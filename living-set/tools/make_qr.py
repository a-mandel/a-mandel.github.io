#!/usr/bin/env python3
"""
ANDRÉ MANDEL · Living Set · make_qr.py (v1.0, 10/1/26)
Writes the title block QR into a project's project.js from SET.live.url (or --url), between the /*QR*/ markers.
One QR per sheet, in the title block only (André 10/1/26). Needs segno: pip install segno

Usage:  python3 tools/make_qr.py template
        python3 tools/make_qr.py my-project --url https://a-mandel.github.io/my-project/
"""
import argparse, os, re, json, sys

def qr_path(url):
    import segno
    q = segno.make(url, error='m', micro=False)
    m = q.matrix; n = len(m); B = 2   # two module quiet zone, like the Walsh set (size 33 for a 29 module code)
    d = []
    for y, row in enumerate(m):
        x = 0
        while x < n:
            if row[x]:
                s = x
                while x < n and row[x]: x += 1
                d.append(f'M{s + B} {y + B}h{x - s}v1h-{x - s}z')
            else: x += 1
    return {'size': n + 2 * B, 'd': ''.join(d)}

def write(project, url=None):
    p = os.path.join(project, 'project.js'); s = open(p, encoding='utf-8').read()
    if not url:
        m = re.search(r"live:\s*\{\s*url:\s*'([^']+)'", s)
        if not m: raise SystemExit('no SET.live.url in project.js; pass --url')
        url = m.group(1)
    Q = qr_path(url)
    new, n = re.subn(r'/\*QR\*/.*?/\*/QR\*/', '/*QR*/' + json.dumps(Q, separators=(', ', ': ')).replace('"size"', 'size').replace('"d"', 'd') + '/*/QR*/', s, flags=re.S)
    if not n: raise SystemExit('no /*QR*/ ... /*/QR*/ marker in project.js')
    open(p, 'w', encoding='utf-8').write(new)
    print(f'QR {Q["size"]} modules for {url} written to {p}')

if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('project'); ap.add_argument('--url')
    a = ap.parse_args(); write(a.project, a.url)
