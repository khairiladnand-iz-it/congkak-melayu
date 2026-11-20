#!/usr/bin/env python3
"""Bina Congkak Melayu menjadi satu fail HTML kendiri.

  python3 tools/build.py                 -> dist/index.html (seni WebP, lebih kecil)
  python3 tools/build.py --no-webp       -> kekalkan JPEG asal
  python3 tools/build.py --out fail.html -> tentukan destinasi sendiri
"""
import json, os, sys, io, base64, hashlib, argparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC  = os.path.join(ROOT, 'src')
rd   = lambda *p: open(os.path.join(SRC, *p), encoding='utf-8').read()

# ---------- susunan fail ----------
JS_ORDER  = ['heroes2', 'new_a', 'prog', 'quest', 'harian', '@snd', 'music', 'hist', 'p2p', 'net',
             'lobi', 'msg', 'menufx', 'mobile', 'istana', 'world', 'new_b', '@duel', 'new_c']
CSS_ORDER = ['extra', 'menu', 'duel', 'lobi']

# ---------- seni: tukar data URI kepada WebP ----------
def to_webp(obj, cache, stats):
    if isinstance(obj, str) and obj.startswith('data:image/'):
        if obj.startswith('data:image/webp'):
            return obj
        key = hashlib.sha1(obj.encode()).hexdigest()
        if key in cache:
            return cache[key]
        try:
            from PIL import Image
        except ImportError:
            return obj
        raw = base64.b64decode(obj.split(',', 1)[1])
        im  = Image.open(io.BytesIO(raw))
        if im.mode not in ('RGB', 'RGBA'):
            im = im.convert('RGBA' if 'A' in im.mode else 'RGB')
        buf = io.BytesIO()
        im.save(buf, 'WEBP', quality=82, method=5)
        new = 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()
        if len(new) >= len(obj):          # jangan jadikan lebih besar
            new = obj
        stats[0] += len(obj); stats[1] += len(new)
        cache[key] = new
        return new
    if isinstance(obj, dict):
        return {k: to_webp(v, cache, stats) for k, v in obj.items()}
    if isinstance(obj, list):
        return [to_webp(v, cache, stats) for v in obj]
    return obj

def load_art(webp):
    box   = json.load(open(os.path.join(SRC, 'assets', 'box.json'), encoding='utf-8'))['box']
    crops = json.load(open(os.path.join(SRC, 'assets', 'crops.json'), encoding='utf-8'))
    if webp:
        cache, stats = {}, [0, 0]
        box   = to_webp(box, cache, stats)
        crops = to_webp(crops, cache, stats)
        if stats[0]:
            print('  seni: %d KB -> %d KB WebP (-%.0f%%)'
                  % (stats[0] // 1024, stats[1] // 1024, 100 - stats[1] / stats[0] * 100))
    return box, crops

# ---------- potong bahagian daripada ui.js ----------
def build(out, webp=True, write_chk=False, pwa=True):
    ui = rd('js', 'ui.js')
    def cut(a, b):
        i = ui.index(a); j = ui.index(b, i) if b else len(ui)
        return ui[i:j]
    head = ui[:ui.index('const SEEDS=')]
    part = {'@snd':  cut('/* ===== BUNYI ===== */', '/* ===== BIJI ===== */'),
            '@duel': cut('/* ===== PERTARUNGAN TIKAM ===== */', '/* ===== PERSIAPAN ===== */')}

    css = rd('css', 'app.css')
    def drop(s, a, b):
        i = s.index(a); j = s.index(b, i); return s[:i] + s[j:]
    css = drop(css, '/* ===== latar ===== */', '/* ===== kawalan ===== */')
    css = drop(css, '/* ===== papan ===== */', '/* ===== lapisan ===== */')
    css = css.replace('@media(max-width:700px){.mwrap{padding-bottom:110px}'
                      'body[data-screen=menu] #bg::before{background:linear-gradient'
                      '(0deg,rgba(8,10,34,.95),rgba(8,10,34,.7) 55%,rgba(8,10,34,.15))}'
                      '#bg{background-position:62% center}}', '')
    assert '#bg' not in css, 'bahagian latar app.css tidak dibuang'
    css += ''.join(rd('css', n + '.css') for n in CSS_ORDER)

    box, crops = load_art(webp)
    js = ("'use strict';\nconst ASSET=" + json.dumps({'box': box}) + ';\n'
          + rd('js', 'engine.js') + '\n' + head
          + 'const ART2_JSON=' + json.dumps(json.dumps(crops)) + ';\n'
          + ''.join(part[n] if n.startswith('@') else rd('js', n + '.js') for n in JS_ORDER))

    html = rd('tpl.html').replace('/*CSS*/', css).replace('/*JS*/', js)
    html = (html.replace('<!--PWA-->', rd('pwa', 'head.html') if pwa else '')
                .replace('<!--SW-->',  rd('pwa', 'register.html') if pwa else ''))

    outdir = os.path.dirname(out) or '.'
    os.makedirs(outdir, exist_ok=True)
    open(out, 'w', encoding='utf-8').write(html)

    if pwa:                                   # salin aset PWA + cap versi ke service worker
        import shutil
        ver = hashlib.sha1(html.encode()).hexdigest()[:12]
        for n in ('manifest.webmanifest', 'icon-192.png', 'icon-512.png',
                  'icon-maskable-512.png', 'apple-touch-icon.png'):
            shutil.copy(os.path.join(SRC, 'pwa', n), os.path.join(outdir, n))
        open(os.path.join(outdir, 'sw.js'), 'w', encoding='utf-8').write(
            rd('pwa', 'sw.js').replace('__VERSION__', ver))
        open(os.path.join(outdir, '.nojekyll'), 'w').close()
        print('  PWA: manifest + sw.js (versi %s) + 4 ikon' % ver)
    if write_chk:
        open(os.path.join(ROOT, 'tests', 'chk.js'), 'w', encoding='utf-8').write(js)
    return html

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', default=os.path.join(ROOT, 'dist', 'index.html'))
    ap.add_argument('--no-webp', action='store_true')
    ap.add_argument('--chk', action='store_true', help='tulis tests/chk.js untuk node --check')
    ap.add_argument('--single', action='store_true',
                    help='satu fail sahaja tanpa PWA (untuk artifact Claude)')
    a = ap.parse_args()
    h = build(a.out, webp=not a.no_webp, write_chk=a.chk, pwa=not a.single)
    print('%s  %d KB' % (a.out, len(h.encode()) // 1024))
