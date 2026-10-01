#!/usr/bin/env python3
"""
ANDRÉ MANDEL · Living Set · make_still.py (v1.0, 10/1/26)
Renders the pocket model's first shot to the cover still (assets/cover-still.webp): the picture the cover shows in
print, on phones and while the live model loads. Ink on white, so it multiplies onto the weathered paper.

Usage:  python3 tools/make_still.py template            # writes template/assets/cover-still.webp
        python3 tools/make_still.py my-project --size 3000x2000
"""
import argparse, asyncio, os, sys, io
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lskit import serve, kit_root

async def main(a):
    from playwright.async_api import async_playwright
    from PIL import Image
    w, h = map(int, a.size.split('x'))
    proj = os.path.abspath(a.project); root = kit_root()
    rel = os.path.relpath(proj, root).replace(os.sep, '/')
    with serve(root) as base:
        async with async_playwright() as p:
            b = await p.chromium.launch(args=['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'])
            pg = await b.new_page(viewport={'width': w // 2, 'height': h // 2}, device_scale_factor=2)
            await pg.goto(f'{base}{rel}/model/index.html?still')
            await pg.wait_for_selector('body[data-ready="1"]', timeout=60000)
            await pg.wait_for_timeout(400)
            png = await pg.screenshot()
            await b.close()
    out = os.path.join(proj, 'assets', 'cover-still.webp'); os.makedirs(os.path.dirname(out), exist_ok=True)
    Image.open(io.BytesIO(png)).convert('RGB').save(out, 'WEBP', quality=86, method=6)
    print('wrote', out, os.path.getsize(out) // 1024, 'KB')

if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('project', help='the project folder (holds model/index.html)')
    ap.add_argument('--size', default='3000x2000', help='pixels, default 3000x2000 (the cover field at about 100 ppi)')
    asyncio.run(main(ap.parse_args()))
