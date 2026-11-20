#!/usr/bin/env python3
"""Jana ikon PWA: papan congkak emas di atas latar merah marun berbingkai tumpal."""
import os, math
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT  = os.path.join(ROOT, 'src', 'pwa')
MAROON, DARK, GOLD, GOLD2 = (74, 12, 20), (38, 6, 12), (224, 178, 74), (255, 230, 160)

def icon(size, pad_ratio=0.0):
    S = size * 4                                  # lukis 4x kemudian kecilkan
    im = Image.new('RGBA', (S, S), MAROON + (255,))
    d  = ImageDraw.Draw(im)
    # latar berpancar
    for i in range(S // 2, 0, -8):
        t = i / (S / 2)
        c = tuple(int(DARK[k] + (MAROON[k] - DARK[k]) * (1 - t)) for k in range(3))
        d.ellipse([S/2 - i, S/2 - i, S/2 + i, S/2 + i], fill=c + (255,))
    inset = S * pad_ratio
    box   = [inset, inset, S - inset, S - inset]
    # bingkai tumpal (segi tiga) di tepi
    fw = S * 0.055
    if pad_ratio < 0.05:
        d.rectangle(box, outline=GOLD + (255,), width=int(S * 0.018))
        n, w = 9, (box[2] - box[0]) / 9
        for i in range(n):
            x = box[0] + i * w
            d.polygon([(x, box[1] + fw), (x + w / 2, box[1] + fw * 0.15), (x + w, box[1] + fw)], fill=GOLD + (255,))
            d.polygon([(x, box[3] - fw), (x + w / 2, box[3] - fw * 0.15), (x + w, box[3] - fw)], fill=GOLD + (255,))
    # papan congkak
    cx, cy = S / 2, S / 2 + S * 0.02
    bw, bh = S * (0.70 - pad_ratio), S * (0.34 - pad_ratio * 0.6)
    d.rounded_rectangle([cx - bw/2, cy - bh/2, cx + bw/2, cy + bh/2],
                        radius=bh/2, outline=GOLD + (255,), width=int(S * 0.022))
    # rumah ibu
    rx, ry = bw * 0.115, bh * 0.30
    for sx in (-1, 1):
        d.ellipse([cx + sx*bw*0.355 - rx, cy - ry, cx + sx*bw*0.355 + rx, cy + ry],
                  outline=GOLD + (255,), width=int(S * 0.016))
    # lubang + biji
    r = bh * 0.112
    for row in (-1, 1):
        for i in range(3):
            hx = cx + (i - 1) * bw * 0.175
            hy = cy + row * bh * 0.20
            d.ellipse([hx - r, hy - r, hx + r, hy + r], fill=GOLD2 + (255,))
    return im.resize((size, size), Image.LANCZOS)

os.makedirs(OUT, exist_ok=True)
for s in (192, 512):
    icon(s).save(os.path.join(OUT, 'icon-%d.png' % s), optimize=True)
icon(512, pad_ratio=0.14).save(os.path.join(OUT, 'icon-maskable-512.png'), optimize=True)
icon(180).save(os.path.join(OUT, 'apple-touch-icon.png'), optimize=True)
print('ikon ditulis ke', OUT)
