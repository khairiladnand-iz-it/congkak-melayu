/* ===== KESAN & SKRIN ===== */
const Fx={pop(i,txt){const q=World.holeScreen(i),d=document.createElement('span');d.className='popup';d.textContent=txt;d.style.left=q.x+'px';d.style.top=q.y+'px';document.body.appendChild(d);setTimeout(()=>d.remove(),1000)}};
const Screen={cur:'menu',
  go(n){for(const x of['menu','setup','match'])document.getElementById(x).hidden=x!==n;document.body.dataset.screen=n;this.cur=n;World.setMode(n);
    Mus.set(n==='match'?((typeof Quest!=='undefined'&&Quest.bak!=null)?'kembara':'game'):'menu');MenuFx.set(n==='menu');
    if(typeof Lobi!=='undefined'&&Lobi.ready)Lobi.status(n==='match'?'main':'idle');
    if(n==='menu')document.getElementById('cont').hidden=!(Match.s&&!Match.s.over)}
};
/* ===== PERLAWANAN ===== */
const Match={
  s:null,view:null,marks:{},hov:-1,
  say(t){document.getElementById('msg').textContent=t},
  online:false,me:0,q:[],
  human(){if(this.online)return this.s.turn===this.me;return !(cfg.vs==='ai'&&this.s.turn===1)},
  owner(seat){return this.online?seat===this.me:seat===0},
  lvOf(seat){return this.online?Net.lv[seat]:(seat===0?Prof.lvl():0)},
  statBonus(seat){const L=this.lvOf(seat);return L>0?Prof.bonus(L):{atk:0,def:0,spd:0}},
  gem(seat){return this.owner(seat)?Prof.gemSel(this.lvOf(seat)):null},
  gems(seat){return this.owner(seat)?Prof.gemSlots(this.lvOf(seat)):[]},
  startOnline(me){
    this.online=true;this.me=me;this.q=[];this.capN=0;this.camp=null;this._campNext=null;const n=cfg.n,s=this.s={n,b:initView(),turn:0,busy:false,over:false,hist:[],pend:null,caps:[0,0]};
    this.view=s.b.slice();this.marks={};World.flip=me===1;document.getElementById('match').classList.toggle('flip',me===1);
    this.mount();Screen.go('match');this.say(`${HEROES[cfg.p[0]].n} mula dahulu.`);this.render();
    {const d=document.getElementById('dpost');if(d)d.hidden=!Msg.on}
    {const q=document.getElementById('dspd');if(q)q.textContent=['🐢','▶','⏩','⚡','🚀'][[1.6,1,.65,.4,.22].indexOf(cfg.speed)]||'▶'}
  },
  remote(i,b){this.q.push({i,b:Array.isArray(b)?b.slice():null});this.pump()},
  pump(){const s=this.s;if(!this.online||!s||s.busy||s.over||s.turn===this.me)return;
    while(this.q.length){const m=this.q.shift(),i=m.i,b=m.b;
      /* mesej boleh tercicir: papan dihantar bersama langkah, jadi kedudukan boleh pulih sendiri */
      if(b&&b.length===s.b.length&&b.join()!==s.b.join()){s.b=b.slice();this.view=b.slice();World.sync(this.view);this.render()}
      if(Rules.legal(s.b,s.n,s.turn).includes(i)){this.play(i);return}}},
  canSet(){const s=this.s;if(!s||s.busy||s.over||!this.human())return new Set();return new Set(Rules.legal(this.view,s.n,s.turn))},
  mount(){World.build(this.s.n,cfg.wood);World.setSeedType(cfg.seed);World.sync(this.view);
    try{document.body.classList.toggle('face',cfg.vs==='2'&&cfg.face!==false&&!this.online)}catch(e){}},
  start(){this.camp=this._campNext!=null?this._campNext:null;
    fixCfg();this.online=false;World.flip=false;document.getElementById('match').classList.remove('flip');const n=cfg.n,s=this.s={n,b:initView(),turn:0,busy:false,over:false,hist:[],pend:null,caps:[0,0]};
    this.view=s.b.slice();this.marks={};saveCfg();this.mount();Screen.go('match');
    {const d=document.getElementById('dpost');if(d)d.hidden=true;const q=document.getElementById('dspd');if(q)q.textContent=['🐢','▶','⏩','⚡','🚀'][[1.6,1,.65,.4,.22].indexOf(cfg.speed)]||'▶'}
    this.say(`${HEROES[cfg.p[0]].n} mula dahulu. Tekan lubang yang bercahaya.`);this.render();
  },
  resume(){this.view=this.s.b.slice();this.marks={};this.mount();Screen.go('match');this.render()},
  restyle(){if(this.s.busy)return false;this.mount();this.render();saveCfg();return true},
  card(p){const h=HEROES[cfg.p[p]],s=this.s,lab=this.online?(p===this.me?'Anda':'Lawan'):p===1&&cfg.vs==='ai'?`AI · ${LVL[cfg.lvl]}`:`Pemain ${p+1}`,lv=this.lvOf(p);
    return`<div class="em"><img src="${IMGS[cfg.p[p]]}" alt=""></div><div class="nm"><b>${esc(h.n)}${elBadge(cfg.p[p],1)}${lv>0?`<i class="lvb">Lv ${lv}</i>`:''}</b><small>${esc(h.t)} · ${lab}${s.turn===p&&!s.over?' · giliran':''}</small></div><div class="sc"><s>BIJI</s>${this.view[Rules.store(s.n,p)]}</div>`},
  mark(){World.setState(this.view,this.canSet(),this.marks)},
  render(){
    const s=this.s;this.mark();
    for(const p of[0,1]){const e=document.getElementById('c'+p);e.innerHTML=this.card(p);e.classList.toggle('act',s.turn===p&&!s.over)}
  },
  react(p,c){const e=document.getElementById('c'+p);if(!e)return;e.classList.add(c);setTimeout(()=>e.classList.remove(c),900)},
  showPath(i){
    const s=this.s,n=s.n,sz=2*n+2,opp=Rules.store(n,1-s.turn);let c=s.b[i],pos=i;const m={};
    while(c>0){pos=(pos+1)%sz;if(pos===opp)continue;m[pos]=c===1?'tgt':(m[pos]||'pth');c--}
    /* cincin 'tgt' hanya ditunjuk bila tikam benar-benar sah (sudah satu pusingan) */
    const r=Rules.resolve(s.b,n,s.turn,i),cp=r.ev.find(e=>e.t==='capture');
    for(const k in m)if(m[k]==='tgt')m[k]='pth';
    if(cp){m[cp.i]='tgt';m[cp.o]='tgt'}
    this.marks=m;this.mark();
  },
  hover(i){
    if(i===this.hov)return;this.hov=i;const s=this.s;if(!s||s.busy||s.over||s.pend!=null)return;
    if(this.canSet().has(i))this.showPath(i);else{this.marks={};this.mark()}
  },
  choose(i){
    const s=this.s;if(!s||!this.canSet().has(i))return;
    if(cfg.confirm==='2'&&s.pend!==i){s.pend=i;this.showPath(i);this.say('Tekan sekali lagi untuk mengesahkan langkah.');return}
    s.pend=null;if(this.online)Net.send({t:'mv',i,b:s.b.slice()});this.play(i);
  },
  async play(i){
    const s=this.s;if(s.busy||s.over)return;
    s.busy=true;s.pend=null;this.marks={};
    try{
      const p=s.turn,n=s.n,r=Rules.resolve(s.b,n,p,i),mine=Rules.store(n,p),sp=cfg.speed;this._ch=1;
      if(!(cfg.vs==='ai'&&p===1)){s.hist.push({b:s.b.slice(),turn:s.turn});if(s.hist.length>40)s.hist.shift()}
      const v=this.view=s.b.slice();
      for(const e of r.ev){
        if(e.t==='pick'){const nb=v[e.i];v[e.i]=0;this.render();Snd.sow(nb);Snd.drum('dung',.12);await World.pick(e.i,380*sp)}
        else if(e.t==='drop'){await World.drop(e.i,250*sp);v[e.i]++;this.render();Snd.knock(v[e.i]);if(e.i===mine)Fx.pop(mine,'+1');await sleep(40*sp)}
        else if(e.t==='chain'){this._ch=(this._ch||1)+1;v[e.i]=0;this.render();Snd.whoosh(.25);this.say('Berlari… ambil biji dan teruskan!');await World.pick(e.i,420*sp)}
        else if(e.t==='nocap'){Snd.block();Fx.pop(e.i,'✋');this.say('Belum satu pusingan — biji belum melepasi rumah ibu, jadi tikam tidak dikira.');await sleep(620*sp)}
        else if(e.t==='capture'){
          Snd.tikam(e.gain);Haptic.cap();World.slomo(2.1,520);s.caps[p]++;this.capN=(this.capN||0)+1;
          if(this.owner(p)){Prof.d.cap=(Prof.d.cap|0)+1;if(e.gain>(Prof.d.best|0))Prof.d.best=e.gain;Quest.bump('cap',1,'add');Quest.bump('big',e.gain,'max')}
          /* mod mesej: peranti yang menyerang menentukan mata, peranti lawan hanya menayang semula */
          const mine2=Rules.store(n,1-p);
          const fx=Msg.on?(this.owner(p)?null:Msg.pullDuel()):null;
          const dz=await Duel.run(p,e.gain,fx)||{a:0,d:0,ko:false};
          const bonus=dz.a|0,dbon=dz.d|0;Snd.gong(110,.3);
          if(Msg.on&&this.owner(p))Msg.pushDuel(dz);
          if(dz.ko&&this.owner(p)){Prof.d.ko=(Prof.d.ko|0)+1;Quest.bump('ko',1,'add')}
          v[mine]+=e.gain+bonus;v[e.o]=0;v[e.i]=0;if(dbon)v[mine2]+=dbon;this.render();
          await World.capture(e.i,e.o,mine,700*sp);if(bonus)await World.bonus(mine,bonus,500*sp);
          if(dbon)await World.bonus(mine2,dbon,460*sp);
          Fx.pop(mine,'+'+(e.gain+bonus));if(dbon)Fx.pop(mine2,'+'+dbon);this.react(p,'cheer');this.react(1-p,dbon?'cheer':'ouch');
          this.say(`${HEROES[cfg.p[p]].n} menikam dan merampas ${e.gain+bonus} biji${bonus?` (+${bonus} bonus tikam)`:''}${dbon?` · ${HEROES[cfg.p[1-p]].n} dapat +${dbon} kerana menangkis`:''}!`);await sleep(500*sp);
        }
      }
      s.b=v.slice();
      if(Rules.over(s.b,n)){await this.finish();return}
      if(r.extra)Snd.chime();if(r.extra)this.say(`${HEROES[cfg.p[p]].n} dapat main sekali lagi!`);else{s.turn=1-p;this.say(`Giliran ${HEROES[cfg.p[s.turn]].n}.`)}
      if(this.owner(p)&&(this._ch|0)>(Prof.d.chain|0)){Prof.d.chain=this._ch|0;Quest.bump('chain',this._ch|0,'max')}
      s.busy=false;this.render();this.aiTurn();this.pump();
      if(Msg.on&&!s.over&&s.turn!==Msg.me)Msg.turnDone();
    }catch(err){
      console.error(err);Toast.show('Ralat semasa langkah: '+err.message);
      s.busy=false;this.view=s.b.slice();World.sync(this.view);this.render();
    }
  },
  async aiTurn(){
    const s=this.s;if(cfg.vs!=='ai'||s.turn!==1||s.over||s.busy)return;
    s.busy=true;this.say(`${HEROES[cfg.p[1]].n} (AI) sedang berfikir…`);this.render();await sleep(900);
    if(this.s!==s)return;
    const m=AI.pick(s.b,s.n,1,cfg.lvl);s.busy=false;if(m>=0)this.play(m);
  },
  hint(){
    const s=this.s;if(!s||s.busy||s.over||!this.human()||this.online){if(this.online)this.say('Petunjuk tidak tersedia dalam talian.');return}
    const h=AI.hint(s.b,s.n,s.turn);if(!h)return;
    this.marks={[h.i]:'hint'};this.mark();setTimeout(()=>{if(this.marks[h.i]==='hint'){this.marks={};this.mark()}},3500);
    this.say(`💡 Cuba lubang ${(s.turn?2*s.n-h.i:h.i)+1}: ${h.cap?`tikam ${h.cap} biji!`:h.extra?'main sekali lagi!':'langkah paling seimbang.'}`);Snd.chime();
  },
  undo(){
    const s=this.s;if(!s||s.busy||s.over)return;
    if(this.online){this.say('Undur tidak tersedia dalam talian.');return}
    if(!s.hist.length){this.say('Tiada langkah untuk diundur.');return}
    const h=s.hist.pop();s.b=h.b;s.turn=h.turn;s.pend=null;this.marks={};this.view=s.b.slice();World.sync(this.view);this.say('↶ Langkah diundur.');Snd.tone(420,.1);this.render();
  },
  async finish(){
    Msg.hide();const s=this.s;this.say('Permainan tamat. Mengira biji…');await World.sweep(s.n,800*cfg.speed);
    s.b=Rules.sweep(s.b,s.n);this.view=s.b.slice();s.over=true;s.busy=false;this.render();
    const a=s.b[s.n],c=s.b[2*s.n+1],w=Rules.winner(s.b,s.n);
    {const ow0=this.online?this.me:0;
     if(w===ow0){Snd.fanfare();Mus.set('win')}else if(w<0){Snd.chime();Mus.set('menu')}else{Snd.lose();Mus.set('menu')}}
    const hw=w<0?null:HEROES[cfg.p[w]];
    const body=w<0?`<h2>Seri!</h2><p class="winn">${a} – ${c}</p>`:`<h2>PEMENANG</h2><div class="pic"><img src="${IMGS[cfg.p[w]]}" alt=""></div><h2>${esc(hw.n)}${cfg.vs==='ai'&&w===1?' (AI)':''}</h2><p class="winn">${a} lawan ${c}</p><p><i>“${esc(hw.l)}”</i></p>`;
    const ow=this.online?this.me:0,res=w<0?'draw':w===ow?'win':'lose';
    if(res==='win')Haptic.win();
    if(typeof Harian!=='undefined'&&Harian.on){
      Harian.tamat(a,this.capN|0,Prof.d.chain|0);
    }
    Quest.bump('play',1,'add');
    if(res==='win'){Quest.bump('win',1,'add');if(cfg.vs==='ai'&&cfg.lvl===3&&!this.online)Quest.bump('ai3',1,'add');
      Prof.d.cur=(Prof.d.cur|0)+1;if(Prof.d.cur>(Prof.d.str|0))Prof.d.str=Prof.d.cur}
    else if(res==='lose')Prof.d.cur=0;
    const campHtml=Quest.done(res);
    const aw=Prof.award({res,caps:s.caps[ow],mult:this.online?1.3:cfg.vs==='ai'?[0,.6,1,1.6][cfg.lvl]:.5});
    const r=document.getElementById('result');
    r.innerHTML=`<div class="panel">${body}${campHtml}<div class="xpbox"><small>${res==='win'?'Anda menang!':res==='draw'?'Seri':'Anda tewas'}</small>${Prof.resultHtml(aw)}</div><div class="center"><button class="btn" data-r="again">Main Semula</button></div>${this.online?'':'<button class="btn sm" data-r="set">Tukar Tetapan</button> '}<button class="btn sm" data-r="menu">Menu Utama</button></div>`;
    if(aw.up.some(g=>g.gem))setTimeout(()=>Snd.fanfare(),900);
    r.hidden=false;
  }
};
