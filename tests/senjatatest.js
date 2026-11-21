/* Senjata pusaka: integriti data (bahan sekolah) dan logik buka/pilih. */
let ok=true;const chk=(c,m)=>{if(!c){ok=false;console.log('FAIL',m)}};
chk(Array.isArray(SENJATA)&&SENJATA.length>=6,'senarai senjata wujud');
const lv=new Set();
SENJATA.forEach((w,i)=>{
  chk(w.id===i,`id ${w.n} selari dengan indeks`);
  chk(JENIS[w.j],`${w.n}: jenis sah (sejarah/lagenda/pertikai)`);
  for(const k of['n','e','c','fx','kesan','z','p','k','t','s'])chk(typeof w[k]==='string'&&w[k].length>0,`${w.n}: medan ${k} ada`);
  chk(w.s.length>12,`${w.n}: sumber dinyatakan`);
  chk(!lv.has(w.lv),`${w.n}: level ${w.lv} unik`);lv.add(w.lv);
  chk(/^#[0-9a-f]{6}$/i.test(w.c),`${w.n}: warna sah`);
});
chk(SENJATA[0].lv===1,'senjata pertama dibuka di level 1 (setiap pemain ada senjata)');
for(let i=1;i<SENJATA.length;i++)chk(SENJATA[i].lv>SENJATA[i-1].lv,'level menaik');
/* Taming Sari tidak boleh dilabel sejarah tanpa rujukan */
const ts=SENJATA.find(w=>/Taming Sari/.test(w.n));chk(ts&&ts.j!=='sejarah','Taming Sari tidak dilabel sejarah');
/* buka & pilih */
const xp0=Prof.d.xp,w0=Prof.d.wpn;
Prof.d.xp=0;Prof.d.wpn=6;
chk(Senjata.dipakai(1).id===0,'level 1: senjata terkunci jatuh balik ke Keris');
chk(Senjata.pilih(6)===false,'tidak boleh pilih senjata terkunci');
chk(Senjata.dipakai(30).id===6,'level 30: Taming Sari dipakai bila dipilih');
Prof.d.wpn=99;Prof.fix();chk(Prof.d.wpn===0,'id senjata rosak dibaiki');
const g=Prof.gains(2,3);chk(g[0].wpn.length===1&&g[0].wpn[0].n==='Kerambit','ganjaran level 3 menyenaraikan Kerambit');
chk(/Kerambit/.test(Prof.perkHtml(g[0])),'naik level menunjukkan senjata baharu');
chk(/data-wsj="6"/.test(Senjata.html(1)),'kad sejarah boleh dibuka walaupun senjata terkunci');
chk(/Sumber:/.test(Senjata.kad(3)),'kad memaparkan sumber');
Prof.d.xp=xp0;Prof.d.wpn=w0;
console.log(ok?'SENJATA OK':'SENJATA GAGAL');console.log('TESTS DONE');
