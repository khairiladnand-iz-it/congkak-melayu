/* ===== MUKA HADAPAN BERANIMASI: latar bersilih, kelopak & debu emas, paralaks, jalur pahlawan ===== */
const MenuFx={
  on:false,raf:0,P:[],cv:null,g:null,w:0,h:0,dpr:1,tx:0,ty:0,px:0,py:0,sw:0,last:0,still:false,
  init(){
    const m=document.getElementById('mbg');if(!m)return;
    this.still=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
    const L=m.querySelectorAll('.l');if(L[0])L[0].style.backgroundImage=`url(${ART2.bg})`;if(L[1])L[1].style.backgroundImage=`url(${ART2.bg2})`;
    this.L=L;this.cv=document.getElementById('mfx');this.g=this.cv&&this.cv.getContext?this.cv.getContext('2d'):null;
    const s=document.getElementById('strip');
    if(s){const one=HEROES.slice(0,NBASE).map((a,j)=>`<button data-hs="${j}" title="${esc(a.t)}"><img src="${IMGS[j]}" alt="" loading="lazy"><b>${esc(a.n)}</b></button>`).join('');s.innerHTML=`<div class="trk">${one}${one}</div>`;
      s.addEventListener('click',e=>{const b=e.target.closest('[data-hs]');if(b){Snd.chime&&Snd.chime();Hist.open(+b.dataset.hs)}})}
    window.addEventListener('pointermove',e=>{if(!this.on||e.pointerType==='touch')return;this.tx=(e.clientX/innerWidth-.5)*2;this.ty=(e.clientY/innerHeight-.5)*2;
      if(typeof World!=='undefined'){World.ptr.tx=this.tx;World.ptr.ty=this.ty}},{passive:true});
    /* tetikus keluar tetingkap: papan kembali ke pose asal */
    document.addEventListener('pointerleave',()=>{if(typeof World!=='undefined'){World.ptr.tx=0;World.ptr.ty=0}});
    /* tatal: papan wira bergerak bersama halaman dan berhenti dilukis bila ditatal keluar */
    document.addEventListener('scroll',e=>{if(!this.on||typeof World==='undefined')return;const t=e.target;
      World.heroSc=(t&&t.scrollTop!=null&&t!==document)?t.scrollTop:(window.scrollY||0)},{capture:true,passive:true});
    window.addEventListener('resize',()=>{this.size();if(this.on)this.heroFit()});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)this.halt();else if(this.on)this.run()});
  },
  size(){if(!this.cv)return;const r=this.cv.getBoundingClientRect();this.dpr=Math.min(window.devicePixelRatio||1,1.5);this.w=r.width;this.h=r.height;this.cv.width=Math.max(1,Math.round(r.width*this.dpr));this.cv.height=Math.max(1,Math.round(r.height*this.dpr))},
  seed(){
    const n=Math.round(Math.min(34,Math.max(14,this.w*this.h/42000))),P=this.P=[];
    for(let i=0;i<n;i++)P.push(this.petal(true));
    for(let i=0;i<n*2;i++)P.push({k:1,x:Math.random()*this.w,y:Math.random()*this.h,r:.8+Math.random()*2.2,vy:-(6+Math.random()*14),vx:(Math.random()-.5)*8,ph:Math.random()*6.28,sp:.8+Math.random()*2});
  },
  petal(any){const c=Math.random();return{k:0,x:Math.random()*this.w*1.2,y:any?Math.random()*this.h:-30,r:7+Math.random()*9,vy:26+Math.random()*34,vx:-(14+Math.random()*26),rot:Math.random()*6.28,vr:(Math.random()-.5)*1.6,ph:Math.random()*6.28,fl:1.2+Math.random()*2.2,c:c<.6?['#ff5a6a','#b0102a']:c<.85?['#ffb0c0','#e0486a']:['#fff4e0','#f0c070']}},
  set(v){
    v=!!v;if(v===this.on)return;this.on=v;const m=document.getElementById('mbg');
    if(v){this.size();if(!this.P.length)this.seed();clearInterval(this.sw);if(!this.still)this.sw=setInterval(()=>{if(this.L&&this.L.length>1){this.L[0].classList.toggle('show');this.L[1].classList.toggle('show')}},9500);this.run()}
    else{clearInterval(this.sw);this.halt();document.body.style.setProperty('--px',0);document.body.style.setProperty('--py',0)}
    if(m)m.classList.toggle('live',v&&!this.still);
    if(v){this.heroFit();setTimeout(()=>{if(this.on)this.heroFit()},700)}else this.heroOff();
  },
  /* ===== Latar 3D =====
     Poster pahlawan dilukis oleh three.js (lihat latar.js). R.ht ialah ketinggian yang
     benar-benar menampakkan poster: seluruh skrin pada desktop, jalur atas pada telefon menegak. */
  heroFit(){
    if(typeof World==='undefined'||!World.ok||!window.THREE)return this.heroOff();
    const mw=document.querySelector('#menu .mwrap');if(!mw)return this.heroOff();
    const W=innerWidth,H=innerHeight;document.body.classList.add('m3d');
    const port=W<=700&&H>W,top=mw.getBoundingClientRect().top+(World.heroSc||0);
    World.heroStill=this.still;World.hero({cx:W/2,cy:H/2,wd:W,ht:port?Math.max(top,30):1e6});
  },
  heroOff(){document.body.classList.remove('m3d');if(typeof World!=='undefined'&&World.hero)World.hero(null)},
  /* kelopak menu juga dihadkan 30 fps, dan berhenti bila lapisan menutupnya */
  fps:30,_next:0,
  run(){if(this.raf||this.still||!this.g)return;this.last=(window.performance||Date).now();
    const f=t=>{this.raf=requestAnimationFrame(f);if(document.body.classList.contains('m3d'))return;/* kelopak kini 3D */
      if(t<this._next)return;
      this._next=t+1000/this.fps;
      try{if(World.covered&&World.covered())return}catch(e){}
      this.frame(t)};
    this.raf=requestAnimationFrame(f)},
  halt(){if(this.raf)cancelAnimationFrame(this.raf);this.raf=0},
  frame(t){
    const dt=Math.min(.05,(t-this.last)/1000);this.last=t;const g=this.g,W=this.w,H=this.h;
    this.px+=(this.tx-this.px)*Math.min(1,dt*4);this.py+=(this.ty-this.py)*Math.min(1,dt*4);
    const st=document.body.style;st.setProperty('--px',this.px.toFixed(3));st.setProperty('--py',this.py.toFixed(3));
    g.setTransform(this.dpr,0,0,this.dpr,0,0);g.clearRect(0,0,W,H);
    for(const p of this.P){
      if(p.k){ /* debu emas */
        p.ph+=dt*p.sp;p.x+=(p.vx+Math.sin(p.ph)*6)*dt;p.y+=p.vy*dt;if(p.y<-10){p.y=H+10;p.x=Math.random()*W}
        const a=.25+.75*Math.abs(Math.sin(p.ph));g.globalCompositeOperation='lighter';g.globalAlpha=a*.8;
        const gr=g.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*4);gr.addColorStop(0,'rgba(255,236,170,1)');gr.addColorStop(.3,'rgba(255,200,90,.5)');gr.addColorStop(1,'rgba(255,180,60,0)');g.fillStyle=gr;g.beginPath();g.arc(p.x,p.y,p.r*4,0,6.283);g.fill();
      }else{ /* kelopak bunga raya */
        p.ph+=dt*p.fl;p.rot+=p.vr*dt;p.x+=(p.vx+Math.sin(p.ph*.7)*22)*dt-this.px*8*dt;p.y+=p.vy*dt;
        if(p.y>H+30||p.x<-40)Object.assign(p,this.petal(false),{x:W*.2+Math.random()*W});
        g.globalCompositeOperation='source-over';g.globalAlpha=.9;g.save();g.translate(p.x,p.y);g.rotate(p.rot);g.scale(Math.cos(p.ph)*.75+.25*Math.sign(Math.cos(p.ph)||1),1);
        const gr=g.createLinearGradient(0,-p.r,0,p.r);gr.addColorStop(0,p.c[0]);gr.addColorStop(1,p.c[1]);g.fillStyle=gr;g.beginPath();g.moveTo(0,-p.r);g.bezierCurveTo(p.r*.95,-p.r*.6,p.r*.75,p.r*.7,0,p.r);g.bezierCurveTo(-p.r*.75,p.r*.7,-p.r*.95,-p.r*.6,0,-p.r);g.fill();
        g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=.8;g.beginPath();g.moveTo(0,-p.r*.7);g.lineTo(0,p.r*.8);g.stroke();g.restore();
      }
    }
    g.globalAlpha=1;g.globalCompositeOperation='source-over';
  }
};
