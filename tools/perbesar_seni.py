#!/usr/bin/env python3
"""Besarkan seni pahlawan 2x dengan waifu2x (tools/w2x.py) supaya tidak pecah pada skrin padat piksel.

  W2X_MODELS=.../upconv_7_anime_style_art_rgb python3 tools/perbesar_seni.py

- box.json   : 10 potret 360px  -> 720px
- crops.json : 8 potret 256px   -> 512px; poster bg/bg2 1290px -> 2x, kemudian dikecilkan ke lebar 1920px
Idempoten: imej yang sudah cukup besar dilangkau. Disimpan sebagai JPEG q93 (binaan menukarnya ke WebP).
Asal kekal dalam sejarah git."""
import base64, io, json, os, sys
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from w2x import up2

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = os.path.join(ROOT, 'src', 'assets')


def buka(uri):
    return Image.open(io.BytesIO(base64.b64decode(uri.split(',', 1)[1]))).convert('RGB')


def uri(im, q=93):
    b = io.BytesIO(); im.save(b, 'JPEG', quality=q, optimize=True, progressive=True, subsampling=0)
    return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()


def besar(im, sasaran, maks=None):
    if im.width >= sasaran:
        return None
    out = Image.fromarray(up2(np.asarray(im)))
    if maks and out.width > maks:
        out = out.resize((maks, round(out.height * maks / out.width)), Image.LANCZOS)
    return out


box = json.load(open(os.path.join(A, 'box.json')))
for i, u in enumerate(box['box']):
    o = besar(buka(u), 700)
    if o is not None: box['box'][i] = uri(o); print('box', i, o.size)
json.dump(box, open(os.path.join(A, 'box.json'), 'w'))

cr = json.load(open(os.path.join(A, 'crops.json')))
for k, u in cr.items():
    poster = k in ('bg', 'bg2')
    o = besar(buka(u), 1900 if poster else 500, 1920 if poster else None)
    if o is not None: cr[k] = uri(o, 90 if poster else 93); print(k, o.size)
json.dump(cr, open(os.path.join(A, 'crops.json'), 'w'))
