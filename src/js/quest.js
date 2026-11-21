/* ===== KEMBARA NUSANTARA · MISI HARIAN · LENCANA ===== */
const CAMP=[
 {h:17,ai:1,n:5,s:3,w:'jati',f:'tikar',sd:'saga',p:'Pahang',      t:'Taman Tun Teja',      d:'Permainan pertama di laman istana Pahang. Tun Teja mengajar anda cara menabur biji.'},
 {h:16,ai:1,n:5,s:4,w:'cendana',f:'marmar',sd:'mutiara',p:'Langkawi',    t:'Pantai Mahsuri',      d:'Di bawah pokok beringin, Mahsuri menguji kesabaran anda.'},
 {h:6, ai:1,n:7,s:5,w:'merah',f:'jubin',sd:'emas',p:'Bukit Cina',  t:'Perigi Hang Li Po',   d:'Puteri dari seberang laut membawa permainan congkak istananya.'},
 {h:8, ai:1,n:7,s:7,w:'jati',f:'rebung',sd:'batu',p:'Johor',       t:'Balai Tun Sri Lanang',d:'Penulis Sejarah Melayu mencatat setiap langkah anda.'},
 {h:12,ai:1,n:7,s:7,w:'emas',f:'songket',sd:'emas',p:'Kelantan',    t:'Istana Kijang Emas',  d:'Cik Siti Wan Kembang bermain ditemani kijang kesayangannya.'},
 {h:10,ai:2,n:7,s:7,w:'merah',f:'songket',sd:'delima',p:'Kelantan',    t:'Mahkota Puteri Saadong',d:'Puteri yang berani menongkah takdir. Jangan pandang rendah.'},
 {h:14,ai:2,n:7,s:7,w:'hitam',f:'rebung',sd:'kulit',p:'Sarawak',     t:'Kaki Gunung Santubong',d:'Alunan antan dan lesung mengiringi perlawanan ini.'},
 {h:9, ai:2,n:7,s:7,w:'jati',f:'songket',sd:'guli',p:'N. Sembilan', t:'Balai Adat Yamtuan',  d:'Adat perpatih menuntut permainan yang bersih dan teratur.'},
 {h:13,ai:2,n:9,s:7,w:'giok',f:'rebung',sd:'zamrud',p:'Gunung Ledang',t:'Puncak Berkabus',    d:'Tujuh syarat, tujuh lubang tambahan. Papan besar menanti.'},
 {h:4, ai:2,n:7,s:9,w:'nilam',f:'marmar',sd:'nilam',p:'Singapura',   t:'Selat Hang Nadim',    d:'Laksamana muda yang mengalahkan todak. Biji penuh di setiap lubang.'},
 {h:11,ai:2,n:7,s:7,w:'emas',f:'songket',sd:'mutiara',p:'Melaka',    t:'Peterana Tun Fatimah',d:'Permaisuri Melaka bermain demi maruah keluarganya.'},
 {h:15,ai:3,n:7,s:7,w:'nilam',f:'jubin',sd:'nilam',p:'Aceh',        t:'Armada Inong Balee',  d:'Laksamana Malahayati tidak pernah berundur di laut mahupun di papan.'},
 {h:3, ai:3,n:7,s:7,w:'emas',f:'jubin',sd:'emas',p:'Melaka',      t:'Singgahsana Sultan',  d:'Sultan Muzaffar Syah menilai kelayakan anda sebagai hulubalang.'},
 {h:5, ai:3,n:9,s:9,w:'bara',f:'marmar',sd:'bara',p:'Melaka',      t:'Asal Usul Kerajaan',  d:'Parameswara, pengasas Melaka. Papan terbesar, biji terbanyak.'},
 {h:1, ai:3,n:7,s:7,w:'bara',f:'kawung',sd:'delima',p:'Istana',      t:'Amuk Hang Jebat',     d:'Sahabat yang menjadi lawan. Setiap tikam membakar.'},
 {h:0, ai:3,n:9,s:9,w:'diraja',f:'langit',sd:'bintang',p:'Melaka',     t:'Takkan Melayu Hilang',d:'Hang Tuah, pendekar teragung. Ini ujian terakhir Kembara.'}
];
const MIS=[
 {id:'play', n:3, t:'Main {n} perlawanan',                 xp:80},
 {id:'win',  n:2, t:'Menang {n} perlawanan',               xp:130},
 {id:'cap',  n:6, t:'Tikam {n} kali',                      xp:110},
 {id:'chain',n:8, t:'Rantaian {n} lubang dalam satu langkah',xp:120},
 {id:'ko',   n:2, t:'KO lawan {n} kali semasa tikam',      xp:140},
 {id:'big',  n:12,t:'Rampas {n} biji dalam satu tikam',    xp:150},
 {id:'camp', n:1, t:'Tamatkan {n} peringkat Kembara',      xp:160},
 {id:'ai3',  n:1, t:'Menang {n} kali lawan komputer Susah',xp:170}
];
const BADGE=[
 {e:'🌱',n:'Anak Kampung',   d:'Main perlawanan pertama',       f:d=>d.g>=1},
 {e:'⚔️',n:'Hulubalang',     d:'Menang 10 perlawanan',          f:d=>d.w>=10},
 {e:'🗡️',n:'Penikam Handal', d:'Tikam 50 kali',                 f:d=>d.cap>=50},
 {e:'💥',n:'Rampasan Besar', d:'Rampas 15 biji dalam satu tikam',f:d=>d.best>=15},
 {e:'🔗',n:'Raja Rantai',    d:'Rantaian 12 lubang',            f:d=>d.chain>=12},
 {e:'👊',n:'Penumbuk Besi',  d:'KO lawan 15 kali',              f:d=>d.ko>=15},
 {e:'🔥',n:'Lima Berturut',  d:'Menang 5 kali berturut-turut',  f:d=>d.str>=5},
 {e:'🧭',n:'Perantau',       d:'Tamat 5 peringkat Kembara',     f:d=>d.camp>=5},
 {e:'🏆',n:'Juara Kembara',  d:'Tamat semua peringkat Kembara', f:d=>d.camp>=CAMP.length},
 {e:'👑',n:'Raja Congkak',   d:'Capai level 50',                f:d=>Prof.lvl()>=50}
];
const Quest={
  today(){const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()},
  hash(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0}return h},
  pick(){const h=this.hash(this.today()),a=MIS.map((m,i)=>i);const out=[];let x=h;
    for(let k=0;k<3&&a.length;k++){x=(Math.imul(x,1103515245)+12345)>>>0;out.push(a.splice(x%a.length,1)[0])}
    return out.sort((p,q)=>p-q)},
  roll(){const t=this.today();if(Prof.day.d!==t){Prof.day={d:t,p:[0,0,0],done:[0,0,0]};Prof.save()}
    this.ids=this.pick();this.mini()},
  list(){if(!this.ids)this.ids=this.pick();return this.ids.map((i,k)=>({m:MIS[i],k,p:Prof.day.p[k]|0,done:!!Prof.day.done[k]}))},
  bump(id,v=1,mode='max'){
    if(Prof.day.d!==this.today())this.roll();
    let ch=false;
    this.list().forEach(q=>{
      if(q.m.id!==id||q.done)return;
      const cur=Prof.day.p[q.k]|0,nv=mode==='max'?Math.max(cur,v):cur+v;
      if(nv===cur)return;Prof.day.p[q.k]=nv;ch=true;
      if(nv>=q.m.n){Prof.day.done[q.k]=1;Prof.d.xp+=q.m.xp;
        Toast.show(`✅ Misi selesai: ${q.m.t.replace('{n}',q.m.n)} · +${q.m.xp} XP`);Snd.chime()}
    });
    if(ch){Prof.save();this.mini();Prof.mini()}
  },
  badges(){return BADGE.map(b=>({b,got:!!b.f(Prof.d)}))},
  /* ---- kad misi di menu ---- */
  mini(){
    const e=document.getElementById('qm');if(!e)return;
    const L=this.list(),all=L.every(q=>q.done);
    e.innerHTML=`<b>📜 Misi Harian${all?' · siap!':''}</b>`+L.map(q=>{
      const p=Math.min(q.p,q.m.n);
      return`<div class="qr${q.done?' got':''}"><i>${q.done?'✅':'◻️'}</i><span>${esc(q.m.t.replace('{n}',q.m.n))}</span><u>${q.done?'+'+q.m.xp+' XP':p+'/'+q.m.n}</u></div>`
    }).join('');
  },
  /* ---- Kembara ---- */
  bak:null,
  stage(i){return CAMP[i]},
  restore(){if(this.bak==null)return;try{const o=JSON.parse(this.bak);for(const k of['wood','floor','seed','n','seeds','lvl','vs'])if(o[k]!==undefined)cfg[k]=o[k]}catch(e){}this.bak=null;fixCfg();saveCfg()},
  openCamp(){
    const o=document.getElementById('camp');if(!o)return;
    const done=Prof.d.camp|0;
    o.innerHTML=`<div class="panel camp"><h2>Kembara Nusantara</h2>
      <p class="hnote">Enam belas peringkat merentas Nusantara. Setiap kemenangan pertama membuka peringkat seterusnya dan memberi XP tambahan. Pahlawan anda dipilih dalam Persiapan.</p>
      <div class="cpick"><b>Pahlawan anda</b><div class="cps">${HEROES.map((h,j)=>{
        const lk=j>=NBASE&&false;return`<button class="cpb${cfg.p[0]===j?' sel':''}" data-chero="${j}" title="${esc(h.n)}"><img src="${IMGS[j]}" alt=""><span>${esc(h.n.split(' ').slice(-1)[0])}</span></button>`}).join('')}</div></div>
      <div class="cbar"><i style="width:${Math.round(done/CAMP.length*100)}%"></i></div>
      <small class="chint">${done} daripada ${CAMP.length} peringkat tamat</small>
      <div class="clist">${CAMP.map((c,i)=>{
        const lock=i>done,cur=i===done;
        return`<button class="cst${lock?' lock':''}${i<done?' got':''}${cur?' now':''}" data-camp="${i}"${lock?' disabled':''}>
          <span class="cno">${i<done?'✓':i+1}</span>
          <img src="${IMGS[c.h]}" alt="">
          <span class="cmain"><b>${esc(c.t)}</b><small>${esc(c.p)} · ${esc(HEROES[c.h].n)} · ${['','Mudah','Sederhana','Susah'][c.ai]} · ${c.n}×2 lubang</small><span class="cbd"><i>🪵 ${esc((WOODN.find(w=>w[0]===c.w)||['',c.w])[1])}</i><i>▦ ${esc((FLN.find(f=>f[0]===c.f)||['',c.f])[1])}</i><i>● ${esc((SEEDS.find(x=>x[0]===c.sd)||['',c.sd])[1])}</i></span>
          <em>${lock?'Tamatkan peringkat sebelum ini dahulu':esc(c.d)}</em></span>
          <span class="cxp">+${60+i*20}<small>XP</small></span></button>`}).join('')}</div>
      <div class="center"><button class="btn" data-h="closecamp">Tutup</button></div></div>`;
    o.hidden=false;o.scrollTop=0;
    const n=o.querySelector('.cst.now');if(n)n.scrollIntoView({block:'center'});
  },
  closeCamp(){const o=document.getElementById('camp');if(o)o.hidden=true},
  setHero(j){if(!HEROES[j])return;cfg.p[0]=j;saveCfg();const o=document.getElementById('camp');
    if(o&&!o.hidden){const t=o.querySelector('.clist')?o.querySelector('.clist').scrollTop:0;this.openCamp();const l=o.querySelector('.clist');if(l)l.scrollTop=t}},
  play(i){
    const c=CAMP[i];if(!c||i>(Prof.d.camp|0))return;
    if(this.bak==null)this.bak=JSON.stringify(cfg);
    /* papan, lantai dan biji peringkat ini dibuka tanpa mengira level — sebahagian daripada rasa melawan watak itu */
    Object.assign(cfg,{vs:'ai',lvl:c.ai,n:c.n,seeds:c.s,wood:c.w,floor:c.f,seed:c.sd});
    cfg.p=[HEROES[cfg.p[0]]?cfg.p[0]:0,c.h];
    if(cfg.p[0]===c.h)cfg.p[0]=c.h===0?1:0;
    this.closeCamp();Match._campNext=i;if(typeof Dock==='function')Dock();Match.start();
  },
  /* ---- selepas perlawanan ---- */
  done(res){
    const i=Match.camp;
    if(i==null)return'';
    Match.camp=null;
    if(res!=='win')return`<p class="hnote">Peringkat ${i+1} belum tamat. Cuba lagi!</p>`;
    Quest.bump('camp',1,'add');
    if(i===(Prof.d.camp|0)){
      const xp=60+i*20;Prof.d.camp=i+1;Prof.d.xp+=xp;Prof.save();
      const last=Prof.d.camp>=CAMP.length;
      return`<div class="cwin"><b>⚑ Peringkat ${i+1} tamat — ${esc(CAMP[i].t)}</b><span>+${xp} XP Kembara</span>${last?'<em>Seluruh Kembara Nusantara ditamatkan! 🏆</em>':`<em>Peringkat ${i+2} terbuka: ${esc(CAMP[i+1].t)}</em>`}</div>`;
    }
    return`<p class="hnote">Peringkat ${i+1} dimenangi semula.</p>`;
  },
  /* ---- lencana untuk skrin pangkat ---- */
  bdgHtml(){
    const B=this.badges(),g=B.filter(x=>x.got).length;
    return`<p class="hnote">${g} daripada ${B.length} lencana diperoleh.</p>
      <div class="bdg">${B.map(x=>`<div class="bd${x.got?' got':''}"><i>${x.got?x.b.e:'🔒'}</i><b>${esc(x.b.n)}</b><small>${esc(x.b.d)}</small></div>`).join('')}</div>`;
  },
  recHtml(){
    const B=this.badges(),g=B.filter(x=>x.got).length;
    return`<h3 class="pf-h">Rekod <small>${g}/${B.length} lencana</small></h3>
      <div class="pf-st rec"><div><small>Tikam</small><b>${Prof.d.cap|0}</b></div><div><small>KO</small><b>${Prof.d.ko|0}</b></div>
        <div><small>Rantaian terpanjang</small><b>${Prof.d.chain|0}</b></div><div><small>Rampasan terbesar</small><b>${Prof.d.best|0}</b></div>
        <div><small>Menang berturut</small><b>${Prof.d.str|0}</b></div><div><small>Kembara</small><b>${Prof.d.camp|0}/${CAMP.length}</b></div></div>
      <div class="bdg mini">${B.filter(x=>x.got).slice(-5).map(x=>`<div class="bd got"><i>${x.b.e}</i><b>${esc(x.b.n)}</b></div>`).join('')}</div>`;
  }
};
