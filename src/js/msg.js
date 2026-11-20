/* ===== MAIN MELALUI MESEJ: bertukar kod pendek, tiada sambungan langsung =====
   Berfungsi di mana-mana — pelayar apa pun, tidak perlu log masuk, tidak perlu WiFi sama. */
const B36='0123456789abcdefghijklmnopqrstuvwxyz';
const Msg={
  on:false,me:0,seq:0,exp:0,pend:[],dq:[],dIn:[],sd:1,out:'',busy:false,err:'',pre:null,
  /* ---- kod mula (sekali sahaja) ---- */
  async packStart(o){
    const u=new TextEncoder().encode(JSON.stringify(o));
    if(typeof CompressionStream!=='undefined'){
      const cs=new CompressionStream('deflate-raw'),w=cs.writable.getWriter();w.write(u);w.close();
      return'S'+b64.e(new Uint8Array(await new Response(cs.readable).arrayBuffer()))}
    return'T'+b64.e(u);
  },
  async readStart(t){
    t=String(t||'').replace(/[\s"'`<>]+/g,'');const k=t[0],u=b64.d(t.slice(1));
    if(k==='S'){
      if(typeof DecompressionStream==='undefined')throw new Error('pelayar ini tidak menyokong kod mampat');
      const ds=new DecompressionStream('deflate-raw'),w=ds.writable.getWriter();w.write(u);w.close();
      return JSON.parse(new TextDecoder().decode(new Uint8Array(await new Response(ds.readable).arrayBuffer())))}
    if(k==='T')return JSON.parse(new TextDecoder().decode(u));
    throw new Error('ini bukan kod mula');
  },
  /* ---- kod giliran (pendek) ---- */
  sum(s){let c=0;for(let i=0;i<s.length;i++)c=(c*31+s.charCodeAt(i))%36;return B36[c]},
  mk(seq,mv,dl){let s='m'+B36[seq%36]+mv.map(i=>B36[i]).join('');
    if(dl&&dl.length)s+='.'+dl.map(x=>B36[Math.max(0,Math.min(35,x.a|0))]+B36[Math.max(0,Math.min(35,x.d|0))]+(x.ko?'1':'0')).join('');
    return s+this.sum(s)},
  rd(t){
    t=String(t||'').toLowerCase().replace(/[^a-z0-9.]/g,'');
    if(t[0]!=='m'||t.length<3)throw new Error('ini bukan kod langkah');
    const body=t.slice(0,-1);
    if(this.sum(body)!==t.slice(-1))throw new Error('kod rosak atau tidak lengkap — minta rakan hantar semula');
    const parts=body.split('.'),head=parts[0],seq=B36.indexOf(head[1]),mv=[];
    for(let i=2;i<head.length;i++){const v=B36.indexOf(head[i]);if(v<0)throw new Error('kod rosak');mv.push(v)}
    if(seq<0||!mv.length)throw new Error('kod rosak');
    const dl=[];const dz=parts[1]||'';
    for(let i=0;i+2<dz.length+1;i+=3){const a=B36.indexOf(dz[i]),d=B36.indexOf(dz[i+1]);if(a<0||d<0)break;dl.push({a,d,ko:dz[i+2]==='1'})}
    return{seq,mv,dl};
  },
  /* ---- nasib tikam yang sama di kedua-dua peranti ---- */
  koFor(k){let h=(this.sd*2654435761+k*40503+0x9e37)>>>0;h^=h>>>13;h=(h*1274126177)>>>0;return(h%100)<42},
  /* ---- mula ---- */
  async start(){
    const lv=Prof.lvl(),sd=(Math.random()*65535|0)+1;
    const o={v:1,n:cfg.n,s:cfg.seeds,w:cfg.wood,b:cfg.seed,f:cfg.floor,sp:cfg.speed,ft:cfg.fight,p:cfg.p.slice(0,2),sd,lv};
    this.pre=o;Net.code=await this.packStart(o);Net.stage='msgout';Net.ui();
  },
  async join(t){
    Net.err='';Net.busy=true;Net.ui();
    try{
      if(!t)throw new Error('kosong — tampal kod mula daripada rakan dahulu');
      const o=await this.readStart(t);
      if(!o||o.v!==1||!Array.isArray(o.p))throw new Error('bukan kod mula yang sah');
      this.begin(o,1);document.getElementById('net').hidden=true;
    }catch(e){Net.err='Kod mula tidak sah: '+e.message}
    Net.busy=false;Net.ui();
  },
  go(){const o=this.pre;if(!o)return;this.pre=null;document.getElementById('net').hidden=true;this.begin(o,0)},
  begin(o,me){
    if(!Net.bak)Net.bak=JSON.stringify(cfg);
    this.on=true;this.me=me;this.seq=0;this.exp=0;this.pend=[];this.dq=[];this.dIn=[];this.sd=o.sd||1;this.out='';this.err='';
    Net.tx='post';Net.open=true;Net.role=me?'guest':'host';Net.me=me;
    Net.lv=me?[o.lv||1,Prof.lvl()]:[Prof.lvl(),1];
    Object.assign(cfg,{n:o.n,seeds:o.s,wood:o.w,seed:o.b,floor:o.f,speed:o.sp,fight:o.ft,vs:'2'});
    cfg.p=o.p.slice();
    document.getElementById('result').hidden=true;
    Match.startOnline(me);
    if(me===1)this.panel();
  },
  /* ---- Net.send disalurkan ke sini ---- */
  take(o){if(o&&o.t==='mv'&&Number.isInteger(o.i))this.pend.push(o.i)},
  pushDuel(z){if(this.on)this.dq.push({a:z.a|0,d:z.d|0,ko:!!z.ko})},
  pullDuel(){return this.dIn.length?this.dIn.shift():{a:0,d:0,ko:false}},
  /* dipanggil bila giliran bertukar kepada lawan */
  turnDone(){
    if(!this.on||!this.pend.length)return;
    this.seq=(this.seq+1)%36;this.out=this.mk(this.seq,this.pend,this.dq);this.pend=[];this.dq=[];this.panel();
  },
  /* ---- panel kod ---- */
  panel(){
    const o=document.getElementById('post');if(!o)return;
    const mine=Match.s&&Match.s.turn===this.me&&!Match.s.over;
    if(Match.s&&Match.s.over){o.hidden=true;return}
    o.hidden=false;
    const code=this.out?this.out.toUpperCase():'';
    o.innerHTML=`<div class="panel post"><h2>${mine?'Giliran anda':'Giliran rakan'}</h2>
      ${code?`<p class="hnote">Hantar kod ini kepada rakan:</p><div class="pcode">${esc(code)}</div>
        <div class="center"><button class="btn sm" data-p="copy">📋 Salin</button> <button class="btn sm" data-p="wa">💬 WhatsApp</button></div>`:''}
      ${mine?'<p class="hnote">Tutup panel ini dan buat langkah anda di papan.</p>':
        `<p class="hnote">Kemudian tampal kod balasan rakan di sini:</p>
         <textarea id="pin" rows="2" placeholder="Kod daripada rakan…" spellcheck="false" autocomplete="off"></textarea>
         <p class="pchk" id="pchk"></p>
         <div class="center"><button class="btn" data-p="play"${this.busy?' disabled':''}>▶ Mainkan</button></div>`}
      ${this.err?`<p class="nerr">${esc(this.err)}</p>`:''}
      <div class="center"><button class="btn sm" data-p="hide">Tutup</button></div></div>`;
  },
  show(){this.err='';this.panel()},
  hide(){const o=document.getElementById('post');if(o)o.hidden=true},
  copy(){
    const t=this.out?this.out.toUpperCase():'';if(!t)return;
    const x=document.querySelector('#post .pcode');
    const ok=()=>Toast.show('Kod disalin. Hantar kepada rakan.');
    try{if(navigator.clipboard&&navigator.clipboard.writeText)return void navigator.clipboard.writeText(t).then(ok,()=>this.selRange(x))}catch(e){}
    this.selRange(x);
  },
  selRange(x){
    try{const r=document.createRange();r.selectNodeContents(x);const s=getSelection();s.removeAllRanges();s.addRange(r);
      if(document.execCommand('copy'))return Toast.show('Kod disalin. Hantar kepada rakan.')}catch(e){}
    Toast.show('Kod sudah dipilih — tekan & tahan lalu pilih “Salin”.');
  },
  play(){
    const e=document.getElementById('pin'),t=e?e.value:'';
    this.err='';
    try{
      const p=this.rd(t),want=(this.exp+1)%36;
      if(p.seq!==want)throw new Error(`kod ini bukan giliran seterusnya (jangkaan ${want.toString(36).toUpperCase()}). Minta rakan hantar kod terbaharu.`);
      const s=Match.s;if(!s)throw new Error('permainan belum bermula');
      if(s.turn===this.me)throw new Error('sekarang giliran anda, bukan giliran rakan');
      this.exp=want;this.out='';this.dIn=(p.dl||[]).slice();this.hide();
      for(const i of p.mv)Match.remote(i,null);
    }catch(err){this.err=err.message;this.panel()}
  },
  click(ev){
    const g=ev.target.closest('[data-p]');if(!g)return;
    const k=g.dataset.p;
    if(k==='copy')return this.copy();
    if(k==='hide')return this.hide();
    if(k==='play')return this.play();
    if(k==='wa'){const t='Giliran kamu dalam Congkak Melayu! Kod: '+(this.out||'').toUpperCase();
      try{window.open('https://wa.me/?text='+encodeURIComponent(t),'_blank','noopener')}catch(e){Toast.show('Tidak dapat membuka WhatsApp. Guna butang Salin.')}return}
  },
  check(v){
    const e=document.getElementById('pchk');if(!e)return;
    if(!String(v||'').trim()){e.textContent='';e.className='pchk';return}
    try{const p=this.rd(v),want=(this.exp+1)%36;
      if(p.seq!==want){e.textContent='⚠️ Kod ini bukan giliran seterusnya.';e.className='pchk bad'}
      else{e.textContent='✓ Kod sah — tekan Mainkan.';e.className='pchk ok'}}
    catch(err){e.textContent='⚠️ '+err.message;e.className='pchk bad'}
  },
  end(){this.on=false;this.hide()}
};
