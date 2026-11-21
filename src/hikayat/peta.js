/* ===== PETA PERJALANAN BERANIMASI (kanvas 2D) =====
   Laluan pahlawan dilukis di atas peta Nusantara. Bila peta dibuka, laluan dilakar
   dari perhentian pertama; bila pemain menang, potret pahlawan belayar ke perhentian
   seterusnya dan kamera mengikutinya. Butang perhentian ialah elemen DOM di atas kanvas
   (boleh ditekan dan dibaca pembaca skrin). Laut beralun perlahan; dihadkan ~30 fps
   dan berhenti bila tiada apa bergerak, tab tersembunyi atau kurang gerakan. */
const Peta = (() => {
  const kini = () => typeof performance !== 'undefined' ? performance.now() : Date.now();
  let cv, ctx, lap, W = 0, H = 0, dpr = 1, H0 = null, pts = [], m = 0;
  let cam = { x: 103, y: 3, s: 40 }, camA = null, camB = null, camT = 1, camDur = 1;
  let lakar = 1, lakarT0 = 0, kapal = null, raf = 0, last = 0, t0 = kini();
  const img = typeof Image === 'function' ? new Image() : {}; let imgOk = false; img.onload = () => { imgOk = true; minta() };
  const KUR = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const proj = (c, k = cam) => [(c[0] - k.x) * k.s + W / 2, -(c[1] - k.y) * k.s + H / 2];

  /* kamera yang memuatkan sekumpulan titik, dengan rentang minimum supaya tidak terlalu zum */
  function muat(cs, pad, minSpan) {
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (const c of cs) { x0 = Math.min(x0, c[0]); x1 = Math.max(x1, c[0]); y0 = Math.min(y0, c[1]); y1 = Math.max(y1, c[1]) }
    /* ruang lebih di atas untuk potret pahlawan, di bawah untuk nama tempat */
    const dx = Math.max(x1 - x0, minSpan), dy = Math.max(y1 - y0, minSpan * .7), atas = pad + 46, bawah = pad + 30;
    const s = Math.min(120, (W - pad * 2) / dx, (H - atas - bawah) / dy);
    return { x: (x0 + x1) / 2, y: (y0 + y1) / 2 + (atas - bawah) / 2 / s, s };
  }
  function keKamera(k, dur) {
    if (KUR || !dur) { cam = k; camT = 1; return }
    camA = Object.assign({}, cam); camB = k; camT = 0; camDur = dur;
  }

  /* susun atur skrin: perhentian yang jatuh berdekatan (tempat sama atau berjiran pada zum ini)
     dikumpul menjadi satu gugus dan disebar dalam bulatan kecil di sekeliling pusatnya */
  let gugus = [];
  function susun() {
    const raw = pts.map(p => proj(p.c)), g = [];
    raw.forEach((xy, i) => {
      const G = g.find(G => Math.hypot(G.x - xy[0], G.y - xy[1]) < 30);
      if (G) { G.ahli.push(i); G.x = (G.x * (G.ahli.length - 1) + xy[0]) / G.ahli.length; G.y = (G.y * (G.ahli.length - 1) + xy[1]) / G.ahli.length }
      else g.push({ x: xy[0], y: xy[1], ahli: [i] });
    });
    const P = [];
    for (const G of g) {
      const n = G.ahli.length; G.R = n > 1 ? 18 + n * 2 : 0;
      G.ahli.forEach((i, k) => { const a = -Math.PI / 2 + k * 2 * Math.PI / n; P[i] = n > 1 ? [G.x + Math.cos(a) * G.R, G.y + Math.sin(a) * G.R] : [G.x, G.y] });
      G.nama = [...new Set(G.ahli.map(i => pts[i].g))].map(k => pts.find(p => p.g === k).t);
    }
    gugus = g; return P;
  }
  /* lengkung pelayaran antara dua perhentian */
  function lengkung(a, b) {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    const k = Math.min(.22, 26 / L);
    return [a[0] + dx / 2 - dy * k, a[1] + dy / 2 + dx * k];
  }
  const qb = (a, c, b, t) => [(1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]];

  function lukisDarat(t) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#14202a'); g.addColorStop(1, '#0c141c');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    /* graticule: setiap 5 darjah */
    ctx.strokeStyle = 'rgba(232,194,90,.07)'; ctx.lineWidth = 1; ctx.beginPath();
    for (let lo = 60; lo <= 130; lo += 5) { const [x] = proj([lo, 0]); ctx.moveTo(x, 0); ctx.lineTo(x, H) }
    for (let la = -15; la <= 40; la += 5) { const [, y] = proj([0, la]); ctx.moveTo(0, y); ctx.lineTo(W, y) }
    ctx.stroke();
    /* alun laut: garis pendek di grid tetap, fasa bergerak */
    if (!KUR) {
      ctx.strokeStyle = 'rgba(160,200,220,.10)'; ctx.lineWidth = 1.2; ctx.beginPath();
      const st = Math.max(1.2, 46 / cam.s);
      const lo0 = cam.x - W / 2 / cam.s, lo1 = cam.x + W / 2 / cam.s, la0 = cam.y - H / 2 / cam.s, la1 = cam.y + H / 2 / cam.s;
      for (let la = Math.floor(la0 / st) * st; la < la1; la += st)
        for (let lo = Math.floor(lo0 / st) * st; lo < lo1; lo += st) {
          const j = Math.sin(lo * 12.9898 + la * 78.233) * 43758.5453, f = j - Math.floor(j);
          const [x, y] = proj([lo + f * st * .7, la + ((f * 7) % 1) * st * .7]);
          const ph = Math.sin(t / 900 + f * 6.28) * 3;
          ctx.moveTo(x - 5 + ph, y); ctx.quadraticCurveTo(x + ph, y - 2.5, x + 5 + ph, y);
        }
      ctx.stroke();
    }
    /* darat: halo pantai, isian, garis emas */
    const jalur = () => { ctx.beginPath(); for (const pol of DARAT) { pol.forEach((c, i) => { const [x, y] = proj(c); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y) }); ctx.closePath() } };
    jalur(); ctx.strokeStyle = 'rgba(120,170,190,.16)'; ctx.lineWidth = 7; ctx.lineJoin = 'round'; ctx.stroke();
    ctx.fillStyle = '#3d2a14'; ctx.fill();
    ctx.strokeStyle = '#a97c28'; ctx.lineWidth = 1.3; ctx.stroke();
    /* nama laut */
    ctx.fillStyle = 'rgba(200,178,138,.32)'; ctx.font = `600 ${Math.max(9, Math.min(13, cam.s / 6))}px Cinzel, Georgia, serif`; ctx.textAlign = 'center';
    for (const L of LABEL_PETA) { const [x, y] = proj(L.c); if (x < -80 || x > W + 80 || y < -20 || y > H + 20) continue; ctx.save(); ctx.translate(x, y); ctx.rotate(L.r * Math.PI / 180); ctx.fillText(L.n, 0, 0); ctx.restore() }
  }

  function lukisLaluan(t) {
    const P = susun();
    const nSeg = P.length - 1, sampai = lakar * nSeg;
    for (let i = 0; i < nSeg; i++) {
      if (i >= sampai) break;
      const a = P[i], b = P[i + 1], c = lengkung(a, b), frac = Math.min(1, sampai - i);
      const selesai = i + 1 < m;
      ctx.beginPath(); ctx.moveTo(a[0], a[1]);
      const N = 24; for (let k = 1; k <= N * frac; k++) { const q = qb(a, c, b, k / N); ctx.lineTo(q[0], q[1]) }
      if (selesai) { ctx.setLineDash([]); ctx.strokeStyle = '#e8c25a'; ctx.lineWidth = 2.4 }
      else if (i === m - 1) { ctx.setLineDash([7, 6]); ctx.lineDashOffset = -t / 60; ctx.strokeStyle = 'rgba(232,194,90,.85)'; ctx.lineWidth = 2 }
      else { ctx.setLineDash([2, 6]); ctx.strokeStyle = 'rgba(232,194,90,.35)'; ctx.lineWidth = 1.6 }
      ctx.stroke(); ctx.setLineDash([]);
    }
    /* potret pahlawan */
    let pos;
    if (kapal) { const a = P[kapal.i], b = P[kapal.i + 1]; pos = qb(a, lengkung(a, b), b, ease(kapal.t)) }
    else pos = P[Math.min(m, P.length - 1)];
    if (pos && lakar >= 1) {
      const R = 17, gl = KUR ? 0 : (Math.sin(t / 420) + 1) / 2;
      ctx.beginPath(); ctx.arc(pos[0], pos[1] - 30, R + 6 + gl * 3, 0, 7); ctx.fillStyle = `rgba(232,194,90,${.12 + gl * .1})`; ctx.fill();
      ctx.beginPath(); ctx.moveTo(pos[0], pos[1] - 12); ctx.lineTo(pos[0] - 6, pos[1] - 18); ctx.lineTo(pos[0] + 6, pos[1] - 18); ctx.fillStyle = '#e8c25a'; ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(pos[0], pos[1] - 30, R, 0, 7); ctx.clip();
      if (imgOk) ctx.drawImage(img, pos[0] - R, pos[1] - 30 - R, R * 2, R * 2); else { ctx.fillStyle = '#56131c'; ctx.fill() }
      ctx.restore(); ctx.beginPath(); ctx.arc(pos[0], pos[1] - 30, R, 0, 7); ctx.strokeStyle = '#e8c25a'; ctx.lineWidth = 2.5; ctx.stroke();
    }
    /* nama tempat bagi setiap gugus; jika gugus lain dekat, ke tepi yang lapang */
    const gl = gugus.filter(G => G.ahli[0] <= sampai + .01);
    for (const G of gl) {
      const jir = gl.filter(q => q !== G && Math.hypot(q.x - G.x, q.y - G.y) < 90);
      let lx = G.x, ly = G.y + G.R + 30, al = 'center';
      if (jir.length) { const kiri = jir.some(q => q.x <= G.x); al = kiri ? 'left' : 'right'; lx = G.x + (kiri ? 1 : -1) * (G.R + 20); ly = G.y + 4 - (G.nama.length - 1) * 7 }
      ctx.textAlign = al; ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,.75)';
      G.nama.slice(0, 3).forEach((T, k) => {
        const yy = ly + k * 14;
        ctx.font = '600 11px Cinzel, Georgia, serif'; ctx.fillStyle = '#f1e3c2';
        const tx = T.n + (T.ag ? ' *' : '');
        ctx.strokeText(tx, lx, yy); ctx.fillText(tx, lx, yy);
      });
    }
    return P;
  }

  /* butang DOM di atas kanvas */
  function letakButang(P) {
    const bs = lap.children;
    for (let i = 0; i < bs.length; i++) {
      const b = bs[i], k = +b.dataset.pi, p = P[k];
      const muncul = lakar * Math.max(1, P.length - 1) >= k - .01;
      b.style.transform = `translate(${p[0]}px,${p[1]}px)`;
      b.style.opacity = muncul ? 1 : 0;
    }
  }

  function frame(now) {
    raf = 0;
    if (!cv || cv.offsetParent === null || document.hidden) return;
    if (now - last < 32) { raf = requestAnimationFrame(frame); return }
    last = now;
    let gerak = false;
    if (camT < 1) { camT = Math.min(1, camT + 32 / camDur); const e = ease(camT); cam = { x: camA.x + (camB.x - camA.x) * e, y: camA.y + (camB.y - camA.y) * e, s: camA.s * Math.pow(camB.s / camA.s, e) }; gerak = true }
    if (lakar < 1) { lakar = Math.min(1, (now - lakarT0) / 1400); gerak = true }
    if (kapal) {
      if (now < kapal.mula) gerak = true;
      else { kapal.t = Math.min(1, (now - kapal.mula) / kapal.dur); gerak = true; if (kapal.t >= 1) { const cb = kapal.cb; kapal = null; cb && cb() } }
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    lukisDarat(now - t0);
    const P = lukisLaluan(now - t0);
    letakButang(P);
    /* laut sentiasa beralun perlahan; tanpa gerakan lain, ~15 fps sudah cukup */
    if (!KUR) { if (!gerak) last += 34; raf = requestAnimationFrame(frame) }
    else if (gerak) raf = requestAnimationFrame(frame);
  }
  function minta() { if (!raf) raf = requestAnimationFrame(frame) }

  function saiz() {
    if (!cv) return;
    const r = cv.getBoundingClientRect(); if (!r.width) return;
    dpr = Math.min(2, devicePixelRatio || 1); W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    if (H0) { cam = muat(pts.map(p => p.c), 46, 4); camT = 1 }
    minta();
  }

  return {
    pasang(c, l) {
      cv = c; lap = l; ctx = cv.getContext('2d');
      if (typeof ResizeObserver !== 'undefined') new ResizeObserver(saiz).observe(cv); else addEventListener('resize', saiz);
      document.addEventListener('visibilitychange', minta);
    },
    /* tunjuk(H, urutan, kemajuan, {belayar:true} untuk animasi dari m-1 ke m) */
    tunjuk(Hk, urut, maju, opt = {}) {
      const baru = H0 !== Hk; H0 = Hk; m = maju;
      const kira = {};
      pts = urut.map(S => { const T = TEMPAT[S.g] || TEMPAT.melaka; kira[S.g] = (kira[S.g] || 0) + 1; return { g: S.g, c: T.c, k: kira[S.g] - 1, t: T } });
      for (const p of pts) p.n = kira[p.g];
      img.src = PORTRET[Hk.h]; imgOk = img.complete && img.naturalWidth > 0;
      lap.innerHTML = urut.map((S, i) => {
        const T = TEMPAT[S.g] || TEMPAT.melaka, st = i < maju ? 'selesai' : i === maju ? 'kini' : 'kunci';
        const no = S.prolog ? 'P' : (Hk.pr ? i : i + 1);
        return `<button class="pn ${st}" data-pi="${i}" data-i="${i}"${st === 'kunci' ? ' disabled' : ''} aria-label="${S.prolog ? 'Prolog' : 'Perhentian ' + no}: ${esc(S.t)}, ${esc(T.n)}${st === 'kunci' ? ', terkunci' : ''}"><b>${no}</b></button>`;
      }).join('');
      saiz();
      const semua = muat(pts.map(p => p.c), 46, 4);
      if (opt.belayar && maju > 0 && maju < urut.length) {
        /* zum ke pasangan perhentian, kemudian belayar */
        cam = semua; camT = 1; lakar = 1;
        keKamera(muat([pts[maju - 1].c, pts[maju].c], 60, 3), 900);
        kapal = { i: maju - 1, t: 0, mula: kini() + (KUR ? 0 : 700), dur: KUR ? 1 : 1600, cb: () => { keKamera(semua, 1100); opt.selesai && opt.selesai() } };
        m = maju;
      } else {
        kapal = null; cam = semua; camT = 1;
        if (baru && !KUR) { lakar = 0; lakarT0 = kini() } else lakar = 1;
      }
      minta();
    },
    _keadaan() { return { lakar, kapal: !!kapal, camT, n: pts.length, W, H } }
  };
})();
