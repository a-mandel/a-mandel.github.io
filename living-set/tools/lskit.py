#!/usr/bin/env python3
"""
ANDRÉ MANDEL · Living Set · shared helpers for the tools (v1.0, 10/1/26)
A tiny local web server, because the set and the model fetch their data and file:// will not do.
Playwright for renders: pip install playwright && python3 -m playwright install chromium
"""
import os, threading, http.server, socketserver, functools, contextlib, socket

@contextlib.contextmanager
def serve(root):
    """Serve `root` on a free localhost port for the length of a with block; yields the base URL."""
    s = socket.socket(); s.bind(('127.0.0.1', 0)); port = s.getsockname()[1]; s.close()
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    H = functools.partial(Quiet, directory=root)
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(('127.0.0.1', port), H)
    t = threading.Thread(target=httpd.serve_forever, daemon=True); t.start()
    try:
        yield f'http://127.0.0.1:{port}/'
    finally:
        httpd.shutdown(); httpd.server_close()

def kit_root():
    """The living-set folder (the parent of tools/)."""
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

async def offline_fonts(ctx, font_dir):
    """Optional: answer Google Fonts from local @fontsource woff2 files (font_dir = node_modules/@fontsource)."""
    if not font_dir: return
    faces = [('EB Garamond', 'eb-garamond/files/eb-garamond-latin-400-normal.woff2', 'normal', 400), ('EB Garamond', 'eb-garamond/files/eb-garamond-latin-400-italic.woff2', 'italic', 400),
             ('EB Garamond', 'eb-garamond/files/eb-garamond-latin-500-normal.woff2', 'normal', 500), ('EB Garamond', 'eb-garamond/files/eb-garamond-latin-500-italic.woff2', 'italic', 500),
             ('Tenor Sans', 'tenor-sans/files/tenor-sans-latin-400-normal.woff2', 'normal', 400), ('Nothing You Could Do', 'nothing-you-could-do/files/nothing-you-could-do-latin-400-normal.woff2', 'normal', 400)]
    css = ''.join(f"@font-face{{font-family:'{f}';font-style:{st};font-weight:{w};font-display:block;src:url(https://localfonts/{fn}) format('woff2')}}\n" for f, fn, st, w in faces)
    async def gcss(r): await r.fulfill(status=200, content_type='text/css', body=css)
    async def lf(r): await r.fulfill(status=200, content_type='font/woff2', body=open(os.path.join(font_dir, r.request.url.split('https://localfonts/')[1]), 'rb').read())
    async def no(r): await r.abort()
    await ctx.route('https://fonts.googleapis.com/**', gcss)
    await ctx.route('https://fonts.gstatic.com/**', no)
    await ctx.route('https://localfonts/**', lf)
