#!/usr/bin/env python3
"""Pembesar 2x gaya anime (waifu2x upconv_7, rangkaian neural) dalam numpy tulen.

Berat: lltcggie/waifu2x-caffe (MIT), bin/models/upconv_7_anime_style_art_rgb/<model>.json.
Tetapkan W2X_MODELS ke folder itu. Model 'noise1_scale2.0x_model' juga membuang artifak JPEG/WebP.
Dijalankan secara jubin supaya memori kekal kecil.

  python3 tools/w2x.py masuk.png keluar.png [ulangan]
"""
import json, os, sys
import numpy as np

MODELS = os.environ.get('W2X_MODELS', '')
_W = {}


def berat(nama='noise1_scale2.0x_model'):
    if nama not in _W:
        L = json.load(open(os.path.join(MODELS, nama + '.json')))
        _W[nama] = [(np.asarray(l['weight'], np.float32), np.asarray(l['bias'], np.float32)) for l in L]
    return _W[nama]


def conv3(x, w, b):
    """x: (C,H,W) -> (O,H-2,W-2), korelasi 3x3 tanpa pad, LeakyReLU 0.1"""
    C, H, Wd = x.shape
    cols = np.empty((C * 9, (H - 2) * (Wd - 2)), np.float32)
    k = 0
    for c in range(C):
        for dy in range(3):
            for dx in range(3):
                cols[k] = x[c, dy:dy + H - 2, dx:dx + Wd - 2].reshape(-1); k += 1
    y = w.reshape(w.shape[0], -1) @ cols + b[:, None]
    y = y.reshape(w.shape[0], H - 2, Wd - 2)
    return np.where(y > 0, y, y * 0.1)


def deconv(x, w, b):
    """SpatialFullConvolution 4x4, langkah 2, pad 3: x (C,H,W) -> (3, 2H-4, 2W-4)"""
    C, H, Wd = x.shape
    O = w.shape[1]
    v = (x.reshape(C, -1).T @ w.reshape(C, -1)).reshape(H, Wd, O, 4, 4)
    out = np.zeros((O, 2 * H + 2, 2 * Wd + 2), np.float32)
    for ky in range(4):
        for kx in range(4):
            out[:, ky:ky + 2 * H:2, kx:kx + 2 * Wd:2] += v[:, :, :, ky, kx].transpose(2, 0, 1)
    out = out[:, 3:-3, 3:-3] + b[:, None, None]
    return out


def jalan(x, nama):
    W = berat(nama)
    for w, b in W[:-1]:
        x = conv3(x, w, b)
    return deconv(x, *W[-1])


def up2(rgb, nama='noise1_scale2.0x_model', jubin=96):
    """rgb uint8 (H,W,3) -> (2H,2W,3)"""
    H, Wd = rgb.shape[:2]; p = 7
    x = np.pad(rgb.astype(np.float32) / 255, ((p, p), (p, p), (0, 0)), mode='edge').transpose(2, 0, 1)
    out = np.zeros((3, 2 * H, 2 * Wd), np.float32)
    for y0 in range(0, H, jubin):
        for x0 in range(0, Wd, jubin):
            h = min(jubin, H - y0); w = min(jubin, Wd - x0)
            t = jalan(x[:, y0:y0 + h + 2 * p, x0:x0 + w + 2 * p], nama)
            out[:, 2 * y0:2 * (y0 + h), 2 * x0:2 * (x0 + w)] = t
    return (np.clip(out.transpose(1, 2, 0), 0, 1) * 255 + .5).astype(np.uint8)


if __name__ == '__main__':
    from PIL import Image
    im = np.asarray(Image.open(sys.argv[1]).convert('RGB'))
    for _ in range(int(sys.argv[3]) if len(sys.argv) > 3 else 1):
        im = up2(im)
    Image.fromarray(im).save(sys.argv[2]); print(im.shape)
