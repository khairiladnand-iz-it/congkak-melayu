/* ===== PAPARAN RALAT (supaya ralat tak senyap) ===== */
const Toast={t:0,show(m){try{const e=document.getElementById('toast');e.textContent=m;e.hidden=false;clearTimeout(this.t);this.t=setTimeout(()=>{e.hidden=true},7000)}catch(x){}}};
addEventListener('error',e=>Toast.show('Ralat: '+(e.message||'tidak diketahui')+(e.lineno?' (baris '+e.lineno+')':'')));
addEventListener('unhandledrejection',e=>Toast.show('Ralat: '+((e.reason&&e.reason.message)||e.reason)));

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const LVL=['','Mudah','Sederhana','Hebat'];

/* ===== DATA ===== */
const SK=(n,k,e,c,big=0)=>({n,k,e,c,big});
/* ===== ELEMEN: api > tanah > air > api ===== */
const ELEM={
  api:{n:'Api',e:'🔥',c:'#ff6a2a',beats:'tanah',t:'Membakar Tanah'},
  air:{n:'Air',e:'💧',c:'#3fb6ff',beats:'api',t:'Memadam Api'},
  tanah:{n:'Tanah',e:'🌿',c:'#8bd45a',beats:'air',t:'Menyerap Air'}
};
const ELK=['api','air','tanah'];
/* 1 = a mengatasi d, -1 = a diatasi d, 0 = seri */
function elAdv(a,d){if(!ELEM[a]||!ELEM[d])return 0;return ELEM[a].beats===d?1:ELEM[d].beats===a?-1:0}
function elOf(i){const h=HEROES[i];return h&&ELEM[h.el]?h.el:'tanah'}
function elBadge(i,sm){const k=elOf(i),E=ELEM[k];return`<em class="elb${sm?' sm':''}" style="--ec:${E.c}">${E.e}<span>${E.n}</span></em>`}
const HEROES=[
 {n:'Hang Tuah',el:'tanah',t:'Laksamana Melaka',atk:4,def:4,spd:4,l:'Takkan Melayu hilang di dunia!',sk:[SK('Keris Taming Sari','multi','🗡️','#f2c14e'),SK('Tikam Seribu Bayang','x','🗡️','#f2c14e',1)]},
 {n:'Hang Jebat',el:'api',t:'Pendekar Amuk',atk:5,def:2,spd:5,l:'Rasakan amukan aku!',sk:[SK('Amuk Jebat','x','⚔️','#ff4a3a'),SK('Amuk Berdarah','aura','🔥','#ff2a2a',1)]},
 {n:'Hang Lekiu',el:'air',t:'Pemanah Setia',atk:3,def:2,spd:5,l:'Panahan ku tak pernah tersasar!',sk:[SK('Panah Seribu','rain','🏹','#7affc8'),SK('Hujan Panah Api','rain','🔥','#ff9a3a',1)]},
 {n:'Sultan Muzaffar Syah',el:'tanah',t:'Sultan Agung Melaka',atk:4,def:5,spd:2,l:'Titah beta tiada yang menolak!',sk:[SK('Titah Menggegar','rings','👑','#ffd45a'),SK('Murka Diraja','stamp','MURKA','#ffb020',1)]},
 {n:'Laksamana Hang Nadim',el:'air',t:'Laksamana Lautan',atk:4,def:3,spd:4,l:'Ombak pun tunduk pada kami!',sk:[SK('Tombak Lautan','multi','🔱','#6ac8ff'),SK('Ombak Perkasa','wave','🌊','#3a9aff',1)]},
 {n:'Parameswara',el:'api',t:'Pengasas Melaka',atk:4,def:3,spd:3,l:'Melaka bermula dari sini!',sk:[SK('Panji Parameswara','multi','🚩','#ff8a2a'),SK('Harimau Melaka','stomp','🐅','#ff9a3a',1)]},
 {n:'Puteri Hang Li Po',el:'air',t:'Puteri Utusan China',atk:3,def:3,spd:4,l:'Anggun, tapi tajam!',sk:[SK('Tarian Teratai','petals','🌸','#ff9ac8'),SK('Teratai Kembang','rings','🌸','#ff7ab8',1)]},
 {n:'Sultan Abu Syahid',el:'tanah',t:'Sultan Perkasa',atk:3,def:5,spd:3,l:'Takhta ini tidak akan tumbang!',sk:[SK('Perisai Diraja','rings','🛡️','#6ab0ff'),SK('Benteng Emas','stomp','🛡️','#ffd45a',1)]},
 {n:'Tun Sri Lanang',el:'air',t:'Bendahara Pujangga',atk:2,def:3,spd:3,l:'Sejarah menyebelahi kami!',sk:[SK('Tinta Bertuah','ink','✒️','#8a6aff'),SK('Hikayat Maut','stamp','HIKAYAT','#b08aff',1)]},
 {n:'Yamtuan Muda',el:'tanah',t:'Penasihat Diraja',atk:2,def:4,spd:3,l:'Bijak mengatasi segalanya!',sk:[SK('Gulungan Titah','stamp','TITAH','#ffd45a'),SK('Bijaksana','rings','📜','#fff0b0',1)]}
];
const IMGS=ASSET.box.slice();
const SEEDS=[['saga','Biji Saga'],['getah','Biji Getah'],['batu','Batu Sungai'],['kulit','Cangkerang'],['manik','Manik Kaca'],['emas','Emas'],['perak','Perak'],['planet','Planet'],['glow','Glow Neon']];
const BOARDS=ASSET.photo.map((P,j)=>({id:'p'+j,name:P.name,kind:'photo',n:P.n,P})).concat([{id:'klasik',name:'Klasik Kayu',kind:'css'}]);
const KD={multi:['🗡️','#f2c14e','Hujan Senjata'],x:['⚔️','#ff5a5a','Tetakan Silang'],rain:['🏹','#7affc8','Hujan Panah'],rings:['👑','#ffd45a','Gelombang Diraja'],stamp:['TITAH','#ffd45a','Cop Titah'],stomp:['🐘','#c8a070','Hentakan Berat'],petals:['🌸','#ff9ac8','Kelopak Berputar'],ink:['✒️','#8a6aff','Percikan Tinta'],aura:['👊','#e8f0ff','Aura Silat'],wave:['🔱','#6ac8ff','Ombak Besar']};

/* ===== TETAPAN ===== */
const DEF={board:'p0',n:7,seeds:7,seed:'saga',p:[0,1],vs:'ai',lvl:2,fight:'live',speed:1,confirm:'auto',mute:false};
const cfg=JSON.parse(JSON.stringify(DEF));
const boardDef=()=>BOARDS.find(b=>b.id===cfg.board)||BOARDS[0];
function fixCfg(){
  if(!BOARDS.some(b=>b.id===cfg.board))cfg.board=DEF.board;
  const B=boardDef();if(B.kind==='photo')cfg.n=B.n;
  if(![5,6,7,8,9].includes(cfg.n))cfg.n=7;
  if(![3,5,7].includes(cfg.seeds))cfg.seeds=7;
  if(!SEEDS.some(s=>s[0]===cfg.seed))cfg.seed='saga';
  if(!Array.isArray(cfg.p)||!HEROES[cfg.p[0]])cfg.p=[0,1];
  if(!HEROES[cfg.p[1]]||cfg.p[1]===cfg.p[0])cfg.p[1]=cfg.p[0]===0?1:0;
  if(![1,2,3].includes(cfg.lvl))cfg.lvl=2;
  if(!['live','auto','skip'].includes(cfg.fight))cfg.fight='live';
  if(![.6,1,1.5].includes(cfg.speed))cfg.speed=1;
  if(!['auto','2'].includes(cfg.confirm))cfg.confirm='auto';
  if(cfg.vs!=='2')cfg.vs='ai';
  cfg.mute=!!cfg.mute;Snd.mute=cfg.mute;
}
function loadCfg(){try{const o=JSON.parse(localStorage.getItem('cm13')||'null');if(o)for(const k in DEF)if(o[k]!==undefined)cfg[k]=o[k]}catch(e){}fixCfg()}
function saveCfg(){try{localStorage.setItem('cm13',JSON.stringify(cfg))}catch(e){}}

/* ===== BUNYI ===== */
const Snd={ctx:null,mute:false,
  tone(f,d=.09,t='sine',v=.05){if(this.mute)return;try{const C=window.AudioContext||window.webkitAudioContext;this.ctx=this.ctx||new C();const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=t;o.frequency.value=f;g.gain.value=v;o.connect(g);g.connect(this.ctx.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,this.ctx.currentTime+d);o.stop(this.ctx.currentTime+d)}catch(e){}},
  knock(){if(this.mute)return;try{const C=window.AudioContext||window.webkitAudioContext;this.ctx=this.ctx||new C();const o=this.ctx.createOscillator(),g=this.ctx.createGain(),f=this.ctx.createBiquadFilter();o.type='triangle';o.frequency.value=380+Math.random()*180;f.type='bandpass';f.frequency.value=900;g.gain.value=.1;o.connect(f);f.connect(g);g.connect(this.ctx.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,this.ctx.currentTime+.07);o.stop(this.ctx.currentTime+.08)}catch(e){}}
};

/* ===== BIJI ===== */
const rnd=k=>{const x=Math.sin(k*91.7+7.3)*43758.5453;return x-Math.floor(x)};
function pile(c,max=14,rx=32,ry=30){let h='';const m=Math.min(c,max);for(let k=0;k<m;k++){const r=Math.sqrt((k+.5)/Math.max(m,5)),a=k*2.4+rnd(k)*.6;h+=`<i class="sd" style="left:${(50+rx*r*Math.cos(a)).toFixed(1)}%;top:${(50+ry*r*Math.sin(a)).toFixed(1)}%;--r:${Math.round(rnd(k+11)*360)}deg;--s:${(.9+rnd(k+3)*.22).toFixed(2)}"></i>`}return h}

/* ===== PAPARAN PAPAN (satu komponen untuk semua papan) ===== */
class BoardView{
  constructor(B,n,inter){
    this.n=n;this.inter=!!inter;this.h={};this.strip=null;
    const L=BoardView.layout(B,n),el=document.createElement('div');
    el.className='board '+(B.kind==='photo'?'photo':'css');
    el.style.aspectRatio=L.ar[0]+' / '+L.ar[1];
    if(L.u)el.style.setProperty('--u','calc(var(--W)*'+L.u+')');
    if(L.img){const im=document.createElement('img');im.src=L.img;im.alt='';el.appendChild(im)}
    for(const o of L.holes)el.appendChild(this.mk(o,false));
    this.el=el;
    if(L.bowls.length){const s=document.createElement('div');s.className='strip';for(const o of L.bowls)s.appendChild(this.mk(o,true));this.strip=s}
  }
  mk(o,bowl){
    const b=document.createElement('button');b.type='button';b.className='hole'+(o.ibu||bowl?' ibu':'');b.dataset.i=o.i;
    if(!bowl){b.style.left=o.x+'%';b.style.top=o.y+'%';b.style.width=o.w+'%';b.style.height=o.h+'%';b.style.setProperty('--fs',o.f)}
    const pl=document.createElement('span');pl.className='pile';const nb=document.createElement('b');
    b.appendChild(pl);b.appendChild(nb);this.h[o.i]={el:b,pile:pl,b:nb};return b;
  }
  static layout(B,n){
    const mk=(i,a,ibu)=>({i,x:a[0],y:a[1],w:a[2],h:a[3],f:a[4],ibu});
    if(B.kind==='photo'){
      const P=B.P,holes=[],bowls=[];
      for(let k=0;k<n;k++){holes.push(mk(k,P.r1[k]),mk(2*n-k,P.r2[k]))}
      if(P.iR)holes.push(mk(n,P.iR,true));
      if(P.iL)holes.push(mk(2*n+1,P.iL,true));
      if(!P.iL)bowls.push({i:2*n+1},{i:n});
      return{ar:P.ar,img:P.img,holes,bowls};
    }
    const pad=.95,iw=1.5,ih=2.4,g=.16,W=2*pad+2*iw+.6+n+(n-1)*g,H=4.7,pc=(x,t)=>+(x/t*100).toFixed(2);
    const f=+(1/W).toFixed(4),xs=pad+iw+.3+.5,yT=H/2-.65,yB=H/2+.65,holes=[];
    for(let k=0;k<n;k++){const x=xs+k*(1+g);holes.push({i:k,x:pc(x,W),y:pc(yB,H),w:pc(1,W),h:pc(1,H),f},{i:2*n-k,x:pc(x,W),y:pc(yT,H),w:pc(1,W),h:pc(1,H),f})}
    holes.push({i:n,x:pc(W-pad-iw/2,W),y:50,w:pc(iw,W),h:pc(ih,H),f,ibu:true},{i:2*n+1,x:pc(pad+iw/2,W),y:50,w:pc(iw,W),h:pc(ih,H),f,ibu:true});
    return{ar:[W,H],u:f,holes,bowls:[]};
  }
  refresh(view,st={}){
    const n=this.n,can=st.can||new Set();
    for(const k in this.h){
      const i=+k,o=this.h[k],v=view[i],c=o.el.classList;
      o.pile.innerHTML=pile(v,(i===n||i===2*n+1)?30:14,32,30);
      o.b.textContent=v;
      c.toggle('can',can.has(i));c.toggle('z',!v);c.toggle('hi',st.hi===i);
      o.el.disabled=!this.inter||!can.has(i);
      if(st.label)o.el.setAttribute('aria-label',st.label(i,v));
    }
  }
  clearMarks(){for(const k in this.h)this.h[k].el.classList.remove('tgt','pth','hint')}
  mark(i,cls,ms){const o=this.h[i];if(!o)return;o.el.classList.add(cls);if(ms)setTimeout(()=>o.el.classList.remove(cls),ms)}
}

/* ===== KESAN ANIMASI ===== */
const Fx={
  hand:null,
  init(){this.hand=document.createElement('div');this.hand.className='hand';document.body.appendChild(this.hand)},
  at(el,c){if(!el||!this.hand)return;const r=el.getBoundingClientRect();this.hand.style.left=(r.left+r.width/2)+'px';this.hand.style.top=(r.top+r.height*.2)+'px';this.hand.textContent='✋ '+c;this.hand.classList.add('on')},
  off(){if(this.hand)this.hand.classList.remove('on')},
  fly(a,b,ms){
    if(!a||!b)return;const r1=a.getBoundingClientRect(),r2=b.getBoundingClientRect(),el=document.createElement('i');
    let fs=28;try{fs=parseFloat(getComputedStyle(b).fontSize)||28}catch(e){}
    el.className='sd fs';el.style.fontSize=Math.max(fs,24)+'px';el.style.setProperty('--r',Math.round(Math.random()*360)+'deg');
    if(!el.animate){return}
    document.body.appendChild(el);
    const x1=r1.left+r1.width/2,y1=r1.top+r1.height/2,x2=r2.left+r2.width/2,y2=r2.top+r2.height/2,h=Math.min(110,Math.hypot(x2-x1,y2-y1)*.45+34),T=(x,y)=>`translate(${x}px,${y}px) translate(-50%,-50%)`;
    const an=el.animate([{transform:T(x1,y1)+' scale(1.1)'},{transform:T((x1+x2)/2,(y1+y2)/2-h)+' scale(1.6)',offset:.5},{transform:T(x2,y2)+' scale(1)'}],{duration:Math.max(ms,60),easing:'ease-in-out',fill:'forwards'});
    an.onfinish=()=>el.remove();
  },
  pop(el,txt){if(!el)return;const r=el.getBoundingClientRect(),d=document.createElement('span');d.className='popup';d.textContent=txt;d.style.left=(r.left+r.width/2)+'px';d.style.top=r.top+'px';document.body.appendChild(d);setTimeout(()=>d.remove(),1000)}
};

/* ===== SKRIN ===== */
const Screen={cur:'menu',
  go(n){const ch=this.cur!==n;for(const x of['menu','setup','match'])document.getElementById(x).hidden=x!==n;document.body.dataset.screen=n;this.cur=n;if(ch){try{scrollTo(0,0)}catch(e){}}
    if(n==='menu')document.getElementById('cont').hidden=!(Match.s&&!Match.s.over)}
};

/* ===== PERLAWANAN ===== */
const Match={
  s:null,bv:null,view:null,
  say(t){document.getElementById('msg').textContent=t},
  nm:p=>esc(HEROES[cfg.p[p]].n),
  human(){return !(cfg.vs==='ai'&&this.s.turn===1)},
  el(i){const o=this.bv&&this.bv.h[i];return o?o.el:null},
  canSet(){const s=this.s;if(!s||s.busy||s.over||!this.human())return new Set();return new Set(Rules.legal(this.view,s.n,s.turn))},
  label(i,v){const n=this.s.n;if(i===n)return`Rumah ibu ${HEROES[cfg.p[0]].n}: ${v} biji`;if(i===2*n+1)return`Rumah ibu ${HEROES[cfg.p[1]].n}: ${v} biji`;const m=i<n;return`${HEROES[cfg.p[m?0:1]].n} · lubang ${(m?i:2*n-i)+1}: ${v} biji`},
  mountBoard(){
    const host=document.getElementById('stage');host.innerHTML='';
    const inner=document.createElement('div');inner.className='inner';
    this.bv=new BoardView(boardDef(),this.s.n,true);inner.appendChild(this.bv.el);if(this.bv.strip)inner.appendChild(this.bv.strip);host.appendChild(inner);
    document.getElementById('dBoard').innerHTML=BOARDS.map(b=>`<option value="${b.id}"${b.id===cfg.board?' selected':''}>${esc(b.name)}</option>`).join('');
    document.getElementById('dSeed').innerHTML=SEEDS.map(([v,t])=>`<option value="${v}"${v===cfg.seed?' selected':''}>${t}</option>`).join('');
  },
  start(){
    const n=cfg.n,s=this.s={n,b:Array(2*n+2).fill(cfg.seeds),turn:0,busy:false,over:false,hist:[],pend:null,hi:-1};
    s.b[n]=0;s.b[2*n+1]=0;this.view=s.b.slice();saveCfg();
    document.body.dataset.seed=cfg.seed;this.mountBoard();Screen.go('match');
    this.say(`${HEROES[cfg.p[0]].n} mula dahulu. Tekan lubang yang bercahaya.`);this.render();
  },
  setBoard(id){
    cfg.board=id;const B=boardDef();
    if(B.kind==='photo'&&B.n!==this.s.n){cfg.n=B.n;this.start();return}
    this.mountBoard();this.render();saveCfg();
  },
  card(p){const h=HEROES[cfg.p[p]],s=this.s,lab=p===1&&cfg.vs==='ai'?`AI · ${LVL[cfg.lvl]}`:`Pemain ${p+1}`;
    return`<div class="em"><img src="${IMGS[cfg.p[p]]}" alt=""></div><div class="nm"><b>${esc(h.n)}</b><small>${esc(h.t)} · ${lab}${s.turn===p&&!s.over?' · giliran':''}</small></div><div class="sc"><s>BIJI</s>${this.view[Rules.store(s.n,p)]}</div>`},
  render(){
    const s=this.s;this.bv.refresh(this.view,{can:this.canSet(),hi:s.hi,label:(i,v)=>this.label(i,v)});
    for(const p of[0,1]){const e=document.getElementById('c'+p);e.innerHTML=this.card(p);e.classList.toggle('act',s.turn===p&&!s.over)}
  },
  react(p,c){const e=document.getElementById('c'+p);if(!e)return;e.classList.add(c);setTimeout(()=>e.classList.remove(c),900)},
  showPath(i){
    this.bv.clearMarks();const s=this.s,n=s.n,sz=2*n+2,opp=Rules.store(n,1-s.turn);let c=s.b[i],pos=i;const out=[];
    while(c>0){pos=(pos+1)%sz;if(pos===opp)continue;out.push(pos);c--}
    out.forEach((x,k)=>this.bv.mark(x,k===out.length-1?'tgt':'pth'));
  },
  choose(i){
    const s=this.s;if(!s||!this.canSet().has(i))return;
    if(cfg.confirm==='2'&&s.pend!==i){s.pend=i;this.showPath(i);this.say('Tekan sekali lagi untuk mengesahkan langkah.');return}
    s.pend=null;this.play(i);
  },
  async play(i){
    const s=this.s;if(s.busy||s.over)return;
    s.busy=true;s.pend=null;this.bv.clearMarks();
    try{
      const p=s.turn,n=s.n,r=Rules.resolve(s.b,n,p,i),mine=Rules.store(n,p),sp=cfg.speed;
      if(!(cfg.vs==='ai'&&p===1)){s.hist.push({b:s.b.slice(),turn:s.turn});if(s.hist.length>40)s.hist.shift()}
      const v=this.view=s.b.slice();let prev=i;
      for(const e of r.ev){
        if(e.t==='pick'){v[e.i]=0;this.render();Fx.at(this.el(e.i),e.c);Snd.knock();await sleep(380*sp)}
        else if(e.t==='drop'){Fx.fly(this.el(prev),this.el(e.i),230*sp);await sleep(210*sp);v[e.i]++;s.hi=e.i;this.render();Fx.at(this.el(e.i),e.left);Snd.knock();prev=e.i;if(e.i===mine)Fx.pop(this.el(mine),'+1');await sleep(110*sp)}
        else if(e.t==='chain'){v[e.i]=0;s.hi=e.i;prev=e.i;this.render();Fx.at(this.el(e.i),e.c);this.say('Berlari… ambil biji dan teruskan!');await sleep(480*sp)}
        else if(e.t==='capture'){
          Fx.off();const bonus=await Duel.run(p,e.gain);
          v[mine]+=e.gain+bonus;v[e.o]=0;v[e.i]=0;s.hi=mine;this.render();
          Fx.pop(this.el(mine),'+'+(e.gain+bonus));this.react(p,'cheer');this.react(1-p,'ouch');
          this.say(`${HEROES[cfg.p[p]].n} menikam dan merampas ${e.gain+bonus} biji${bonus?' (termasuk bonus KO)':''}!`);await sleep(500*sp);
        }
      }
      Fx.off();s.hi=-1;s.b=v.slice();
      if(Rules.over(s.b,n)){this.finish();return}
      if(r.extra)this.say(`${HEROES[cfg.p[p]].n} dapat main sekali lagi!`);else{s.turn=1-p;this.say(`Giliran ${HEROES[cfg.p[s.turn]].n}.`)}
      s.busy=false;this.render();this.aiTurn();
    }catch(err){
      console.error(err);Toast.show('Ralat semasa langkah: '+err.message);
      Fx.off();s.busy=false;s.hi=-1;this.view=s.b.slice();this.render();
    }
  },
  async aiTurn(){
    const s=this.s;if(cfg.vs!=='ai'||s.turn!==1||s.over||s.busy)return;
    s.busy=true;this.say(`${HEROES[cfg.p[1]].n} (AI) sedang berfikir…`);this.render();await sleep(900);
    const m=AI.pick(s.b,s.n,1,cfg.lvl);s.busy=false;if(m>=0)this.play(m);
  },
  hint(){
    const s=this.s;if(!s||s.busy||s.over||!this.human())return;
    const h=AI.hint(s.b,s.n,s.turn);if(!h)return;
    this.bv.clearMarks();this.bv.mark(h.i,'hint',3500);
    this.say(`💡 Cuba lubang ${(s.turn?2*s.n-h.i:h.i)+1}: ${h.cap?`tikam ${h.cap} biji!`:h.extra?'main sekali lagi!':'langkah paling seimbang.'}`);Snd.tone(660,.12);
  },
  undo(){
    const s=this.s;if(!s||s.busy||s.over)return;
    if(!s.hist.length){this.say('Tiada langkah untuk diundur.');return}
    const h=s.hist.pop();s.b=h.b;s.turn=h.turn;s.hi=-1;s.pend=null;this.view=s.b.slice();this.bv.clearMarks();this.say('↶ Langkah diundur.');Snd.tone(420,.1);this.render();
  },
  finish(){
    const s=this.s;s.b=Rules.sweep(s.b,s.n);this.view=s.b.slice();s.over=true;s.busy=false;s.hi=-1;this.render();
    const a=s.b[s.n],c=s.b[2*s.n+1],w=Rules.winner(s.b,s.n);
    Snd.tone(523,.2);setTimeout(()=>Snd.tone(659,.2),200);setTimeout(()=>Snd.tone(784,.4),400);
    const hw=w<0?null:HEROES[cfg.p[w]];
    const body=w<0?`<h2>Seri!</h2><p class="winn">${a} – ${c}</p>`:`<h2>PEMENANG</h2><div class="pic"><img src="${IMGS[cfg.p[w]]}" alt=""></div><h2>${esc(hw.n)}${cfg.vs==='ai'&&w===1?' (AI)':''}</h2><p class="winn">${a} lawan ${c}</p><p><i>“${esc(hw.l)}”</i></p>`;
    const r=document.getElementById('result');
    r.innerHTML=`<div class="panel">${body}<div class="center"><button class="btn" data-r="again">Main Semula</button></div><button class="btn sm" data-r="set">Tukar Tetapan</button> <button class="btn sm" data-r="menu">Menu Utama</button></div>`;
    r.hidden=false;
  }
};

/* ===== PERTARUNGAN TIKAM ===== */
const WPN=[{e:'🗡️',n:'Keris',d:[5,9],k:'1'},{e:'⚔️',n:'Libas',d:[9,15],k:'2'},{e:'🥋',n:'Silat',d:[6,11],k:'3'}];
const mkFx=(L,cls,html,st,ms)=>{const e=document.createElement('span');e.className=cls;e.innerHTML=html||'';e.style.cssText=st||'';L.appendChild(e);setTimeout(()=>e.remove(),ms);return e};
const shakeBody=()=>{document.body.classList.add('shake');setTimeout(()=>document.body.classList.remove('shake'),500)};
const FXK={
  multi(L,s){for(let i=0;i<6;i++)mkFx(L,'fm',s.e,`--d:${i*70}ms;--y:${22+i*9}%;--c:${s.c}`,1200);return 600},
  x(L,s){for(let i=0;i<4;i++)mkFx(L,'fxs','',`--d:${i*110}ms;--rt:${[-30,25,-62,62][i]}deg;--c:${s.c}`,1000);return 450},
  rain(L,s){for(let i=0;i<16;i++)mkFx(L,'frn',s.e,`left:${52+Math.random()*40}%;--d:${Math.random()*500}ms;--c:${s.c}`,1300);return 700},
  rings(L,s){for(let i=0;i<3;i++)mkFx(L,'frg','',`--d:${i*160}ms;--c:${s.c}`,1300);mkFx(L,'fcp',s.e,`--c:${s.c}`,1200);shakeBody();return 350},
  stamp(L,s){mkFx(L,'fst',s.e,`--c:${s.c};font-size:${s.e.length>2?54:90}px`,1300);mkFx(L,'frg','',`--d:380ms;--c:${s.c}`,1300);return 420},
  stomp(L,s){mkFx(L,'fsp',s.e,'',1300);mkFx(L,'fck','','--d:420ms',1300);mkFx(L,'frg','',`--d:420ms;--c:${s.c}`,1300);setTimeout(shakeBody,420);return 460},
  petals(L,s){for(let i=0;i<26;i++)mkFx(L,'fpt',s.e,`--a:${i*(360/26)}deg;--r:${90+Math.random()*60}px;--d:${Math.random()*300}ms;--c:${s.c}`,1600);return 900},
  ink(L,s){for(let i=0;i<9;i++)mkFx(L,'fik','',`left:${52+Math.random()*38}%;top:${15+Math.random()*60}%;--d:${i*80}ms;--c:${s.c};--s:${60+Math.random()*80}px`,1200);mkFx(L,'fcp',s.e,`--c:${s.c}`,1100);return 500},
  aura(L,s,ct){ct.aura();for(let i=0;i<7;i++)mkFx(L,'fm fist',s.e,`--d:${200+i*90}ms;--y:${30+(i%3)*12}%;--c:${s.c}`,1200);return 800},
  wave(L,s){mkFx(L,'fwv','',`--c:${s.c}`,1400);return 650},
  notes(L,s){for(let i=0;i<10;i++)mkFx(L,'fnt',['🎶','🎵','🎼'][i%3],`--x:${12+i*7}%;--s:${28+(i%3)*10}px;--d:${i*90}ms;--dx:${(i%2?1:-1)*40}px;--c:${s.c}`,1700);return 750},
  claw(L,s){for(let i=0;i<3;i++)mkFx(L,'fcl','',`--o:${i*34-34}px;--d:${i*90}ms;--c:${s.c}`,900);mkFx(L,'fcp',s.e,`--c:${s.c}`,1100);shakeBody();return 500},
  moon(L,s){mkFx(L,'fmo','',`--c:${s.c}`,1300);mkFx(L,'frg','',`--d:300ms;--c:${s.c}`,1300);return 600},
  fire(L,s){for(let i=0;i<14;i++)mkFx(L,'ffr','🔥',`left:${40+Math.random()*50}%;--d:${Math.random()*500}ms;--s:${30+Math.random()*40}px`,1400);mkFx(L,'fcp',s.e,`--c:${s.c}`,1300);shakeBody();return 650},
  bolt(L,s){for(let i=0;i<4;i++)mkFx(L,'fbt','⚡',`left:${46+i*10}%;--d:${i*120}ms;--c:${s.c}`,900);setTimeout(shakeBody,150);return 520},
  beam(L,s){mkFx(L,'fbm','',`--c:${s.c}`,1300);mkFx(L,'frg','',`--d:400ms;--c:${s.c}`,1300);return 600}
};
/* zarah kanvas untuk gelanggang tikam */
const DFX={
  cv:null,g:null,P:[],raf:0,w:0,h:0,last:0,amb:0,
  start(cv){this.stop();this.cv=cv;this.g=cv&&cv.getContext?cv.getContext('2d'):null;if(!this.g)return;this.P=[];this.size();this.last=(window.performance||Date).now();
    const f=t=>{this.raf=requestAnimationFrame(f);this.frame(t)};this.raf=requestAnimationFrame(f)},
  stop(){if(this.raf)cancelAnimationFrame(this.raf);this.raf=0;this.P=[];this.g=null},
  size(){const r=this.cv.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,1.5);this.d=d;this.w=r.width;this.h=r.height;this.cv.width=Math.max(1,r.width*d|0);this.cv.height=Math.max(1,r.height*d|0)},
  at(el){if(!el||!this.cv)return[this.w*.7,this.h*.4];const a=el.getBoundingClientRect(),c=this.cv.getBoundingClientRect();return[a.left+a.width/2-c.left,a.top+a.height/2-c.top]},
  burst(x,y,col,n=18,sp=420){if(!this.g)return;for(let i=0;i<n;i++){const a=Math.random()*6.283,v=sp*(.3+Math.random()*.9);this.P.push({k:0,x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-80,l:.35+Math.random()*.4,t:0,c:col,r:1.5+Math.random()*2.5})}},
  ring(x,y,col,R=150){if(this.g)this.P.push({k:1,x,y,l:.45,t:0,c:col,R})},
  slash(x,y,col,ang){if(this.g)this.P.push({k:2,x,y,l:.28,t:0,c:col,a:ang===undefined?-.6+Math.random()*1.2:ang,R:70+Math.random()*50})},
  lines(col){if(!this.g)return;for(let i=0;i<26;i++)this.P.push({k:3,x:Math.random()*this.w,y:Math.random()*this.h,l:.5+Math.random()*.3,t:-Math.random()*.25,c:col,len:80+Math.random()*220})},
  confetti(x,y){if(!this.g)return;const C=['#ffd45a','#ff5a6a','#fff4c0','#7ae0c0','#ff9a3a'];for(let i=0;i<90;i++){const a=-Math.PI/2+(Math.random()-.5)*2.4,v=300+Math.random()*520;this.P.push({k:4,x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:1.6+Math.random()*.8,t:0,c:C[i%5],r:4+Math.random()*5,ro:Math.random()*6,vr:(Math.random()-.5)*14})}},
  frame(t){
    const g=this.g;if(!g)return;const dt=Math.min(.05,(t-this.last)/1000);this.last=t;g.setTransform(this.d,0,0,this.d,0,0);g.clearRect(0,0,this.w,this.h);
    this.amb+=dt;if(this.amb>.09){this.amb=0;this.P.push({k:5,x:Math.random()*this.w,y:this.h+8,vx:(Math.random()-.5)*30,vy:-(40+Math.random()*90),l:2.4,t:0,c:Math.random()<.5?'#ffb040':'#ff5a2a',r:1+Math.random()*2})}
    const P=this.P;for(let i=P.length-1;i>=0;i--){const p=P[i];p.t+=dt;if(p.t<0)continue;const u=p.t/p.l;if(u>=1){P.splice(i,1);continue}
      g.globalAlpha=1-u;
      if(p.k===0||p.k===5){p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.k===0){p.vy+=900*dt;p.vx*=.97}g.globalCompositeOperation='lighter';g.strokeStyle=p.c;g.lineWidth=p.r;g.lineCap='round';g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x-p.vx*.035,p.y-p.vy*.035);g.stroke()}
      else if(p.k===1){g.globalCompositeOperation='lighter';g.strokeStyle=p.c;g.lineWidth=10*(1-u)+1;g.beginPath();g.arc(p.x,p.y,p.R*(.15+u),0,6.283);g.stroke()}
      else if(p.k===2){g.globalCompositeOperation='lighter';const e=Math.min(1,u*2.2);g.save();g.translate(p.x,p.y);g.rotate(p.a);g.strokeStyle='#fff';g.shadowColor=p.c;g.shadowBlur=22;g.lineCap='round';g.lineWidth=(1-u)*13+1;g.beginPath();g.arc(0,p.R*.55,p.R,-2.4,-2.4+e*1.7);g.stroke();g.restore()}
      else if(p.k===3){g.globalCompositeOperation='lighter';g.globalAlpha=(1-u)*.55;g.strokeStyle=p.c;g.lineWidth=2;p.x+=1900*dt;if(p.x>this.w+p.len)p.x=-p.len;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x-p.len,p.y);g.stroke()}
      else if(p.k===4){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=620*dt;p.vx*=.985;p.ro+=p.vr*dt;g.globalCompositeOperation='source-over';g.globalAlpha=Math.min(1,(1-u)*2);g.save();g.translate(p.x,p.y);g.rotate(p.ro);g.fillStyle=p.c;g.fillRect(-p.r,-p.r*.4*Math.cos(p.ro*2),p.r*2,p.r*.8);g.restore()}
    }
    g.globalAlpha=1;g.globalCompositeOperation='source-over';
  }
};
const Duel={
  async run(p,gain,fx){
    const force=fx?!!fx.ko:undefined;
    if(cfg.fight==='skip'){Snd.tone(130,.3,'sawtooth',.08);await sleep(450);return fx?{a:fx.a|0,d:fx.d|0,ko:!!fx.ko}:{a:0,d:0,ko:false}}
    const ia=cfg.p[p],iv=cfg.p[1-p],A=HEROES[ia],V=HEROES[iv],t=document.getElementById('duel'),live=cfg.fight==='live';
    /* mod mesej: tiada rangkaian — setiap peranti main peranannya sendiri, keputusan ditetapkan oleh `force` */
    const post=!!(typeof Msg!=='undefined'&&Msg.on),on=!!Match.online&&!post,role=on?(p===Match.me?'a':'d'):'';
    const hAtk=post?(live&&p===Msg.me&&!fx):on?(role==='a'&&live):live&&!(cfg.vs==='ai'&&p===1);
    const hDef=post?false:on?(role==='d'&&live):live&&!(cfg.vs==='ai'&&p===0);
    const DUR=live?10500:3600;
    /* mata tikam: setiap perbuatan ada nilainya */
    let mA=0,mD=0,nH=0,nS=0,nG=0,nB=0;
    const capS=Math.max(2,Math.min(10,Math.round(gain*.6)+1)),capD=Math.max(1,Math.round(capS/2));
    const bA=Match.statBonus(p),bV=Match.statBonus(1-p);
    /* ----- elemen ----- */
    const eA=elOf(ia),eV=elOf(iv),EA=ELEM[eA],EV=ELEM[eV],adv=elAdv(eA,eV);
    const elm=adv>0?1.38:adv<0?.74:1;
    const am=(.75+(A.atk+bA.atk)*.1)*elm;
    let bf=Math.max(.12,.5-(V.def+bV.def)*.08),gw=600+(V.def+bV.def)*70;
    if(adv<0){bf*=.62;gw*=1.3}
    const gcdv=Math.max(500,1700-(V.spd+bV.spd)*130);
    /* ===== LANGKAH SILAT: tiga garis serangan, tangkis mesti padan garis & masa ===== */
    const LN=[{k:'1',g:'7',n:'Atas',e:'↑',t:'Tetak kepala'},{k:'2',g:'8',n:'Tengah',e:'→',t:'Tikam dada'},{k:'3',g:'9',n:'Bawah',e:'↓',t:'Sapu kaki'}];
    const JUR=[{k:'4',sp:1,sk:A.sk[0],d:[20,28],cost:30},{k:'5',sp:2,sk:A.sk[1],d:[34,44],cost:65}];
    const gmw=(g,k)=>({k:k||'6',sp:3,gid:g.id,sk:{n:g.n,k:g.k,e:g.e,c:g.c},d:g.d,cost:100,stun:g.stun,pierce:g.pierce});
    for(const[i,g]of Match.gems(p).entries())JUR.push(gmw(g,i?'0':'6'));
    const PER=1500;                                   /* kitaran meter ketepatan */
    const ACC=x=>x<.075?2:x<.26?1:0;                  /* 2=tepat 1=baik 0=tersasar */
    const AMUL=[.45,1,1.65],ANM=['TERSASAR','','TEPAT!'];
    const TEL=[980,820,660];                          /* makin tepat, makin laju tiba */
    const PAR=360,GW=Math.round(gw*.8);              /* tetingkap tangkis sempurna / biasa */
    const lnb=LN.map(l=>`<button class="lb3" data-w="${l.k}"${hAtk?'':' disabled'}><i>${l.e}</i><b>${l.n}</b><u>${l.t} [${l.k}]</u></button>`).join('');
    const jrb=JUR.map(w=>`<button class="wb${w.sp===3?' gem':w.sp===2?' ult':' sp'}" data-w="${w.k}"${hAtk?'':' disabled'} style="--c:${w.sk.c}">${w.sk.e}<span>${esc(w.sk.n)} [${w.k}]</span><em>⚡${w.cost}</em><u></u></button>`).join('');
    const gdb=LN.map(l=>`<button class="lb3 d" data-g="${l.k}"${hDef?'':' disabled'}><i>${l.e}</i><b>${l.n}</b><u>[${l.g}]</u></button>`).join('');
    t.innerHTML=`<div class="rays"></div><div class="dvig"></div><canvas id="dcv"></canvas><div class="lb a"></div><div class="lb b"></div><div class="flash" id="fl"></div><div class="duel"><div class="hps"><div class="hp"><b>${esc(A.n)} ${elBadge(ia,1)}</b><small>${esc(A.t)}</small><div class="bar"><i id="ahp" style="width:100%"></i></div></div><div class="hp r"><b>${elBadge(iv,1)} ${esc(V.n)}</b><small>${esc(V.t)}</small><div class="bar"><i id="vhp" style="width:100%"></i></div></div></div><div class="arena" id="ar" style="--ea:${EA.c};--ev:${EV.c}"><div class="fgt el" id="fa" style="--c:${EA.c}"><img src="${IMGS[ia]}" alt=""></div><div class="fgt el r" id="fv" style="--c:${EV.c}"><img src="${IMGS[iv]}" alt=""></div><div class="vsb" id="vsb">VS</div><div id="fx"></div><div class="shield" id="shd"></div><div id="cmb"></div><div class="tel" id="tel"></div><div class="gln" id="gln"></div></div>
      <div class="sem"><div class="sa"><small>Semangat</small><div class="sbar"><i id="sea"></i></div></div><div class="sd"><small>Semangat</small><div class="sbar"><i id="sed"></i></div></div></div><h2 id="dt">BERSEDIA!</h2><p id="dq"><b>${esc(A.n)}</b>: “${esc(A.l)}”</p><div class="tbar"><i id="tb" style="width:100%"></i></div>${live?`<div class="ctl"><div class="grp atk"><small>${esc(A.n)} menyerang</small>
      <div class="mrow"><div class="meter" id="mtr"><span class="zb"></span><span class="zg"></span><i id="mpin"></i></div><b class="mpw" id="mpw" aria-live="off">0%</b></div>
      <div class="lns">${lnb}</div><div class="jrs">${jrb}</div></div>
      <div class="grp def"><small>${esc(V.n)} bertahan — padankan garis</small><div class="lns">${gdb}</div></div></div>`:''}<button class="skip" id="skp">Langkau ⏩</button></div>`;
    const q=id=>t.querySelector('#'+id),fl=(e,c)=>{e.classList.remove(c);void e.offsetWidth;e.classList.add(c)};
    /* senjata pusaka pemain: cahaya dan tag pada kad pahlawan pemain, kesan khas bila tikaman kena.
       Kosmetik sahaja — kerosakan tidak berubah. */
    const meI=post?Msg.me:on?Match.me:0,W=typeof Senjata!=='undefined'?Senjata.dipakai():null,myAtk=!!W&&p===meI;
    if(W){const we=q(p===meI?'fa':'fv');we.classList.add('wpn');we.style.setProperty('--wc',W.c);we.style.setProperty('--wc2',W.c2||W.c);
      const wr=document.createElement('i');wr.className='wring';we.appendChild(wr);
      const tg=document.createElement('div');tg.className='wtag';tg.textContent=W.e+' '+W.n;we.appendChild(tg)}
    const wFx=(x,y)=>{const c=W.c,c2=W.c2||'#fff';
      switch(W.fx){
        case'luk':DFX.slash(x-14,y-10,c,-.9);DFX.slash(x+14,y+10,c,-.9);DFX.burst(x,y,c,16,460);break;
        case'cakar':for(const o of[-24,0,24])DFX.slash(x+o*.4,y+o,c,-.5);DFX.burst(x,y,c,12,380);break;
        case'tusuk':DFX.burst(x-10,y,c,14,320);setTimeout(()=>{DFX.burst(x+12,y-6,c,14,320);DFX.ring(x,y,c,90)},110);break;
        case'kilau':DFX.ring(x,y,c,190);DFX.burst(x,y,c,26,560);break;
        case'tujah':DFX.lines(c);DFX.ring(x,y,c,150);fl(q('ar'),'hs');break;
        case'libas':DFX.slash(x,y,c,-.3);DFX.burst(x,y,'#a8f080',30,700);DFX.burst(x,y,c,14,420);break;
        case'taming':DFX.ring(x,y,c,240);DFX.ring(x,y,c2,160);DFX.burst(x,y,c,30,640);DFX.burst(x,y,c2,20,520);fl(q('fl'),'fz');fl(q('ar'),'quake');break}
      if(Snd.senjata)Snd.senjata(W.fx);
      mkFx(q('fx'),'elp wfx',W.e,`--c:${c};--y:${22+Math.random()*30}%;--x:${-14+Math.random()*28}px`,800)};
    t.hidden=false;t.classList.remove('fin','kofin','tlow','hplow');DFX.start(q('dcv'));Snd.gong(98,.34);setTimeout(()=>{if(!t.hidden&&Mus.motif)Mus.motif(ia)},620);Snd.drum('dung',.4);Mus.set('duel');Mus.hot(.4);
    setTimeout(()=>{if(t.hidden)return;const[x,y]=DFX.at(q('vsb'));DFX.ring(x,y,'#ffd45a',220);DFX.burst(x,y,'#ffe9a0',26,520);fl(q('fl'),'fz');Snd.drum('tak',.3)},430);
    setTimeout(()=>{
      if(t.hidden)return;
      const c=document.createElement('div');c.className='eclash'+(adv>0?' up':adv<0?' dn':'');
      c.style.setProperty('--c1',EA.c);c.style.setProperty('--c2',EV.c);
      c.innerHTML=`<i>${EA.e}</i><b>${adv>0?EA.n.toUpperCase()+' MENGATASI '+EV.n.toUpperCase():adv<0?EV.n.toUpperCase()+' MENGATASI '+EA.n.toUpperCase():'ELEMEN SERI'}</b><i>${EV.e}</i><u>${adv>0?EA.t+' · serangan +38%':adv<0?EV.t+' · serangan −26%, tangkisan lawan lebih kuat':'tiada kelebihan elemen'}</u>`;
      t.appendChild(c);setTimeout(()=>c.remove(),2300);
      const[x,y]=DFX.at(q('vsb'));
      if(adv>0){DFX.ring(x,y,EA.c,300);DFX.burst(x,y,EA.c,34,640);Snd.chime()}
      else if(adv<0){DFX.ring(x,y,EV.c,300);DFX.burst(x,y,EV.c,34,640);Snd.clang(.2)}
      else{DFX.burst(x,y,EA.c,16,420);DFX.burst(x,y,EV.c,16,420);Snd.drum('tak',.25)}
    },760);
    await sleep(1900);
    /* panduan: ditunjuk sehingga pemain faham, mereka sendiri tekan Mula */
    if(live&&!on&&(Prof.d.seen|0)<3){
      await new Promise(go=>{
        const c=document.createElement('div');c.className='dtut';
        c.innerHTML=`<div class="dtw"><h3>Cara Tikam — Langkah Silat</h3>
          <div class="dtg">
            <div><b>⚔️ Menyerang</b>
              <p>Pilih <b>garis</b>: ↑ Atas · → Tengah · ↓ Bawah.</p>
              <p>Tekan ketika penunjuk meter berada di <b>zon putih di tengah</b> — tikaman <b>TEPAT</b>, lebih kuat dan lebih laju. Angka <b>kuasa</b> di sisi meter: 100% tepat di tengah, makin jauh makin lemah.</p>
              <p>Setiap tikaman mengisi <b>⚡ Semangat</b>. Cukup semangat, barulah jurus boleh dilepaskan.</p><p><b>Jurus Gemilang</b> dipilih dalam skrin Pangkat sebelum perlawanan, dan muncul sebagai butang tambahan di sini. Level 25 membuka slot kedua.</p></div>
            <div><b>🛡️ Bertahan</b>
              <p>Bulatan merah muncul pada garis yang akan datang — itu amaran.</p>
              <p>Tekan butang tangkis pada <b>garis yang sama</b>. Tekan <b>lewat sikit</b>, hampir dengan hentaman, untuk <b>TANGKIS SEMPURNA</b>: sifar kerosakan.</p>
              <p>Tangkisan mengisi semangat anda juga. Penuh, tangkisan sempurna jadi <b>Balas Maut</b>.</p></div>
          </div>
          <p class="dtn">Bonus biji selepas tikam bergantung pada mata yang anda kumpul. Kalau semua tikaman ditangkis, penyerang tidak dapat bonus langsung.</p>
          <div class="dtb"><button class="btn" data-go="1">Mula Lawan</button><button class="btn sm" data-go="2">Jangan tunjuk lagi</button></div></div>`;
        c.onpointerdown=e=>{const b=e.target.closest('[data-go]');if(!b)return;
          Prof.d.seen=b.dataset.go==='2'?99:(Prof.d.seen|0)+1;Prof.save();c.remove();go()};
        t.appendChild(c);
        setTimeout(()=>{if(c.parentNode)c.remove();go()},60000);   /* jaring keselamatan */
      });
    }
    if(live){for(const n of['3','2','1']){const c=document.createElement('div');c.className='dcd';c.textContent=n;
      t.appendChild(c);Snd.drum('tik',.3);await sleep(390);c.remove()}}
    return await new Promise(res=>{
      /* hpA: nyawa penyerang — dikurangkan oleh tangkis sempurna dan Balas Maut (dulu tiada langsung) */
      let hp=100,hpA=100,nC=0,fin=false,combo=0,last=0,semA=0,semD=0,recov=0,mpos=0;
      let gL=-1,gAt=0,gUntil=0,gcdU=0,stag=0,rz=null;
      let nH=0,nT=0,nP=0;                       /* kena, tepat, tangkis sempurna */
      const tm=[];
      const setSem=()=>{q('sea').style.width=Math.min(100,semA)+'%';q('sed').style.width=Math.min(100,semD)+'%';
        for(const w of JUR){const b=t.querySelector(`.wb[data-w="${w.k}"]`);if(b)b.classList.toggle('rdy',semA>=w.cost)}
        const sb=q('sed')&&q('sed').parentNode;if(sb&&sb.classList)sb.classList.toggle('full',semD>=100)};
      /* meter ketepatan: berayun, tekan di tengah untuk tikaman tepat */
      const loop=()=>{if(fin||t.hidden)return;const ph=(Date.now()%PER)/PER;mpos=Math.abs(Math.sin(ph*Math.PI));
        const pin=q('mpin');if(pin)pin.style.left=(mpos*100)+'%';
        const pe=q('mpw');if(pe){const v=pwr();pe.textContent=v+'%';pe.dataset.lv=v>=90?2:v>=50?1:0}};
      const acc=()=>ACC(Math.abs(mpos-.5)*2);
      /* kuasa tikaman: 100% tepat di tengah meter, menurun licin ke 0% di hujung */
      const pwr=()=>Math.round(100*Math.pow(Math.max(0,1-Math.abs(mpos-.5)*2),1.6));
      /* lawan komputer: ketepatan mengikut tahap, bukan meter */
      const aiAcc=()=>{const L=cfg.vs==='ai'?cfg.lvl:2,r2=Math.random(),pt=[0,.12,.22,.34][L]||.2,pb=[0,.52,.56,.52][L]||.54;
        return r2<pt?2:r2<pt+pb?1:0};
      const rg=m=>{if(!m)return;
        if(m.t==='dg')guardPress(+m.L,1);
        else if(m.t==='dh')strike(m.j?((m.j==='6'||m.j==='0')&&m.g!==undefined?gmw(GEM[m.g],m.j):JUR.find(x=>x.k===m.j)):null,+m.L,m);
        else if(m.t==='dz')rz=m;else if(m.t==='de')done(!!m.ko,1,!!m.ka)};
      const kd=e=>{
        const k=e.key;
        if(hAtk){const l=LN.find(x=>x.k===k);if(l)return strike(null,LN.indexOf(l));
          const w=JUR.find(x=>x.k===k);if(w)return strike(w,1)}
        if(hDef){const g=LN.findIndex(x=>x.g===k||x.k===k);if(g>=0&&LN[g].g===k){e.preventDefault();guardPress(g)}}};
      const done=async(ko,rem,ka)=>{
        if(fin)return;fin=true;
        if(on){Net.duelH=null;if(role==='a'&&!rem)Net.send({t:'de',ko:!!ko,ka:ka?1:0})}
        tm.forEach(x=>{clearInterval(x);clearTimeout(x)});t.onpointerdown=null;document.removeEventListener('keydown',kd);
        if(ko)mA+=6;
        /* penyerang tumbang: tiada bonus serangan, pertahanan diberi ganjaran */
        if(ka){mA=0;mD+=6}
        let sA,sD;
        if(fx){sA=fx.a|0;sD=fx.d|0;ko=!!fx.ko}
        else if(rz){sA=rz.a|0;sD=rz.d|0}
        else if(live||cfg.fight==='auto'){
          const f=live?(x=>Math.floor(x/3)):(x=>Math.round(x*.78/3));
          sA=Math.max(0,Math.min(capS,f(mA)));
          sD=Math.max(0,Math.min(capD,f(mD)));}
        else{sA=0;sD=0}
        const bonus=sA;
        if(on&&role==='a'&&!rem)Net.send({t:'dz',a:sA,d:sD});
        q('dt').textContent=ka?'PENYERANG TUMBANG!':ko?'KO! TIKAM MAUT!':nH===0?'TIKAMAN TERTAHAN!':'TIKAM BERJAYA!';
        if(ka){q('fa').classList.remove('hurt','big','wind','go');q('fa').classList.add('ko');fl(q('fv'),'win')}
        else{q('fv').classList.remove('hurt','big','blk');q('fv').classList.add('ko');q('fa').classList.remove('wind');fl(q('fa'),'win')}
        t.classList.add('fin');
        {const[x,y]=DFX.at(q('fv')),[ax,ay]=DFX.at(q('fa'));
          if(ko){fl(q('fl'),'fz');t.classList.add('kofin');DFX.ring(x,y,'#fff',260);DFX.burst(x,y,'#ffd45a',50,700);DFX.confetti(ax,ay)}
          else DFX.burst(x,y,'#ffd45a',24,420);
          for(let i=0;i<Math.min(10,gain+bonus);i++)mkFx(q('fx'),'sdf','','--d:'+(i*70)+'ms;--y:'+(30+Math.random()*30)+'%',1300)}
        {const rows=[];
          if(nH)rows.push(`<i>Tikaman kena ×${nH}${nT?` · tepat ×${nT}`:''}</i>`);
          if(nS)rows.push(`<i class="s">Jurus pahlawan ×${nS}</i>`);
          if(nG)rows.push(`<i class="g">Jurus Gemilang ×${nG}</i>`);
          if(ko)rows.push('<i class="k">KO!</i>');
          if(nC)rows.push(`<i class="b">Penyerang terkena balas ×${nC} · HP ${hpA}</i>`);
          if(ka)rows.push('<i class="k">Penyerang tumbang</i>');
          if(nB)rows.push(`<i class="b">Tangkis ×${nB}</i>`);
          if(nP)rows.push(`<i class="p">Tangkis sempurna ×${nP}</i>`);
          const none=nH===0&&(nB+nP)>0;
          q('dq').innerHTML=`<span class="gain">+${gain} biji dirampas</span>`
            +(rows.length?`<span class="mta">${rows.join('')}</span>`:'')
            +`<span class="bns">${none?'Semua tikaman ditangkis — tiada bonus serangan.':sA?`+${sA} biji bonus serangan`:'Tiada bonus serangan'}${sD?` · lawan dapat +${sD} biji kerana bertahan`:''}</span>`;}
        Snd.gong(ko?130:98,.36);ko?Snd.chime():Snd.drum('dung',.3);
        Mus.set((typeof Quest!=='undefined'&&Quest.bak!=null)?'kembara':'game');
        await sleep(ko?2400:1900);t.hidden=true;DFX.stop();res({a:sA,d:sD,ko:!!ko});
      };
      /* ---- serangan ---- */
      const strike=(w,L,rep)=>{
        if(fin)return;const now=Date.now();
        if(!rep){
          if(now<recov||now<stag)return;
          if(w&&semA<w.cost){const bt=t.querySelector(`.wb[data-w="${w.k}"]`);if(bt)fl(bt,'no');
            Snd.tone(150,.1,'square',.05);mkFx(q('fx'),'acc nos','Semangat belum cukup','',700);return}
          if(w){semA-=w.cost;setSem()}
          recov=now+(w?900:560);
        }
        const ac=rep?(+rep.a||0):(hAtk?acc():aiAcc());
        /* pemain: kerosakan ikut angka kuasa yang dipaparkan (0% = ×0.45, 100% = ×1.65); AI kekal tiga tahap */
        const pw=!rep&&hAtk?pwr():null,pm=pw!=null?.45+1.2*pw/100:AMUL[ac];
        let tel=TEL[ac];
        combo=rep?rep.cb:(now-last<1600?combo+1:1);last=now;
        let d=rep?rep.d:Math.round((w?w.d[0]+Math.random()*(w.d[1]-w.d[0]):11+Math.random()*7)*am*pm*(1+Math.min(combo,8)*.07));
        /* telegraf: lawan nampak garis sebelum kena */
        const te=q('tel');te.dataset.l=L;te.dataset.sp=w?'1':'0';te.innerHTML=`<i>${LN[L].e}</i><b>${esc(w?w.sk.n:LN[L].t)}</b>`;fl(te,'go');
        if(w){
          const c=document.createElement('div');c.className='cutin';c.style.setProperty('--cc',w.sk.c);
          c.innerHTML=`<img src="${IMGS[ia]}" alt=""><b>${esc(w.sk.n)}</b>`;t.appendChild(c);setTimeout(()=>c.remove(),950);
          Snd.whoosh(.4);Snd.gong(82,.34);Mus.hot(.85);fl(q('fl'),'fz');DFX.lines(w.sk.c);
          const fxd=FXK[w.sk.k](q('fx'),w.sk,{aura:()=>{q('fa').style.setProperty('--c',w.sk.c);fl(q('fa'),'aur')}});
          tel=Math.max(tel,(+fxd||0)+260);   /* biar kesan jurus habis dahulu sebelum hentaman */
        }else{mkFx(q('fx'),'pj',LN[L].e,'',520);mkFx(q('fx'),'slx','',`--rt:${-40+Math.random()*30}deg`,420)}
        /* ancang-ancang semasa telegraf, kemudian terjang supaya puncak terjangan
           (52% daripada go2 = 187ms) mendarat tepat pada hentaman. Visual sahaja:
           tel ialah tetingkap tangkisan pemain dan tidak diubah. */
        {const fa=q('fa'),lt=Math.max(0,tel-187),wAt=Math.max(0,(fa._goEnd||0)-Date.now());
          /* jangan potong terjangan yang masih di udara: ancang-ancang menunggu ia habis */
          /* ancang-ancang pendek (≤340ms) tepat sebelum terjangan; lebih lama dibaca sebagai goyangan kosong */
          const wS=Math.max(wAt,lt-340);
          if(wS<lt)tm.push(setTimeout(()=>{if(fin)return;fa.style.setProperty('--tw',Math.max(120,lt-wS)+'ms');
            fa.classList.remove('go');fl(fa,'wind')},wS));
          tm.push(setTimeout(()=>{if(fin)return;fa.classList.remove('wind','aur');fl(fa,'go');fa._goEnd=Date.now()+360;Snd.whoosh(.2)},lt))}
        if(!rep&&ac===2){mkFx(q('fx'),'acc','TEPAT!','',600);Snd.tone(880,.12,'triangle',.07)}
        if(pw!=null){const pe=q('mpw');if(pe){pe.classList.remove('hit');void pe.offsetWidth;pe.classList.add('hit')}
          mkFx(q('fx'),'acc kpw','KUASA '+pw+'%',`--pc:${pw>=90?'#ffd45a':pw>=50?'#fff':'#ff8a7a'}`,700)}
        /* AI bertahan: cuba teka garis */
        if(!rep&&!hDef&&!on&&Math.random()<.78){
          const pr=[0,.2,.32,.46][cfg.lvl]||.3;
          const gl=Math.random()<pr?L:(L+1+(Math.random()*2|0))%3;
          tm.push(setTimeout(()=>guardPress(gl),Math.max(90,tel-130-Math.random()*240)));
        }
        tm.push(setTimeout(()=>{
          if(fin)return;const nw=Date.now();
          let blk=0;
          if(rep)blk=+rep.blk||0;
          else if(gL===L&&nw<gUntil)blk=(nw-gAt)<=PAR?2:1;
          if(!rep){
            if(blk===2)d=w?Math.max(1,Math.round(d*.3)):0;
            else if(blk===1)d=w?d:Math.max(1,Math.round(d*bf));
          }
          let balas=false;
          if(blk===2){nP++;mD+=4;mA-=2;semD+=32;
            if(semD>=100&&!rep){balas=true}
            if(rep&&rep.bl)balas=true;
            if(balas){mD+=8;semD=0;stag=nw+1200;
              const c=document.createElement('div');c.className='cutin bal';c.style.setProperty('--cc','#7ad0ff');
              c.innerHTML=`<img src="${IMGS[iv]}" alt=""><b>BALAS MAUT</b>`;t.appendChild(c);setTimeout(()=>c.remove(),900);
              Snd.clang(.3);Snd.gong(150,.3);fl(q('ar'),'quake')}}
          else if(blk===1){nB++;mD+=2;mA-=1;semD+=18}
          else{nH++;if(w&&w.sp===3){mA+=5;nG++}else if(w){mA+=3;nS++}else{mA+=ac===2?2:1;if(ac===2)nT++}
            semD+=10;semA+=[12,22,34][ac]}
          if(blk>0)semA+=7;
          if(w&&w.stun&&blk===0){gL=-1;gUntil=0;gcdU=Math.max(gcdU,nw+w.stun)}
          setSem();
          if(on&&role==='a'&&!rep)Net.send(Object.assign({t:'dh',L,a:ac,d,blk,cb:combo,bl:balas?1:0},w?{j:w.k}:{},w&&w.sp===3?{g:w.gid}:{}));
          hp=Math.max(force===false?1:0,hp-d);
          {const fv=q('fv');fv.classList.remove('blk','hurt','big');fl(fv,blk?'blk':'hurt');fv.classList.toggle('big',!blk&&d>=24)}
          const[x,y]=DFX.at(q('fv')),ox=(Math.random()-.5)*60,oy=(Math.random()-.5)*60;
          if(blk===2){DFX.ring(x,y,'#9fe0ff',200);DFX.burst(x,y,'#d8f2ff',26,480);fl(q('fl'),'fz');Snd.parry()}
          else if(blk===1){DFX.ring(x,y,'#7ad0ff',120);DFX.burst(x+ox,y+oy,'#9fe0ff',14,360);Snd.block()}
          else{DFX.slash(x+ox*.4,y+oy*.4,w?w.sk.c:ac===2?'#fff0a0':'#ffeaa0');
            DFX.burst(x+ox,y+oy,w?w.sk.c:'#ffd070',d>=24?40:16,d>=24?620:400);
            if(d>=24){DFX.ring(x,y,w?w.sk.c:'#fff',200);fl(q('ar'),'quake');fl(q('fl'),'fz')}else fl(q('ar'),'hs');Snd.hit();Haptic.hit()}
          if(myAtk&&!blk)wFx(x,y);
          /* serangan balas: tangkis sempurna menyengat (5), Balas Maut memukul (16, +6 jika unsur lawan mengatasi).
             Tiada rawak di sini supaya HP penyerang sama di kedua-dua peranti dalam talian. */
          if(blk===2){const cd=balas?16+(adv<0?6:0):5;hpA=Math.max(force===false?1:0,hpA-cd);nC++;
            q('ahp').style.width=hpA+'%';t.classList.toggle('alow',hpA<=30);
            {const fa=q('fa');fa.classList.remove('hurt','big','wind','go');fl(fa,'hurt');fa.classList.toggle('big',balas)}
            const[ax,ay]=DFX.at(q('fa'));DFX.burst(ax,ay,'#7ad0ff',balas?30:12,balas?560:360);if(balas)DFX.ring(ax,ay,'#9fe0ff',190);
            mkFx(q('fx'),'dmg ka'+(balas?' crit':''),(balas?'BALAS -':'-')+cd,`left:${4+Math.random()*14}%;top:${14+Math.random()*16}%;--r:${(Math.random()-.5)*16}deg`,900);
            if(hpA<=0&&!rep){Haptic.ko();return done(false,0,true)}}
          /* unsur penyerang kelihatan pada setiap hentaman; lebih besar bila ia mengatasi lawan.
             Bila unsur lawan lebih kuat dan ia menahan, unsur lawan pula yang menyala. */
          if(!blk){const up=adv>0;DFX.burst(x+ox*.5,y+oy*.5,EA.c,up?30:20,up?600:480);DFX.ring(x,y,EA.c,up?170:110);
            mkFx(q('fx'),'elp'+(up?' up':''),EA.e,`--c:${EA.c};--y:${18+Math.random()*34}%;--x:${-10+Math.random()*20}px`,up?900:650);
            if(up){q('ar').style.setProperty('--ec',EA.c);fl(q('ar'),'ela')}}
          else if(adv<0){DFX.burst(x,y,EV.c,14,420);
            mkFx(q('fx'),'elp sm',EV.e,`--c:${EV.c};--y:${30+Math.random()*20}%;--x:${-10+Math.random()*20}px`,650)}
          mkFx(q('fx'),'dmg'+(blk===2?' p':blk?' b':d>=24?' crit':'')+(adv>0&&!blk?' el':''),
            blk===2?'TANGKIS SEMPURNA':blk?'TANGKIS '+d:'-'+d,
            `right:${4+Math.random()*16}%;top:${12+Math.random()*18}%;--r:${(Math.random()-.5)*16}deg`,900);
          q('vhp').style.width=hp+'%';t.classList.toggle('hplow',hp<=30);
          const cb=q('cmb');if(combo>=2&&!blk){cb.innerHTML=`<b>${combo}</b><small>KOMBO</small>`;cb.dataset.lv=combo>=8?3:combo>=5?2:1;fl(cb,'pop')}
          if(hp<=0){Haptic.ko();done(true)}
        },tel));
      };
      /* ---- tangkis ---- */
      const guardPress=(L,rem)=>{
        const n=Date.now();if(fin||n<gcdU)return;
        gL=L;gAt=n;gUntil=n+GW;gcdU=n+Math.max(260,gcdv*.45);
        const g=q('gln');g.dataset.l=L;fl(g,'on');
        q('shd').style.setProperty('--gw',GW+'ms');fl(q('shd'),'up');Snd.drum('tik',.22);
        const b=t.querySelector(`.lb3.d[data-g="${LN[L].k}"]`);if(b){b.style.setProperty('--cd',(gcdU-n)+'ms');fl(b,'cd')}
        if(on&&role==='d'&&!rem)Net.send({t:'dg',L});
      };
      t.onpointerdown=e=>{const b=e.target.closest('button');if(!b||b.disabled)return;
        if(b.id==='skp'){if(!on)done(false);return}
        if(b.dataset.g!==undefined)return guardPress(LN.findIndex(x=>x.k===b.dataset.g));
        const k=b.dataset.w;if(!k)return;
        const li=LN.findIndex(x=>x.k===k);if(li>=0)return strike(null,li);
        const w=JUR.find(x=>x.k===k);if(w)strike(w,1)};
      document.addEventListener('keydown',kd);
      if(on){Net.duelH=rg;Net.drain()}
      setSem();loop();tm.push(setInterval(loop,16));
      q('dt').textContent='LAWAN!';q('tb').style.transition=`width ${DUR}ms linear`;
      requestAnimationFrame(()=>requestAnimationFrame(()=>{q('tb').style.width='0%'}));
      /* AI menyerang */
      if(!hAtk&&!(on&&role==='d'))tm.push(setInterval(()=>{
        if(fin)return;const r=Math.random();
        const w=semA>=100&&r<.22?JUR[JUR.length-1]:semA>=50&&r<.38?JUR[0]:null;
        if(w&&semA>=w.cost)strike(w,Math.random()*3|0);else strike(null,Math.random()*3|0);
      },live?820:430));
      tm.push(setTimeout(()=>{t.classList.add('tlow')},DUR*.7));
      if(force===true)tm.push(setTimeout(()=>{if(!fin)done(true)},Math.max(800,DUR-700)));
      tm.push(setTimeout(()=>done(false),on&&role==='d'?DUR+5000:DUR));
    });
  }
};

/* ===== AVATAR SENDIRI ===== */
const PRE={seimbang:[3,3,3],penyerang:[5,2,4],bertahan:[3,5,2],laju:[3,2,5]};
function addCustom(o){
  const k=KD[o.kind]||KD.multi,pr=PRE[o.pre]||PRE.seimbang;
  IMGS.push(o.img);
  HEROES.push({n:String(o.n).slice(0,22),el:ELEM[o.el]?o.el:'tanah',t:'Avatar Sendiri',atk:pr[0],def:pr[1],spd:pr[2],l:'Inilah giliranku!',custom:1,sk:[SK('Jurus '+String(o.n).split(' ')[0],o.kind,k[0],k[1]),SK('Jurus Muktamad',o.kind,k[0],k[1],1)]});
}
const Av={src:null,
  draw(sz=240,ctx){
    const c=document.getElementById('avc'),x=ctx||c.getContext('2d');x.clearRect(0,0,sz,sz);x.fillStyle='#222';x.fillRect(0,0,sz,sz);
    if(!this.src){x.fillStyle='#aaa';x.font='16px sans-serif';x.textAlign='center';x.fillText('Pilih gambar…',sz/2,sz/2);return}
    const g=id=>+document.getElementById(id).value,z=g('avz'),s=Math.min(this.src.width,this.src.height)/z,sx=(this.src.width-s)/2+g('avx')*(this.src.width-s)/2,sy=(this.src.height-s)/2+g('avy')*(this.src.height-s)/2;
    x.filter=document.getElementById('avst').checked?'saturate(1.35) contrast(1.12) brightness(1.04)':'none';x.drawImage(this.src,sx,sy,s,s,0,0,sz,sz);x.filter='none';
  },
  open(){this.src=null;document.getElementById('avfile').value='';document.getElementById('aved').hidden=false;this.draw()},
  save(){
    if(!this.src)return;
    const c=document.createElement('canvas');c.width=c.height=360;this.draw(360,c.getContext('2d'));
    const o={n:(document.getElementById('avn').value||'Pahlawanku').slice(0,22),img:c.toDataURL('image/jpeg',.86),kind:document.getElementById('avk').value,pre:document.getElementById('avp').value,el:document.getElementById('avel').value};
    addCustom(o);try{const a=JSON.parse(localStorage.getItem('cm13av')||'[]');a.push(o);localStorage.setItem('cm13av',JSON.stringify(a))}catch(e){}
    document.getElementById('aved').hidden=true;cfg.p[0]=HEROES.length-1;if(cfg.p[1]===cfg.p[0])cfg.p[1]=0;Setup.render('hero');
  },
  init(){
    document.getElementById('avk').innerHTML=Object.keys(KD).map(k=>`<option value="${k}">${KD[k][2]}</option>`).join('');
    document.getElementById('avfile').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{Av.src=im;Av.draw()};im.src=r.result};r.readAsDataURL(f)};
    for(const i of['avz','avx','avy','avst'])document.getElementById(i).addEventListener('input',()=>Av.draw());
    document.getElementById('avx2').onclick=()=>{document.getElementById('aved').hidden=true};
    document.getElementById('avs').onclick=()=>Av.save();
    try{JSON.parse(localStorage.getItem('cm13av')||'[]').forEach(addCustom)}catch(e){}
  }
};

/* ===== PERSIAPAN ===== */
const Setup={tab:'mod',
  TABS:[['mod','Mod'],['hero','Pahlawan'],['board','Papan'],['seed','Biji'],['more','Lain-lain']],
  chips(k,label,opts,cur){return`<div class="row"><h3>${label}</h3><div class="chips">${opts.map(([v,t])=>`<button class="chip${String(cur)===String(v)?' on':''}" data-k="${k}" data-v="${v}">${t}</button>`).join('')}</div></div>`},
  stat:(l,v)=>`<div class="st"><span>${l}</span><i style="--v:${v*20}%"></i></div>`,
  hero(j){const a=HEROES[j];return`<div class="hc"><img src="${IMGS[j]}" alt=""><div><b>${esc(a.n)}</b><small>${esc(a.t)}</small>${this.stat('Kuasa',a.atk)}${this.stat('Tahan',a.def)}${this.stat('Laju',a.spd)}<em>✨ ${esc(a.sk[0].n)}<br>💥 ${esc(a.sk[1].n)}</em></div></div>`},
  avs(k,i){return`<div class="chips">${HEROES.map((a,j)=>`<button class="av${cfg.p[i]===j?' on':''}" data-k="${k}" data-v="${j}"><img src="${IMGS[j]}" alt="">${esc(a.n)}</button>`).join('')}</div>`},
  panel(){
    const ai=cfg.vs==='ai';
    switch(this.tab){
      case 'mod':return this.chips('vs','Mod permainan',[['ai','Lawan Komputer'],['2','Dua Pemain']],cfg.vs)+(ai?this.chips('lvl','Tahap komputer',[[1,'Mudah'],[2,'Sederhana'],[3,'Hebat']],cfg.lvl):'');
      case 'hero':return`<div class="row"><button class="btn sm" data-a="avnew">＋ Avatar Sendiri (muat naik gambar)</button></div><div class="row"><h3>Pemain 1</h3>${this.avs('p0',0)}${this.hero(cfg.p[0])}</div><div class="row"><h3>${ai?'Lawan komputer':'Pemain 2'}</h3>${this.avs('p1',1)}${this.hero(cfg.p[1])}</div>`;
      case 'board':return`<div class="row"><h3>Congkak tradisional (foto asli)</h3><div class="grid">${BOARDS.map(b=>b.kind==='photo'?`<button class="bd${cfg.board===b.id?' on':''}" data-k="board" data-v="${b.id}"><img src="${b.P.img}" alt="">${esc(b.name)}<small>${b.n} lubang</small></button>`:`<button class="bd${cfg.board===b.id?' on':''}" data-k="board" data-v="${b.id}"><div class="kl"></div>${esc(b.name)}<small>5–9 lubang</small></button>`).join('')}</div></div>`;
      case 'seed':return`<div class="row"><h3>Jenis biji</h3><div class="grid">${SEEDS.map(([v,t])=>`<button class="sw${cfg.seed===v?' on':''}" data-k="seed" data-v="${v}" data-seed="${v}"><div class="sh">${pile(7,7,32,32)}</div>${t}</button>`).join('')}</div></div>`;
      default:{const B=boardDef();return(B.kind==='photo'?`<div class="row"><h3>Bilangan lubang</h3><p class="note">Papan foto asli: ${B.n} lubang setiap barisan.</p></div>`:this.chips('n','Bilangan lubang',[[5,'5 (Mini)'],[7,'7 (Klasik)'],[9,'9 (Besar)']],cfg.n))+this.chips('seeds','Biji setiap lubang',[[3,'3'],[5,'5'],[7,'7']],cfg.seeds)+this.chips('fight','Pertarungan tikam',[['live','Interaktif (bonus KO +2)'],['auto','Animasi auto'],['skip','Langkau']],cfg.fight)+this.chips('speed','Kelajuan animasi',[[1.5,'Perlahan'],[1,'Normal'],[.6,'Pantas']],cfg.speed)+this.chips('confirm','Sahkan langkah',[['auto','Terus main'],['2','Sentuh dua kali']],cfg.confirm)}
    }
  },
  render(tab){
    if(tab)this.tab=tab;fixCfg();saveCfg();Screen.go('setup');document.body.dataset.seed=cfg.seed;
    const root=document.getElementById('setup');
    root.innerHTML=`<div class="sbar"><button class="chip back" data-a="menu">‹ Menu</button><h2>PERSIAPAN GELANGGANG</h2></div><div class="tabs">${this.TABS.map(([v,t])=>`<button class="tab${this.tab===v?' on':''}" data-tab="${v}">${t}</button>`).join('')}</div><div class="sg"><div class="pv"><div class="pvh"><div class="pvp"><img src="${IMGS[cfg.p[0]]}" alt=""><b>${esc(HEROES[cfg.p[0]].n)}</b></div><div class="vs">VS</div><div class="pvp"><img src="${IMGS[cfg.p[1]]}" alt=""><b>${esc(HEROES[cfg.p[1]].n)}${cfg.vs==='ai'?' (AI)':''}</b></div></div><div class="pvb" id="pvb" data-seed="${cfg.seed}"></div></div><div class="spn">${this.panel()}</div></div><div class="center"><button class="btn" data-a="go">▶ MULA MAIN</button></div>`;
    const bv=new BoardView(boardDef(),cfg.n,false),n=cfg.n,c=Array(2*n+2).fill(cfg.seeds);c[n]=0;c[2*n+1]=0;bv.refresh(c,{});
    const pv=document.getElementById('pvb');pv.appendChild(bv.el);if(bv.strip)pv.appendChild(bv.strip);
  },
  click(e){
    const g=e.target.closest('[data-a],[data-tab],[data-k]');if(!g)return;
    if(g.dataset.a==='go')return Match.start();
    if(g.dataset.a==='menu')return Screen.go('menu');
    if(g.dataset.a==='avnew')return Av.open();
    if(g.dataset.tab){this.tab=g.dataset.tab;Snd.ui(1);return this.render()}
    const k=g.dataset.k,v=g.dataset.v;
    if(k==='p0'||k==='p1'){const i=+k[1],o=1-i;cfg.p[i]=+v;if(cfg.p[o]===+v)cfg.p[o]=(+v+1)%HEROES.length}
    else cfg[k]=['n','seeds','lvl','speed'].includes(k)?+v:v;
    Snd.tone(520);this.render();
  }
};

/* ===== PEMASANGAN ===== */
function wire(){
  document.getElementById('menu').addEventListener('click',e=>{
    const b=e.target.closest('[data-go]');if(!b)return;Snd.ui();const g=b.dataset.go;
    if(g==='cont')Screen.go('match');
    else if(g==='play'){cfg.vs='ai';Match.start()}
    else if(g==='ai'){cfg.vs='ai';Setup.render('mod')}
    else if(g==='two'){cfg.vs='2';Setup.render('mod')}
    else if(g==='hero')Setup.render('hero');else if(g==='board')Setup.render('board');else if(g==='set')Setup.render('more');
    else if(g==='help')document.getElementById('help').hidden=false;
    else if(g==='full'){const d=document.documentElement;(d.requestFullscreen||d.webkitRequestFullscreen||(()=>0)).call(d)}
    else if(g==='snd'){cfg.mute=!cfg.mute;Snd.mute=cfg.mute;saveCfg();b.textContent=cfg.mute?'🔇 Bunyi':'🔊 Bunyi'}
  });
  document.getElementById('setup').addEventListener('click',e=>Setup.click(e));
  document.getElementById('helpOk').onclick=()=>{document.getElementById('help').hidden=true};
  document.getElementById('stage').addEventListener('click',e=>{const h=e.target.closest('.hole');if(h)Match.choose(+h.dataset.i)});
  document.getElementById('stage').addEventListener('mouseover',e=>{const h=e.target.closest('.hole.can');Match.bv&&Match.bv.clearMarks();if(h)Match.showPath(+h.dataset.i)});
  document.getElementById('match').querySelector('.dock').addEventListener('click',e=>{
    const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;
    if(a==='menu'&&!Match.s.busy)Screen.go('menu');else if(a==='hint')Match.hint();else if(a==='undo')Match.undo();
    else if(a==='help')document.getElementById('help').hidden=false;
    else if(a==='snd'){cfg.mute=!cfg.mute;Snd.mute=cfg.mute;saveCfg();b.textContent=cfg.mute?'🔇':'🔊'}
  });
  document.getElementById('dBoard').addEventListener('change',e=>{if(!Match.s.busy)Match.setBoard(e.target.value);else e.target.value=cfg.board});
  document.getElementById('dSeed').addEventListener('change',e=>{cfg.seed=e.target.value;document.body.dataset.seed=cfg.seed;saveCfg();Match.render()});
  document.getElementById('result').addEventListener('click',e=>{
    const r=e.target.dataset&&e.target.dataset.r;if(!r)return;document.getElementById('result').hidden=true;
    if(r==='again')Match.start();else if(r==='set')Setup.render('mod');else Screen.go('menu');
  });
  document.addEventListener('keydown',e=>{
    if(Screen.cur!=='match'||!Match.s)return;
    for(const id of['duel','result','help','aved'])if(!document.getElementById(id).hidden)return;
    if(/INPUT|SELECT|TEXTAREA/.test((e.target&&e.target.tagName)||''))return;
    const s=Match.s,k=e.key;
    if(/^[1-9]$/.test(k)){const j=+k-1;if(j<s.n)Match.choose(s.turn===0?j:2*s.n-j)}
    else if(k==='h'||k==='H')Match.hint();else if(k==='u'||k==='U')Match.undo();
  });
  addEventListener('pointermove',e=>{const r=document.documentElement.style;r.setProperty('--mx',(e.clientX/innerWidth-.5)*2);r.setProperty('--my',(e.clientY/innerHeight-.5)*2)});
}
function init(){
  document.getElementById('bg').style.backgroundImage='url('+ASSET.art+')';
  Av.init();loadCfg();Fx.init();wire();
  document.getElementById('snd').textContent=cfg.mute?'🔇 Bunyi':'🔊 Bunyi';
  Screen.go('menu');
}
try{init()}catch(err){Toast.show('Gagal mula: '+err.message);console.error(err)}
