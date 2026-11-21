/* ===== HIKAYAT PAHLAWAN: antara muka =====
   Rumah (pilih pahlawan) -> Jalan (peta perhentian) -> Adegan -> Laga -> Kad fakta.
   Kalah tidak menamatkan perjalanan: pemain cuba semula perhentian yang sama.
   Kemajuan disimpan dalam localStorage pelayar ini sahaja (dibalut try/catch). */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const tidur = ms => new Promise(r => setTimeout(r, ms));
const KURANG = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- simpanan ---------- */
const Simpan = {
  K: 'hikayat-pahlawan.v1', d: { maju: {}, laju: false },
  muat() { try { const v = JSON.parse(localStorage.getItem(this.K)); if (v && v.maju) this.d = Object.assign(this.d, v) } catch (e) {} },
  simpan() { try { localStorage.setItem(this.K, JSON.stringify(this.d)) } catch (e) {} },
  maju(id) { return this.d.maju[id] | 0 },
  menang(id, i) { if (i + 1 > this.maju(id)) { this.d.maju[id] = i + 1; this.simpan() } }
};

/* senarai perhentian sesuatu hikayat; prolog (jika ada) di hadapan */
const urutan = H => (H.pr ? [Object.assign({ prolog: true }, H.pr)] : []).concat(H.st);
const tahapOf = (H, i) => { const u = urutan(H)[i]; return u.prolog ? PROLOG : TAHAP[H.pr ? i - 1 : i] };
const tamatOf = H => Simpan.maju(H.id) >= urutan(H).length;

function cip(j, kecil) {
  const L = LABEL[j] || LABEL.lagenda;
  return `<b class="cip${kecil ? ' sm' : ''}" style="--lc:${L.c}">${L.l}</b>`;
}
function potret(h, nama, o, besar) {
  if (h != null && PORTRET[h]) return `<span class="med${besar ? ' lg' : ''}"><img src="${PORTRET[h]}" alt=""></span>`;
  const ini = nama.replace(/\(.*?\)/g, '').split(/[\s,]+/).filter(w => /^[A-ZÀ-Ý]/.test(w)).slice(0, 2).map(w => w[0]).join('') || nama[0];
  return `<span class="med sil${o === 'rekaan' ? ' rek' : ''}${besar ? ' lg' : ''}" aria-hidden="true"><i>${esc(ini)}</i></span>`;
}

/* ---------- skrin ---------- */
const Skrin = {
  ke(id) {
    for (const s of document.querySelectorAll('.skrin')) s.hidden = s.id !== id;
    document.body.dataset.skrin = id; scrollTo(0, 0);
  }
};

const Rumah = {
  lukis() {
    $('#label-senarai').innerHTML = Object.keys(LABEL).map(j => `<div><dt>${cip(j)}</dt><dd>${esc(LABEL[j].d)}</dd></div>`).join('');
    $('#senarai').innerHTML = HIKAYAT.map((H, k) => {
      const u = urutan(H), m = Math.min(Simpan.maju(H.id), u.length), done = m >= u.length;
      return `<button class="hero${done ? ' tamat' : ''}" data-h="${k}">
        <span class="hp"><img src="${PORTRET[H.h]}" alt=""></span>
        <span class="hn"><b>${esc(H.n)}</b><small>${esc(H.z)} · ${esc(H.p)}</small></span>
        <span class="hm">${cip(H.j, 1)}<span class="pip" aria-label="${m} daripada ${u.length} perhentian">${u.map((_, i) => `<i class="${i < m ? 'on' : ''}"></i>`).join('')}</span></span>
        ${done ? '<em class="lencana" title="Penghafal Hikayat">Penghafal Hikayat</em>' : ''}</button>`;
    }).join('');
    const t = HIKAYAT.filter(tamatOf).length;
    $('#kira').textContent = t ? `${t} daripada ${HIKAYAT.length} hikayat tamat` : `${HIKAYAT.length} hikayat, ${HIKAYAT.reduce((a, H) => a + urutan(H).length, 0)} perhentian`;
  }
};

const Jalan = {
  H: null,
  buka(k) { this.H = HIKAYAT[k]; this.lukis(); Skrin.ke('jalan') },
  lukis() {
    const H = this.H, u = urutan(H), m = Simpan.maju(H.id);
    $('#jkepala').innerHTML = `${potret(H.h, H.n, 'tokoh', 1)}
      <div><p class="eyebrow">Hikayat</p><h2>${esc(H.n)}</h2>
      <p class="meta">${cip(H.j)} <span>${esc(H.z)}</span> · <span>${esc(H.p)}</span></p></div>`;
    $('#jintro').textContent = H.i;
    $('#perhentian').innerHTML = u.map((S, i) => {
      const st = i < m ? 'selesai' : i === m ? 'kini' : 'kunci', T = tahapOf(H, i);
      const no = S.prolog ? 'P' : (H.pr ? i : i + 1);
      return `<li class="ph ${st}"><span class="nod">${no}</span>
        <button class="phb" data-i="${i}"${st === 'kunci' ? ' disabled' : ''}>
          <span class="pt"><b>${esc(S.t)}</b>${cip(S.j, 1)}</span>
          <span class="pl">${st === 'kunci' ? 'Menang perhentian sebelumnya untuk membuka' : 'Lawan: ' + esc(S.l) + (S.o === 'rekaan' ? ' <i class="rk">rekaan</i>' : '')}</span>
          <span class="ps">${st === 'selesai' ? 'Selesai · baca kad' : st === 'kini' ? 'Main · ' + T.n : T.n}</span>
        </button></li>`;
    }).join('');
    const ep = $('#epilog');
    ep.hidden = m < u.length;
    if (m >= u.length) ep.innerHTML = `<p class="eyebrow">Epilog</p><p>${esc(H.e)}</p><p class="src">Sumber: ${esc(H.es)}</p>
      <p class="lencana-besar">Lencana diperoleh: <b>Penghafal Hikayat ${esc(H.n)}</b></p>`;
  }
};

/* ---------- adegan & kad ---------- */
const Lapis = {
  buka(html) { $('#lapis .kertas').innerHTML = html; $('#lapis').hidden = false; $('#lapis .kertas').focus() },
  tutup() { $('#lapis').hidden = true }
};
function kadRekaan(S) {
  return S.r ? `<div class="rekaan"><b>Penyataan rekaan</b><p>${esc(S.r)}</p></div>` : '';
}
const Adegan = {
  buka(i) {
    const H = Jalan.H, S = urutan(H)[i], T = tahapOf(H, i), m = Simpan.maju(H.id);
    if (i < m) return Kad.fakta(i, false);
    Lapis.buka(`<p class="eyebrow">${S.prolog ? 'Prolog' : 'Perhentian ' + (H.pr ? i : i + 1)} · ${esc(H.n)}</p>
      <h3>${esc(S.t)}</h3>
      <p class="narasi">${esc(S.a)}</p>
      <div class="vs">${potret(H.h, H.n, 'tokoh')}<span class="vsx">lawan</span>${potret(S.h, S.l, S.o)}
        <div class="vsl"><b>${esc(S.l)}</b><small>${JLAWAN[S.o]}</small></div></div>
      ${kadRekaan(S)}
      <p class="tahap">${esc(T.n)} · ${T.biji} biji setiap lubang</p>
      <div class="btns"><button class="btn utama" data-k="mula" data-i="${i}">Mula Perlawanan</button>
      <button class="btn" data-k="tutup">Kembali</button></div>`);
  }
};
const Kad = {
  fakta(i, baru) {
    const H = Jalan.H, S = urutan(H)[i], L = LABEL[S.j], u = urutan(H), akhir = i + 1 >= u.length;
    Lapis.buka(`<p class="eyebrow">${baru ? 'Menang · kad dibuka' : 'Kad perhentian'}</p>
      <h3>${esc(S.t)}</h3>
      <p class="label">${cip(S.j)} <span>${esc(L.d)}</span></p>
      ${S.jn ? `<p class="jn">${esc(S.jn)}</p>` : ''}
      <div class="tahu"><b>Apa yang diketahui</b><p>${esc(S.k)}</p></div>
      ${kadRekaan(S)}
      <p class="src">Sumber: ${esc(S.s)}</p>
      <p class="lw">Lawan: ${esc(S.l)} · ${JLAWAN[S.o]}</p>
      <div class="btns">${baru && !akhir ? `<button class="btn utama" data-k="seterus" data-i="${i + 1}">Perhentian Seterusnya</button>` : ''}
      ${baru && akhir ? '<button class="btn utama" data-k="peta">Baca Epilog</button>' : ''}
      <button class="btn" data-k="peta">Peta Perjalanan</button></div>`);
  },
  kalah(i, seri) {
    Lapis.buka(`<p class="eyebrow">${seri ? 'Seri' : 'Tewas'}</p><h3>${seri ? 'Sama kuat' : 'Lawan menang kali ini'}</h3>
      <p class="narasi">Perjalanan tidak tamat. Cuba perhentian ini sekali lagi; kad faktanya terbuka bila anda menang.</p>
      <div class="btns"><button class="btn utama" data-k="mula" data-i="${i}">Cuba Lagi</button>
      <button class="btn" data-k="peta">Peta Perjalanan</button></div>`);
  }
};

/* ---------- gelanggang ---------- */
const Gel = {
  s: null, i: 0, sibuk: false, lihat: null, tangan: 0, aktif: -1,
  mula(i) {
    const H = Jalan.H, S = urutan(H)[i], T = tahapOf(H, i);
    this.i = i; this.s = Laga.baru(7, T.biji, T.lvl); this.lihat = this.s.b.slice(); this.sibuk = false; this.tangan = 0; this.aktif = -1;
    $('#lkepala').innerHTML = `<div class="pihak p1">${potret(H.h, H.n, 'tokoh')}<span><b>${esc(H.n)}</b><small>Anda</small></span></div>
      <div class="ltengah"><b>${esc(S.t)}</b><small>${esc(T.n)}</small></div>
      <div class="pihak p2"><span><b>${esc(S.l)}</b><small>${JLAWAN[S.o]}</small></span>${potret(S.h, S.l, S.o)}</div>`;
    Lapis.tutup(); Skrin.ke('laga'); this.lukis(); this.giliran();
  },
  /* susun atur: ibu pemain di KIRI (dicapai selepas lubang n-1), ibu lawan di KANAN */
  lukis() {
    const n = this.s.n, b = this.lihat, s = this.s;
    const lub = i => {
      const mine = s.p === 0 && !this.sibuk && !s.over && Rules.own(n, 0, i) && b[i] > 0;
      return `<button class="lb${mine ? ' sah' : ''}${this.aktif === i ? ' aktif' : ''}" data-l="${i}"${mine ? '' : ' tabindex="-1"'} aria-label="Lubang ${Rules.own(n, 0, i) ? 'anda' : 'lawan'}, ${b[i]} biji">${biji(b[i], 14)}<em>${b[i]}</em></button>`;
    };
    const top = [], bot = [];
    for (let k = 0; k < n; k++) { top.push(lub(n + 1 + k)); bot.push(lub(n - 1 - k)) }
    $('#papan').innerHTML = `<div class="ibu kiri${this.aktif === n ? ' aktif' : ''}" aria-label="Rumah anda, ${b[n]} biji">${biji(b[n], 40)}<em>${b[n]}</em><small>Rumah anda</small></div>
      <div class="baris atas">${top.join('')}</div><div class="baris bawah">${bot.join('')}</div>
      <div class="ibu kanan${this.aktif === 2 * n + 1 ? ' aktif' : ''}" aria-label="Rumah lawan, ${b[2 * n + 1]} biji">${biji(b[2 * n + 1], 40)}<em>${b[2 * n + 1]}</em><small>Rumah lawan</small></div>`;
    $('#tangan').textContent = this.tangan ? `Dalam genggaman: ${this.tangan} biji` : '';
  },
  pesan(t, cls) { const e = $('#pesan'); e.textContent = t; e.className = 'pesan ' + (cls || '') },
  giliran() {
    const s = this.s;
    if (s.over) return this.akhir();
    if (s.p === 0) { this.pesan('Giliran anda: pilih satu lubang di baris bawah.'); this.lukis() }
    else { this.pesan('Lawan sedang berfikir…'); this.lukis(); setTimeout(() => this.gerakAI(), KURANG ? 200 : 650) }
  },
  async gerakAI() { if (this.s.over || this.s.p !== 1) return; await this.main(Laga.ai(this.s)) },
  async main(h) {
    if (this.sibuk) return;
    const s = this.s, p = s.p;
    if (!Laga.sah(s, h)) return;
    this.sibuk = true;
    const r = Laga.langkah(s, h);
    await this.animasi(r, p);
    this.lihat = s.b.slice(); this.aktif = -1; this.tangan = 0; this.sibuk = false;
    if (!s.over && r.extra && s.p === p) this.pesan(p === 0 ? 'Biji terakhir masuk rumah: main lagi.' : 'Lawan masuk rumah dan main lagi.', 'baik');
    if (!s.over && r.extra) await tidur(KURANG ? 100 : 500);
    this.giliran();
  },
  async animasi(r, p) {
    const d = KURANG ? 25 : Simpan.d.laju ? 40 : 120, v = this.lihat, n = this.s.n;
    for (const e of r.ev) {
      if (e.t === 'pick' || e.t === 'chain') { v[e.i] = 0; this.tangan = e.c; this.aktif = e.i; if (e.t === 'chain') this.pesan('Sambung: angkat ' + e.c + ' biji.'); this.lukis(); await tidur(d * 2) }
      else if (e.t === 'drop') { v[e.i]++; this.tangan = e.left; this.aktif = e.i; this.lukis(); bunyi(e.i === Rules.store(n, p) ? 1 : 0); await tidur(d) }
      else if (e.t === 'capture') {
        this.pesan((p === 0 ? 'Tikam! Anda mengambil ' : 'Lawan menikam dan mengambil ') + e.gain + ' biji.', p === 0 ? 'baik' : 'buruk');
        document.querySelector(`[data-l="${e.o}"]`)?.classList.add('ditikam'); bunyi(2); await tidur(d * 5);
        v[Rules.store(n, p)] += e.gain; v[e.o] = 0; v[e.i] = 0; this.lukis(); await tidur(d * 3);
      }
      else if (e.t === 'nocap') { this.pesan('Tiada tikam: biji belum melepasi rumah sendiri.'); await tidur(d * 4) }
    }
  },
  akhir() {
    const s = this.s, H = Jalan.H, a = Laga.skor(s, 0), b = Laga.skor(s, 1);
    this.lihat = s.b.slice(); this.lukis();
    this.pesan(`Tamat: anda ${a}, lawan ${b}.`, s.w === 0 ? 'baik' : 'buruk');
    setTimeout(() => {
      if (s.w === 0) { Simpan.menang(H.id, this.i); Kad.fakta(this.i, true) }
      else Kad.kalah(this.i, s.w === -1);
    }, KURANG ? 300 : 900);
  }
};

/* biji saga: titik merah dalam lubang; selebihnya diwakili angka */
function biji(c, max) {
  let o = '';
  for (let k = 0; k < Math.min(c, max); k++) o += '<i></i>';
  return `<span class="bj">${o}</span>`;
}

/* bunyi tik kayu yang sangat ringkas (WebAudio); hanya selepas pemain menekan sesuatu */
let AC = null;
function bunyi(jenis) {
  if (Simpan.d.senyap) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const t = AC.currentTime, o = AC.createOscillator(), g = AC.createGain();
    o.type = 'triangle'; o.frequency.setValueAtTime([620, 880, 300][jenis], t);
    o.frequency.exponentialRampToValueAtTime([380, 520, 120][jenis], t + .08);
    g.gain.setValueAtTime(jenis === 2 ? .18 : .09, t); g.gain.exponentialRampToValueAtTime(.001, t + (jenis === 2 ? .25 : .09));
    o.connect(g).connect(AC.destination); o.start(t); o.stop(t + .3);
  } catch (e) {}
}

/* ---------- pendawaian ---------- */
function wire() {
  document.addEventListener('click', e => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.dataset.h != null) return Jalan.buka(+t.dataset.h);
    if (t.classList.contains('phb')) return Adegan.buka(+t.dataset.i);
    if (t.dataset.l != null) return Gel.main(+t.dataset.l);
    const k = t.dataset.k;
    if (k === 'tutup') Lapis.tutup();
    else if (k === 'mula') Gel.mula(+t.dataset.i);
    else if (k === 'seterus') { Jalan.lukis(); Adegan.buka(+t.dataset.i) }
    else if (k === 'peta') { Lapis.tutup(); Jalan.lukis(); Skrin.ke('jalan') }
    else if (k === 'rumah') { Lapis.tutup(); Rumah.lukis(); Skrin.ke('rumah') }
    else if (k === 'keluar') { Jalan.lukis(); Skrin.ke('jalan') }
    else if (k === 'laju') { Simpan.d.laju = !Simpan.d.laju; Simpan.simpan(); lajuLabel() }
    else if (k === 'bunyi') { Simpan.d.senyap = !Simpan.d.senyap; Simpan.simpan(); lajuLabel() }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !$('#lapis').hidden) Lapis.tutup();
    /* nombor 1–7 memilih lubang anda dari kiri ke kanan */
    if (document.body.dataset.skrin === 'laga' && /^[1-7]$/.test(e.key)) Gel.main(Gel.s.n - +e.key);
  });
}
function lajuLabel() {
  $('#blaju').textContent = Simpan.d.laju ? 'Kelajuan: laju' : 'Kelajuan: biasa';
  $('#bbunyi').textContent = Simpan.d.senyap ? 'Bunyi: tutup' : 'Bunyi: buka';
}

Simpan.muat(); wire(); lajuLabel(); Rumah.lukis(); Skrin.ke('rumah');
/* pemegang untuk ujian pelayar (tests/hikayat.py) */
window.Hikayat = { Simpan, Jalan, Gel, Laga, HIKAYAT };
