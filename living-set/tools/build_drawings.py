#!/usr/bin/env python3
"""
ANDRÉ MANDEL · Living Set · build_drawings.py  (v1.0, 10/1/26)

Turns a project's drawing source (draw/drawings.src.json) into draw/drawings.js, the window.DRAWINGS data the
engine draws on 'draw' sheets. Geometry is in model feet (x east, y down the sheet, i.e. south on a plan), set at
true scale on the 36 x 24 sheet, in the Walsh pen table so every project drafts the same way.

Three ways to feed a view, mix freely:
  layers   hand or script geometry: poly, rects, segs (centerline + thickness), lines, circles, per pen
  dxf      a DXF export (Vectorworks, AutoCAD, Rhino) with a layer map from CAD layer to pen
  svg      a raw SVG already in model feet (pasted inside the view, pens are up to you)

Usage:  python3 tools/build_drawings.py template/draw/drawings.src.json  [-o template/draw/drawings.js]
Needs ezdxf only when a view uses dxf (pip install ezdxf).
"""
import json, math, sys, os, argparse

INK, PAPER, ACC, TIMBER, PINE = '#1b1a18', '#f6f5f1', '#c07a2c', '#c98a52', '#2c5a37'
NS = 'vector-effect="non-scaling-stroke" stroke-linejoin="round"'

# The pen table, read off the Walsh plans (draw/drawings.js, 9/30/26). fill, stroke, width, extras
PENS = {
    'outline':  dict(fill='none', stroke=INK, w=1.3),
    'cut':      dict(fill='none', stroke=INK, w=1.1),
    'wall':     dict(fill=INK, stroke=INK, w=0.35),                 # poche, cut walls
    'slab':     dict(fill='rgba(27,26,24,.05)', stroke='none'),     # floor at the cut level
    'slab2':    dict(fill='rgba(27,26,24,.035)', stroke='none'),    # floor at another level
    'glass':    dict(fill=PAPER, stroke=INK, w=0.6),
    'line':     dict(fill='none', stroke=INK, w=0.6),
    'thin':     dict(fill='none', stroke=INK, w=0.45, op=0.7),
    'faint':    dict(fill='none', stroke=INK, w=0.45, op=0.3),
    'hidden':   dict(fill='none', stroke=INK, w=0.6, dash='3 2', op=0.6),
    'overhead': dict(fill='none', stroke=INK, w=0.5, dash='9 3 2 3', op=0.55),
    'roof':     dict(fill='#d6d5d1', stroke=INK, w=1.0),
    'roof2':    dict(fill=PAPER, stroke=INK, w=1.4),
    'ridge':    dict(fill='none', stroke=INK, w=1.1),
    'deck':     dict(fill='url(#{p}-deck)', stroke=INK, w=0.7),
    'flag':     dict(fill='url(#{p}-flag)', stroke=INK, w=0.7),
    'concrete': dict(fill='url(#{p}-dots)', stroke='none'),
    'earth':    dict(fill='url(#{p}-hatch)', stroke='none'),
    'drive':    dict(fill='#e9e6df', stroke=INK, w=0.9),
    'property': dict(fill='none', stroke=INK, w=1.5, dash='18 4 3 4'),
    'setback':  dict(fill='none', stroke=INK, w=0.8, dash='6 4', op=0.65),
    'contour':  dict(fill='none', stroke=INK, w=0.45, op=0.3),
    'contour5': dict(fill='none', stroke=INK, w=0.6, op=0.6),
    'tree':     dict(fill='none', stroke=PINE, w=1.1, op=0.9),
    'tree2':    dict(fill='none', stroke=PINE, w=0.45, op=0.5),
    'timber':   dict(fill='none', stroke=TIMBER, w=0.6),
    'accent':   dict(fill='none', stroke=ACC, w=1.1),
    'dot':      dict(fill=ACC, stroke='none'),                      # the one orange mark, e.g. the signature tree
}

def defs(p):
    return ('<defs>\n'
        f'<pattern id="{p}-deck" width="0.5" height="0.5" patternUnits="userSpaceOnUse"><line x1="0" y1="0.25" x2="0.5" y2="0.25" stroke="{TIMBER}" stroke-width="0.5" vector-effect="non-scaling-stroke"/></pattern>\n'
        f'<pattern id="{p}-flag" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(8)"><path d="M0 0 L2.6 0.3 L3.1 2.4 L0.4 2.8 Z M3.1 2.4 L6 2.1 M2.6 0.3 L4.4 0 M4.4 0 L6 0.6 M4.4 0 L4.7 2.2 M0.4 2.8 L0 6 M0.4 2.8 L2.2 3.4 L2.9 6 M2.2 3.4 L5.1 4.1 L6 6 M3.1 2.4 L2.2 3.4 M5.1 4.1 L4.7 2.2" fill="none" stroke="{INK}" stroke-width="0.4" opacity="0.55" vector-effect="non-scaling-stroke"/></pattern>\n'
        f'<pattern id="{p}-dots" width="2" height="2" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.12" fill="{INK}" opacity="0.4"/></pattern>\n'
        f'<pattern id="{p}-hatch" width="1.5" height="1.5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="1.5" stroke="{INK}" stroke-width="0.4" opacity="0.4" vector-effect="non-scaling-stroke"/></pattern>\n'
        '</defs>')

f2 = lambda v: f'{v:.2f}'.rstrip('0').rstrip('.') if abs(v - round(v)) > 1e-9 else str(int(round(v)))

def attrs(pen, p):
    P = PENS[pen]
    a = f'fill="{P["fill"].format(p=p)}"'
    if P.get('stroke', 'none') != 'none':
        a += f' stroke="{P["stroke"]}" stroke-width="{P["w"]}" {NS}'
        if P.get('dash'): a += f' stroke-dasharray="{P["dash"]}"'
    if P.get('op'): a += f' opacity="{P["op"]}"'
    return a

def poly_d(pts, close=True):
    return 'M' + ' L'.join(f'{f2(x)} {f2(y)}' for x, y in pts) + (' Z' if close else '')

def seg_poly(a, b, t):
    dx, dy = b[0] - a[0], b[1] - a[1]; L = math.hypot(dx, dy) or 1
    nx, ny = -dy / L * t / 2, dx / L * t / 2
    return [(a[0] + nx, a[1] + ny), (b[0] + nx, b[1] + ny), (b[0] - nx, b[1] - ny), (a[0] - nx, a[1] - ny)]

def layer_svg(L, p):
    pen = L['pen']
    if pen not in PENS: raise SystemExit(f'unknown pen "{pen}"; pens: {", ".join(PENS)}')
    d = []
    for poly in L.get('polys', []) + ([L['poly']] if 'poly' in L else []): d.append(poly_d(poly))
    for r in L.get('rects', []): x0, y0, x1, y1 = r; d.append(poly_d([(x0, y0), (x1, y0), (x1, y1), (x0, y1)]))
    for s in L.get('segs', []): d.append(poly_d(seg_poly(s[0], s[1], s[2] if len(s) > 2 else L.get('t', 0.5))))
    for ln in L.get('lines', []): d.append(poly_d(ln, close=False))
    out = f'<path d="{" ".join(d)}" {attrs(pen, p)}/>' if d else ''
    for c in L.get('circles', []):
        out += f'<circle cx="{f2(c[0])}" cy="{f2(c[1])}" r="{f2(c[2])}" {attrs(pen, p)}/>'
    for t in L.get('texts', []):   # small site words, e.g. a street name: [x, y, text, size ft, rotate]
        rot = f' transform="rotate({t[4]} {f2(t[0])} {f2(t[1])})"' if len(t) > 4 else ''
        out += f'<text x="{f2(t[0])}" y="{f2(t[1])}" font-size="{t[3] if len(t) > 3 else 1.6}" text-anchor="middle" fill="{INK}" opacity="0.65" font-family="Tenor Sans, sans-serif" letter-spacing=".08em"{rot}>{t[2]}</text>'
    return out

def dxf_layers(path, layermap, units='ft', origin=(0, 0)):
    """Read a DXF and return layers in model feet, y flipped to point down the sheet."""
    import ezdxf
    k = {'ft': 1, 'in': 1 / 12, 'm': 3.28084, 'mm': 0.00328084}[units]
    ox, oy = origin
    T = lambda x, y, *_: ((x - ox) * k, -(y - oy) * k)
    xy = lambda v: (float(v[0]), float(v[1]))
    doc = ezdxf.readfile(path)
    buckets = {}
    def B(pen): return buckets.setdefault(pen, {'pen': pen, 'polys': [], 'lines': [], 'circles': []})
    for e in doc.modelspace():
        pen = layermap.get(e.dxf.layer) or layermap.get('*')
        if not pen: continue
        t = e.dxftype()
        if t == 'LINE': B(pen)['lines'].append([T(*xy(e.dxf.start)), T(*xy(e.dxf.end))])
        elif t in ('LWPOLYLINE', 'POLYLINE'):
            pts = [T(*xy(p)) for p in (e.get_points('xy') if t == 'LWPOLYLINE' else [v.dxf.location for v in e.vertices])]
            (B(pen)['polys'] if e.closed else B(pen)['lines']).append(pts)
        elif t == 'CIRCLE': c = T(*xy(e.dxf.center)); B(pen)['circles'].append([c[0], c[1], e.dxf.radius * k])
        elif t == 'ARC':
            c, r = e.dxf.center, e.dxf.radius; a0, a1 = math.radians(e.dxf.start_angle), math.radians(e.dxf.end_angle)
            if a1 < a0: a1 += 2 * math.pi
            n = max(6, int((a1 - a0) / 0.1))
            B(pen)['lines'].append([T(c[0] + r * math.cos(a0 + (a1 - a0) * i / n), c[1] + r * math.sin(a0 + (a1 - a0) * i / n)) for i in range(n + 1)])
        elif t == 'HATCH':
            for bp in e.paths:
                if hasattr(bp, 'vertices'): B(pen)['polys'].append([T(*xy(v)) for v in bp.vertices])
    return list(buckets.values())

def build_view(V, sid, base):
    p = (sid.replace('.', '') + '-' + V.get('id', 'v')).lower()
    x0, y0, x1, y1 = V['box']; sc = V['scale']
    w, h = (x1 - x0) * sc, (y1 - y0) * sc
    body = ''
    for L in V.get('layers', []): body += layer_svg(L, p)
    if V.get('dxf'):
        for L in dxf_layers(os.path.join(base, V['dxf']), V.get('layermap', {}), V.get('units', 'ft'), tuple(V.get('origin', (0, 0)))):
            body += layer_svg(L, p)
    if V.get('svg'):
        body += open(os.path.join(base, V['svg'])).read() if V['svg'].endswith('.svg') else V['svg']
    for L in V.get('top', []): body += layer_svg(L, p)          # drawn last, over everything
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" class="dsvg" viewBox="{f2(x0)} {f2(y0)} {f2(x1 - x0)} {f2(y1 - y0)}" '
           f'preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">{defs(p)}{body}</svg>')
    labels = []
    for lb in V.get('labels', []):
        fx, fy = (lb['at'][0] - x0) / (x1 - x0), (lb['at'][1] - y0) / (y1 - y0)
        L = {'p': [round(fx, 5), round(fy, 5)], 't': lb['t'], 'k': lb.get('k', 'room')}
        if lb.get('s'): L['s'] = lb['s']
        if lb.get('hot'): L['hot'] = True
        labels.append(L)
    out = {'x': V['x'], 'y': V['y'], 'w': round(w, 4), 'h': round(h, 4), 'svg': svg, 'labels': labels}
    reg = {'x': V['x'], 'y': V['y'], 'box': V['box'], 'scale': sc}
    return out, reg

def to_sheet(pt, reg):
    """model feet to sheet inches through a view's registration"""
    return [round(reg['x'] + (pt[0] - reg['box'][0]) * reg['scale'], 4), round(reg['y'] + (pt[1] - reg['box'][1]) * reg['scale'], 4)]

def build(src_path):
    src = json.load(open(src_path)); base = os.path.dirname(os.path.abspath(src_path))
    D = {'calcs': src.get('calcs', {}), 'sheets': {}, 'north': src.get('north', 0), 'keys': {}, 'keyAr': src.get('keyAr', 1.2)}
    REG = {}
    for sid, S in src['sheets'].items():
        views, regs = [], []
        for V in S['views']:
            v, r = build_view(V, sid, base); views.append(v); regs.append(r)
        REG[sid] = regs
        out = {'views': views}
        if S.get('vt'):
            out['vt'] = [{'n': t['n'], 't': t['t'], 's': t['s'], 'x': t['x'], 'y': t['y'], **({'bar': {'sc': t.get('sc', S['views'][0]['scale']), 'ft': t['bar']}} if t.get('bar') else {})} for t in S['vt']]
        if S.get('north'): out['north'] = S['north']
        if S.get('tables'): out['tables'] = S['tables']
        if S.get('notes'):
            notes = []
            for n in S['notes']:
                m = {'text': n['text'], 'a': n.get('a', 'l')}
                m['t'] = n['t']
                m['p'] = to_sheet(n['pf'], regs[n.get('v', 0)]) if 'pf' in n else n['p']
                notes.append(m)
            out['notes'] = notes
        D['sheets'][sid] = out
    return D, REG

if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('src'); ap.add_argument('-o', '--out')
    a = ap.parse_args()
    D, REG = build(a.src)
    out = a.out or os.path.join(os.path.dirname(a.src), 'drawings.js')
    with open(out, 'w') as fh:
        fh.write('/* built by tools/build_drawings.py from drawings.src.json; do not edit by hand */\n')
        fh.write('window.DRAWINGS = ' + json.dumps(D, separators=(',', ':')) + ';\n')
        fh.write('/* view registration, model feet to sheet inches, for overlays: x + (ft - box[0]) * scale */\n')
        fh.write('window.DRAWINGS.reg = ' + json.dumps(REG, separators=(',', ':')) + ';\n')
    print(f'wrote {out}: ' + ', '.join(f'{k} ({len(v["views"])} view)' for k, v in D['sheets'].items()))
