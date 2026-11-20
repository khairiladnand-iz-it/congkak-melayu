# Congkak Melayu — Warisan Agung Nusantara

Permainan congkak tradisional Melayu dalam pelayar. Satu fail HTML kendiri, tiada rangka kerja,
tiada pemasangan. 16 pahlawan Nusantara, duel silat berasaskan kemahiran, Kembara Nusantara
16 peringkat, gamelan prosedural, dan mod dalam talian.

[**▶ Main sekarang**](https://khairiladnand-iz-it.github.io/congkak-melayu/) · Lesen MIT

## Ciri

- **Congkak penuh** — peraturan tradisional termasuk tikam selepas satu pusingan, giliran tambahan, dan rumah ibu.
- **16 pahlawan Nusantara** — Hang Tuah, Mahsuri, Puteri Gunung Ledang, Laksamana Hang Nadim dan lain-lain, setiap satu dengan elemen (api · air · tanah) dan jurus sendiri.
- **Duel silat** — baca gerakan lawan, pilih langkah atas/tengah/bawah, tangkis dan balas. Bukan sekadar tikam-menikam.
- **Kembara Nusantara** — 16 peringkat, setiap pahlawan dengan papan dan lantai yang melambangkan dirinya.
- **Gamelan prosedural** — gong, saron, bonang, suling, serunai, rebab dan gendang disintesis terus dalam pelayar. Lima mood yang bertukar mengikut keadaan permainan.
- **Istana Melaka 3D** — latar dipapar dengan pemapar mini-3D tulisan tangan (tiada pustaka luar).
- **Boleh dipasang (PWA)** — tambah ke skrin utama pada Android atau iPhone untuk skrin penuh sebenar dan main di luar talian.
- **Mod dalam talian tanpa akaun** — lobi awam terus antara pelayar melalui WebRTC. Tiada pendaftaran, tiada pelayan: buka pautan, tukar nama, cari lawan. Sembang guna frasa tetap sahaja, jadi tiada bot mahupun kata kesat. Ada juga main melalui kod mesej bila sambungan terus tidak boleh.

## Binaan

Perlu Python 3 dengan Pillow, dan Node 20+ untuk ujian.

```bash
pip install pillow

python3 tools/build.py          # -> dist/  (web penuh + PWA)
bash tools/test.sh              # bina + semak sintaks + 4 set ujian
```

Keluaran satu fail tanpa PWA (contohnya untuk ditampal ke tempat lain):

```bash
python3 tools/build.py --single --out congkak.html
```

Binaan menukar semua seni JPEG kepada WebP secara automatik — kira-kira 22% lebih kecil
tanpa perubahan kod. Guna `--no-webp` untuk melangkaunya.

## Susunan

```
src/js/      17 modul JavaScript (lihat JS_ORDER dalam tools/build.py)
src/css/     5 helaian gaya
src/assets/  seni pahlawan & papan (data URI dalam JSON)
src/pwa/     manifest, service worker, ikon
tools/       build.py · make_icons.py · test.sh
tests/       harness vm + 4 set ujian
.github/     aliran kerja bina-uji-siar
```

`CLAUDE.md` mengandungi nota seni bina untuk sesi Claude Code.

## Penyiaran

Setiap tolakan ke `main` akan dibina, diuji, dan disiarkan ke GitHub Pages secara automatik
melalui `.github/workflows/deploy.yml`. Hidupkan sekali sahaja di
**Settings → Pages → Source: GitHub Actions**.

## Penghargaan

- [three.js](https://github.com/mrdoob/three.js) — papan 3D (MIT)
- [Trystero](https://github.com/dmotz/trystero) — perlawanan P2P tanpa pelayan (MIT)
- Seni pahlawan dijana untuk projek ini

## Lesen

MIT — lihat [LICENSE](LICENSE).
