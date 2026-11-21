#!/usr/bin/env python3
"""Potong avatar watak sampingan Hikayat daripada src/assets/watak-roster.png (seni pengguna)
-> src/assets/watak.json (WebP 128px). Jalankan semula jika roster diganti.
Kotak: pusat muka (y), saiz, dan x bagi setiap baris; ADJ untuk pelarasan individu."""
import json, base64, io, os
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
im = Image.open(os.path.join(ROOT, 'src', 'assets', 'watak-roster.png')).convert('RGB')
X10=[72,222,372,525,677,830,985,1137,1290,1442]
ROWS=[  # (pusat muka y, saiz, senarai x)
 (160,124,X10),
 (378,106,X10),
 (546,104,X10),
 (686,98,X10),
 (815,96,[88,240,393,546,700,846,997,1150,1302,1452]),
 (930,96,[160,318,500,690]),
]
NAMA=[['temagi','rajuna','pemburu','yinqing','tunali_b','penasihat','perpatih','tunali_b2','tunperak','panglimasiam'],
 ['tunali_f','utusan','pengiring','mansur','pires','adiputera','pengamuk','tamingsari','lekir','pemfitnah'],
 ['hulubalang','kasturi','nakhodapel','inang','nakhodakapal','mahmud','todak','pengawal','pembesarlaut','kapten'],
 ['goa','mudaliar','rajaali','pembjohor','alauddin3','rajaabdullah_k','panglimaaceh','sultanaceh','inongbalee','houtman'],
 ['lancaster','narai','isteribaru','pengasuh','pembkelantan','pedagangarab','rajakecil','daengchelak','syarif','komander'],
 ['pandak','wandarus','wanmahora','penghulu']]
ADJ = {'tunali_b': [0, 6, 0], 'tunali_b2': [0, 4, 0], 'todak': [8, 0, 0]}
out = {}
for r, (cy, sz, xs) in enumerate(ROWS):
    for c, x in enumerate(xs):
        id = NAMA[r][c]
        if id == 'tunali_b2':      # pendua Bendahara Tun Ali (tokoh yang sama dengan tunali_b); tidak digunakan
            continue
        dx, dy, ds = ADJ.get(id, [0, 0, 0]); s = sz + ds; x0 = x + dx - s // 2; y0 = cy + dy - s // 2
        b = io.BytesIO()
        im.crop((x0, y0, x0 + s, y0 + s)).resize((128, 128), Image.LANCZOS).save(b, 'WEBP', quality=78, method=6)
        out[id] = 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()
# potret berasingan (lembaran watak penuh daripada pengguna): id -> (fail, kotak)
ASING = {'rajaabdullah_j': ('watak-rajaabdullah_j.png', (250, 190, 710, 650))}
for id, (f, box) in ASING.items():
    b = io.BytesIO()
    Image.open(os.path.join(ROOT, 'src', 'assets', f)).convert('RGB').crop(box).resize((128, 128), Image.LANCZOS).save(b, 'WEBP', quality=78, method=6)
    out[id] = 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()
json.dump(out, open(os.path.join(ROOT, 'src', 'assets', 'watak.json'), 'w'), indent=0)
print(len(out), 'avatar')
