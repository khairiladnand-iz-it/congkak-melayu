/* ===== CONGKAK HARIAN =====
   Satu papan, sama untuk semua orang di dunia, bertukar setiap tengah malam.
   Satu percubaan sehari. Lawan AI yang sama. Skor ialah biji dalam rumah anda.

   Congkak tiada dadu dan tiada rawak, jadi papan yang sama ditambah gerakan
   yang sama sentiasa memberi keputusan yang sama. Itu menjadikan teka-teki
   harian benar-benar adil — asalkan AI juga deterministik, yang disediakan
   oleh RNG di bawah. Tiada pelayan diperlukan: tarikh itu sendiri benihnya. */

/* Penjana nombor rawak boleh benih (mulberry32).
   Tanpa benih ia hanyalah Math.random, jadi permainan biasa tidak berubah. */
const RNG = {
  s: 0, seeded: false,
  seed(n) { this.s = (n >>> 0) || 1; this.seeded = true },
  off() { this.seeded = false },
  next() {
    if (!this.seeded) return Math.random();
    this.s = (this.s + 0x6D2B79F5) >>> 0;
    let t = this.s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
};

const Harian = {
  EPOK: Date.UTC(2026, 0, 1),        /* teka-teki #1 ialah 1 Januari 2026 */
  on: false, bak: null, hasil: null,

  /* nombor teka-teki hari ini, mengikut waktu tempatan pemain */
  no(d) {
    const t = d || new Date();
    const hari = Date.UTC(t.getFullYear(), t.getMonth(), t.getDate());
    return Math.floor((hari - this.EPOK) / 86400000) + 1;
  },
  tarikh(n) {
    const d = new Date(this.EPOK + (n - 1) * 86400000);
    const B = ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
               'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'];
    return d.getUTCDate() + ' ' + B[d.getUTCMonth()] + ' ' + d.getUTCFullYear();
  },
  /* benih daripada nombor teka-teki sahaja — semua orang menjana papan yang sama */
  benih(n) { let h = 2166136261 ^ n; for (let i = 0; i < 4; i++) { h = Math.imul(h ^ (h >>> 13), 16777619) } return h >>> 0 },

  /* Papan dicerminkan: kedua-dua pihak dapat susunan yang sama, jadi tiada
     siapa boleh kata dia dapat sebelah yang buruk. Pemain tetap mula dahulu. */
  papan(n) {
    const r = Object.create(RNG); r.s = this.benih(n); r.seeded = true;
    const lubang = cfg.n, jum = lubang * 7;
    const sisi = Array(lubang).fill(2);
    let baki = jum - lubang * 2;
    while (baki > 0) {
      const i = Math.floor(r.next.call(r) * lubang);
      if (sisi[i] >= 14) continue;
      sisi[i]++; baki--;
    }
    const b = sisi.concat([0], sisi, [0]);
    return b;
  },
  /* pahlawan hari ini — sama untuk semua orang */
  pahlawan(n) {
    const r = Object.create(RNG); r.s = this.benih(n * 7919); r.seeded = true;
    const a = Math.floor(r.next.call(r) * NBASE);
    let b = Math.floor(r.next.call(r) * NBASE); if (b === a) b = (b + 1) % NBASE;
    return [a, b];
  },

  sudah() { return (Prof.d.hariN | 0) === this.no() },
  skorHariIni() { return Prof.d.hariS | 0 },

  /* ---- main ---- */
  mula() {
    if (this.sudah()) return this.panel();
    const n = this.no();
    this.bak = { p: cfg.p.slice(), vs: cfg.vs, lvl: cfg.lvl, n: cfg.n, seeds: cfg.seeds };
    cfg.p = this.pahlawan(n); cfg.vs = 'ai'; cfg.lvl = 2;
    this.on = true; RNG.seed(this.benih(n) ^ 0x5bf03635);
    if (typeof Quest !== 'undefined') Quest.bak = Quest.bak || null;
    Match.start();
    Match.s.b = this.papan(n); Match.view = Match.s.b.slice();
    try { World.sync(Match.view) } catch (e) {}
    Match.render();
    Match.say('Congkak Harian #' + n + ' — satu percubaan sahaja. Kumpul biji sebanyak mungkin.');
  },
  pulih() {
    if (!this.bak) return;
    Object.assign(cfg, this.bak); this.bak = null;
    this.on = false; RNG.off();
  },
  /* dipanggil oleh Match.finish */
  tamat(skor, tikam, rantai) {
    const n = this.no();
    this.hasil = { n, skor, tikam, rantai };
    Prof.d.hariN = n; Prof.d.hariS = skor;
    if (skor > (Prof.d.hariB | 0)) Prof.d.hariB = skor;
    Prof.save();
    this.pulih();
    setTimeout(() => this.panel(), 900);
  },

  /* ---- paparan ---- */
  bar(skor) {
    const jum = cfg.n * 14, p = Math.max(0, Math.min(10, Math.round(skor / jum * 10)));
    return '▓'.repeat(p) + '░'.repeat(10 - p);
  },
  teks() {
    const h = this.hasil || { n: this.no(), skor: this.skorHariIni(), tikam: 0, rantai: 0 };
    return ['🎋 Congkak Harian #' + h.n,
            h.skor + ' biji' + (h.tikam ? ' · ' + h.tikam + ' tikam' : '') + (h.rantai > 1 ? ' · rantaian ' + h.rantai : ''),
            this.bar(h.skor), SITE].join('\n');
  },
  panel() {
    const o = document.getElementById('hari'); if (!o) return;
    const n = this.no(), main = this.sudah(), h = this.hasil;
    const skor = main ? this.skorHariIni() : 0;
    o.innerHTML = `<div class="panel hari"><h2>🎋 Congkak Harian</h2>
      <p class="hno">#${n} · ${this.tarikh(n)}</p>
      ${main ? `<div class="hres"><b>${skor}</b><small>biji dikumpul</small>
          <div class="hbar">${this.bar(skor)}</div>
          ${h && h.tikam ? `<p class="hsub">${h.tikam} tikam${h.rantai > 1 ? ` · rantaian terpanjang ${h.rantai}` : ''}</p>` : ''}
          ${(Prof.d.hariB | 0) ? `<p class="hsub">Terbaik anda: ${Prof.d.hariB | 0} biji</p>` : ''}</div>
        <div class="center"><button class="btn" data-h="kongsi">📤 Kongsi Keputusan</button></div>
        <p class="hnote">Teka-teki baharu setiap tengah malam. Semua orang di dunia main papan yang sama hari ini.</p>`
      : `<p class="hnote">Satu papan, sama untuk semua orang hari ini. <b>Satu percubaan sahaja.</b>
           Kumpul sebanyak mungkin biji ke dalam rumah anda, kemudian kongsi skor dengan kawan.</p>
         <div class="center"><button class="btn big" data-h="mula">▶ Main Teka-teki Hari Ini</button></div>`}
      <div class="center"><button class="btn" data-h="tutup">Tutup</button></div></div>`;
    o.hidden = false;
  },
  async kongsi() {
    const t = this.teks();
    try { if (navigator.share) { await navigator.share({ text: t }); return } } catch (e) { if (e && e.name === 'AbortError') return }
    try { if (navigator.clipboard) { await navigator.clipboard.writeText(t); Toast.show('Keputusan disalin — tampal dalam WhatsApp.'); return } } catch (e) {}
    const o = document.getElementById('hari');
    const d = document.createElement('div'); d.className = 'hcopy';
    d.innerHTML = `<textarea readonly rows="5">${esc(t)}</textarea>
      <p class="hnote">Tekan & tahan untuk Salin.</p>
      <div class="center"><button class="btn sm" data-h="tutupsalin">Tutup</button></div>`;
    o.querySelector('.panel').appendChild(d);
    const ta = d.querySelector('textarea'); ta.focus(); ta.select();
  },
  click(e) {
    const g = e.target.closest('[data-h]');
    if (!g) { if (e.target.id === 'hari') this.tutup(); return }
    const k = g.dataset.h;
    if (k === 'tutup') return this.tutup();
    if (k === 'mula') { this.tutup(); return this.mula() }
    if (k === 'kongsi') return this.kongsi();
    if (k === 'tutupsalin') { const d = document.querySelector('#hari .hcopy'); if (d) d.remove() }
  },
  tutup() { const o = document.getElementById('hari'); if (o) o.hidden = true },
  open() { this.panel() }
};
