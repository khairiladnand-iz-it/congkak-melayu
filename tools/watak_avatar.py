#!/usr/bin/env python3
"""Potong avatar watak sampingan Hikayat daripada src/assets/watak-roster.png (seni pengguna)
-> src/assets/watak.json (WebP 256px). Wajah dalam roster hanya ~100px, jadi dibesarkan 4x dengan
waifu2x (tools/w2x.py; tetapkan W2X_MODELS) sebelum dikecilkan ke 256px supaya tajam pada skrin padat piksel.
Jalankan semula jika roster diganti.
Kotak: pusat muka (y), saiz, dan x bagi setiap baris; ADJ untuk pelarasan individu."""
import json, base64, io, os, sys
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from w2x import up2
SZ = 256

def tajam(im):
    a = np.asarray(im)
    if im.width < SZ * 2:
        a = up2(a)
    if a.shape[1] < SZ * 2:
        a = up2(a)
    return Image.fromarray(a).resize((SZ, SZ), Image.LANCZOS)

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
        tajam(im.crop((x0, y0, x0 + s, y0 + s))).save(b, 'WEBP', quality=80, method=6)
        out[id] = 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()
# roster kedua pengguna (2730x1536, wajah lebih besar): menggantikan watak yang ada di dalamnya.
# Koordinat ditulis dalam skala 2000px paparan asal, didarab 1.365. Watak tanpa label dilangkau,
# kecuali komander (tricorne Belanda, tidak berlabel; dipadankan ikut rupa).
im3 = Image.open(os.path.join(ROOT, 'src', 'assets', 'watak-roster2.png')).convert('RGB')
R2 = { # id: (cx, cy, saiz)
'temagi':(120,250,130),'rajuna':(290,258,130),'inang':(440,272,150),'perpatih':(757,330,160),
'rajaali':(1225,360,130),'pandak':(1375,282,120),'penghulu':(1612,322,112),'wandarus':(1738,278,118),'kapten':(1872,255,140),
'yinqing':(122,488,150),'pires':(290,512,160),'houtman':(455,495,170),'komander':(600,495,160),'mahmud':(1340,478,150),
'syarif':(1625,495,150),'narai':(1748,495,150),'panglimaaceh':(1895,478,160),
'kasturi':(158,750,190),'lekir':(330,758,190),'tamingsari':(585,695,200),'tunperak':(783,632,210),'mansur':(1000,612,220),
'tunali_b':(1205,640,210),'inongbalee':(1360,712,190),'daengchelak':(1522,728,176),'panglimasiam':(1715,730,200),'sultanaceh':(1865,712,190),
'todak':(1172,128,140)}
for id, v in R2.items():
    cx, cy, sz = [round(x * 1.365) for x in v]
    b = io.BytesIO()
    tajam(im3.crop((cx - sz // 2, cy - sz // 2, cx + sz // 2, cy + sz // 2))).save(b, 'WEBP', quality=80, method=6)
    out[id] = 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()
print(len(R2), 'daripada roster kedua')
# potret berasingan (lembaran watak penuh daripada pengguna): id -> (fail, kotak)
ASING = {'rajaabdullah_j': ('watak-rajaabdullah_j.png', (250, 190, 710, 650)),
         'adiputera': ('watak-kumpulan2.webp', (650, 162, 778, 290))}
for id, (f, box) in ASING.items():
    b = io.BytesIO()
    im2 = Image.open(os.path.join(ROOT, 'src', 'assets', f)).convert('RGB').crop(box)
    tajam(im2).save(b, 'WEBP', quality=80, method=6)
    out[id] = 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()
json.dump(out, open(os.path.join(ROOT, 'src', 'assets', 'watak.json'), 'w'), indent=0)
print(len(out), 'avatar')
