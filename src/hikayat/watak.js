/* ===== WATAK SAMPINGAN =====
   Lawan yang tiada potret pahlawan. Setiap satu dilukis oleh Avatar.svg() dalam gaya chibi.
   Kebanyakan watak memakai potret chibi daripada roster pengguna (src/assets/watak-roster.png,
   dipotong oleh tools/watak_avatar.py). Spesifikasi sp di bawah ialah sandaran SVG.
   n = nama, o = jenis (tokoh / watak / rekaan, sama seperti JLAWAN), d = siapa (hanya daripada data.js),
   sp = spesifikasi avatar. Rupa paras ialah tafsiran seni, bukan gambaran sejarah:
   tiada potret sezaman bagi kebanyakan tokoh ini. */
const LATAR_JENIS = { tokoh: '#6a1c28', watak: '#5a4214', rekaan: '#3e2c66' };
const WATAK = {
 temagi:      { n: 'Temagi / Sang Aji', o: 'tokoh', d: 'Pemerintah Temasik yang digulingkan; dua sumber Portugis memberinya dua nama.', sp: { t: 'mahkota', b: '#33477a', bt: 'songket', ms: 1, m: 'sedih' } },
 rajuna:      { n: 'Sang Rajuna Tapa', o: 'tokoh', d: 'Pembesar Temasik yang membuka pintu kota menurut Sulalatus Salatin.', sp: { t: 'tengkolok', tc: '#3a2a4a', b: '#4a2a3a', ms: 1, m: 'licik' } },
 pemburu:     { n: 'Pemburu baginda', o: 'watak', d: 'Pengikut Parameswara di Bertam.', sp: { t: 'ikat', tc: '#5a7a2a', b: '#5a4a2a', bt: 'none', m: 'senyum', a: 'lembing', k: 'gelap' } },
 yinqing:     { n: 'Yin Qing', o: 'tokoh', d: 'Utusan Ming ke Melaka (1403).', sp: { t: 'ming', k: 'cerah', b: '#8a1c2a', bt: 'jubah', ms: 1, m: 'tenang', a: 'gulung', iris: '#2a1a10' } },
 tunali_b:    { n: 'Bendahara Seri Nara Diraja Tun Ali', o: 'tokoh', d: 'Bendahara Melaka pada zaman Abu Syahid dan Muzaffar Syah.', sp: { t: 'tengkolok', tc: '#1f4a3a', b: '#2a3a2a', bt: 'songket', ms: 1, jg: 1, tua: 1, m: 'tenang', a: 'keris' } },
 penasihat:   { n: 'Penasihat istana', o: 'rekaan', d: 'Watak rekaan: menceritakan bahawa urusan negeri dipegang orang lain.', sp: { t: 'kopiah', b: '#4a4a5a', bt: 'jubah', jg: 1, ms: 1, tua: 1, m: 'senyum' } },
 perpatih:    { n: 'Tun Perpatih Sedang', o: 'tokoh', d: 'Pembesar yang namanya dikaitkan dengan pakatan 1446.', sp: { t: 'tengkolok', tc: '#2a1a1a', b: '#3a1a1a', ms: 1, m: 'garang', a: 'keris' } },
 tunperak:    { n: 'Tun Perak', o: 'tokoh', d: 'Pembesar Kelang; kemudian Bendahara Paduka Raja.', sp: { t: 'tengkolok', tc: '#5a2a7a', b: '#3a2050', bt: 'songket', ms: 1, m: 'tenang', a: 'keris' } },
 panglimasiam:{ n: 'Panglima Siam', o: 'rekaan', d: 'Watak rekaan: namanya tidak tercatat dalam sumber kami. Peperangan 1456 ialah sejarah.', sp: { t: 'siam', b: '#7a3a1a', bt: 'zirah', ms: 1, m: 'garang', a: 'lembing' } },
 tunali_f:    { n: 'Tun Ali', o: 'tokoh', d: 'Suami pertama Tun Fatimah, sepupunya.', sp: { t: 'tengkolok', tc: '#8a5a1a', b: '#5a3a1a', m: 'senyum', a: 'keris' } },
 utusan:      { n: 'Utusan Melaka', o: 'rekaan', d: 'Watak rekaan: nama utusan ke China belum kami sahkan.', sp: { t: 'tengkolok', tc: '#1a3a6a', b: '#2a3a5a', ms: 1, m: 'tenang', a: 'gulung' } },
 pengiring:   { n: 'Ketua pengiring', o: 'watak', d: 'Ketua rombongan puteri dari China.', sp: { t: 'beret', tc: '#1a1a1a', k: 'cerah', b: '#2a5a7a', bt: 'jubah', m: 'tenang', iris: '#2a1a10' } },
 mansur:      { n: 'Sultan Mansur Syah', o: 'tokoh', d: 'Sultan Melaka, 1456–1477.', sp: { t: 'mahkota', b: '#6a1a2a', bt: 'songket', ms: 1, m: 'senyum', a: 'keris' } },
 pires:       { n: 'Tomé Pires', o: 'watak', d: 'Pengarang Suma Oriental; di sini sebagai watak penulis.', sp: { t: 'beret', tc: '#1a1a1a', k: 'eropah', r: '#4a3020', b: '#2a2a3a', jg: 1, m: 'tenang', a: 'pena', iris: '#3a5a6a' } },
 adiputera:   { n: 'Adi Putera', o: 'watak', d: 'Guru silat lima sahabat dalam Hikayat Hang Tuah.', sp: { t: 'ikat', tc: '#f4f0e6', b: '#3a3a3a', bt: 'none', jg: 1, ms: 1, tua: 1, m: 'tenang' } },
 pengamuk:    { n: 'Pengamuk', o: 'watak', d: 'Pengamuk di pasar Melaka dalam Hikayat Hang Tuah.', sp: { t: 'ikat', tc: '#a01a1a', b: '#4a2a1a', bt: 'none', m: 'garang', a: 'keris', k: 'gelap' } },
 tamingsari:  { n: 'Taming Sari', o: 'watak', d: 'Pendekar Majapahit dalam Hikayat Hang Tuah.', sp: { t: 'destar', tc: '#3a2a1a', b: '#2a1a0a', ms: 1, m: 'garang', a: 'keris' } },
 lekir:       { n: 'Hang Lekir', o: 'watak', d: 'Salah seorang daripada lima sahabat.', sp: { t: 'ikat', tc: '#b0302a', b: '#5a1a1a', m: 'senyum', a: 'keris' } },
 pemfitnah:   { n: 'Pembesar pemfitnah', o: 'rekaan', d: 'Watak rekaan: nama pemfitnah belum kami sahkan.', sp: { t: 'tengkolok', tc: '#2a2a2a', b: '#3a2a3a', ms: 1, m: 'licik' } },
 hulubalang:  { n: 'Hulubalang istana', o: 'watak', d: 'Pengawal istana yang cuba menghalang Jebat.', sp: { t: 'destar', tc: '#5a1a1a', b: '#3a3a3a', bt: 'zirah', m: 'garang', a: 'lembing' } },
 kasturi:     { n: 'Hang Kasturi', o: 'watak', d: 'Salah seorang daripada lima sahabat.', sp: { t: 'ikat', tc: '#2a5a8a', b: '#1a3a5a', m: 'tenang', a: 'keris' } },
 nakhodapel:  { n: 'Nakhoda pelabuhan', o: 'rekaan', d: 'Watak rekaan di pelabuhan Melaka.', sp: { t: 'ikat', tc: '#e8e0c8', b: '#f1e3c2', bt: 'none', ms: 1, tua: 1, m: 'senyum', a: 'teropong', k: 'gelap' } },
 inang:       { n: 'Inang Tun Teja', o: 'rekaan', d: 'Watak rekaan: nama inang belum kami sahkan.', sp: { p: 1, rg: 'sanggul', t: 'tudung', tc: '#7a4a6a', b: '#7a4a6a', bt: 'selendang', m: 'senyum', tua: 1 } },
 nakhodakapal:{ n: 'Nakhoda kapal', o: 'rekaan', d: 'Watak rekaan dalam pelayaran dari Pahang.', sp: { t: 'destar', tc: '#1a4a5a', b: '#2a4a4a', ms: 1, m: 'tenang', a: 'dayung', k: 'gelap' } },
 mahmud:      { n: 'Sultan Mahmud Syah', o: 'tokoh', d: 'Sultan Melaka terakhir; berundur selepas 1511.', sp: { t: 'mahkota', b: '#2a1a4a', bt: 'songket', ms: 1, m: 'licik', a: 'keris' } },
 todak:       { n: 'Todak', o: 'watak', d: 'Ikan todak yang menyerang Temasik dalam Sulalatus Salatin.', sp: { jenis: 'todak' } },
 pengawal:    { n: 'Pengawal kota', o: 'watak', d: 'Pengawal Melaka pada 1511.', sp: { t: 'destar', tc: '#4a2a1a', b: '#3a3a3a', bt: 'zirah', ms: 1, m: 'sedih', a: 'lembing' } },
 pembesarlaut:{ n: 'Pembesar angkatan laut', o: 'watak', d: 'Pembesar angkatan Sultan Mahmud selepas 1511.', sp: { t: 'tengkolok', tc: '#1a3a6a', b: '#1a2a4a', ms: 1, jg: 1, m: 'tenang', a: 'teropong' } },
 kapten:      { n: 'Kapten kubu Portugis', o: 'watak', d: 'Kapten kubu Portugis di Melaka.', sp: { t: 'morion', k: 'eropah', r: '#3a2a1a', b: '#3a2a2a', bt: 'zirah', jg: 1, ms: 1, m: 'garang', a: 'pedang', iris: '#3a5a6a' } },
 goa:         { n: 'Ketua angkatan bantuan Goa', o: 'watak', d: 'Angkatan dari Goa yang memecahkan kepungan 1524.', sp: { t: 'beret', tc: '#8a1a1a', k: 'eropah', r: '#2a1a10', b: '#2a2a3a', bt: 'ruff', ms: 1, m: 'licik', a: 'pedang', iris: '#3a2a1a' } },
 mudaliar:    { n: 'Raja Mudaliar', o: 'tokoh', d: 'Penabur fitnah terhadap Bendahara Tun Mutahir menurut Sulalatus Salatin.', sp: { t: 'serban', tc: '#e0a83a', k: 'gelap', b: '#6a3a1a', bt: 'jubah', ms: 1, m: 'licik', a: 'anting' } },
 rajaali:     { n: 'Raja Ali', o: 'tokoh', d: 'Putera Tun Fatimah; kemudian Sultan Alauddin Riayat Syah, pemerintah Johor kedua.', sp: { t: 'tengkolok', tc: '#c9962e', b: '#5a1a2a', bt: 'songket', m: 'senyum' } },
 pembjohor:   { n: 'Pembesar Johor', o: 'watak', d: 'Pembesar istana Johor.', sp: { t: 'tengkolok', tc: '#2a4a2a', b: '#2a3a2a', ms: 1, m: 'tenang', a: 'keris' } },
 alauddin3:   { n: 'Sultan Alauddin Riayat Syah III', o: 'tokoh', d: 'Sultan Johor yang dilayani Tun Sri Lanang.', sp: { t: 'mahkota', b: '#1a3a4a', bt: 'songket', ms: 1, jg: 1, m: 'tenang', a: 'keris' } },
 rajaabdullah_j:{ n: 'Raja Abdullah (Johor)', o: 'tokoh', d: 'Kerabat Johor yang meminta Sulalatus Salatin disusun (1612).', sp: { t: 'tengkolok', tc: '#6a4a1a', b: '#3a2a1a', ms: 1, m: 'senyum', a: 'gulung' } },
 panglimaaceh:{ n: 'Panglima Aceh', o: 'watak', d: 'Panglima angkatan Aceh yang menyerang Batu Sawar (1613).', sp: { t: 'meukeutop', b: '#1a1a1a', bt: 'kolar', ms: 1, m: 'garang', a: 'rencong' } },
 sultanaceh:  { n: 'Sultan Aceh', o: 'tokoh', d: 'Sultan Aceh pada akhir abad ke-16; nama tidak dinyatakan di sini.', sp: { t: 'meukeutop', b: '#2a1a3a', bt: 'songket', ms: 1, jg: 1, m: 'tenang', a: 'rencong' } },
 inongbalee:  { n: 'Panglima Inong Balee', o: 'watak', d: 'Panglima armada balu dalam kisah Malahayati.', sp: { p: 1, rg: 'panjang', t: 'tudung', tc: '#1a1a2a', b: '#1a1a2a', bt: 'kolar', m: 'garang', a: 'rencong' } },
 houtman:     { n: 'Cornelis de Houtman', o: 'tokoh', d: 'Ketua ekspedisi Belanda ke Aceh; terbunuh pada 1599.', sp: { t: 'belanda', k: 'eropah', r: '#c99a4a', b: '#1d1a1a', bt: 'ruff', jg: 1, ms: 1, m: 'licik', a: 'pedang', iris: '#4a7a9a' } },
 lancaster:   { n: 'James Lancaster', o: 'tokoh', d: 'Pelayar Inggeris yang membawa surat Ratu Elizabeth I ke Aceh.', sp: { t: 'inggeris', k: 'eropah', r: '#6a4a2a', b: '#26202a', bt: 'ruff', jg: 1, ms: 1, m: 'tenang', a: 'gulung', iris: '#4a6a5a' } },
 narai:       { n: 'Raja Narai', o: 'tokoh', d: 'Raja Siam pada zaman Puteri Saadong.', sp: { t: 'siam', b: '#c9962e', bt: 'songket', m: 'tenang', k: 'sawo' } },
 isteribaru:  { n: 'Isteri baharu Raja Abdullah', o: 'watak', d: 'Namanya tidak diketahui.', sp: { p: 1, rg: 'sanggul', b: '#2a6a5a', bt: 'selendang', tc: '#2a6a5a', m: 'licik', a: 'anting' } },
 rajaabdullah_k:{ n: 'Raja Abdullah (Jembal)', o: 'tokoh', d: 'Suami Puteri Saadong; pemerintahannya bersumber.', sp: { t: 'tengkolok', tc: '#1a5a3a', b: '#1a3a2a', bt: 'songket', ms: 1, m: 'tenang', a: 'keris' } },
 pengasuh:    { n: 'Pengasuh istana', o: 'watak', d: 'Pengasuh puteri dalam cerita rakyat Kelantan.', sp: { p: 1, t: 'tudung', tc: '#8a6a3a', b: '#8a6a3a', tua: 1, m: 'senyum' } },
 pembkelantan:{ n: 'Pembesar Kelantan', o: 'watak', d: 'Pembesar dalam lagenda Cik Siti Wan Kembang.', sp: { t: 'tengkolok', tc: '#1a5a4a', b: '#1a3a3a', ms: 1, m: 'tenang', a: 'keris' } },
 pedagangarab:{ n: 'Pedagang Arab', o: 'watak', d: 'Pedagang yang menghadiahkan seekor kijang.', sp: { t: 'serban', b: '#e8dcc0', bt: 'jubah', jg: 1, ms: 1, m: 'senyum', k: 'sawo' } },
 rajakecil:   { n: 'Raja Kecil', o: 'tokoh', d: 'Ditewaskan pada 1722 oleh Sultan Sulaiman dengan bantuan lima bersaudara Bugis.', sp: { t: 'tengkolok', tc: '#9a1a1a', b: '#4a1a1a', m: 'garang', a: 'keris' } },
 daengchelak: { n: 'Daeng Chelak', o: 'tokoh', d: 'Yang Dipertuan Muda kedua.', sp: { t: 'passapu', tc: '#7a1a2a', b: '#2a1a1a', bt: 'songket', ms: 1, m: 'tenang', a: 'keris' } },
 syarif:      { n: 'Syarif Abdurrahman Alkadrie', o: 'tokoh', d: 'Sultan Pontianak pertama (1771).', sp: { t: 'serban', tc: '#2a6a3a', b: '#e8dcc0', bt: 'jubah', jg: 1, ms: 1, m: 'tenang' } },
 komander:    { n: 'Komander kubu Belanda', o: 'watak', d: 'Komander kubu Belanda di Melaka (1784).', sp: { t: 'tricorne', k: 'eropah', r: '#e8e2d6', b: '#2a3a6a', bt: 'kolar', m: 'garang', a: 'pedang', iris: '#4a6a8a' } },
 pandak:      { n: 'Pandak Mayah', o: 'watak', d: 'Ayahanda Mahsuri dalam lagenda Langkawi.', sp: { t: 'ikat', tc: '#5a3a2a', b: '#4a3a2a', bt: 'none', ms: 1, tua: 1, m: 'senyum' } },
 wandarus:    { n: 'Wan Darus', o: 'watak', d: 'Suami Mahsuri; pergi berperang untuk Kedah (1821).', sp: { t: 'destar', tc: '#2a3a5a', b: '#2a2a3a', m: 'sedih', a: 'keris' } },
 wanmahora:   { n: 'Wan Mahora', o: 'watak', d: 'Isteri penghulu yang menabur fitnah dalam lagenda Mahsuri.', sp: { p: 1, t: 'tudung', tc: '#5a2a6a', b: '#5a2a6a', bt: 'selendang', m: 'licik', a: 'anting' } },
 penghulu:    { n: 'Penghulu kampung', o: 'watak', d: 'Penghulu yang menjatuhkan hukuman dalam lagenda Mahsuri.', sp: { t: 'songkok', b: '#3a3a2a', ms: 1, tua: 1, m: 'garang' } }
};
const _avCache = {};
/* AVATAR (disuntik oleh binaan daripada src/assets/watak.json): potret chibi lukisan pengguna.
   Watak tanpa potret di situ jatuh balik ke avatar SVG. */
const adaPotret = id => typeof AVATAR !== 'undefined' && !!AVATAR[id];
function avatarWatak(id) {
  const W = WATAK[id]; if (!W) return '';
  if (adaPotret(id)) return `<img src="${AVATAR[id]}" alt="">`;
  return _avCache[id] || (_avCache[id] = Avatar.svg(Object.assign({ bg: LATAR_JENIS[W.o] }, W.sp)));
}
