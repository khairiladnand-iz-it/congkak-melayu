/* Hikayat Pahlawan: integriti bahan akademik + perlawanan sampai tamat.
   node tests/hikayattest.js  (memuatkan sumber terus, tanpa DOM) */
const fs = require('fs'), vm = require('vm'), path = require('path');
const R = p => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
const hr = R('src/js/harian.js');
const src = 'const AVATAR=' + R('src/assets/watak.json') + ';\n' + R('src/js/engine.js') + '\n' + hr.slice(hr.indexOf('const RNG'), hr.indexOf('const Harian'))
  + ['data', 'cerita', 'avatar', 'watak', 'tempat', 'laga'].map(n => R('src/hikayat/' + n + '.js')).join('\n')
  + '\n;({Rules,AI,RNG,LABEL,JLAWAN,TAHAP,PROLOG,HIKAYAT,Laga,CERITA,WATAK,TEMPAT,DARAT,Avatar,avatarWatak})';
const X = vm.runInNewContext(src, { console, Math });
const { Rules, RNG, LABEL, JLAWAN, TAHAP, HIKAYAT, Laga, CERITA, WATAK, TEMPAT, DARAT } = X;

let ok = true, n = 0;
const chk = (c, m) => { n++; if (!c) { ok = false; console.log('FAIL', m) } };

/* ---- data ---- */
chk(HIKAYAT.length === 16, '16 hikayat');
const ids = new Set(HIKAYAT.map(H => H.id)); chk(ids.size === 16, 'id hikayat unik');
const hs = new Set(HIKAYAT.map(H => H.h)); chk(hs.size === 16, 'setiap pahlawan sekali sahaja');
chk(!hs.has(13) && !hs.has(14), 'Puteri Gunung Ledang dan Puteri Santubong dikecualikan (tiada sauh sejarah)');
const TEKS = JSON.stringify(HIKAYAT);
chk(!/perlu semakan/i.test(TEKS), 'tiada butiran "(perlu semakan)" yang dibina');
chk(!/\bsekolah\b|\bkelas\b/i.test(TEKS + R('src/hikayat/tpl.html') + R('src/hikayat/main.js')), 'tiada perkataan sekolah/kelas');
let rekaan = 0;
for (const H of HIKAYAT) {
  for (const k of ['id', 'n', 'z', 'p', 'j', 'i', 'e', 'es']) chk(typeof H[k] === 'string' && H[k].length > 0, `${H.id}: medan ${k}`);
  chk(H.h >= 0 && H.h < 18, `${H.id}: potret wujud`);
  chk(LABEL[H.j], `${H.id}: label utama sah`);
  chk(H.st.length === 4, `${H.id}: 4 perhentian`);
  const sem = (H.pr ? [H.pr] : []).concat(H.st);
  for (const [i, S] of sem.entries()) {
    const w = `${H.id}#${i}`;
    for (const k of ['t', 'l', 'o', 'j', 'k', 's']) chk(typeof S[k] === 'string' && S[k].trim().length > 0, `${w}: medan ${k}`);
    chk(typeof S.ringkas === 'string' && S.ringkas.length > 0 || H.pr === S, `${w}: ringkasan asal kekal`);
    chk(LABEL[S.j], `${w}: label sah (${S.j})`);
    chk(JLAWAN[S.o], `${w}: jenis lawan sah (${S.o})`);
    chk(S.s.length >= 8, `${w}: sumber dinyatakan`);
    if (S.j === 'rekaan' || S.o === 'rekaan') { rekaan++; chk(typeof S.r === 'string' && S.r.length > 30, `${w}: rekaan WAJIB ada penyataan`) }
    else chk(!S.r, `${w}: penyataan rekaan hanya pada adegan/lawan rekaan`);
    if (S.j === 'rekaan') chk(/rekaan/i.test(S.r), `${w}: penyataan menyebut perkataan "rekaan"`);
    if (S.h != null) chk(S.h >= 0 && S.h < 18, `${w}: potret lawan wujud`);
    chk(!/["“][^"”]{3,}["”]\s*(kata|titah|ujar)/i.test([].concat(S.a).join(' ')), `${w}: tiada dialog rekaan di mulut tokoh`);
  }
}
/* ---- cerita, peta, avatar ---- */
const dipakai = new Set();
for (const H of HIKAYAT) {
  chk(CERITA[H.id] && CERITA[H.id].st.length === H.st.length, `${H.id}: cerita untuk setiap perhentian`);
  chk(typeof H.i2 === 'string' && H.i2.length > 40, `${H.id}: pembukaan tambahan`);
  for (const [i, S] of (H.pr ? [H.pr] : []).concat(H.st).entries()) {
    const w = `${H.id}#${i}`;
    chk(Array.isArray(S.a) && S.a.length >= 3 && S.a.every(p => p.length > 20), `${w}: sekurang-kurangnya 3 babak cerita`);
    chk(typeof S.b === 'string' && S.b.length > 15, `${w}: penutup selepas menang`);
    chk(TEMPAT[S.g], `${w}: tempat peta wujud (${S.g})`);
    chk(S.h != null || (S.w && WATAK[S.w]), `${w}: lawan ada potret atau avatar`);
    if (S.w) { dipakai.add(S.w); chk(WATAK[S.w].o === S.o, `${w}: jenis watak ${S.w} sepadan dengan perhentian`) }
    chk(!S.a.some(p => /[“"][^”"]{4,}[”"]/.test(p) && !/ghaib/.test(p)), `${w}: tiada dialog dalam narasi`);
    if (S.o === 'rekaan') chk(S.a.join(' ').match(/rekaan|ditambah|dicipta|tidak wujud/i), `${w}: narasi menyatakan lawan rekaan`);
  }
}
for (const id in WATAK) {
  chk(dipakai.has(id), `watak ${id} digunakan dalam sekurang-kurangnya satu perhentian`);
  const v = X.avatarWatak(id); chk((/^<svg[\s\S]*<\/svg>$/.test(v) || /^<img src="data:image\/webp/.test(v)) && !(/^<svg/.test(v) && /undefined|NaN/.test(v)), `avatar ${id} sah`);
  chk(JLAWAN[WATAK[id].o] && WATAK[id].d.length > 8, `watak ${id}: jenis dan keterangan`);
}
const AV = JSON.parse(R('src/assets/watak.json'));
for (const id in AV) chk(WATAK[id], `potret roster ${id} sepadan dengan watak`);
chk(Object.keys(AV).length >= 50, 'potret chibi roster untuk hampir semua watak (' + Object.keys(AV).length + ')');
chk(Object.keys(WATAK).length >= 50, 'avatar untuk semua watak sampingan (' + Object.keys(WATAK).length + ')');
for (const k in TEMPAT) { const c = TEMPAT[k].c; chk(c[0] > 60 && c[0] < 125 && c[1] > -10 && c[1] < 40, `tempat ${k} dalam rantau peta`) }
chk(DARAT.every(p => p.length >= 4), 'poligon darat sah');
chk(rekaan >= 7, 'jurang sumber diisi rekaan yang dinyatakan (' + rekaan + ')');
/* label tidak dinaikkan: tokoh yang dipertikai kekal dipertikai */
const by = id => HIKAYAT.find(H => H.id === id);
chk(by('malahayati').j === 'pertikai', 'Malahayati dipertikai');
chk(by('tuah').j === 'pertikai', 'Hang Tuah dipertikai');
chk(by('siti').st.every(S => S.j === 'lagenda'), 'Cik Siti Wan Kembang: semua lagenda');
chk(by('nadim').pr && by('nadim').pr.j === 'lagenda', 'Hang Nadim: kisah todak ialah prolog lagenda');

/* ---- perlawanan: setiap tahap sampai tamat, biji kekal ---- */
const tahap = TAHAP.concat([X.PROLOG]);
for (const [k, T] of tahap.entries()) for (let g = 0; g < 12; g++) {
  RNG.seed(1000 * k + g + 1);
  const s = Laga.baru(7, T.biji, T.lvl), jum = 14 * T.biji;
  let langkah = 0;
  while (!s.over && langkah < 2000) {
    const p = s.p, h = p === 1 ? Laga.ai(s) : X.AI.pick(s.b, 7, 0, 1);
    const r = Laga.langkah(s, h);
    if (!r) { chk(false, `tahap ${k}: langkah tidak sah ${h}`); break }
    if (s.b.reduce((a, b) => a + b, 0) !== jum) { chk(false, `tahap ${k}: biji hilang`); break }
    if (!s.over && !r.extra) chk(s.p === 1 - p, 'giliran bertukar bila tidak masuk rumah');
    langkah++;
  }
  chk(s.over, `tahap ${k} perlawanan ${g}: tamat`);
  chk(Laga.skor(s, 0) + Laga.skor(s, 1) === jum, `tahap ${k}: semua biji di rumah selepas tamat`);
}
chk(!Laga.sah(Laga.baru(7, 4, 1), 8), 'pemain tidak boleh memilih lubang lawan');
RNG.off();
console.log(ok ? `HIKAYAT OK (${n} semakan, ${rekaan} rekaan dinyatakan)` : 'HIKAYAT GAGAL');
process.exit(ok ? 0 : 1);
