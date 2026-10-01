#!/usr/bin/env python3
"""
ANDRÉ MANDEL · Living Set · new_project.py (v1.0, 10/1/26)
Starts a new living set from the template: copies it, fills the project's identity, writes the QR, and either
freezes a copy of the engine inside the project (default, so later engine changes never move an issued set) or
links to the kit's engine (--link, so the project follows the kit).

Usage:
  python3 tools/new_project.py ../kelly/set --name "Kelly Residence" --street "727 Kelly Drive" --city "Truckee CA" \\
      --site "Lot 00" --apn "000 000 000 000" --zoning "RS" --county "Nevada County" --owner "Owner Name" \\
      --url https://a-mandel.github.io/kelly/set/ --seed 727
Then: edit project.js (sheets, permits, issuances), replace draw/drawings.src.json and model/massing.json with the
project's, run build_drawings.py, make_still.py and check.py. FRAMEWORK.md, section 11, walks it end to end.
"""
import argparse, os, re, shutil, sys, json, datetime
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lskit import kit_root
import make_qr

def q(s): return s.replace('\\', '\\\\').replace("'", "\\'")

def main(a):
    kit = kit_root(); src = os.path.join(kit, 'template'); dest = os.path.abspath(a.dest)
    if os.path.exists(dest) and os.listdir(dest): raise SystemExit(f'{dest} is not empty; pick a new folder')
    shutil.copytree(src, dest, dirs_exist_ok=True, ignore=shutil.ignore_patterns('check'))
    today = a.date or datetime.date.today().strftime('%-m/%-d/%y')
    # engine: frozen copy or link
    if a.link:
        rel = os.path.relpath(kit, dest).replace(os.sep, '/')
        eng, brand, model = f'{rel}/engine/', f'{rel}/brand/', f'{rel}/model/'
    else:
        kd = os.path.join(dest, '_kit')
        for d in ('engine', 'brand', 'model'): shutil.copytree(os.path.join(kit, d), os.path.join(kd, d))
        eng, brand, model = '_kit/engine/', '_kit/brand/', '_kit/model/'
    def sub(path, pairs):
        p = os.path.join(dest, path); s = open(p, encoding='utf-8').read()
        for o, n in pairs: s = s.replace(o, n)
        open(p, 'w', encoding='utf-8').write(s)
    up = lambda u: u if u.startswith(('http', '/')) else '../' + u
    sub('index.html', [('../engine/', eng), ('../brand/', brand), ('Sample Living Set', a.name.replace(' Residence', '') + ' Living Set'),
                       ('Sample Residence living plan set', f'{a.name} living plan set')])
    sub('model/index.html', [('../../model/', up(model)), ('../../brand/', up(brand))])
    # project.js: identity fields inside project: { ... }, the header, the live url, labels, seed
    p = os.path.join(dest, 'project.js'); s = open(p, encoding='utf-8').read()
    P = {'name': a.name, 'site': a.site, 'street': a.street, 'city': a.city, 'address': f'{a.street}, {a.city}', 'apn': a.apn,
         'zoning': a.zoning, 'county': a.county, 'owner': a.owner, 'ownerCo': a.owner_co}
    blk = re.search(r'project: \{.*?\n  \},', s, re.S)
    b = blk.group(0)
    for k, v in P.items():
        b = re.sub(rf"(\b{k}: )'[^']*'", lambda m: m.group(1) + "'" + q(v) + "'", b, count=1)
    b = re.sub(r"tbLines: \[[^\]]*\]", "tbLines: ['" + q(a.street) + "', '" + q(' · '.join(x for x in (a.site, a.city) if x)) + "', '" + q(a.county) + "']", b)
    s = s.replace(blk.group(0), b)
    short = a.city.replace(' CA', '').replace(' NV', '')
    s = re.sub(r"header: \{ title: '[^']*', lines: \[[^\]]*\] \}",
               "header: { title: '" + q(a.name) + "', lines: ['" + q(' · '.join(x for x in (a.street, a.site, short) if x)) + "', '" +
               q(' · '.join(x for x in ('APN ' + a.apn if a.apn else '', a.zoning) if x)) + "', '" + q('Living set · ' + today) + "'] }", s)
    s = re.sub(r"live: \{ url: '[^']*', show: \[[^\]]*\]",
               "live: { url: '" + q(a.url) + "', show: ['" + q(re.sub(r'^https?://', '', a.url).split('/')[0]) + "', '" + q('/' + '/'.join(x for x in re.sub(r'^https?://[^/]+', '', a.url).split('/') if x)) + "']", s)
    s = s.replace("docTitle: 'Sample Living Set'", "docTitle: '" + q(a.name.replace(' Residence', '')) + " Living Set'")
    s = s.replace("model: { src: 'model/?sheet', still: 'assets/cover-still.webp'", "model: { src: 'model/?sheet', still: 'assets/cover-still.webp'")
    s = s.replace("marks: { lockup: '../brand/am10_lockup.webp', mark: '../brand/am10_mark.webp' }", f"marks: {{ lockup: '{brand}am10_lockup.webp', mark: '{brand}am10_mark.webp' }}")
    s = re.sub(r'seed: \d+,', f'seed: {a.seed},', s)
    s = re.sub(r"issuances: \[ \{ no: 1, date: '[^']*', for: '[^']*' \} \]", f"issuances: [ {{ no: 1, date: '{today}', for: 'Living set, cartoon' }} ]", s)
    s = re.sub(r"date: '[^']*', drawnBy", f"date: '{today}', drawnBy", s)
    open(p, 'w', encoding='utf-8').write(s)
    # the model's title
    mp = os.path.join(dest, 'model', 'massing.json'); M = json.load(open(mp)); M['title'] = a.name; json.dump(M, open(mp, 'w'), indent=1)
    make_qr.write(dest, a.url)
    print(f'new living set at {dest} ({"linked to" if a.link else "with a frozen copy of"} the engine). Next: FRAMEWORK.md, section 11.')

if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('dest', help='the new project folder, e.g. ../kelly/set')
    ap.add_argument('--name', required=True); ap.add_argument('--street', default=''); ap.add_argument('--city', default='')
    ap.add_argument('--site', default=''); ap.add_argument('--apn', default=''); ap.add_argument('--zoning', default='')
    ap.add_argument('--county', default=''); ap.add_argument('--owner', default=''); ap.add_argument('--owner-co', default='')
    ap.add_argument('--url', required=True, help='where the set will live; the QR points here')
    ap.add_argument('--seed', type=int, default=1, help='seeds the frayed corner; use the lot or street number')
    ap.add_argument('--date', help='M/D/YY, default today')
    ap.add_argument('--link', action='store_true', help='link to the kit engine instead of freezing a copy')
    main(ap.parse_args())
