/* Sejarah perubahan: kontrak lejar (skill build-game-changelog). */
let ok=true;const chk=(c,m)=>{if(!c){ok=false;console.log('FAIL',m)}};
chk(Array.isArray(CHANGELOG)&&CHANGELOG.length>=2,'lejar wujud');
chk(VERSI===CHANGELOG[0].v,'versi dipapar = entri terbaru');
chk(CHANGELOG[CHANGELOG.length-1].v==='0.9.0','entri tertua ialah asas 0.9.0');
const seen=new Set();
CHANGELOG.forEach((e,i)=>{
  chk(!seen.has(e.v),`versi ${e.v} unik`);seen.add(e.v);
  chk(/^\d{4}-\d{2}-\d{2}$/.test(e.d),`${e.v}: tarikh sah`);
  chk(e.t&&e.n.length&&e.n.every(x=>x.trim()),`${e.v}: tajuk & butiran ada`);
  chk(!('sha' in e)&&!('run' in e),`${e.v}: hash/ID tidak dihantar kepada pemain`);
  if(i+1<CHANGELOG.length){const a=e.v.split('.').map(Number),b=CHANGELOG[i+1].v.split('.').map(Number);
    chk(a[0]===b[0]&&a[1]===b[1]&&a[2]===b[2]+1,`${e.v} berturutan selepas ${CHANGELOG[i+1].v}`);
    chk(e.d>=CHANGELOG[i+1].d,`${e.v}: terbaru dahulu`)}
});
const h=Log.html();
chk((h.match(/class="loge/g)||[]).length===CHANGELOG.length,'semua entri dipapar');
chk(h.indexOf(CHANGELOG[0].v)<h.indexOf(CHANGELOG[1].v),'dipapar terbaru dahulu');
chk(/aria-label="Tutup sejarah perubahan"/.test(h)&&/data-log="back"/.test(h),'ada X dan Kembali');
chk(Log.tarikh('2026-11-21')==='21 November 2026','tarikh dalam Bahasa Melayu');
console.log(ok?'CHANGELOG OK':'CHANGELOG GAGAL');console.log('TESTS DONE');
