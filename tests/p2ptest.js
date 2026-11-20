/* Semakan tulen untuk P2P. Tingkah laku pengangkutan (hos/klien, presence,
   mesej, joined/left) diuji oleh tests/online.py dengan PeerJS tiruan yang
   jauh lebih sahih, melalui kod produk sebenar dalam pelayar. */
let ok=true;const chk=(c,m)=>{if(!c){ok=false;console.log('FAIL',m)}};

chk(typeof P2P==='object','P2P wujud');
for(const k of ['avail','load','id','_peer','_wrap','ns'])
  chk(typeof P2P[k]==='function','ada P2P.'+k);
chk(P2P.URL.includes('peerjs@1.5.5'),'versi PeerJS disematkan: '+P2P.URL);
chk(P2P.URL.startsWith('https://cdn.jsdelivr.net/'),'dimuatkan dari CDN yang dibenarkan');

/* tiada WebRTC dalam harness -> mesti melaporkan sebab, bukan senyap */
chk(P2P.avail()===false,'avail false tanpa WebRTC');
chk(/WebRTC/.test(P2P.why),'sebab dinyatakan: '+P2P.why);

/* ID PeerServer hanya menerima huruf, nombor, - dan _ */
chk(P2P.id('cm5-ab12c')==='ckm1-cm5-ab12c','ID bilik: '+P2P.id('cm5-ab12c'));
chk(P2P.id('lobi')==='ckm1-lobi','ID lobi: '+P2P.id('lobi'));
chk(!/[^A-Za-z0-9_-]/.test(P2P.id('a b/c:d#e')),'aksara haram dibersihkan: '+P2P.id('a b/c:d#e'));
chk(P2P.id('x'.repeat(200)).length<=60,'ID dipendekkan: '+P2P.id('x'.repeat(200)).length);

/* Rm mesti jatuh balik dengan bersih bila P2P tiada */
Rm.tried=false;Rm.ns=null;Rm.mode='';Rm._p=null;Rm.why='';
await Rm.init();
chk(Rm.ns===null,'Rm.ns null tanpa P2P dan tanpa artifact');
chk(!!Rm.why,'Rm menerangkan sebabnya: '+Rm.why);

/* REGRESI: dua pemanggil serentak mesti berkongsi satu sambungan */
const fake={kind:'p2p'};let calls=0;
P2P.avail=()=>true;P2P.root=null;
P2P.ns=async()=>{calls++;await new Promise(r=>setTimeout(r,5));return fake};
Rm.tried=false;Rm.ns=null;Rm.mode='';Rm._p=null;
const [a,b]=await Promise.all([Rm.init(),Rm.init()]);
chk(a===fake&&b===fake,'dua init serentak kedua-duanya berjaya');
chk(calls===1,'sambungan dibuat sekali sahaja, bukan '+calls);
chk(Rm.mode==='p2p','mod ditetapkan: '+Rm.mode);

console.log(ok?'P2P OK':'P2P FAILED');
