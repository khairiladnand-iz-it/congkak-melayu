/* ===== PERSIAPAN ===== */
const Setup={tab:'mod',
  TABS:[['mod','Mod'],['hero','Pahlawan'],['board','Papan & Biji'],['more','Lain-lain']],
  chips(k,label,opts,cur){const L=Prof.lvl(),lk=k==='wood'||k==='seed'||k==='floor'?(v=>(k==='wood'?Prof.okWood(v,L):k==='floor'?Prof.okFloor(v,L):Prof.okSeed(v,L))?0:Prof.lvOf(k,v)):()=>0;return`<div class="row"><h3>${label}</h3><div class="chips">${opts.map(([v,t])=>{const nd=lk(v);return`<button class="chip${String(cur)===String(v)?' on':''}${nd?' lock':''}" data-k="${k}" data-v="${v}"${nd?` data-need="${nd}"`:''}>${nd?'🔒 ':''}${t}${nd?' · Lv'+nd:''}</button>`}).join('')}</div></div>`},
  stat:(l,v)=>`<div class="st"><span>${l}</span><i style="--v:${v*20}%"></i></div>`,
  hero(j){const a=HEROES[j];return`<div class="hc"><img src="${IMGS[j]}" alt=""><div><b>${esc(a.n)} ${elBadge(j)}</b><small>${esc(a.t)}</small>${this.stat('Kuasa',a.atk)}${this.stat('Tahan',a.def)}${this.stat('Laju',a.spd)}<em>✨ ${esc(a.sk[0].n)}<br>💥 ${esc(a.sk[1].n)}</em>${a.custom?'':`<button class="chip" data-a="hist" data-v="${j}">📜 Sejarah</button>`}</div></div>`},
  avs(k,i){return`<div class="chips">${HEROES.map((a,j)=>`<button class="av${cfg.p[i]===j?' on':''}" data-k="${k}" data-v="${j}"><img src="${IMGS[j]}" alt=""><u class="elc" style="--ec:${ELEM[elOf(j)].c}">${ELEM[elOf(j)].e}</u>${esc(a.n)}</button>`).join('')}</div>`},
  panel(){
    const ai=cfg.vs==='ai';
    switch(this.tab){
      case 'mod':return this.chips('vs','Mod permainan',[['ai','Lawan Komputer'],['2','Dua Pemain']],cfg.vs)+(ai?this.chips('lvl','Tahap komputer',[[1,'Mudah'],[2,'Sederhana'],[3,'Hebat']],cfg.lvl):'')+this.chips('speed','Kelajuan permainan',[[1.6,'🐢 Perlahan'],[1,'Biasa'],[.65,'⏩ Pantas'],[.4,'⚡ Sangat Pantas'],[.22,'🚀 Kilat']],cfg.speed)+(cfg.vs==='2'?this.chips('face','Dua pemain satu telefon',[[true,'↕ Bersemuka — kawalan lawan di atas'],[false,'Sebelah-menyebelah']],cfg.face):'')+this.chips('vibe','Getaran telefon',[[true,'Hidup'],[false,'Mati']],cfg.vibe)+this.chips('fight','Pertarungan tikam',[['live','Interaktif (bonus KO +2)'],['auto','Animasi auto'],['skip','Langkau']],cfg.fight);
      case 'hero':return`<div class="row"><h3>Elemen pahlawan</h3><p class="hnote">Setiap pahlawan ada elemen. Semasa tikam, elemen yang mengatasi lawan menambah kuasa serangan 38%; yang diatasi kehilangan 26% dan tangkisan lawan jadi lebih kuat.</p><div class="eltab">${ELK.map(k=>{const E=ELEM[k];return`<i style="--ec:${E.c}">${E.e} <b>${E.n}</b> mengatasi <b>${ELEM[E.beats].n}</b><br><small>${esc(E.t)}</small></i>`}).join('')}</div></div><div class="row"><button class="btn sm" data-a="avnew">＋ Avatar Sendiri (muat naik gambar)</button></div><div class="row"><h3>Pemain 1</h3>${this.avs('p0',0)}${this.hero(cfg.p[0])}</div><div class="row"><h3>${ai?'Lawan komputer':'Pemain 2'}</h3>${this.avs('p1',1)}${this.hero(cfg.p[1])}</div>`;
      case 'board':return this.chips('wood','Jenis kayu',WOODN,cfg.wood)+this.chips('floor','Corak lantai',FLN,cfg.floor)+this.chips('n','Bilangan lubang',[[5,'5'],[6,'6'],[7,'7 (Klasik)'],[8,'8'],[9,'9']],cfg.n)+this.chips('seed','Jenis biji',SEEDS,cfg.seed)+this.chips('seeds','Biji setiap lubang',[[3,'3'],[5,'5'],[7,'7']],cfg.seeds);
      default:return this.chips('fight','Pertarungan tikam',[['live','Interaktif (bonus KO +2)'],['auto','Animasi auto'],['skip','Langkau']],cfg.fight)+this.chips('speed','Kelajuan permainan',[[1.6,'🐢 Perlahan'],[1,'Biasa'],[.65,'⏩ Pantas'],[.4,'⚡ Sangat Pantas'],[.22,'🚀 Kilat']],cfg.speed)+this.chips('confirm','Sahkan langkah',[['auto','Terus main'],['2','Sentuh dua kali']],cfg.confirm);
    }
  },
  preview(){const v=initView();World.build(cfg.n,cfg.wood);World.setSeedType(cfg.seed);World.sync(v);World.setState(v,new Set(),{})},
  render(tab){
    if(tab)this.tab=tab;fixCfg();saveCfg();Screen.go('setup');this.preview();
    document.getElementById('setup').innerHTML=`<div class="sbar"><button class="chip back" data-a="menu">‹ Menu</button><h2>PERSIAPAN</h2></div><div class="pvh"><div class="pvp"><img src="${IMGS[cfg.p[0]]}" alt=""><b>${esc(HEROES[cfg.p[0]].n)}</b></div><div class="vs">VS</div><div class="pvp"><img src="${IMGS[cfg.p[1]]}" alt=""><b>${esc(HEROES[cfg.p[1]].n)}${cfg.vs==='ai'?' (AI)':''}</b></div></div><div class="tabs">${this.TABS.map(([v,t])=>`<button class="tab${this.tab===v?' on':''}" data-tab="${v}">${t}</button>`).join('')}</div>${this.panel()}<div class="center"><button class="btn" data-a="go">▶ MULA MAIN</button></div>`;
  },
  click(e){
    const g=e.target.closest('[data-a],[data-tab],[data-k]');if(!g)return;
    if(g.dataset.a==='go')return Match.start();
    if(g.dataset.a==='menu')return Screen.go('menu');
    if(g.dataset.a==='hist')return Hist.open(+g.dataset.v);
    if(g.dataset.a==='avnew')return Av.open();
    if(g.dataset.tab){this.tab=g.dataset.tab;Snd.tone(520);return this.render()}
    if(g.dataset.need){Snd.tone(200,.15,'square',.05);return Toast.show('Dibuka pada level '+g.dataset.need+'. Menang perlawanan untuk naik level!')}
    const k=g.dataset.k,v=g.dataset.v;
    if(k==='p0'||k==='p1'){const i=+k[1],o=1-i;cfg.p[i]=+v;if(cfg.p[o]===+v)cfg.p[o]=(+v+1)%HEROES.length}
    else if(k==='vibe'){cfg.vibe=v==='true';if(cfg.vibe)Haptic.hit()}
    else if(k==='face')cfg.face=v==='true';
    else cfg[k]=['n','seeds','lvl','speed'].includes(k)?+v:v;
    Snd.tone(520);this.render();
  }
};
/* ===== PEMASANGAN ===== */
function wire(){
  const opt=(id,list,cur)=>{document.getElementById(id).innerHTML=list.map(([v,t])=>`<option value="${v}"${v===cur?' selected':''}>${t}</option>`).join('')};
  const dock=()=>{const L=Prof.lvl();opt('dWood',WOODN.filter(w=>Prof.okWood(w[0],L)||w[0]===cfg.wood),cfg.wood);opt('dSeed',SEEDS.filter(w=>Prof.okSeed(w[0],L)||w[0]===cfg.seed),cfg.seed)};
  document.getElementById('menu').addEventListener('click',e=>{
    const b=e.target.closest('[data-go]');if(!b)return;Snd.tone(500);const g=b.dataset.go;
    if(g!=='camp')Match._campNext=null;
    if(g==='cont'){dock();Match.resume()}
    else if(g==='play'){cfg.vs='ai';dock();Match.start()}
    else if(g==='ai'){cfg.vs='ai';Setup.render('mod')}
    else if(g==='two'){cfg.vs='2';Setup.render('mod')}
    else if(g==='hero')Setup.render('hero');else if(g==='board')Setup.render('board');else if(g==='set')Setup.render('more');
    else if(g==='help')document.getElementById('help').hidden=false;
    else if(g==='camp')Quest.openCamp();
    else if(g==='hist')Hist.open(-1);
    else if(g==='prof')Prof.open();
    else if(g==='net')Net.show();
    else if(g==='hari')Harian.open();
    else if(g==='lobi'){try{localStorage.setItem('cm15lobi','1')}catch(x){}Lobi.open()}
    else if(g==='mus'){cfg.music=!cfg.music;saveCfg();Mus.sync();b.textContent=cfg.music?'🎵 Muzik':'🔇 Muzik'}
    else if(g==='full')Scr.toggle();
    else if(g==='snd'){cfg.mute=!cfg.mute;Snd.mute=cfg.mute;saveCfg();Mus.sync();b.textContent=cfg.mute?'🔇 Bunyi':'🔊 Bunyi'}
  });
  document.getElementById('setup').addEventListener('click',e=>{Setup.click(e);dock()});
  document.getElementById('hist').addEventListener('click',e=>{if(e.target.dataset&&e.target.dataset.h==='close'||e.target.id==='hist')Hist.close()});
  document.addEventListener('pointerdown',()=>Mus.sync(),{once:false,passive:true});
  document.addEventListener('visibilitychange',()=>{const c=Mus.ctx;if(!c)return;document.hidden?c.suspend():c.resume()});
  document.getElementById('net').addEventListener('click',e=>Net.click(e));
  document.getElementById('lobi').addEventListener('click',e=>Lobi.click(e));
  document.getElementById('hari').addEventListener('click',e=>Harian.click(e));
  document.getElementById('lobi').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='lbni'){e.preventDefault();Lobi.saveNick()}});
  document.getElementById('prof').addEventListener('click',e=>{const t=e.target;if(t.dataset&&t.dataset.h==='closeprof'||t.id==='prof')return Prof.close();const pb=t.closest&&t.closest('[data-ptab]');if(pb){Prof.tab=pb.dataset.ptab;Prof.open();return}
    if(t.dataset&&t.dataset.h==='cloudon')return void Prof.cloudOn();
    if(t.dataset&&t.dataset.h==='cloudoff')return Prof.cloudOff();const sb=t.closest&&t.closest('[data-slot]');if(sb&&!sb.disabled){Prof.slot=+sb.dataset.slot;Snd.tone(520);Prof.open();return}
    const gb=t.closest&&t.closest('[data-gem]');if(gb&&!gb.disabled){Prof.pickGem(+gb.dataset.gem);Snd.chime()}});
  document.getElementById('pm').onclick=()=>Prof.open();
  document.getElementById('post').addEventListener('click',e=>Msg.click(e));
  document.getElementById('net').addEventListener('input',e=>{
    if(e.target.id==='rmin'){const v=Rm.clean(e.target.value);e.target.value=v.toUpperCase();if(v.length===5&&!Net.busy)Net.roomJoin(v)}
  });
  document.getElementById('post').addEventListener('input',e=>{if(e.target.id==='pin')Msg.check(e.target.value)});
  document.getElementById('helpOk').onclick=()=>{document.getElementById('help').hidden=true};
  World.onTap=i=>{if(Screen.cur==='match')Match.choose(i)};
  World.onHover=i=>{if(Screen.cur==='match')Match.hover(i)};
  document.getElementById('dock').addEventListener('click',e=>{
    const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;
    if(a==='menu'){if(Match.online){Net.leave()}else if(!Match.s.busy)Screen.go('menu')}else if(a==='hint')Match.hint();else if(a==='undo')Match.undo();
    else if(a==='spd'){const L=[1.6,1,.65,.4,.22],i=(L.indexOf(cfg.speed)+1)%L.length;cfg.speed=L[i];saveCfg();
      b.textContent=['🐢','▶','⏩','⚡','🚀'][i];Toast.show('Kelajuan: '+['Perlahan','Biasa','Pantas','Sangat Pantas','Kilat'][i])}
    else if(a==='full')Scr.toggle();
    else if(a==='post')Msg.show();
    else if(a==='help')document.getElementById('help').hidden=false;
    else if(a==='snd'){cfg.mute=!cfg.mute;Snd.mute=cfg.mute;saveCfg();Mus.sync();b.textContent=cfg.mute?'🔇':'🔊'}
    else if(a==='mus'){cfg.music=!cfg.music;saveCfg();Mus.sync();b.textContent=cfg.music?'🎵':'🔇'}
  });
  document.getElementById('dWood').addEventListener('change',e=>{const old=cfg.wood;cfg.wood=e.target.value;if(!Match.restyle()){cfg.wood=old;e.target.value=old}});
  document.getElementById('dSeed').addEventListener('change',e=>{cfg.seed=e.target.value;World.setSeedType(cfg.seed);saveCfg()});
  document.getElementById('result').addEventListener('click',e=>{
    const r=e.target.dataset&&e.target.dataset.r;if(!r)return;document.getElementById('result').hidden=true;
    if(Msg.on){if(r==='again'){Net.restore();Msg.end();Net.tx='';Net.open=false;Screen.go('menu');Net.show()}else{Net.restore();Msg.end();Net.tx='';Net.open=false;Screen.go('menu')}return}
    if(Match.online){if(r==='again')Net.again();else{Net.leave()}return}
    if(r==='again')Match.start();else if(r==='set')Setup.render('mod');else Screen.go('menu');
  });
  document.addEventListener('keydown',e=>{
    if(Screen.cur!=='match'||!Match.s)return;
    for(const id of['duel','result','help','aved','net','prof','hist'])if(!document.getElementById(id).hidden)return;
    if(/INPUT|SELECT|TEXTAREA/.test((e.target&&e.target.tagName)||''))return;
    const s=Match.s,k=e.key;
    if(/^[1-9]$/.test(k)){const j=+k-1;if(j<s.n)Match.choose((Match.online?Match.me:s.turn)===0?j:2*s.n-j)}
    else if(k==='h'||k==='H')Match.hint();else if(k==='u'||k==='U')Match.undo();
  });
  dock();
}
function init(){
  try{MenuFx.init()}catch(e){console.error(e)}
  try{Istana.init()}catch(e){console.error(e)}
  try{Scr.init()}catch(e){console.error(e)}
  Av.init();Prof.load();loadCfg();Prof.mini();Quest.roll();Prof.autoSync();Lobi.auto();
  document.getElementById('camp').addEventListener('click',e=>{const t=e.target;
    if(t.id==='camp'||(t.dataset&&t.dataset.h==='closecamp'))return Quest.closeCamp();
    const hb=t.closest&&t.closest('[data-chero]');if(hb)return Quest.setHero(+hb.dataset.chero);
    const c=t.closest&&t.closest('[data-camp]');if(c&&!c.disabled)Quest.play(+c.dataset.camp)});
  try{World.init()}catch(e){Toast.show('Paparan 3D tidak dapat dimulakan: '+e.message);console.error(e)}
  wire();document.getElementById('snd').textContent=cfg.mute?'🔇 Bunyi':'🔊 Bunyi';document.getElementById('mus').textContent=cfg.music?'🎵 Muzik':'🔇 Muzik';document.getElementById('dmus').textContent=cfg.music?'🎵':'🔇';
  const v=initView();World.build(cfg.n,cfg.wood);World.setSeedType(cfg.seed);World.sync(v);World.setState(v,new Set(),{});
  Screen.go('menu');
}
try{init()}catch(err){Toast.show('Gagal mula: '+err.message);console.error(err)}
