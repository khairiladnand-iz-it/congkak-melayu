/* ===== AVATAR CHIBI (SVG, tiada fail imej) =====
   Watak sampingan yang tiada potret pahlawan dilukis daripada spesifikasi ringkas:
   kepala besar, mata anime besar, tutup kepala ikut zaman dan tempat.
   Gaya diselaraskan dengan potret chibi permainan (garis gelap, warna rata berbayang).
   Ini avatar sementara; potret lukisan penuh boleh menggantikannya kemudian.

   spesifikasi: { k:kulit, r:warna rambut, rg:gaya rambut, t:tutup kepala, tc:warna tutup,
                  b:warna baju, bt:hiasan baju, m:raut ('garang'|'tenang'|'senyum'|'sedih'|'licik'),
                  ms:misai, jg:janggut, tua:1, p:perempuan, a:aksesori, bg:warna latar } */
const Avatar = (() => {
  const KULIT = { cerah: '#f6d2b0', sawo: '#e7b98f', gelap: '#c9926a', eropah: '#f8dcc8' };
  const D = '#2a1410';                       // garis gelap seragam
  let uid = 0;
  const gelap = (h, f) => {                  // gelapkan warna hex untuk bayang
    const n = parseInt(h.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v * f));
    return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
  };

  function badan(s) {
    const b = s.b || '#7a2030', g = gelap(b, .7);
    let o = `<path d="M18 124 C20 100 36 90 60 90 C84 90 100 100 102 124 Z" fill="${b}" stroke="${D}" stroke-width="2"/>
      <path d="M30 124 C34 106 44 98 60 98 C76 98 86 106 90 124 Z" fill="${g}" opacity=".35"/>`;
    const bt = s.bt || 'kolar';
    if (bt === 'kolar') o += `<path d="M48 91 L60 106 L72 91" fill="none" stroke="#e8c25a" stroke-width="3"/>`;
    if (bt === 'jubah') o += `<path d="M44 92 C50 110 54 118 54 124 M76 92 C70 110 66 118 66 124" fill="none" stroke="#f1e3c2" stroke-width="3"/>`;
    if (bt === 'ruff') o += `<path d="M38 92 Q44 84 50 92 Q56 84 62 92 Q68 84 74 92 Q80 84 84 92 Q78 100 60 100 Q42 100 38 92Z" fill="#f4f0e6" stroke="${D}" stroke-width="1.6"/>`;
    if (bt === 'zirah') o += `<path d="M34 104 Q60 92 86 104" fill="none" stroke="#c9ced6" stroke-width="5"/><circle cx="60" cy="110" r="5" fill="#c9ced6" stroke="${D}" stroke-width="1.4"/>`;
    if (bt === 'songket') o += `<path d="M30 112 H90 M34 118 H86" stroke="#e8c25a" stroke-width="2" stroke-dasharray="4 3"/>`;
    if (bt === 'selendang') o += `<path d="M30 100 C46 112 74 112 92 98 L96 124 L84 124 C76 114 46 114 36 124 L24 124Z" fill="${s.tc || '#c94f7c'}" stroke="${D}" stroke-width="1.6"/>`;
    return o;
  }

  function rambutBelakang(s) {
    const r = s.r || '#1b1212';
    if (s.rg === 'panjang') return `<path d="M24 58 C22 90 30 104 40 108 L80 108 C90 104 98 90 96 58 Z" fill="${r}" stroke="${D}" stroke-width="2"/>`;
    if (s.rg === 'sanggul') return `<circle cx="60" cy="22" r="13" fill="${r}" stroke="${D}" stroke-width="2"/><path d="M70 14 L84 6" stroke="#e8c25a" stroke-width="3" stroke-linecap="round"/><circle cx="85" cy="5" r="3" fill="#d0242b"/>`;
    if (s.rg === 'ikat') return `<path d="M84 46 C98 50 100 66 94 78" fill="none" stroke="${r}" stroke-width="9" stroke-linecap="round"/>`;
    return '';
  }

  function kepala(s) {
    const k = KULIT[s.k] || KULIT.sawo;
    return `<rect x="52" y="80" width="16" height="14" rx="5" fill="${gelap(k, .85)}" stroke="${D}" stroke-width="2"/>
      <ellipse cx="27" cy="62" rx="5" ry="7" fill="${k}" stroke="${D}" stroke-width="2"/><ellipse cx="93" cy="62" rx="5" ry="7" fill="${k}" stroke="${D}" stroke-width="2"/>
      <path d="M26 52 C26 30 42 20 60 20 C78 20 94 30 94 52 C94 72 82 88 60 88 C38 88 26 72 26 52Z" fill="${k}" stroke="${D}" stroke-width="2.2"/>
      ${s.tua ? `<path d="M40 76 Q44 79 46 76 M74 76 Q76 79 80 76" fill="none" stroke="${gelap(k, .7)}" stroke-width="1.4"/>` : ''}
      <ellipse cx="40" cy="72" rx="6" ry="3.4" fill="#ff8a80" opacity=".35"/><ellipse cx="80" cy="72" rx="6" ry="3.4" fill="#ff8a80" opacity=".35"/>`;
  }

  function mata(s) {
    const m = s.m || 'tenang', iris = s.iris || '#5a3418', tua = s.tua;
    const ry = m === 'licik' ? 4.5 : tua ? 6 : 8.5, cy = 63;
    const satu = (x, f) => `<g>
      <ellipse cx="${x}" cy="${cy}" rx="6.6" ry="${ry}" fill="#fff" stroke="${D}" stroke-width="1.4"/>
      <ellipse cx="${x + f * .6}" cy="${cy + 1}" rx="5" ry="${ry - 1}" fill="${iris}"/>
      <ellipse cx="${x + f * .6}" cy="${cy + 2}" rx="2.6" ry="${Math.max(2, ry - 4)}" fill="#1a0c06"/>
      <circle cx="${x - 2 + f}" cy="${cy - ry / 2.6}" r="2.1" fill="#fff"/><circle cx="${x + 2.2 + f}" cy="${cy + ry / 3}" r="1" fill="#fff"/>
      <path d="M${x - 7.5} ${cy - ry + 1} Q${x} ${cy - ry - 2.5} ${x + 7.5} ${cy - ry + 1.5}" fill="none" stroke="${D}" stroke-width="2.6" stroke-linecap="round"/></g>`;
    const kening = {
      garang: 'M38 50 L52 55 M82 50 L68 55', tenang: 'M39 52 Q46 49 53 52 M67 52 Q74 49 81 52',
      senyum: 'M39 51 Q46 47 53 51 M67 51 Q74 47 81 51', sedih: 'M39 52 L52 49 M81 52 L68 49',
      licik: 'M39 53 L52 51 M68 50 L81 54'
    }[m];
    const kc = s.tua ? '#e8e2d6' : (s.r || '#1b1212');
    return satu(47, 1) + satu(73, -1) + `<path d="${kening}" fill="none" stroke="${kc}" stroke-width="${s.tua ? 3.4 : 2.8}" stroke-linecap="round"/>`;
  }

  function mulut(s) {
    const m = s.m || 'tenang';
    const d = { garang: 'M53 80 Q60 76 67 80', tenang: 'M55 79 Q60 81 65 79', senyum: 'M52 77 Q60 85 68 77',
      sedih: 'M54 81 Q60 77 66 81', licik: 'M53 79 Q62 82 68 76' }[m];
    let o = `<path d="M59 70 Q60 72 61 70" fill="none" stroke="${D}" stroke-width="1.2"/>`;
    if (m === 'senyum') o += `<path d="M53 78 Q60 84 67 78 Z" fill="#8a2a2a"/>`;
    o += `<path d="${d}" fill="none" stroke="${D}" stroke-width="2" stroke-linecap="round"/>`;
    const u = s.tua ? '#e8e2d6' : (s.r || '#1b1212');
    if (s.ms) o += `<path d="M48 76 Q54 72 60 75 Q66 72 72 76 Q66 75 60 77 Q54 75 48 76Z" fill="${u}" stroke="${D}" stroke-width="1"/>`;
    if (s.jg) o += `<path d="M38 74 C40 92 52 98 60 98 C68 98 80 92 82 74 C76 84 68 86 60 86 C52 86 44 84 38 74Z" fill="${u}" stroke="${D}" stroke-width="1.6"/>`;
    return o;
  }

  function rambutDepan(s) {
    const r = s.r || '#1b1212', hl = 'rgba(255,255,255,.22)';
    if (s.rg === 'botak') return '';
    if (s.p || s.rg === 'panjang' || s.rg === 'sanggul')
      return `<path d="M25 56 C24 30 40 17 60 17 C80 17 96 30 95 56 C88 44 80 36 72 34 C70 42 64 44 60 44 C54 40 52 36 50 34 C40 38 32 46 25 56Z" fill="${r}" stroke="${D}" stroke-width="2"/>
        <path d="M42 26 Q52 22 60 23" stroke="${hl}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    return `<path d="M24 54 C22 28 40 15 60 15 C82 15 98 28 96 54 L90 46 L86 52 L80 40 L74 48 L66 36 L58 46 L52 36 L44 48 L38 40 L32 52Z" fill="${r}" stroke="${D}" stroke-width="2"/>
      <path d="M40 24 Q52 18 64 20" stroke="${hl}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  }

  function tutup(s) {
    const c = s.tc || '#8a1c2a', g = gelap(c, .65), e = '#e8c25a';
    switch (s.t) {
      case 'tengkolok': return `<path d="M22 46 C22 22 42 10 62 12 C80 13 96 24 98 44 C86 38 72 36 60 36 C46 36 32 40 22 46Z" fill="${c}" stroke="${D}" stroke-width="2"/>
        <path d="M70 13 L96 2 L90 24 Z" fill="${g}" stroke="${D}" stroke-width="2"/><path d="M26 42 C40 34 80 32 96 40" fill="none" stroke="${e}" stroke-width="2.4" stroke-dasharray="5 3"/>`;
      case 'destar': return `<path d="M23 44 C30 34 90 34 97 44 L96 52 C86 44 34 44 24 52Z" fill="${c}" stroke="${D}" stroke-width="2"/><path d="M92 44 L106 50 L100 58 Z" fill="${c}" stroke="${D}" stroke-width="1.8"/>`;
      case 'songkok': return `<path d="M30 40 L32 14 C46 10 74 10 88 14 L90 40 C76 36 44 36 30 40Z" fill="#1d1a1a" stroke="${D}" stroke-width="2"/><path d="M33 18 C48 15 72 15 87 18" stroke="#444" stroke-width="2" fill="none"/>`;
      case 'mahkota': return `<path d="M28 40 L30 18 L40 28 L50 10 L60 24 L70 10 L80 28 L90 18 L92 40 C76 35 44 35 28 40Z" fill="${e}" stroke="${D}" stroke-width="2"/><circle cx="60" cy="31" r="4" fill="#d0242b" stroke="${D}" stroke-width="1.2"/><circle cx="44" cy="33" r="2.6" fill="#3a9aff"/><circle cx="76" cy="33" r="2.6" fill="#3a9aff"/>`;
      case 'serban': return `<path d="M22 50 C18 24 40 8 60 8 C80 8 102 24 98 50 C88 40 74 36 60 36 C46 36 32 40 22 50Z" fill="${s.tc || '#f4f0e6'}" stroke="${D}" stroke-width="2"/>
        <path d="M26 40 C40 26 80 24 96 40 M30 30 C46 18 76 18 92 30" fill="none" stroke="${gelap(s.tc || '#f4f0e6', .78)}" stroke-width="2"/>`;
      case 'ming': return `<path d="M30 40 C30 18 46 12 60 12 C74 12 90 18 90 40 C76 36 44 36 30 40Z" fill="#141414" stroke="${D}" stroke-width="2"/>
        <ellipse cx="14" cy="34" rx="15" ry="5" fill="#141414" stroke="${D}" stroke-width="1.6"/><ellipse cx="106" cy="34" rx="15" ry="5" fill="#141414" stroke="${D}" stroke-width="1.6"/><rect x="40" y="30" width="40" height="5" fill="${e}"/>`;
      case 'siam': return `<path d="M34 40 C34 24 46 18 60 18 C74 18 86 24 86 40 C74 36 46 36 34 40Z" fill="${e}" stroke="${D}" stroke-width="2"/>
        <path d="M46 24 L60 -6 L74 24 Z" fill="${e}" stroke="${D}" stroke-width="2"/><path d="M50 16 H70 M53 8 H67" stroke="${gelap(e, .7)}" stroke-width="2"/>`;
      case 'morion': return `<path d="M14 40 C26 36 32 18 60 14 C88 18 94 36 106 40 C90 42 30 42 14 40Z" fill="#c9ced6" stroke="${D}" stroke-width="2"/>
        <path d="M44 16 C50 2 70 2 76 16" fill="#c9ced6" stroke="${D}" stroke-width="2"/><path d="M60 3 V16" stroke="${D}" stroke-width="1.4"/><path d="M24 38 C40 34 80 34 96 38" stroke="#fff" stroke-width="1.6" opacity=".5" fill="none"/>`;
      case 'belanda': return `<ellipse cx="60" cy="34" rx="46" ry="9" fill="#1d1a1a" stroke="${D}" stroke-width="2"/><path d="M36 34 C36 10 84 10 84 34Z" fill="#1d1a1a" stroke="${D}" stroke-width="2"/><rect x="36" y="27" width="48" height="5" fill="#6a4a2a"/>`;
      case 'tricorne': return `<path d="M14 38 Q60 6 106 38 Q84 30 60 34 Q36 30 14 38Z" fill="#1d1a1a" stroke="${D}" stroke-width="2"/><path d="M16 37 Q60 10 104 37" fill="none" stroke="${e}" stroke-width="2"/>`;
      case 'inggeris': return `<path d="M30 38 C26 22 40 12 60 12 C80 12 94 22 90 38 C76 34 44 34 30 38Z" fill="#26202a" stroke="${D}" stroke-width="2"/><path d="M84 18 C100 6 110 14 104 26" fill="none" stroke="#f4f0e6" stroke-width="4" stroke-linecap="round"/>`;
      case 'beret': return `<path d="M24 40 C18 22 44 10 66 12 C90 14 104 28 94 40 C76 34 44 34 24 40Z" fill="${c}" stroke="${D}" stroke-width="2"/>`;
      case 'meukeutop': return `<path d="M30 40 L44 4 L76 4 L90 40 C76 36 44 36 30 40Z" fill="#d0242b" stroke="${D}" stroke-width="2"/>
        <path d="M33 32 H87 M37 22 H83 M41 12 H79" stroke="#e8c25a" stroke-width="4"/><circle cx="60" cy="3" r="4" fill="${e}" stroke="${D}" stroke-width="1.2"/>`;
      case 'tudung': return `<path d="M20 60 C16 24 40 10 60 10 C80 10 104 24 100 60 C98 74 94 82 90 88 C92 70 90 50 84 40 C74 32 46 32 36 40 C30 50 28 70 30 88 C26 82 22 74 20 60Z" fill="${c}" stroke="${D}" stroke-width="2"/>
        <path d="M36 40 C46 30 74 30 84 40" fill="none" stroke="${gelap(c, .7)}" stroke-width="2"/>`;
      case 'passapu': return `<path d="M24 44 C24 24 42 14 60 14 C78 14 96 24 96 44 C84 38 36 38 24 44Z" fill="${c}" stroke="${D}" stroke-width="2"/><path d="M60 14 L74 0 L70 18Z" fill="${g}" stroke="${D}" stroke-width="1.8"/><path d="M28 40 C44 32 76 32 92 40" stroke="${e}" stroke-width="2" fill="none"/>`;
      case 'ikat': return `<path d="M24 44 C34 36 86 36 96 44 L95 50 C84 43 36 43 25 50Z" fill="${c}" stroke="${D}" stroke-width="1.8"/>`;
      case 'kopiah': return `<path d="M32 36 C32 18 46 14 60 14 C74 14 88 18 88 36 C74 33 46 33 32 36Z" fill="#f4f0e6" stroke="${D}" stroke-width="2"/><path d="M36 28 H84" stroke="#c9c2b0" stroke-width="2" stroke-dasharray="3 3"/>`;
    }
    return '';
  }

  function aksesori(s) {
    const a = s.a || '';
    let o = '';
    if (a.includes('keris')) o += `<path d="M90 98 L104 82" stroke="#6a3a1a" stroke-width="5" stroke-linecap="round"/><path d="M102 80 Q110 72 106 70 Q100 72 100 78Z" fill="#e8c25a" stroke="${D}" stroke-width="1.4"/>`;
    if (a.includes('lembing')) o += `<path d="M106 124 L106 30" stroke="#6a3a1a" stroke-width="4"/><path d="M106 12 L112 32 L100 32Z" fill="#c9ced6" stroke="${D}" stroke-width="1.6"/>`;
    if (a.includes('gulung')) o += `<rect x="16" y="98" width="26" height="10" rx="5" fill="#f1e3c2" stroke="${D}" stroke-width="1.6" transform="rotate(-20 29 103)"/>`;
    if (a.includes('pena')) o += `<path d="M18 120 Q24 96 36 86 Q30 104 22 120Z" fill="#f4f0e6" stroke="${D}" stroke-width="1.4"/>`;
    if (a.includes('pedang')) o += `<path d="M96 124 L104 92" stroke="#c9ced6" stroke-width="4"/><path d="M96 96 H112" stroke="#e8c25a" stroke-width="4" stroke-linecap="round"/>`;
    if (a.includes('rencong')) o += `<path d="M92 102 Q104 92 108 80" fill="none" stroke="#c9ced6" stroke-width="4" stroke-linecap="round"/><path d="M88 106 L96 98" stroke="#e8c25a" stroke-width="5" stroke-linecap="round"/>`;
    if (a.includes('anting')) o += `<circle cx="27" cy="72" r="2.6" fill="#e8c25a"/><circle cx="93" cy="72" r="2.6" fill="#e8c25a"/>`;
    if (a.includes('busur')) o += `<path d="M14 40 Q-2 80 14 120" fill="none" stroke="#6a3a1a" stroke-width="4"/>`;
    if (a.includes('kipas')) o += `<path d="M14 118 L30 92 L40 112 Z" fill="#c94f7c" stroke="${D}" stroke-width="1.4"/>`;
    if (a.includes('teropong')) o += `<rect x="86" y="100" width="28" height="8" rx="3" fill="#b08a3a" stroke="${D}" stroke-width="1.4" transform="rotate(-25 100 104)"/>`;
    if (a.includes('dayung')) o += `<path d="M14 124 L28 70" stroke="#8a5a2a" stroke-width="4"/><ellipse cx="30" cy="62" rx="5" ry="12" fill="#8a5a2a" stroke="${D}" stroke-width="1.4" transform="rotate(15 30 62)"/>`;
    return o;
  }

  /* todak: satu-satunya lawan bukan manusia */
  function todak(bg) {
    return `<rect width="120" height="120" fill="${bg}"/>
      <path d="M0 96 Q20 88 40 96 T80 96 T120 96 V120 H0Z" fill="#1e4a6a" opacity=".6"/>
      <path d="M4 56 L46 52" stroke="#9fb8c8" stroke-width="4" stroke-linecap="round"/>
      <path d="M44 42 C60 28 92 32 104 52 C92 72 60 76 44 62 Z" fill="#5d8fb2" stroke="${D}" stroke-width="2.2"/>
      <path d="M48 58 C64 68 90 66 100 56" fill="#cfe2ee" stroke="${D}" stroke-width="1.4"/>
      <path d="M66 36 L78 14 L86 38Z" fill="#3e6a8c" stroke="${D}" stroke-width="2"/>
      <path d="M102 52 L118 36 L114 52 L118 68Z" fill="#3e6a8c" stroke="${D}" stroke-width="2"/>
      <ellipse cx="56" cy="50" rx="6" ry="7" fill="#fff" stroke="${D}" stroke-width="1.4"/><ellipse cx="55" cy="51" rx="3.6" ry="5" fill="#1a0c06"/><circle cx="54" cy="48" r="1.6" fill="#fff"/>
      <path d="M49 42 L61 45" stroke="${D}" stroke-width="2.4" stroke-linecap="round"/>`;
  }

  function svg(s) {
    const id = 'av' + (++uid), bg = s.bg || '#5a1a24';
    const latar = `<defs><radialGradient id="${id}" cx=".5" cy=".35" r=".75"><stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="${gelap(bg, .45)}"/></radialGradient></defs>`;
    if (s.jenis === 'todak') return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${todak(bg)}</svg>`;
    return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${latar}
      <rect width="120" height="120" fill="url(#${id})"/><g transform="translate(7 14) scale(.885)">
      ${s.a && s.a.includes('lembing') ? aksesori({ a: 'lembing' }) : ''}
      ${rambutBelakang(s)}${badan(s)}${kepala(s)}${mata(s)}${mulut(s)}${rambutDepan(s)}${tutup(s)}
      ${aksesori(Object.assign({}, s, { a: (s.a || '').replace('lembing', '') }))}</g></svg>`;
  }
  return { svg, KULIT };
})();
