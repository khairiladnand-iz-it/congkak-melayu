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
| `new_a.js` | `DEF` tetapan lalai, `fixCfg()`, `SITE` |
| `harian.js` | `RNG` boleh benih + `Harian` — teka-teki harian |
| `kisah.js` | `KISAH` 18 kad pahlawan (sejarah/lagenda/dipertikai) + `Kisah` |
| `prof.js`→`prog.js` | `Prof` (XP, biji permata, nick), `Store` (keupayaan `db`) |
| `quest.js` | `CAMP` 16 peringkat Kembara, misi harian, lencana |
| `music.js` | `Mus` gamelan prosedural (5 mood) + `Snd` kesan bunyi |
| `p2p.js` | `P2P` — PeerJS (MIT) dibungkus menjadi ruang nama gaya bilik Claude; topologi bintang |
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

## Kisah Pahlawan (bahan sekolah)

`kisah.js` ada satu kad untuk setiap pahlawan, selari dengan indeks `HEROES`.
Setiap kad **mesti** menyatakan `j` (sejarah / lagenda / pertikai), zaman, tempat, kisah,
satu fakta "Tahukah anda", dan **sumber cerita**. Inilah yang menjadikannya berguna di
sekolah: pelajar belajar membezakan catatan daripada cerita rakyat.

**Jangan tambah atau ubah kisah tanpa sumber.** Jangan naikkan sesuatu daripada `lagenda`
kepada `sejarah` tanpa rujukan. Kad ditunjukkan selepas menewaskan pahlawan dalam Kembara,
dan boleh dilayari melalui jubin **Kisah** di menu.

## Congkak Harian

Satu papan, sama untuk semua orang di dunia, bertukar setiap tengah malam, satu percubaan
sehari. **Keadilannya bergantung sepenuhnya pada determinisme**, jadi:

- `RNG` (mulberry32) dalam `harian.js` menggantikan `Math.random()` dalam AI `engine.js`.
  Tanpa benih ia hanyalah `Math.random`, jadi permainan biasa tidak berubah.
- Tarikh ialah satu-satunya benih — tiada pelayan. `Harian.papan(n)` dicerminkan supaya
  kedua-dua pihak dapat susunan yang sama.
- **Jangan masukkan apa-apa yang rawak ke dalam laluan permainan tanpa melalui `RNG`.**

Skor disimpan dalam `Prof.d.hariN/hariS/hariB` (mesti ada dalam senarai kunci `Prof.apply`).
Diuji oleh `tests/hariantest.js`.

## Prestasi (telefon panas)

Gelung paparan dulu berjalan tanpa henti pada kadar skrin penuh walaupun tiada apa
yang bergerak. Sekarang `World.shouldDraw()` menghadkan papan kepada **30 fps**,
Istana (pemapar perisian, bahagian paling mahal) kepada separuh daripada itu, dan
melangkau lukisan sepenuhnya apabila tab tersembunyi atau lapisan penuh menutup papan.
Tween tetap dikemas kini setiap bingkai supaya tiada gerakan tergantung.
`MenuFx` dihadkan sama. Diuji oleh `tests/perftest.js`.

**Jangan naikkan `World.fps`** tanpa sebab kukuh — ini permainan bergilir.

## Papan Wira (muka hadapan 3D)

Papan 3D sebenar (`World`) ialah wira muka hadapan. `MenuFx.heroFit()` mengukur `.mwrap` dan
memberi `World.hero({cx,cy,wd,ht})`: ruang kanan panel pada skrin lebar (≥901px, ruang ≥340px),
atau jalur di atas panel pada telefon menegak (`.mwrap` ditolak 150px). Tiada ruang = `hero(null)`.
`World.heroFrame()` mengira jarak kamera daripada segi empat itu dan memakai `cam.setViewOffset`;
`setMode()` membersihkannya untuk mod lain. Di menu pelantar disorok dan diganti bayang
(`menuM`: `ShadowMaterial` + kolam sentuhan); `dressMode()` menukarnya.

Sebelum ini papan dilukis di menu pada resolusi penuh **walaupun kanvasnya `display:none`**.
Kini di menu ia dilukis hanya bila `heroR` wujud, belum ditatal keluar (`heroSc`), dan tiada lapisan
menutupnya. Mod kurang gerakan melukis sekali (`_heroDirty`). Diuji oleh `tests/hero.py`
(perlu binaan; `THREE_LOCAL=` jika tiada rangkaian).

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

## Pengangkutan P2P

PeerJS 1.5.5, isyarat melalui PeerServer awam (`0.peerjs.com:443`), data melalui WebRTC.
**Topologi bintang**: orang pertama yang menuntut ID bilik menjadi hos dan menyampaikan
semula setiap mesej; yang mendapat ralat `unavailable-id` menyambung kepadanya sebagai
klien. Bila hos pergi, klien berebut menuntut ID itu semula selepas jeda rawak.
Menyambung kepada hos dicuba sehingga lima kali — hos yang baru menuntut ID mungkin
belum bersedia menerima sambungan, dan ia tidak patut dilaporkan sebagai gagal.

## Ujian

`tests/h.js` ialah harness `vm` yang memuatkan `tests/chk.js` (dijana) dengan DOM tiruan.
`NO3D=1` mematikan stub three.js. Set ujian: `t` (enjin, 300 perlawanan), `t2` (sejarah/jam),
`t3` (profil), `lobitest` (tapisan bahasa, nick, frasa, cabaran, audio),
`p2ptest` (shim Trystero diuji terhadap bilik tiruan), `animtest` (lengkung pelonggaran & kadar masa).
`tests/hero.py` menguji Papan Wira (11 semakan).
`tests/smoke.py` membuka keluaran sebenar dalam Chromium (telefon & desktop) — dijalankan oleh CI.

`tests/online.py` ialah **penguji dalam talian**: dua pemain sebenar dalam dua tab, melalui
kod keluaran sebenar (P2P -> Rm -> Net -> Lobi -> Match). Empat senario — tanpa ID log masuk,
dengan ID log masuk (bilik Claude), telefon, dan kod perkongsian — 68 semakan.
Pengangkutan PeerServer/WebRTC diganti dengan `tests/mock_peerjs.js` (BroadcastChannel +
timbang tara tuntutan ID melalui localStorage) yang API-nya sama dengan PeerJS 1.5.5. Ia menguji semua KECUALI rangkaian sebenar:
kegagalan di sini bermakna pepijat logik; lulus di sini tetapi gagal pada telefon sebenar
bermakna masalah relay atau WebRTC, bukan kod permainan.
