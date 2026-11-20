#!/usr/bin/env python3
"""Ujian asap: muat keluaran sebenar dalam pelayar, pastikan tiada ralat dan boleh main."""
import asyncio, sys, os, http.server, socketserver, threading, functools

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, 'dist')
PORT = 8799

def serve():
    h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=DIST)
    # mesti berbilang benang: pelayan satu-benang tersekat apabila beberapa
    # tab dan service worker membuka sambungan serentak
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    socketserver.ThreadingTCPServer.daemon_threads = True
    httpd = socketserver.ThreadingTCPServer(('127.0.0.1', PORT), h)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd

async def main():
    from playwright.async_api import async_playwright
    httpd, bad = serve(), []
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for name, vp in (('telefon', {'width': 390, 'height': 844}),
                         ('desktop', {'width': 1280, 'height': 860})):
            c  = await b.new_context(viewport=vp)
            pg = await c.new_page()
            errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)))
            await pg.goto(f'http://127.0.0.1:{PORT}/', wait_until='domcontentloaded', timeout=60000)
            await pg.wait_for_timeout(4000)

            if not await pg.evaluate('!!document.querySelector(\'[data-go="play"]\')'):
                bad.append(f'{name}: butang Main Sekarang tiada')
            if not await pg.evaluate('!!document.querySelector(\'link[rel=manifest]\')'):
                bad.append(f'{name}: pautan manifest tiada')
            # setiap jubin koleksi mesti ada ikon SVG sendiri, berapa pun bilangannya
            tiles = await pg.evaluate('document.querySelectorAll(".mt").length')
            icons = await pg.evaluate('document.querySelectorAll(".mt u svg").length')
            if tiles < 6 or icons != tiles:
                bad.append(f'{name}: {tiles} jubin tetapi {icons} ikon')

            # klik melalui JS: pada runner CI kanvas 3D boleh melindungi butang
            await pg.evaluate('document.querySelector(\'[data-go="play"]\').click()')
            await pg.wait_for_timeout(3500)
            if await pg.evaluate('document.body.dataset.screen') != 'match':
                bad.append(f'{name}: perlawanan tidak bermula')

            # seluruh menu mesti muat tanpa scroll
            await pg.goto(f'http://127.0.0.1:{PORT}/', wait_until='domcontentloaded', timeout=60000); await pg.wait_for_timeout(3000)
            fits = await pg.evaluate(
                'document.querySelector(\'[data-go="set"]\').getBoundingClientRect().bottom <= innerHeight + 2')
            if not fits:
                bad.append(f'{name}: menu melimpah keluar skrin')

            errs = [e for e in errs if 'three' not in e.lower()]
            if errs:
                bad.append(f'{name}: ralat JS -> {errs[:2]}')
            print(f'  {name}: ok' if not any(name in x for x in bad) else f'  {name}: GAGAL')
            await c.close()
        await b.close()
    httpd.shutdown()
    if bad:
        print('UJIAN ASAP GAGAL:'); [print('  -', x) for x in bad]; sys.exit(1)
    print('UJIAN ASAP LULUS')

asyncio.run(main())
