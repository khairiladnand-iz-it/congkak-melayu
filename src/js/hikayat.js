/* ===== HIKAYAT PAHLAWAN (dalam Congkak Melayu) =====
   Mod cerita: 16 perjalanan pahlawan; setiap perhentian ialah perlawanan congkak SEBENAR
   permainan ini — papan 3D, animasi biji, pertarungan tikam, XP dan level — melalui Match.
   Data cerita, peta dan watak dikongsi daripada src/hikayat/ (data, cerita, avatar, watak,
   tempat, peta). Antara muka berada dalam lapisan #hik di atas menu.

   Watak sampingan bukan pahlawan dalam HEROES. Semasa perlawanan, satu slot HEROES/IMGS
   dipinjam (SLOT) dan diisi dengan nama serta potret watak itu, supaya kad, duel, mesej dan
   panel keputusan memaparkannya tanpa mengubah kod Match. Slot dipulihkan sebaik sahaja
   pemain meninggalkan gelanggang (Screen.go selain 'match'). */
const PORTRET = IMGS;
const Hikayat = (() => {
  const $h = s => document.querySelector('#hik ' + s);
  const urutan = H => (H.pr ? [Object.assign({ prolog: true }, H.pr)] : []).concat(H.st);
  const tahapOf = (H, i) => { const u = urutan(H)[i]; return u.prolog ? PROLOG : TAHAP[H.pr ? i - 1 : i] };
  const kunci = id => 'hk_' + id;
  const maju = H => Prof.d[kunci(H.id)] | 0;
  const tamat = H => maju(H) >= urutan(H).length;
  /* XP tambahan kemenangan pertama setiap perhentian; tamat perjalanan diberi lebih */
  const XPH = (H, i) => (urutan(H)[i].prolog ? 30 : 40 + 15 * (H.pr ? i - 1 : i));
  const XPT = 150;
  /* papan ikut tempat perhentian: [kayu, lantai, biji] daripada koleksi sedia ada */
  const PAPAN = {
    istana: ['diraja', 'songket', 'emas'], laut: ['nilam', 'langit', 'kulit'], gunung: ['cendana', 'rebung', 'batu'],
    china: ['merah', 'marmar', 'delima'], jawa: ['hitam', 'kawung', 'saga'], aceh: ['hitam', 'kawung', 'delima'],
    kelantan: ['emas', 'jubin', 'zamrud'], pantai: ['jati', 'tikar', 'mutiara'], borneo: ['giok', 'tikar', 'zamrud'], siam: ['emas', 'marmar', 'emas']
  };
  const JENIS_T = {
    palembang: 'laut', temasik: 'istana', bertam: 'gunung', melaka: 'istana', china: 'china', lautcina: 'laut', kelang: 'istana',
    batupahat: 'laut', gunung: 'gunung', majapahit: 'jawa', gledang: 'gunung', pahang: 'istana', lautpahang: 'laut', bintan: 'laut',
    kampar: 'istana', johor: 'istana', batusawar: 'istana', aceh: 'aceh', inongbalee: 'aceh', samalanga: 'aceh', kelantan: 'kelantan',
    bukitmarak: 'kelantan', jembal: 'kelantan', guamusang: 'gunung', siam: 'siam', riau: 'laut', pontianak: 'borneo', langkawi: 'pantai', kedah: 'pantai'
  };
  let H = null, ctx = null, pinjam = null, pBak = null, dipasang = false;

  function cip(j, kecil) { const L = LABEL[j] || LABEL.lagenda; return `<b class="cip${kecil ? ' sm' : ''}" style="--lc:${L.c}">${L.l}</b>` }
  function potret(h, nama, o, besar, w) {
    if (h != null && IMGS[h]) return `<span class="med${besar ? ' lg' : ''}"><img src="${IMGS[h]}" alt=""></span>`;
    if (w && WATAK[w]) return `<span class="med hav${o === 'rekaan' ? ' rek' : ''}${besar ? ' lg' : ''}">${avatarWatak(w)}</span>`;
    return `<span class="med${besar ? ' lg' : ''}"></span>`;
  }
  const lawanP = (S, b) => potret(S.h, S.l, S.o, b, S.w);
  function rekaan(S) { return S.r ? `<div class="rekaan"><b>Penyataan rekaan</b><p>${esc(S.r)}</p></div>` : '' }
  const DRAMA = 'Narasi didramatisasi untuk permainan; fakta dan sumbernya dalam kad selepas menang. Perlawanan congkak ialah cara permainan ini menceritakan setiap pertemuan, bukan peristiwa sejarah.';

  /* ---------- lapisan dalam (adegan & kad) ---------- */
  const Lapis = {
    buka(html) { const k = $h('.hkertas'); k.innerHTML = html; $h('.hlapis').hidden = false; k.scrollTop = 0; k.focus() },
    tutup() { const l = $h('.hlapis'); if (l) l.hidden = true },
    terbuka() { const l = $h('.hlapis'); return l && !l.hidden }
  };

  /* ---------- skrin dalam lapisan #hik ---------- */
  function ke(id) { for (const s of document.querySelectorAll('#hik .hsk')) s.hidden = s.id !== id; const o = document.getElementById('hik'); if (o) o.scrollTop = 0 }

  function lukisRumah() {
    $h('#hlabel').innerHTML = Object.keys(LABEL).map(j => `<div><dt>${cip(j)}</dt><dd>${esc(LABEL[j].d)}</dd></div>`).join('');
    $h('#hsenarai').innerHTML = HIKAYAT.map((H, k) => {
      const u = urutan(H), m = Math.min(maju(H), u.length), done = m >= u.length;
      return `<button class="hhero${done ? ' tamat' : ''}" data-hh="${k}">
        <span class="hp"><img src="${IMGS[H.h]}" alt=""></span>
        <span class="hn"><b>${esc(H.n)}</b><small>${esc(H.z)} · ${esc(H.p)}</small></span>
        <span class="hm">${cip(H.j, 1)}<span class="pip" aria-label="${m} daripada ${u.length} perhentian">${u.map((_, i) => `<i class="${i < m ? 'on' : ''}"></i>`).join('')}</span></span>
        ${done ? '<em class="lencana">Penghafal Hikayat</em>' : ''}</button>`;
    }).join('');
    const t = HIKAYAT.filter(tamat).length;
    $h('#hkira').textContent = t ? `${t} daripada ${HIKAYAT.length} hikayat tamat` : `${HIKAYAT.length} hikayat · ${HIKAYAT.reduce((a, H) => a + urutan(H).length, 0)} perhentian`;
    $h('#hbwatak').textContent = `Galeri Watak Sampingan (${Object.keys(WATAK).length})`;
  }

  function lukisJalan(opt) {
    const u = urutan(H), m = maju(H);
    $h('#hjkepala').innerHTML = `${potret(H.h, H.n, 'tokoh', 1)}
      <div><p class="eyebrow">Hikayat</p><h2>${esc(H.n)}</h2>
      <p class="meta">${cip(H.j)} <span>${esc(H.z)}</span> · <span>${esc(H.p)}</span></p></div>`;
    $h('#hjintro').innerHTML = `<p>${esc(H.i)}</p>${H.i2 ? `<p>${esc(H.i2)}</p>` : ''}`;
    Peta.tunjuk(H, u, m, opt || {});
    $h('#hph').innerHTML = u.map((S, i) => {
      const st = i < m ? 'selesai' : i === m ? 'kini' : 'kunci', T = tahapOf(H, i), no = S.prolog ? 'P' : (H.pr ? i : i + 1);
      return `<li class="ph ${st}"><span class="nod">${no}</span>
        <button class="phb" data-i="${i}"${st === 'kunci' ? ' disabled' : ''}>
          <span class="pt"><b>${esc(S.t)}</b>${cip(S.j, 1)}</span>
          <span class="pl">${st === 'kunci' ? 'Menang perhentian sebelumnya untuk membuka' : `${lawanP(S)}<span>Lawan: ${esc(S.l)}${S.o === 'rekaan' ? ' <i class="rk">rekaan</i>' : ''}</span>`}</span>
          <span class="ps">${st === 'selesai' ? 'Selesai · baca kad' : st === 'kini' ? `Main · ${T.n} · +${XPH(H, i)} XP` : T.n}</span>
        </button></li>`;
    }).join('');
    const ep = $h('#hepilog'); ep.hidden = m < u.length;
    if (m >= u.length) ep.innerHTML = `<p class="eyebrow">Epilog</p><p>${esc(H.e)}</p><p class="src">Sumber: ${esc(H.es)}</p>
      <p class="lencana-besar">Lencana diperoleh: <b>Penghafal Hikayat ${esc(H.n)}</b></p>`;
  }

  function lukisGaleri() {
    const muncul = {};
    for (const H of HIKAYAT) for (const S of urutan(H)) if (S.w) (muncul[S.w] = muncul[S.w] || new Set()).add(H.n);
    const ikut = { tokoh: [], watak: [], rekaan: [] };
    for (const [id, W] of Object.entries(WATAK)) ikut[W.o].push([id, W]);
    $h('#hgsenarai').innerHTML = Object.keys(ikut).map(o => `<section class="gk"><h3>${JLAWAN[o]} <small>${ikut[o].length}</small></h3>
      <div class="gg">${ikut[o].map(([id, W]) => `<figure class="gw">${potret(null, W.n, W.o, 1, id)}
        <figcaption><b>${esc(W.n)}</b><small>${esc(W.d)}</small><em>${[...(muncul[id] || [])].map(esc).join(' · ')}</em></figcaption></figure>`).join('')}</div></section>`).join('');
  }

  /* ---------- adegan berbabak ---------- */
  const Adegan = {
    i: 0, babak: 0,
    buka(i) { if (i < maju(H)) return Kad.fakta(i, false); this.i = i; this.babak = 0; this.lukis(true) },
    lukis(baru) {
      const i = this.i, S = urutan(H)[i], T = tahapOf(H, i), A = [].concat(S.a), n = this.babak, akhir = n >= A.length - 1;
      const html = `<p class="eyebrow">${S.prolog ? 'Prolog' : 'Perhentian ' + (H.pr ? i : i + 1)} · ${esc(H.n)}</p>
        <h3>${esc(S.t)}</h3>
        <div class="babak">${A.slice(0, n + 1).map((p, k) => `<p class="narasi${k === n && !baru ? ' masuk' : ''}">${esc(p)}</p>`).join('')}</div>
        <p class="langkah" aria-hidden="true">${A.map((_, k) => `<i class="${k <= n ? 'on' : ''}"></i>`).join('')}</p>
        ${akhir ? `<div class="vs">${potret(H.h, H.n, 'tokoh')}<span class="vsx">lawan</span>${lawanP(S)}
          <div class="vsl"><b>${esc(S.l)}</b><small>${JLAWAN[S.o]}</small></div></div>
          ${rekaan(S)}
          <p class="tahap">${esc(T.n)} · ${T.biji} biji setiap lubang · AI ${['', 'Mudah', 'Sederhana', 'Susah'][T.lvl]} · +${XPH(H, i)} XP kemenangan pertama</p>
          <div class="center"><button class="btn big" data-hk="mula" data-i="${i}">⚔ Mula Perlawanan</button></div>
          <div class="center"><button class="btn sm" data-hk="tutup">Kembali ke peta</button></div>`
        : `<div class="center"><button class="btn" data-hk="babak">Seterusnya ›</button> <button class="btn sm" data-hk="langkau">Baca semua</button></div>`}
        <p class="drama">${DRAMA}</p>`;
      if (baru) Lapis.buka(html); else { const k = $h('.hkertas'); k.innerHTML = html; const b = k.querySelector('[data-hk]'); b && b.focus() }
    },
    maju(semua) { const A = [].concat(urutan(H)[this.i].a); this.babak = semua ? A.length - 1 : Math.min(this.babak + 1, A.length - 1); this.lukis(false) }
  };

  const Kad = {
    fakta(i, baru) {
      const S = urutan(H)[i], L = LABEL[S.j], akhir = i + 1 >= urutan(H).length;
      Lapis.buka(`<p class="eyebrow">${baru ? 'Menang · kad dibuka' : 'Kad perhentian'}</p>
        <h3>${esc(S.t)}</h3>
        ${S.b ? `<p class="narasi penutup">${esc(S.b)}</p>` : ''}
        <p class="label">${cip(S.j)} <span>${esc(L.d)}</span></p>
        ${S.jn ? `<p class="jn">${esc(S.jn)}</p>` : ''}
        <div class="tahu"><b>Apa yang diketahui</b><p>${esc(S.k)}</p></div>
        ${rekaan(S)}
        <p class="src">Sumber: ${esc(S.s)}</p>
        <p class="lw">${lawanP(S)}<span>Lawan: ${esc(S.l)} · ${JLAWAN[S.o]}</span></p>
        ${baru && !akhir ? `<div class="center"><button class="btn big" data-hk="seterus" data-i="${i + 1}">⛵ Teruskan Perjalanan</button></div>` : ''}
        ${baru && akhir ? '<div class="center"><button class="btn big" data-hk="tutup">📜 Baca Epilog</button></div>' : ''}
        <div class="center"><button class="btn sm" data-hk="tutup">Peta Perjalanan</button></div>`);
    }
  };

  /* ---------- pinjam slot pahlawan untuk watak sampingan ---------- */
  function pakai(S) {
    pulih();
    if (S.h != null) { cfg.p[1] = S.h; return }
    const k = [2, 3, 7, 9].find(x => x !== H.h), W = WATAK[S.w];
    pinjam = { k, h: HEROES[k], img: IMGS[k], S };
    HEROES[k] = Object.assign({}, pinjam.h, { n: S.l, t: JLAWAN[S.o], l: '' });
    IMGS[k] = (typeof AVATAR !== 'undefined' && AVATAR[S.w]) || ('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(avatarWatak(S.w).replace('<svg ', '<svg width="120" height="120" ')));
    cfg.p[1] = k;
  }
  function pulih() { if (!pinjam) return; HEROES[pinjam.k] = pinjam.h; IMGS[pinjam.k] = pinjam.img; pinjam = null }

  /* mulakan perlawanan perhentian i: papan, biji dan AI ikut tahap; pahlawan pemain ialah pahlawan hikayat */
  function main(i) {
    const S = urutan(H)[i], T = tahapOf(H, i); if (i > maju(H)) return;
    if (Quest.bak == null) Quest.bak = JSON.stringify(cfg);
    if (pBak == null) pBak = cfg.p.slice();
    const pp = PAPAN[JENIS_T[S.g]] || PAPAN.istana;
    Object.assign(cfg, { vs: 'ai', lvl: T.lvl, n: 7, seeds: T.biji, wood: pp[0], floor: pp[1], seed: pp[2] });
    cfg.p = [H.h, cfg.p[1]];
    pakai(S);
    ctx = { H, i };
    Lapis.tutup(); tutup(); Match._campNext = null; Match._hikNext = ctx;
    if (typeof Dock === 'function') Dock();
    Match.start();
    if (Mus.gaya) Mus.gaya(H.h);
    Match.say(`${S.t}: ${HEROES[cfg.p[0]].n} berdepan ${S.l}. Tekan lubang yang bercahaya.`);
  }

  /* dipanggil oleh Match.finish sebelum Prof.award: kemajuan, XP tambahan dan butang keputusan */
  function selesai(res) {
    const c = ctx; if (!c) return null;
    Match.hik = null;
    const H0 = c.H, S = urutan(H0)[c.i], u = urutan(H0);
    let bonus = 0, nota = '';
    if (res === 'win') {
      if (c.i + 1 > maju(H0)) {
        Prof.d[kunci(H0.id)] = c.i + 1; bonus = XPH(H0, c.i);
        if (c.i + 1 >= u.length) bonus += XPT;
        Quest.bump && Quest.bump('win', 0, 'add');
      }
      nota = `<div class="cwin"><b>📜 ${esc(S.t)} — kad dibuka</b>${bonus ? `<span>+${bonus} XP Hikayat</span>` : '<span>Perhentian dimenangi semula</span>'}${c.i + 1 >= u.length && bonus ? `<em>Hikayat ${esc(H0.n)} tamat! Lencana Penghafal Hikayat 🏅</em>` : ''}</div>`;
    } else nota = `<p class="hnote">Perjalanan tidak tamat. Cuba perhentian ini sekali lagi; kad faktanya terbuka bila anda menang.</p>`;
    const btns = (res === 'win' ? `<div class="center"><button class="btn big" data-r="hkad">📜 Kad &amp; Teruskan Hikayat</button></div>`
      : `<div class="center"><button class="btn" data-r="hagain">↻ Cuba Lagi</button></div>`) + `<button class="btn sm" data-r="hpeta">⚑ Peta Hikayat</button> `;
    ctx = c;
    return { html: nota, btns, bonus };
  }

  /* butang panel keputusan */
  function hasil(r) {
    const c = ctx; if (!c) { Screen.go('menu'); return }
    if (r === 'hagain') return main(c.i);
    keluarGelanggang(); buka(true);
    H = c.H; ke('hjalan'); lukisJalan();
    if (r === 'hkad') Kad.fakta(c.i, true);
  }
  function keluarGelanggang() { if (Screen.cur === 'match') Screen.go('menu') }

  /* ---------- buka/tutup lapisan ---------- */
  function pasang() {
    if (dipasang) return; dipasang = true;
    Peta.pasang($h('#hpcv'), $h('#hplap'));
    document.getElementById('hik').addEventListener('click', e => {
      const t = e.target.closest('button'); if (!t) return;
      if (t.dataset.hh != null) { H = HIKAYAT[+t.dataset.hh]; ke('hjalan'); return lukisJalan() }
      if (t.classList.contains('phb') || t.classList.contains('pn')) return Adegan.buka(+t.dataset.i);
      const k = t.dataset.hk; if (!k) return;
      if (typeof Snd !== 'undefined') Snd.tone(500);
      if (k === 'tutup') { Lapis.tutup(); if (H) lukisJalan() }
      else if (k === 'babak') Adegan.maju(false);
      else if (k === 'langkau') Adegan.maju(true);
      else if (k === 'mula') main(+t.dataset.i);
      else if (k === 'seterus') { const ni = +t.dataset.i; Lapis.tutup(); lukisJalan({ belayar: true, selesai: () => { if (!document.getElementById('hik').hidden && !Lapis.terbuka()) Adegan.buka(ni) } }) }
      else if (k === 'rumah') { Lapis.tutup(); lukisRumah(); ke('hrumah') }
      else if (k === 'watak') { lukisGaleri(); ke('hgaleri') }
      else if (k === 'kisah') { if (typeof Kisah !== 'undefined') Kisah.open() }
      else if (k === 'sejarah') { if (typeof Hist !== 'undefined') Hist.open(-1) }
      else if (k === 'keluar') tutup();
    });
    document.addEventListener('keydown', e => {
      const o = document.getElementById('hik'); if (!o || o.hidden || e.key !== 'Escape') return;
      if (Lapis.terbuka()) { Lapis.tutup(); if (H) lukisJalan() } else tutup();
    });
  }
  /* perlawanan Hikayat yang belum tamat boleh disambung dari menu; jangan pulihkan tetapan semasa itu */
  const sedangMain = () => Match.hik && Match.s && !Match.s.over;
  function lepas() { if (sedangMain()) Match.hik = null; pulih(); pulihP() }
  function buka(kekal) {
    pasang(); if (!sedangMain()) { Quest.restore(); pulihP() }
    const o = document.getElementById('hik'); o.hidden = false;
    if (typeof ART2 !== 'undefined' && ART2.bg && !o.style.getPropertyValue('--hbg')) o.style.setProperty('--hbg', `url(${ART2.bg})`);
    if (!kekal) { lukisRumah(); ke('hrumah') }
  }
  function tutup() { const o = document.getElementById('hik'); if (o) o.hidden = true; Lapis.tutup() }
  function pulihP() { if (pBak) { cfg.p = pBak; pBak = null; if (typeof saveCfg === 'function') saveCfg() } }

  /* kemajuan disimpan dalam Prof (setempat + awan), satu kunci nombor bagi setiap hikayat */
  for (const H of HIKAYAT) if (!(kunci(H.id) in Prof.d)) Prof.d[kunci(H.id)] = 0;

  /* pulihkan slot pinjaman bila meninggalkan gelanggang; pasang semula bila menyambung perlawanan */
  const go0 = Screen.go;
  Screen.go = function (n) {
    if (n !== 'match') { pulih(); if (!Match.hik) pulihP() }
    else if (!Match.hik) pulihP();
    else if (ctx && Match.s && !Match.s.over && !pinjam) pakai(urutan(ctx.H)[ctx.i]);
    return go0.apply(this, arguments);
  };

  return { buka, tutup, hasil, lepas, selesai, main, urutan, maju, _pinjam: () => pinjam, _ctx: () => ctx, buka1(k) { buka(); H = HIKAYAT[k]; ke('hjalan'); lukisJalan() } };
})();
/* alamat ...#hikayat (dan hikayat.html lama) terus membuka Hikayat */
if (typeof location !== 'undefined' && location.hash === '#hikayat') setTimeout(() => Hikayat.buka(), 300);
