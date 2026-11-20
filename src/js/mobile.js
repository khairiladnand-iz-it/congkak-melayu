/* ===== TELEFON: skrin penuh, mod imersif, getaran, jimat kuasa ===== */
const Scr={
  imm:false,wl:null,ready:false,
  isFs(){return!!(document.fullscreenElement||document.webkitFullscreenElement)},
  can(){const d=document.documentElement;return!!(d.requestFullscreen||d.webkitRequestFullscreen)},
  async toggle(){
    const d=document.documentElement;
    if(this.isFs()){
      try{const x=document.exitFullscreen||document.webkitExitFullscreen;if(x)await x.call(document)}catch(e){}
      this.imm=false;this.apply();return;
    }
    let ok=false;
    try{const f=d.requestFullscreen||d.webkitRequestFullscreen;
      if(f){const r=f.call(d,{navigationUI:'hide'});if(r&&r.then)await r;ok=this.isFs()}}catch(e){ok=false}
    if(!ok){
      this.imm=!this.imm;
      Toast.show(this.imm
        ?'Mod imersif hidup — bar permainan disembunyikan. iPhone tiada skrin penuh dalam pelayar; untuk skrin penuh sebenar, tekan Kongsi → Tambah ke Skrin Utama.'
        :'Mod imersif dimatikan.');
    }
    this.apply();this.wake();
  },
  apply(){
    const on=this.imm||this.isFs();
    document.body.classList.toggle('imm',on);
    for(const b of document.querySelectorAll('[data-go="full"]'))b.textContent=on?'⛶ Keluar Skrin Penuh':'⛶ Skrin Penuh';
    for(const b of document.querySelectorAll('[data-a="full"]'))b.textContent=on?'⛶':'⛶';
    try{World.fit&&World.fit()}catch(e){}
    setTimeout(()=>{try{World.fit&&World.fit()}catch(e){}},260);
  },
  async wake(){
    try{if('wakeLock'in navigator&&!this.wl){this.wl=await navigator.wakeLock.request('screen');
      this.wl.addEventListener('release',()=>{this.wl=null})}}catch(e){}
  },
  init(){
    if(this.ready)return;this.ready=true;
    for(const e of['fullscreenchange','webkitfullscreenchange'])document.addEventListener(e,()=>this.apply());
    document.addEventListener('visibilitychange',()=>{
      if(document.hidden){try{this.wl&&this.wl.release()}catch(e){}this.wl=null}
      else if(this.imm||this.isFs())this.wake();
    });
    window.addEventListener('orientationchange',()=>setTimeout(()=>{try{World.fit&&World.fit()}catch(e){}},320));
    /* elak zum dua-ketuk dan tarik-segar semasa bermain */
    let lt=0;
    document.addEventListener('touchend',e=>{
      const n=Date.now();
      if(n-lt<320&&e.target.closest('#gl,#board,.dock,#duel,.hole'))e.preventDefault();
      lt=n;
    },{passive:false});
    this.apply();
  }
};
/* getaran halus — Android sahaja, senyap di tempat lain */
const Haptic={
  ok(){try{return cfg.vibe!==false&&typeof navigator.vibrate==='function'}catch(e){return false}},
  hit(){if(this.ok())try{navigator.vibrate(12)}catch(e){}},
  cap(){if(this.ok())try{navigator.vibrate([18,40,28])}catch(e){}},
  ko(){if(this.ok())try{navigator.vibrate([30,50,30,50,60])}catch(e){}},
  win(){if(this.ok())try{navigator.vibrate([40,60,40,60,120])}catch(e){}}
};
