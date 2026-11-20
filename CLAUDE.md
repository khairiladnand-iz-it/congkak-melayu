# Congkak Melayu — nota untuk sesi Claude

Permainan congkak tradisional, satu fail HTML kendiri, tiada rangka kerja.
Repo ini ialah **sumber kebenaran tunggal**. Artifact Claude hanyalah keluaran binaan.

## Peraturan penting

1. **Jangan sekali-kali edit `dist/index.html`.** Ia dijana. Edit fail dalam `src/`, kemudian bina semula.
2. Setiap perubahan mesti lulus `bash tools/test.sh` sebelum disiarkan.
3. Semua teks yang dilihat pemain dalam **Bahasa Melayu**. Komen kod juga Melayu.
4. Jangan tambah kebergantungan npm kepada keluaran. Ia mesti kekal satu fail yang boleh dibuka terus.
   Satu pengecualian: `p2p.js` memuatkan Trystero melalui `import()` **hanya apabila pemain membuka
   mod dalam talian**. Permainan mesti tetap berfungsi penuh tanpanya (tanpa internet, atau dalam artifact).

## Binaan

```bash
python3 tools/build.py            # -> dist/ (web + PWA)   <- untuk GitHub Pages
python3 tools/build.py --single --out fail.html   # satu fail tanpa PWA <- untuk artifact Claude
bash tools/test.sh                # bina + sintaks + 6 set ujian
```

Binaan menukar semua seni JPEG kepada WebP (−22%). `--no-webp` untuk melangkaunya.

## Susunan `src/js` (susunan binaan penting — lihat `JS_ORDER` dalam `tools/build.py`)

| Fail | Isi |
|---|---|
| `engine.js` | Peraturan congkak tulen, tiada DOM. `Rules.sow()` memulangkan `{b,ev,extra,cap,lap}` |
| `ui.js` | HEROES, ELEM, SK, skrin, dan **Duel** (dipotong oleh build mengikut penanda komen) |
| `new_a.js` | `DEF` tetapan lalai, `fixCfg()` |
| `prof.js`→`prog.js` | `Prof` (XP, biji permata, nick), `Store` (keupayaan `db`) |
| `quest.js` | `CAMP` 16 peringkat Kembara, misi harian, lencana |
| `music.js` | `Mus` gamelan prosedural (5 mood) + `Snd` kesan bunyi |
| `p2p.js` | `P2P` — Trystero (MIT) dibungkus menjadi ruang nama gaya bilik Claude |
| `net.js` | `Rm` (pilih P2P dahulu, jatuh balik ke keupayaan `room`), `Net`, kodek SDP |
| `lobi.js` | `Tapis` (tapisan bahasa), `FRASA`, `Lobi` (lobi awam) |
| `msg.js` | `Msg` — main melalui kod mesej, tanpa sambungan |
| `istana.js` | Pemapar mini-3D Istana Melaka (kanvas 2D, tiada three.js) |
| `world.js` | Papan three.js, tekstur lantai, `EASE` (lengkung pelonggaran), `World.rate`/`slomo()` |
| `new_b.js` | `Screen`, `Match` — gelung permainan |
| `new_c.js` | `Setup`, `wire()`, urutan permulaan |

`ui.js` dipotong pada dua penanda; **jangan padam** komen ini:
`/* ===== BUNYI ===== */`, `/* ===== BIJI ===== */`,
`/* ===== PERTARUNGAN TIKAM ===== */`, `/* ===== PERSIAPAN ===== */`.

## Animasi

Sistem tween sendiri dalam `world.js` sudah memadai — **jangan tambah GSAP atau pustaka animasi lain**.
Gerakan ditala melalui `EASE` (lengkung bernama: `out` `back` `bounce` `inout`) yang dipilih per
gerakan dalam `pick`/`drop`/`capture`, dan `World.rate` yang mendarab tempoh ketika tween dicipta.
`World.slomo(kadar, ms)` memberi gerak perlahan seketika. Jam dinding kekal memandu tween, jadi
tiada gerakan boleh tergantung apabila tab disembunyikan.

## Had keupayaan artifact (sudah disahkan dengan ujian langsung)

- `RTCPeerConnection` **tidak wujud** dalam bingkai artifact — WebRTC tidak akan berfungsi di sana.
- `claude.use('room')` memulangkan `null` untuk pelawat yang tidak log masuk.
- `navigator.clipboard` dan `navigator.share` tiada; Fullscreen API dan wake lock **ada**.
- Keupayaan yang diisytiharkan: `{"room":{"topics":{"m":"interact","chat":"interact","inv":"interact"}},"db":{},"user":{}}`

Di GitHub Pages tiada had ini — WebRTC berfungsi penuh, jadi `Rm.mode` menjadi `'p2p'`
dan lobi terbuka kepada sesiapa sahaja tanpa akaun.

## Ujian

`tests/h.js` ialah harness `vm` yang memuatkan `tests/chk.js` (dijana) dengan DOM tiruan.
`NO3D=1` mematikan stub three.js. Set ujian: `t` (enjin, 300 perlawanan), `t2` (sejarah/jam),
`t3` (profil), `lobitest` (tapisan bahasa, nick, frasa, cabaran, audio),
`p2ptest` (shim Trystero diuji terhadap bilik tiruan), `animtest` (lengkung pelonggaran & kadar masa).
`tests/smoke.py` membuka keluaran sebenar dalam Chromium (telefon & desktop) — dijalankan oleh CI.
