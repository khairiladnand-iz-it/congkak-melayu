/* ===== LAGA: satu perlawanan congkak (tiada DOM) =====
   Pembungkus nipis di atas Rules dan AI daripada engine.js permainan utama,
   supaya peraturan Hikayat sama tepat dengan gelanggang biasa.
   Pemain sentiasa pihak 0 (baris bawah); lawan pihak 1. */
const Laga = {
  baru(n, biji, lvl) {
    const b = Array(2 * n + 2).fill(0);
    for (let p = 0; p < 2; p++) for (const i of Rules.holes(n, p)) b[i] = biji;
    return { n, b, p: 0, lvl, over: false, w: null, gerak: 0 };
  },
  sah(s, h) { return !s.over && Rules.own(s.n, s.p, h) && s.b[h] > 0 },
  /* jalankan satu langkah; pulangkan hasil resolve (peristiwa untuk animasi) */
  langkah(s, h) {
    if (!this.sah(s, h)) return null;
    const r = Rules.resolve(s.b, s.n, s.p, h);
    s.b = r.b; s.gerak++;
    if (Rules.over(s.b, s.n)) { this.tamat(s); return r }
    if (!r.extra) s.p = 1 - s.p;
    return r;
  },
  tamat(s) { s.b = Rules.sweep(s.b, s.n); s.over = true; s.w = Rules.winner(s.b, s.n) },
  ai(s) { return AI.pick(s.b, s.n, s.p, s.lvl) },
  skor(s, p) { return s.b[Rules.store(s.n, p)] }
};
