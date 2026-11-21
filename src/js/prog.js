/* ===== PROFIL, LEVEL & GANJARAN ===== */
const WU={jati:1,hitam:1,merah:3,emas:6,cendana:9,giok:12,nilam:16,perak:20,bara:26,angkasa:32,diraja:40};
const FU={songket:1,jubin:1,tikar:3,rebung:8,kawung:14,marmar:24,langit:36};
const SU={saga:1,guli:1,batu:2,kulit:4,emas:7,mutiara:10,zamrud:14,delima:18,nilam:22,bara:28,planet:34,bintang:42};
const GEM=[
 {id:0,lv:5,n:'Tiupan Serunai',k:'notes',e:'🎶',c:'#8affc8',d:[26,34],stun:1500,pierce:0,t:'Alunan serunai mengacau pertahanan lawan 1.5 saat.'},
 {id:1,lv:10,n:'Bayang Harimau',k:'claw',e:'🐅',c:'#ffa83a',d:[34,44],stun:0,pierce:1,t:'Cakaran menembusi tangkisan.'},
 {id:2,lv:15,n:'Wau Bulan Menyala',k:'moon',e:'🌙',c:'#ffe27a',d:[38,48],stun:2000,pierce:0,t:'Sabit cahaya, lawan tidak boleh menangkis 2 saat.'},
 {id:3,lv:20,n:'Api Naga Laut',k:'fire',e:'🐉',c:'#ff5a2a',d:[44,56],stun:0,pierce:1,t:'Semburan api yang menembusi tangkisan.'},
 {id:4,lv:25,n:'Kilat Taming Sari',k:'bolt',e:'⚡',c:'#9ad0ff',d:[50,62],stun:2500,pierce:0,t:'Kilat menyambar, lawan terpaku 2.5 saat.'},
 {id:5,lv:30,n:'Ribut Samudera',k:'wave',e:'🌪️',c:'#4ab0ff',d:[55,68],stun:0,pierce:1,t:'Ribut besar menembusi segala tangkisan.'},
 {id:6,lv:35,n:'Cahaya Tujuh Lapis Langit',k:'beam',e:'🌟',c:'#fff0a0',d:[60,75],stun:3000,pierce:0,t:'Pancaran suci, lawan terpaku 3 saat.'},
 {id:7,lv:40,n:'Murka Gunung Ledang',k:'stomp',e:'🌋',c:'#ff7a3a',d:[70,85],stun:0,pierce:1,t:'Hentakan gunung menembusi tangkisan.'},
 {id:8,lv:45,n:'Keris Seribu Bayang',k:'multi',e:'🗡️',c:'#ffd45a',d:[80,95],stun:3500,pierce:1,t:'Seribu bayang keris, menembusi dan memaku lawan.'},
 {id:9,lv:50,n:'Takkan Melayu Hilang',k:'rings',e:'👑',c:'#ffd45a',d:[100,100],stun:4000,pierce:1,t:'Jurus agung: tikaman maut yang pasti KO.'}
];
const TITLES=['Budak Kampung','Anak Silat','Hulubalang Muda','Hulubalang','Pendekar','Panglima','Laksamana Muda','Laksamana','Orang Kaya','Bendahara','Raja Congkak'];
const LVMAX=50,STN=['atk','def','spd'],STL={atk:'Kuasa',def:'Tahan',spd:'Laju'};
/* ===== SIMPANAN KEKAL =====
   Storan pelayar sahaja tidak boleh dipercayai di dalam bingkai artifact (boleh kosong atau
   melontar ralat), jadi profil disimpan juga dalam storan akaun Claude bila ada. */
const Store={
  db:null,uid:'',on:false,tried:false,why:'storan pelayar ini sahaja',busy:null,
  async init(){
    if(this.tried)return this.on;this.tried=true;
    try{
      if(typeof claude==='undefined'||!claude||typeof claude.use!=='function')return false;
      const db=await claude.use('db');if(!db){this.why='storan pelayar ini sahaja (belum log masuk)';return false}
      const u=await claude.use('user');if(!u){this.why='storan pelayar ini sahaja';return false}
      this.uid=await u.id();if(!this.uid)return false;
      this.db=db;this.on=true;this.why='akaun Claude anda';
    }catch(e){this.on=false}
    return this.on;
  },
  ref(){return this.db.collection('data/users/'+this.uid).doc('congkak')},
  async get(){if(!this.on)return null;try{const d=await this.ref().get();return d&&d.exists?(d.data()||null):null}catch(e){return null}},
  async put(o){if(!this.on)return false;try{await this.ref().set(o);return true}catch(e){return false}}
};
const Prof={
  d:{xp:0,w:0,g:0,gem:-1,gem2:-1,camp:0,cap:0,ko:0,chain:0,best:0,str:0,cur:0,seen:0,hariN:0,hariS:0,hariB:0,wpn:0},
  day:{d:'',p:[0,0,0],done:[0,0,0]},
  loaded:false,nk:'',
  key:'cm15p',
  /* nama paparan untuk lobi dalam talian */
  nick(){
    if(this.nk)return this.nk;
    let s='';try{s=localStorage.getItem('cm15nid')||''}catch(e){}
    if(!s){s=String(1000+(Math.random()*8999|0));try{localStorage.setItem('cm15nid',s)}catch(e){}}
    return 'Pahlawan'+s;
  },
  setNick(v){
    const t=String(v||'').replace(/\s+/g,' ').trim().slice(0,16);
    if(t.length<3)return 'Nama perlu sekurang-kurangnya 3 aksara.';
    if(!/^[\p{L}\p{N} ._-]+$/u.test(t))return 'Guna huruf, nombor, ruang dan . _ - sahaja.';
    if(typeof Tapis!=='undefined'&&Tapis.bad(t))return 'Nama itu mengandungi perkataan tidak sopan.';
    this.nk=t;this.save();return true;
  },
  load(){
    let o=null;try{o=JSON.parse(localStorage.getItem(this.key)||'null')}catch(e){}
    if(o)this.apply(o);this.fix();
  },
  apply(o){
    if(!o)return;
    for(const k in this.d)if(typeof o[k]==='number')this.d[k]=o[k];
    if(typeof o.nk==='string'&&o.nk)this.nk=o.nk.slice(0,16);
    if(o.day&&typeof o.day==='object'&&typeof o.day.d==='string')this.day={d:o.day.d,p:(o.day.p||[0,0,0]).map(x=>+x||0),done:(o.day.done||[0,0,0]).map(x=>+x||0)};
  },
  /* gabung: ambil nilai tertinggi supaya kemajuan tidak pernah berundur */
  merge(o){
    if(!o)return false;let ch=false;
    /* semua kiraan yang hanya naik, termasuk kemajuan Hikayat (hk_*) */
    for(const k of Object.keys(this.d).filter(k=>!['gem','gem2','wpn','cur'].includes(k))){
      const v=+o[k];if(Number.isFinite(v)&&v>(this.d[k]||0)){this.d[k]=v;ch=true}}
    if(o.day&&o.day.d===this.day.d){
      for(let i=0;i<3;i++){const v=+((o.day.p||[])[i]);if(Number.isFinite(v)&&v>this.day.p[i]){this.day.p[i]=v;ch=true}
        if((o.day.done||[])[i]&&!this.day.done[i]){this.day.done[i]=1;ch=true}}}
    else if(o.day&&!this.day.d){this.day={d:o.day.d,p:(o.day.p||[0,0,0]).map(x=>+x||0),done:(o.day.done||[0,0,0]).map(x=>+x||0)};ch=true}
    if(typeof o.gem==='number'&&this.d.gem<0&&o.gem>=0){this.d.gem=o.gem;ch=true}
    if(typeof o.nk==='string'&&o.nk&&!this.nk){this.nk=o.nk.slice(0,16);ch=true}
    return ch;
  },
  pack(){return Object.assign({},this.d,{day:this.day,nk:this.nk,v:2})},
  cloudKey:'cm15cloud',
  cloudWanted(){try{return localStorage.getItem(this.cloudKey)==='1'}catch(e){return false}},
  autoSync(){
    /* storan awan hanya bila pemain memintanya: elak halaman meminta log masuk tanpa sebab */
    if(this.cloudWanted())this.sync().catch(()=>{});
    else{Store.why='pelayar ini sahaja';this.mini();Quest.roll()}
  },
  async cloudOn(){
    try{localStorage.setItem(this.cloudKey,'1')}catch(e){}
    Store.tried=false;Store.on=false;
    await this.sync();
    if(!Store.on)Toast.show('Tidak dapat menyambung ke akaun. Kemajuan masih disimpan dalam pelayar ini.');
    else Toast.show('Kemajuan kini disimpan dalam akaun Claude anda.');
    this.open();
  },
  cloudOff(){try{localStorage.removeItem(this.cloudKey)}catch(e){}Store.on=false;Store.why='pelayar ini sahaja';this.saveLocal();this.open();},
  async sync(){
    const ok=await Store.init();this.loaded=true;
    if(ok){const r=await Store.get();this.merge(r);this.fix();await Store.put(this.pack())}
    this.saveLocal();this.mini();Quest.roll();
  },
  saveLocal(){try{localStorage.setItem(this.key,JSON.stringify(this.pack()))}catch(e){}},
  save(){
    this.saveLocal();
    if(Store.on){clearTimeout(this._t);this._t=setTimeout(()=>Store.put(this.pack()),400)}
    else if(!Store.tried&&this.cloudWanted())Store.init().then(ok=>{if(ok)Store.put(this.pack())});
  },
  cum:L=>60*(L-1)+10*(L-1)*L,
  lvl(xp=this.d.xp){let L=1;while(L<LVMAX&&xp>=this.cum(L+1))L++;return L},
  prog(){const L=this.lvl(),a=this.cum(L),b=L>=LVMAX?a:this.cum(L+1);return{L,cur:this.d.xp-a,need:b-a,pct:L>=LVMAX?100:Math.round((this.d.xp-a)/(b-a)*100)}},
  title:L=>TITLES[Math.min(TITLES.length-1,Math.floor(L/5))],
  bonus(L){const b={atk:0,def:0,spd:0};for(let k=2;k<=L;k++)b[STN[(k-2)%3]]+=.2;return b},
  gemsFor(L){return GEM.filter(g=>g.lv<=L)},
  gemSel(L=this.lvl()){const a=this.gemsFor(L);if(!a.length)return null;return a.find(g=>g.id===this.d.gem)||a[a.length-1]},
  SLOT2:25,
  gemSel2(L=this.lvl()){if(L<this.SLOT2)return null;const a=this.gemsFor(L);if(a.length<2)return null;
    const s1=this.gemSel(L),p=a.find(g=>g.id===this.d.gem2&&(!s1||g.id!==s1.id));
    return p||a.filter(g=>!s1||g.id!==s1.id).pop()||null},
  gemSlots(L=this.lvl()){const o=[];const a=this.gemSel(L);if(a)o.push(a);const b=this.gemSel2(L);if(b)o.push(b);return o},
  fix(){if(typeof SENJATA!=='undefined'&&!SENJATA[this.d.wpn])this.d.wpn=0;if(this.d.gem>=0&&!GEM[this.d.gem])this.d.gem=-1;if(this.d.gem2>=0&&!GEM[this.d.gem2])this.d.gem2=-1;if(this.d.gem2===this.d.gem)this.d.gem2=-1;for(const k in this.d)if(!Number.isFinite(this.d[k]))this.d[k]=0},
  okWood:(id,L)=>(WU[id]||1)<=L,okSeed:(id,L)=>(SU[id]||1)<=L,okFloor:(id,L)=>(FU[id]||1)<=L,
  lvOf(k,id){return(k==='wood'?WU:k==='floor'?FU:SU)[id]||1},
  gains(l0,l1){const out=[];for(let L=l0+1;L<=l1;L++){const g=GEM.find(x=>x.lv===L);out.push({L,st:STN[(L-2)%3],gem:g||null,wood:WOODN.filter(w=>WU[w[0]]===L).map(w=>w[1]),seed:SEEDS.filter(s=>SU[s[0]]===L).map(s=>s[1]),floor:FLN.filter(f=>FU[f[0]]===L).map(f=>f[1]),wpn:typeof SENJATA!=='undefined'?SENJATA.filter(w=>w.lv===L):[]})}return out},
  award(o){
    const b={win:120,draw:70,lose:40}[o.res]||40,xp=Math.round((b+Math.min(o.caps||0,10)*8)*o.mult)+(o.bonus|0),l0=this.lvl();
    this.d.xp+=xp;this.d.g++;if(o.res==='win')this.d.w++;this.save();const l1=this.lvl();
    return{xp,l0,l1,up:this.gains(l0,l1)};
  },
  /* ---- skrin pangkat ---- */
  perkHtml(g){const bits=[`+0.2 ${STL[g.st]}`];if(g.gem)bits.push(`${IKON.svg(g.gem.e)} ${esc(g.gem.n)}`);g.wood.forEach(w=>bits.push(`🪵 ${esc(w)}`));g.seed.forEach(s=>bits.push(`🔮 ${esc(s)}`));g.floor.forEach(f=>bits.push(`🧶 ${esc(f)}`));(g.wpn||[]).forEach(w=>bits.push(`${w.e} Senjata: ${esc(w.n)}`));return bits.map(x=>`<span>${x}</span>`).join('')},
  tab:'sum',slot:1,
  pickGem(id){const L=this.lvl(),g=GEM[id];if(!g||g.lv>L)return;
    if(this.slot===2&&L>=this.SLOT2){if(this.d.gem===id)this.d.gem=-1;this.d.gem2=id}
    else{if(this.d.gem2===id)this.d.gem2=-1;this.d.gem=id}
    this.fix();this.save();this.open()},
  html(){
    const p=this.prog(),L=p.L,b=this.bonus(L),sel=this.gemSel(),T=this.tab;
    const near=this.gains(Math.max(0,L-1),Math.min(LVMAX,L+4));
    const rows=T==='road'?this.gains(1,LVMAX):near;
    const tabs=[['sum','Ringkasan'],['gem','Jurus'],['wpn','Senjata'],['bdg','Lencana'],['road','Ganjaran']];
    let body='';
    if(T==='sum')body=`<div class="pf-st">${STN.map(k=>`<div><small>${STL[k]}</small><b>+${b[k].toFixed(1)}</b></div>`).join('')}</div>
      ${Quest.recHtml()}
      <h3 class="pf-h">Ganjaran berikutnya</h3><div class="road">${near.filter(g=>g.L>L).slice(0,3).map(g=>`<div class="rw${g.gem?' ms':''}"><b>Lv ${g.L}</b><div>${this.perkHtml(g)}</div></div>`).join('')||'<p class="hnote">Semua ganjaran telah dibuka.</p>'}</div>
      <p class="hnote">Kelebihan level dipakai oleh anda sahaja, bukan lawan komputer.</p>`;
    else if(T==='gem'){
      const s2=this.gemSel2(L),slot=this.slot===2&&L>=this.SLOT2?2:1;
      body=`<p class="hnote">Jurus dipilih <b>di sini sebelum perlawanan</b>, bukan semasa tikam. Yang dipakai sahaja muncul sebagai butang di gelanggang, dan dilepaskan bila meter Semangat penuh.</p>
      <div class="slots">
        <button class="slt${slot===1?' sel':''}" data-slot="1"><small>Slot 1 · kekunci [6]</small><b>${sel?IKON.svg(sel.e)+' '+esc(sel.n):'— kosong —'}</b></button>
        <button class="slt${slot===2?' sel':''}${L<this.SLOT2?' lock':''}" data-slot="2"${L<this.SLOT2?' disabled':''}><small>Slot 2 · kekunci [0]</small><b>${L<this.SLOT2?'🔒 Buka di level '+this.SLOT2:s2?IKON.svg(s2.e)+' '+esc(s2.n):'— kosong —'}</b></button>
      </div>
      <p class="hnote">Tekan slot di atas, kemudian pilih jurus di bawah untuk slot itu.${L>=this.SLOT2?' Dua jurus dibawa sekali, dan anda pilih yang mana satu semasa bertarung.':''}</p>
      <div class="gems">${GEM.map(g=>{const un=g.lv<=L,a1=sel&&sel.id===g.id,a2=s2&&s2.id===g.id;
        return`<button class="gem${un?'':' lock'}${a1||a2?' sel':''}" data-gem="${g.id}" ${un?'':'disabled'}><i>${IKON.svg(un?g.e:'🔒')}</i><b>${esc(g.n)}</b><small>${un?esc(g.t):'Buka di level '+g.lv}</small>${a1?'<em>SLOT 1</em>':a2?'<em class="s2">SLOT 2</em>':''}</button>`}).join('')}</div>`;}
    else if(T==='wpn')body=Senjata.html(L);
    else if(T==='bdg')body=Quest.bdgHtml();
    else body=`<div class="road tall">${rows.map(g=>`<div class="rw${g.L<=L?' got':''}${g.gem?' ms':''}"><b>Lv ${g.L}</b><div>${this.perkHtml(g)}</div></div>`).join('')}</div>`;
    return`<div class="panel prof"><h2>Pangkat &amp; Ganjaran</h2>
    <div class="pf-head"><div class="pf-lv"><small>LEVEL</small><b>${L}</b></div><div class="pf-info"><h3>${esc(this.title(L))}</h3><div class="xpb"><i style="width:${p.pct}%"></i></div><small>${L>=LVMAX?'Pangkat tertinggi dicapai!':`${p.cur} / ${p.need} XP ke level ${L+1}`} · ${this.d.w} menang daripada ${this.d.g} perlawanan</small><small class="sv">💾 ${esc(Store.why)}</small></div></div>
    <div class="cloud">${Store.on
      ?`<span>☁️ Kemajuan disimpan dalam akaun Claude — kekal walaupun tukar peranti.</span><button class="btn sm" data-h="cloudoff">Matikan</button>`
      :`<span>💾 Kemajuan disimpan dalam pelayar ini sahaja. Kalau hang kosongkan data pelayar atau tukar peranti, ia hilang.</span><button class="btn sm" data-h="cloudon">☁️ Simpan ke akaun Claude</button>`}</div>
    <div class="ptab">${tabs.map(t=>`<button class="ptb${T===t[0]?' on':''}" data-ptab="${t[0]}">${t[1]}</button>`).join('')}</div>
    <div class="pbody">${body}</div>
    <div class="center"><button class="btn" data-h="closeprof">Tutup</button></div></div>`},
  open(t){if(t)this.tab=t;const o=document.getElementById('prof');o.innerHTML=this.html();o.hidden=false;o.scrollTop=0},
  close(){document.getElementById('prof').hidden=true;this.mini()},
  mini(){const e=document.getElementById('pm');if(!e)return;const p=this.prog();e.innerHTML=`<div class="pm-lv">${p.L}</div><div class="pm-i"><b>${esc(this.title(p.L))}</b><div class="xpb"><i style="width:${p.pct}%"></i></div><small>Level ${p.L} · ${this.d.xp} XP</small></div>`},
  resultHtml(a){
    if(!a)return'';let h=`<p class="xpg">+${a.xp} XP</p>`;
    if(a.l1>a.l0){h+=`<div class="lvup"><b>NAIK LEVEL! ${a.l0} → ${a.l1}</b>${a.up.map(g=>`<div class="rw${g.gem?' ms':''}"><b>Lv ${g.L}</b><div>${this.perkHtml(g)}</div></div>`).join('')}</div>`}
    else{const p=this.prog();h+=`<div class="xpb"><i style="width:${p.pct}%"></i></div><small>Level ${p.L} · ${p.cur}/${p.need} XP</small>`}
    return h;
  }
};
