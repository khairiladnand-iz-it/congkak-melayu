/* Congkak Harian — keadilan bergantung sepenuhnya pada determinisme. */
let ok=true;const chk=(c,m)=>{if(!c){ok=false;console.log('FAIL',m)}};

/* ---- RNG ---- */
chk(typeof RNG==='object','RNG wujud');
RNG.off();const r1=RNG.next(),r2=RNG.next();
chk(r1!==r2,'tanpa benih ia rawak');
RNG.seed(1234);const a=[];for(let i=0;i<20;i++)a.push(RNG.next());
RNG.seed(1234);const b=[];for(let i=0;i<20;i++)b.push(RNG.next());
chk(JSON.stringify(a)===JSON.stringify(b),'benih sama -> urutan sama');
RNG.seed(1235);const c2=[];for(let i=0;i<20;i++)c2.push(RNG.next());
chk(JSON.stringify(a)!==JSON.stringify(c2),'benih lain -> urutan lain');
chk(a.every(x=>x>=0&&x<1),'semua nilai dalam [0,1)');
RNG.off();chk(RNG.seeded===false,'off() mengembalikan Math.random');

/* ---- nombor teka-teki ---- */
chk(Harian.no(new Date(2026,0,1))===1,'1 Jan 2026 ialah #1: '+Harian.no(new Date(2026,0,1)));
chk(Harian.no(new Date(2026,0,2))===2,'hari berikutnya #2');
chk(Harian.no(new Date(2026,11,31))===365,'31 Dis 2026 ialah #365: '+Harian.no(new Date(2026,11,31)));
chk(Harian.tarikh(1).includes('Januari'),'tarikh dalam Melayu: '+Harian.tarikh(1));

/* ---- papan: sama di mana-mana, sah sebagai papan congkak ---- */
for(const n of [1,42,100,365,1000]){
  const p=Harian.papan(n),lub=cfg.n;
  chk(JSON.stringify(p)===JSON.stringify(Harian.papan(n)),'#'+n+' stabil');
  chk(p.length===2*lub+2,'#'+n+' saiz papan betul');
  chk(p.reduce((x,y)=>x+y,0)===lub*14,'#'+n+' jumlah biji '+p.reduce((x,y)=>x+y,0));
  chk(p[lub]===0&&p[2*lub+1]===0,'#'+n+' rumah ibu kosong');
  chk(JSON.stringify(p.slice(0,lub))===JSON.stringify(p.slice(lub+1,2*lub+1)),'#'+n+' dicerminkan — adil kedua-dua pihak');
  chk(p.slice(0,lub).every(x=>x>=2&&x<=14),'#'+n+' setiap lubang 2-14 biji');
}
chk(JSON.stringify(Harian.papan(42))!==JSON.stringify(Harian.papan(43)),'hari berbeza -> papan berbeza');

/* pahlawan hari ini sama untuk semua orang */
for(const n of [5,42,300]){
  const h=Harian.pahlawan(n);
  chk(JSON.stringify(h)===JSON.stringify(Harian.pahlawan(n)),'#'+n+' pahlawan stabil');
  chk(h[0]!==h[1],'#'+n+' dua pahlawan berbeza');
  chk(h.every(x=>x>=0&&x<NBASE),'#'+n+' indeks pahlawan sah');
}

/* ---- AI deterministik: inilah syarat keadilan ---- */
{
  const p=Harian.papan(42);
  const main=()=>{RNG.seed(777);const o=[];for(let i=0;i<12;i++)o.push(AI.pick(p,cfg.n,i%2,3));RNG.off();return o};
  chk(JSON.stringify(main())===JSON.stringify(main()),'AI memberi gerakan sama dengan benih sama');
}

/* ---- satu percubaan sehari ---- */
Prof.d.hariN=0;Prof.d.hariS=0;
chk(Harian.sudah()===false,'belum main hari ini');
Prof.d.hariN=Harian.no();Prof.d.hariS=52;
chk(Harian.sudah()===true,'sudah main hari ini');
chk(Harian.skorHariIni()===52,'skor diingat');
Prof.d.hariN=Harian.no()-1;
chk(Harian.sudah()===false,'skor semalam tidak mengunci hari ini');

/* ---- teks kongsi ---- */
Prof.d.hariN=Harian.no();Prof.d.hariS=52;
Harian.hasil={n:Harian.no(),skor:52,tikam:4,rantai:6};
const t=Harian.teks();
chk(t.includes('#'+Harian.no()),'teks ada nombor teka-teki');
chk(t.includes('52 biji'),'teks ada skor');
chk(t.includes('4 tikam')&&t.includes('rantaian 6'),'teks ada tikam dan rantaian');
chk(/[▓░]{10}/.test(t),'teks ada bar visual');
chk(t.includes(SITE),'teks ada pautan permainan');
chk(t.split('\n').length===4,'teks pendek, 4 baris: '+t.split('\n').length);
chk(Harian.bar(0)==='░░░░░░░░░░','bar kosong');
chk(Harian.bar(cfg.n*14)==='▓▓▓▓▓▓▓▓▓▓','bar penuh');

/* ---- tetapan pemain dipulihkan selepas teka-teki ---- */
cfg.p=[3,5];cfg.vs='2';cfg.lvl=1;
Harian.bak={p:[3,5],vs:'2',lvl:1,n:cfg.n,seeds:cfg.seeds};Harian.on=true;RNG.seed(1);
Harian.pulih();
chk(cfg.vs==='2'&&cfg.lvl===1&&cfg.p[0]===3,'tetapan pemain dipulihkan');
chk(Harian.on===false&&RNG.seeded===false,'mod harian dimatikan');

console.log(ok?'HARIAN OK':'HARIAN FAILED');
