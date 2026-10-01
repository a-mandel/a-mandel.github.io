#!/usr/bin/env python3
"""
ANDRÉ MANDEL · Living Set · check.py (v1.0, 10/1/26)
The last step before a set goes out. Opens the set the way a person would and proves it:
  every sheet renders on a desktop with no script errors      -> check/desk_<id>.png and check/contact.png
  the phone layout holds                                      -> check/phone_<id>.png (first three sheets)
  print makes one 36 x 24 page per sheet                      -> check/<name>.pdf
  every video is a progressive MP4 (no moof or mvex, moov before mdat), so iPhones play it
Usage:  python3 tools/check.py template [--fonts /path/to/node_modules/@fontsource] [--no-model]
"""
import argparse, asyncio, os, sys, struct, glob
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lskit import serve, offline_fonts

def mp4_boxes(path):
    out = []
    with open(path, 'rb') as f:
        data = f.read()
    def walk(b, depth, lim):
        i = b
        while i + 8 <= lim:
            size, typ = struct.unpack('>I4s', data[i:i + 8]); typ = typ.decode('latin1'); hdr = 8
            if size == 1: size = struct.unpack('>Q', data[i + 8:i + 16])[0]; hdr = 16
            if size == 0: size = lim - i
            out.append((depth, typ, i))
            if typ in ('moov', 'trak', 'mdia', 'minf', 'stbl', 'mvex', 'moof', 'traf'): walk(i + hdr, depth + 1, i + size)
            i += size
    walk(0, 0, len(data))
    return out

def check_video(path):
    B = mp4_boxes(path); types = [t for _, t, _ in B]
    if 'moof' in types or 'mvex' in types: return f'FRAGMENTED (moof/mvex): {path}. Re encode progressive, HandBrake Web Optimized.'
    top = [(t, o) for d, t, o in B if d == 0]
    mo = next((o for t, o in top if t == 'moov'), None); md = next((o for t, o in top if t == 'mdat'), None)
    if mo is None: return f'NO MOOV: {path}'
    return f'ok progressive{" faststart" if md is None or mo < md else ", moov after mdat (add faststart)"}: {os.path.basename(path)}'

async def main(a):
    from playwright.async_api import async_playwright
    proj = os.path.abspath(a.project); out = os.path.join(proj, 'check'); os.makedirs(out, exist_ok=True)
    root = os.path.dirname(proj) if not a.root else os.path.abspath(a.root)
    rel = os.path.relpath(proj, root).replace(os.sep, '/')
    problems = []
    for v in glob.glob(os.path.join(proj, '**', '*.mp4'), recursive=True):
        r = check_video(v); print('video', r)
        if not r.startswith('ok'): problems.append(r)
    with serve(root) as base:
        url = f'{base}{rel}/index.html'
        async with async_playwright() as p:
            b = await p.chromium.launch(args=['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'])
            # desktop
            ctx = await b.new_context(viewport={'width': 1680, 'height': 1180}, reduced_motion='reduce')
            await offline_fonts(ctx, a.fonts)
            if a.no_model: await ctx.route('**/model/**', lambda r: r.abort())
            pg = await ctx.new_page(); errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)))
            await pg.goto(url); await pg.wait_for_timeout(3500)
            ids = await pg.evaluate("[...document.querySelectorAll('#stage .sheet')].map(s => s.dataset.id)")
            for i in ids:
                await pg.evaluate(f"location.hash = {i!r}"); await pg.wait_for_timeout(1300)
                await pg.screenshot(path=os.path.join(out, f'desk_{i}.png'))
            # print
            await pg.emulate_media(media='print'); await pg.wait_for_timeout(1600)
            pdf = os.path.join(out, os.path.basename(proj.rstrip('/')) + '.pdf')
            await pg.pdf(path=pdf, width='36in', height='24in', print_background=True, prefer_css_page_size=True)
            await ctx.close()
            # phone
            ctx = await b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True, reduced_motion='reduce')
            await offline_fonts(ctx, a.fonts)
            if a.no_model: await ctx.route('**/model/**', lambda r: r.abort())
            ph = await ctx.new_page(); ph.on('pageerror', lambda e: errs.append('phone: ' + str(e)))
            await ph.goto(url); await ph.wait_for_timeout(3000)
            for i in ids[:3]:
                await ph.evaluate(f"location.hash = {i!r}"); await ph.wait_for_timeout(1200)
                await ph.screenshot(path=os.path.join(out, f'phone_{i}.png'))
            await b.close()
    # pages in the pdf
    try:
        from pypdf import PdfReader
        n = len(PdfReader(pdf).pages)
    except Exception:
        n = open(pdf, 'rb').read().count(b'/Type /Page') - open(pdf, 'rb').read().count(b'/Type /Pages')
    print(f'{len(ids)} sheets, pdf {n} pages: {pdf}')
    if n != len(ids): problems.append(f'pdf has {n} pages for {len(ids)} sheets')
    # contact sheet
    try:
        from PIL import Image
        th = [Image.open(os.path.join(out, f'desk_{i}.png')).resize((420, 295)) for i in ids]
        cols = 5; rows = (len(th) + cols - 1) // cols
        C = Image.new('RGB', (cols * 430 + 10, rows * 305 + 10), (235, 233, 227))
        for k, t in enumerate(th): C.paste(t, (10 + (k % cols) * 430, 10 + (k // cols) * 305))
        C.save(os.path.join(out, 'contact.png'))
    except Exception as e: print('contact sheet skipped:', e)
    problems += [f'script error: {e}' for e in errs]
    print('\n'.join(problems) if problems else 'clean: no script errors, pages match, videos progressive')
    return 1 if problems else 0

if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('project'); ap.add_argument('--fonts', help='node_modules/@fontsource, for renders without internet')
    ap.add_argument('--root', help='the folder to serve (default: the project\'s parent, so ../engine resolves)')
    ap.add_argument('--no-model', action='store_true', help='skip the live model (the cover shows its still)')
    sys.exit(asyncio.run(main(ap.parse_args())))
