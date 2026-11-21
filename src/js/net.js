/* ===== MAIN DALAM TALIAN (WebRTC peer-to-peer, tanpa pelayan) ===== */
const b64={e(u8){let s='';for(let i=0;i<u8.length;i+=8192)s+=String.fromCharCode.apply(null,u8.subarray(i,i+8192));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')},d(t){t=t.replace(/-/g,'+').replace(/_/g,'/');while(t.length%4)t+='=';const s=atob(t),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u}};
/* Kod pendek: ambil hanya medan SDP yang perlu, bina semula di sebelah sana.
   Memendekkan kod bilik daripada ~550 aksara kepada ~130 aksara. */
const SDPC={
  pack(sdp,ans){
    const G=re=>{const m=sdp.match(re);return m?m[1]:null};
    const uf=G(/a=ice-ufrag:(\S+)/),pw=G(/a=ice-pwd:(\S+)/),fp=G(/a=fingerprint:sha-256 ([0-9A-Fa-f:]+)/),su=G(/a=setup:(\S+)/);
    if(!uf||!pw||!fp||!su)return null;
    const fx=fp.replace(/:/g,'');if(fx.length!==64)return null;
    const cs=[],re=/a=candidate:\S+ (\d+) (\S+) \d+ (\S+) (\d+) typ (\S+)/g;let m;
    while((m=re.exec(sdp))){
      if(m[1]!=='1'||m[2].toLowerCase()!=='udp')continue;
      const ty=m[5];if(ty!=='host'&&ty!=='srflx')continue;
      const a=m[3],pt=+m[4];if(!(pt>0&&pt<65536))continue;
      if(cs.some(c=>c.a===a&&c.p===pt))continue;
      cs.push({t:ty==='host'?0:1,a,p:pt});if(cs.length>=12)break;
    }
    if(!cs.length)return null;
    const A=[],txt=t=>{const u=new TextEncoder().encode(t);if(u.length>200)return false;A.push(u.length);for(const b of u)A.push(b);return true};
    A.push(0x10|(ans?8:0)|(su==='active'?1:su==='passive'?2:0));
    if(!txt(uf)||!txt(pw))return null;
    for(let i=0;i<64;i+=2)A.push(parseInt(fx.substr(i,2),16));
    A.push(cs.length);
    for(const c of cs){
      const md=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.local$/i.test(c.a),
        v4=/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(c.a);
      if(md){A.push(c.t<<4|1);const h=c.a.slice(0,36).replace(/-/g,'');for(let i=0;i<32;i+=2)A.push(parseInt(h.substr(i,2),16))}
      else if(v4&&v4.slice(1).every(x=>+x<256)){A.push(c.t<<4|2);for(let i=1;i<=4;i++)A.push(+v4[i])}
      else{A.push(c.t<<4|3);if(!txt(c.a))return null}
      A.push(c.p>>8&255,c.p&255);
    }
    return new Uint8Array(A);
  },
  unpack(u){
    let i=0;const v=u[i++];if((v>>4)!==1)throw new Error('versi kod tidak dikenali');
    const setup=['actpass','active','passive'][v&7]||'actpass',ans=!!(v&8);
    const txt=()=>{const n=u[i++],t=new TextDecoder().decode(u.subarray(i,i+n));i+=n;return t};
    const uf=txt(),pw=txt();
    let fp='';for(let k=0;k<32;k++){fp+=(k?':':'')+u[i++].toString(16).padStart(2,'0').toUpperCase()}
    const nc=u[i++],cl=[];
    for(let k=0;k<nc;k++){
      const f=u[i++],ty=(f>>4)===1?'srflx':'host',fm=f&15;let a;
      if(fm===1){let h='';for(let j=0;j<16;j++)h+=u[i++].toString(16).padStart(2,'0');
        a=h.slice(0,8)+'-'+h.slice(8,12)+'-'+h.slice(12,16)+'-'+h.slice(16,20)+'-'+h.slice(20)+'.local'}
      else if(fm===2){const q=[u[i++],u[i++],u[i++],u[i++]];a=q.join('.')}
      else a=txt();
      const hi=u[i++],lo=u[i++];cl.push({ty,a,p:(hi<<8)|lo});
    }
    if(!uf||!pw||!cl.length)throw new Error('kod tidak lengkap');
    let s='v=0\r\no=- 1 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\na=msid-semantic: WMS\r\n'
      +'m=application 9 UDP/DTLS/SCTP webrtc-datachannel\r\nc=IN IP4 0.0.0.0\r\n';
    cl.forEach((c,k)=>{s+='a=candidate:'+(k+1)+' 1 udp '+(2130706431-k*256)+' '+c.a+' '+c.p+' typ '+c.ty+(c.ty==='srflx'?' raddr 0.0.0.0 rport 0':'')+' generation 0\r\n'});
    s+='a=end-of-candidates\r\na=ice-ufrag:'+uf+'\r\na=ice-pwd:'+pw+'\r\na=ice-options:trickle\r\n'
      +'a=fingerprint:sha-256 '+fp+'\r\na=setup:'+setup+'\r\na=mid:0\r\na=sctp-port:5000\r\na=max-message-size:262144\r\n';
    return{s,a:ans};
  }
};
/* ===== BILIK PANTAS: saluran masa nyata artifact (tanpa WebRTC) ===== */
const Rm={
  ns:null,room:null,code:'',host:false,tried:false,why:'',off:[],mode:'',_p:null,
  /* Dua pemanggil boleh meminta sambungan serentak (Net.show dan Lobi.auto).
     Tanpa menyimpan janji yang sedang berjalan, pemanggil kedua melihat
     tried=true tetapi ns masih null, lalu gagal dengan "tidak tersedia". */
  init(){
    if(this.ns)return Promise.resolve(this.ns);
    if(this._p)return this._p;
    this._p=this._init().then(ns=>{this._p=null;return ns},e=>{this._p=null;throw e});
    return this._p;
  },
  async _init(){
    if(this.tried&&!this.ns&&this.why)return this.ns;
    this.tried=true;
    /* laluan utama: P2P terus antara pelayar — tiada akaun, tiada pelayan */
    if(typeof P2P!=='undefined'&&P2P.avail()){
      try{const ns=await P2P.ns();
        if(ns){this.ns=ns;this.mode='p2p';return ns}
        this.why=P2P.why||'Sambungan terus gagal dimulakan.';
      }catch(e){this.why=P2P.why||'Pustaka P2P gagal dimuatkan (perlu internet).'}
    }
    try{
      if(typeof claude==='undefined'||!claude||typeof claude.use!=='function'){this.why='Halaman ini tidak disiarkan sebagai artifact.';return null}
      this.ns=await claude.use('room');
      if(this.ns)this.mode='claude';
      if(!this.ns)this.why='Saluran bilik tidak dibuka untuk paparan ini. Rakan perlu log masuk ke Claude dan dijemput ke artifact ini (menu Share).';
    }catch(e){this.ns=null;this.why='Saluran bilik gagal dimuatkan.'}
    return this.ns;
  },
  avail(){return!!this.ns},
  mkCode(){const A='abcdefghjkmnpqrstuvwxyz23456789';let t='';for(let i=0;i<5;i++)t+=A[Math.random()*A.length|0];return t},
  clean(t){return String(t||'').toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,5)},
  async join(code,host){
    const ns=await this.init();if(!ns)throw new Error(this.why||'Bilik pantas tidak tersedia.');
    await this.leave();
    this.code=code;this.host=!!host;
    const r2=this.room=await ns.join('cm5-'+code);
    this.off.push(r2.on('m',m=>{if(m.isMe&&m.sameTab)return;try{Net.recv(m.data)}catch(e){console.error(e)}},e=>Net.roomErr(e)));
    this.off.push(r2.onPeers(c=>Net.roomPeers(c)));
    this.off.push(r2.onConnection(()=>Net.ui()));
    this.pres({h:Net.mine.h,lv:Prof.lvl(),host:!!host});
    return r2;
  },
  send(o){if(!this.room)return;this.room.emit('m',o).catch(e=>{if(e&&e.code==='not_permitted')Net.permErr()})},
  pres(o){if(this.room)this.room.presence(o).catch(()=>{})},
  connected(){try{return!!(this.room&&this.room.connected())}catch(e){return false}},
  others(){try{return this.room?this.room.peers().filter(p=>!p.isMe&&p.kind!=='agent'):[]}catch(e){return[]}},
  async leave(){
    for(const f of this.off){try{f()}catch(e){}}this.off=[];
    const r2=this.room;this.room=null;if(r2){try{await r2.leave()}catch(e){}}
  }
};
const Net={
  pc:null,dc:null,tx:'',role:'',me:0,open:false,stage:'menu',code:'',err:'',busy:false,iv:0,t0:0,
  peer:{h:-1,lv:1},mine:{h:0},lv:[1,1],duelH:null,buf:[],bak:null,rm:[false,false],
  supported:()=>typeof RTCPeerConnection!=='undefined',
  async enc(o,ans){
    if(!cfg.longcode){try{const b=SDPC.pack(o.s,ans);if(b)return'C'+b64.e(b)}catch(e){console.warn('kod pendek gagal',e)}}
    o=Object.assign({},o,{a:ans?1:0});
    const u=new TextEncoder().encode(JSON.stringify(o));
    if(typeof CompressionStream!=='undefined'){const cs=new CompressionStream('deflate-raw'),w=cs.writable.getWriter();w.write(u);w.close();return'Z'+b64.e(new Uint8Array(await new Response(cs.readable).arrayBuffer()))}
    return'R'+b64.e(u);
  },
  async dec(t){
    t=String(t).replace(/[\s"'`<>]+/g,'');const k=t[0],u=b64.d(t.slice(1));
    if(k==='C')return SDPC.unpack(u);
    if(k==='Z'){if(typeof DecompressionStream==='undefined')throw new Error('Pelayar ini tidak menyokong kod mampat');const ds=new DecompressionStream('deflate-raw'),w=ds.writable.getWriter();w.write(u);w.close();return JSON.parse(new TextDecoder().decode(new Uint8Array(await new Response(ds.readable).arrayBuffer())))}
    if(k==='R')return JSON.parse(new TextDecoder().decode(u));
    throw new Error('Kod tidak sah');
  },
  mk(){
    const pc=this.pc=new RTCPeerConnection({iceServers:[{urls:['stun:stun.l.google.com:19302','stun:stun1.l.google.com:19302','stun:stun.cloudflare.com:3478']}]});
    pc.onconnectionstatechange=()=>{if(this.pc!==pc)return;const s=pc.connectionState;this.ui();if(s==='failed'||s==='closed')this.lost()};
    pc.oniceconnectionstatechange=()=>{if(this.pc===pc)this.ui()};
    return pc;
  },
  ice(pc){return new Promise(r=>{if(pc.iceGatheringState==='complete')return r();const f=()=>{if(pc.iceGatheringState==='complete'){pc.removeEventListener('icegatheringstatechange',f);r()}};pc.addEventListener('icegatheringstatechange',f);setTimeout(r,5000)})},
  bind(dc){
    this.dc=dc;dc.onopen=()=>{this.open=true;this.stage='lobby';this.mine.h=cfg.p[0]<NBASE?cfg.p[0]:0;this.send({t:'pick',h:this.mine.h,lv:Prof.lvl()});this.ui()};
    dc.onmessage=e=>{try{this.recv(JSON.parse(e.data))}catch(err){console.error(err)}};
    dc.onclose=()=>{if(this.dc===dc)this.lost()};
  },
  send(o){if(this.tx==='post')return Msg.take(o);if(this.tx==='room')return Rm.send(o);try{if(this.dc&&this.dc.readyState==='open')this.dc.send(JSON.stringify(o))}catch(e){}},
  reset(){this.unwatch();this.close(true);this.role='';this.code='';this.err='';this.peer={h:-1,lv:1};this.rm=[false,false]},
  roomOff(){if(this.tx==='room'){this.tx='';Rm.leave()}},
  close(quiet){const d=this.dc,p=this.pc;this.dc=this.pc=null;this.open=false;try{d&&d.close()}catch(e){}try{p&&p.close()}catch(e){}if(!quiet&&this.bak)this.restore()},
  restore(){Msg.end();if(this.bak){try{const o=JSON.parse(this.bak);for(const k in o)cfg[k]=o[k]}catch(e){}this.bak=null}Match.online=false;World.flip=false;document.getElementById('match').classList.remove('flip')},
  async host(){
    this.reset();this.role='host';this.me=0;this.busy=true;this.ui();
    try{const pc=this.mk();this.bind(pc.createDataChannel('c'));await pc.setLocalDescription(await pc.createOffer());await this.ice(pc);this.code=await this.enc({s:pc.localDescription.sdp},false);this.stage='host'}
    catch(e){this.err='Gagal mencipta bilik: '+e.message;this.stage='menu'}
    this.busy=false;this.ui();
  },
  async accept(t){
    this.err='';this.busy=true;this.ui();
    try{
      if(!t)throw new Error('kosong — tampal kod jawapan daripada rakan dahulu');
      const o=await this.dec(t);
      if(o.a===false||o.a===0)throw new Error('itu kod BILIK, bukan kod jawapan. Minta rakan tekan “Jana Kod Jawapan” dan hantar kod yang keluar');
      if(!this.pc)throw new Error('bilik sudah tutup — cipta bilik baharu');
      await this.pc.setRemoteDescription({type:'answer',sdp:o.s});this.stage='wait';this.watch()}
    catch(e){this.err='Kod jawapan tidak sah: '+e.message}
    this.busy=false;this.ui();
  },
  async join(t){
    this.err='';this.busy=true;this.ui();
    try{
      if(!t)throw new Error('kosong — tampal kod bilik daripada rakan dahulu');
      const o=await this.dec(t);
      if(o.a===true||o.a===1)throw new Error('itu kod JAWAPAN, bukan kod bilik. Minta rakan hantar kod daripada “Cipta Bilik”');
      this.close(true);this.role='guest';this.me=1;const pc=this.mk();pc.ondatachannel=e=>this.bind(e.channel);await pc.setRemoteDescription({type:'offer',sdp:o.s});await pc.setLocalDescription(await pc.createAnswer());await this.ice(pc);this.code=await this.enc({s:pc.localDescription.sdp},true);this.stage='guest';this.watch()}
    catch(e){this.err='Kod bilik tidak sah: '+e.message}
    this.busy=false;this.ui();
  },
  lost(){
    if(this.stage==='gone')return;const was=this.stage;this.stage='gone';this.open=false;
    if(Match.online&&Match.s&&!Match.s.over){Toast.show('Sambungan dengan lawan terputus.');Match.s.over=true;Match.s.busy=false;const d=document.getElementById('duel');if(d)d.hidden=true;if(this.duelH)this.duelH({t:'de',ko:false})}
    else if(was!=='menu'){this.err='Sambungan terputus.'}
    this.ui();
  },
  /* ---- mesej ---- */
  recv(m){
    switch(m.t){
      case'pick':this.peer={h:m.h,lv:m.lv|0||1};if(!Number.isInteger(m.h)||m.h<0||m.h>=NBASE)this.peer.h=-1;if(this.role==='host')this.send({t:'cfg',c:this.hostCfg()});if(this.role==='guest'&&this.peer.h===this.mine.h){this.mine.h=(this.mine.h+1)%NBASE;this.send({t:'pick',h:this.mine.h,lv:Prof.lvl()})}this.ui();break;
      case'cfg':if(this.role==='guest'){this.hc=m.c;this.ui()}break;
      case'go':if(this.role==='guest')this.begin(m.c,m.p,m.lv);break;
      case'mv':Match.remote(m.i,m.b);break;
      case'dh':case'dg':case'de':if(this.duelH)this.duelH(m);else this.buf.push(m);break;
      case'rm':this.rm[1-this.me]=true;this.chkRm();break;
      case'bye':this.stage='gone';this.open=false;if(Match.online&&Match.s&&!Match.s.over){Toast.show('Lawan telah keluar.')}this.ui();break;
    }
  },
  drain(){while(this.buf.length&&this.duelH)this.duelH(this.buf.shift())},
  chkRm(){if(this.rm[0]&&this.rm[1]&&this.role==='host'){this.rm=[false,false];this.goHost()}},
  /* ---- mula ---- */
  hostCfg(){return{n:cfg.n,seeds:cfg.seeds,wood:cfg.wood,seed:cfg.seed,fight:cfg.fight,speed:cfg.speed}},
  goHost(){
    if(this.peer.h<0||this.peer.h===this.mine.h)return;
    const p=[this.mine.h,this.peer.h],lv=[Prof.lvl(),this.peer.lv],c=this.hostCfg();
    this.send({t:'go',c,p,lv});this.begin(c,p,lv);
  },
  begin(c,p,lv){
    if(!this.bak)this.bak=JSON.stringify(cfg);
    this.lv=lv;this.rm=[false,false];this.buf=[];this.duelH=null;
    Object.assign(cfg,{n:c.n,seeds:c.seeds,wood:c.wood,seed:c.seed,fight:c.fight,speed:c.speed,vs:'2'});cfg.p=p.slice();
    document.getElementById('net').hidden=true;document.getElementById('result').hidden=true;Match.startOnline(this.me);
  },
  leave(){
    if(this.tx==='post'){Msg.end();this.restore();this.tx='';this.open=false;this.stage='menu';document.getElementById('net').hidden=true;Screen.go('menu');return}
    this.send({t:'bye'});this.stage='menu';this.close();this.roomOff();this.reset();document.getElementById('net').hidden=true;Screen.go('menu')},
  /* ---- bilik pantas ---- */
  async roomHost(){
    this.err='';this.busy=true;this.ui();
    try{const c=Rm.mkCode();this.tx='room';this.role='host';this.me=0;this.open=false;
      this.mine.h=HEROES[cfg.p[0]]&&cfg.p[0]<NBASE?cfg.p[0]:0;
      await Rm.join(c,true);this.stage='rmwait';this.t0=Date.now();this.wtick()}
    catch(e){this.err=e.message;this.stage='menu';this.tx=''}
    this.busy=false;this.ui();
  },
  async roomJoin(t){
    const c=Rm.clean(t);
    if(c.length<5){this.err='Kod bilik perlu 5 aksara.';return this.ui()}
    this.err='';this.busy=true;this.ui();
    try{this.tx='room';this.role='guest';this.me=1;this.open=false;
      this.mine.h=HEROES[cfg.p[0]]&&cfg.p[0]<NBASE?cfg.p[0]:1;
      await Rm.join(c,false);this.stage='rmwait';this.t0=Date.now();this.wtick()}
    catch(e){this.err=e.message;this.stage='menu';this.tx=''}
    this.busy=false;this.ui();
  },
  /* masuk bilik yang sudah ditetapkan (dari lobi / cabaran) */
  async roomEnter(code,host){
    this.err='';this.busy=true;this.stage='rmwait';this.ui();
    try{const c=Rm.clean(code);this.tx='room';this.role=host?'host':'guest';this.me=host?0:1;this.open=false;
      this.mine.h=HEROES[cfg.p[0]]&&cfg.p[0]<NBASE?cfg.p[0]:(host?0:1);
      await Rm.join(c,!!host);this.stage='rmwait';this.t0=Date.now();this.wtick()}
    catch(e){this.err=e.message;this.stage='menu';this.tx=''}
    this.busy=false;this.ui();
  },
  p2p(){return Rm.mode==='p2p'},
  roomPeers(c){
    if(this.tx!=='room')return;
    const o=Rm.others();
    if(o.length){
      if(!this.open){this.open=true;this.stage='lobby'}
      const pr=o[0].presence||{};
      if(Number.isInteger(pr.h)&&pr.h>=0&&pr.h<NBASE)this.peer={h:pr.h,lv:pr.lv|0||1};
      if(c&&c.joined&&c.joined.some(p=>!p.isMe)){
        Rm.pres({h:this.mine.h,lv:Prof.lvl(),host:this.role==='host'});
        this.send({t:'pick',h:this.mine.h,lv:Prof.lvl()});
        if(this.role==='host')this.send({t:'cfg',c:this.hostCfg()});
      }
    }else if(this.open){
      if(Match.online&&Match.s&&!Match.s.over)this.lost();
      else{this.open=false;this.stage='rmwait';this.peer={h:-1,lv:1}}
    }
    this.ui();
  },
  roomErr(e){
    if(this.tx!=='room')return;const c=e&&e.code;
    if(c==='not_granted'||c==='revoked'||c==='not_permitted'){
      this.err='Saluran bilik tidak dibenarkan untuk paparan ini. Rakan perlu log masuk ke Claude dan dijemput ke artifact ini melalui menu Share (beri kebenaran mengedit).';
      this.tx='';this.open=false;this.stage='menu';Rm.leave();
    }else if(Match.online&&Match.s&&!Match.s.over)this.lost();
    this.ui();
  },
  permErr(){if(!this.err)this.err='Paparan ini tidak dibenarkan menghantar dalam bilik. Minta pemilik artifact berkongsi dengan kebenaran mengedit.';this.ui()},
  wtick(){this.unwatch();this.iv=setInterval(()=>{
    if(this.stage!=='rmwait'||this.open){this.unwatch();this.ui();return}
    this.ui();},1000)},
  /* ---- pemantau sambungan ---- */
  unwatch(){if(this.iv)clearInterval(this.iv);this.iv=0;this.t0=0},
  watch(){
    this.unwatch();this.t0=Date.now();
    this.iv=setInterval(()=>{
      if(this.open||this.stage==='lobby'||this.stage==='menu'||this.stage==='gone'){this.unwatch();this.ui();return}
      if(Date.now()-this.t0>45000){
        this.unwatch();this.close(true);this.stage='menu';
        this.err='Tidak dapat menyambung selepas 45 saat. Pastikan kedua-dua peranti berada pada WiFi yang SAMA (bukan data mudah alih), matikan VPN, dan cuba cipta bilik baharu. WiFi awam, hotel dan kampus selalunya menyekat peranti daripada bercakap sesama sendiri — guna hotspot telefon sebagai ganti.';
        this.ui();return}
      this.ui();
    },1000);
  },
  stLine(){
    const p=this.pc;if(!p)return'';
    const M={new:'bersedia',checking:'mencari laluan…',connecting:'menyambung…',connected:'bersambung ✓',completed:'bersambung ✓',disconnected:'terputus seketika',failed:'gagal',closed:'tutup'};
    const t=this.t0?' · '+Math.round((Date.now()-this.t0)/1000)+'s':'';
    return`<p class="nst">Status sambungan: <b>${esc(M[p.connectionState]||M[p.iceConnectionState]||p.connectionState||'—')}</b>${t}</p>`;
  },
  copyX(x){try{if(!x)return false;const ro=x.hasAttribute('readonly');x.removeAttribute('readonly');x.focus();x.select();x.setSelectionRange(0,999999);const ok=document.execCommand('copy');if(ro)x.setAttribute('readonly','');return!!ok}catch(e){return false}},
  copy(){
    const x=document.getElementById('ncode'),t=this.code;if(!t)return;
    const ok=()=>Toast.show('Kod disalin. Hantar kepada rakan.');
    const man=()=>{const ro=x&&x.hasAttribute('readonly');if(x){x.removeAttribute('readonly');x.focus();x.select();x.setSelectionRange(0,999999);if(ro)x.setAttribute('readonly','')}
      Toast.show('Kod sudah dipilih — tekan & tahan kod itu, kemudian pilih “Salin”.')};
    try{
      if(navigator.clipboard&&navigator.clipboard.writeText){
        navigator.clipboard.writeText(t).then(ok,()=>{this.copyX(x)?ok():man()});return}
    }catch(e){}
    this.copyX(x)?ok():man();
  },
  /* ---- antara muka ---- */
  show(){this.stage=this.open?'lobby':'menu';this.err='';document.getElementById('net').hidden=false;this.ui();
    if(!Rm.tried)Rm.init().then(()=>this.ui());},
  chips(k,label,opts,cur,lk){return`<div class="row"><h3>${label}</h3><div class="chips">${opts.map(([v,t])=>{const need=lk?lk(v):0;return`<button class="chip${String(cur)===String(v)?' on':''}${need?' lock':''}" data-nk="${k}" data-v="${v}">${need?'🔒 ':''}${t}${need?' Lv'+need:''}</button>`}).join('')}</div></div>`},
  ui(){
    const o=document.getElementById('net');if(!o||o.hidden)return;
    const keep={};for(const id of['nans','nin','rmin','msgin']){const e=document.getElementById(id);if(e&&e.value)keep[id]=e.value}
    const ta=(id,ph,v)=>`<textarea id="${id}" rows="4" placeholder="${ph}" spellcheck="false"${v?' readonly':''}>${v||''}</textarea>`;
    let b='';const L=Prof.lvl();
    if(this.stage==='menu'||this.stage==='gone'){
      const rmOn=Rm.avail(),rtc=this.supported();
      b=(this.stage==='gone'?'<p class="nerr">Sambungan terputus. Mula semula untuk bermain lagi.</p>':'')
      +((!rmOn&&!rtc&&Rm.tried)?`<div class="lbsite"><b>Anda sedang membuka salinan pratonton.</b>
          <p>Bilik pantas perlu sambungan terus antara pelayar, yang tidak dibenarkan di sini.
             <b>Laman penuh tidak meminta log masuk</b> dan membenarkannya.</p>
          <a class="btn" href="${SITE}" target="_blank" rel="noopener">🌐 Buka Laman Penuh</a>
          <small>Kongsi pautan laman penuh dengan kawan, bukan pautan pratonton.</small></div>`:'')
      +`<div class="nsec${rtc?'':' off'}"><h3>📶 WiFi Sama <small>tiada pelayan</small></h3>`
      +(rtc?`<p class="hnote"><b>Paling boleh diharap.</b> Dua peranti pada WiFi yang sama bercakap terus antara satu sama lain — tiada pelayan di tengah, jadi tiada apa yang boleh tergendala. Kod dihantar dua kali: kod bilik kepada rakan, kod jawapan balik kepada hos.</p>
        <div class="nbtn"><button class="btn" data-n="host"${this.busy?' disabled':''}>🏠 Cipta Bilik</button><button class="btn" data-n="joinui">🔗 Sertai Bilik</button></div>
        <label class="nchk"><input type="checkbox" id="nlong"${cfg.longcode?' checked':''}> Guna kod panjang (jika kod pendek gagal)</label>`
        :`<p class="hnote">Tidak tersedia di sini: halaman ini berjalan dalam bingkai yang menyekat WebRTC. Cara ini hanya berfungsi jika fail permainan dibuka terus dalam pelayar.</p>`)
      +`</div>`      +`<div class="nsec${rmOn?' ok':''}"><h3>⚡ Bilik Pantas <small>perlu pelayan isyarat</small></h3>`
      +(rmOn?`<p class="hnote">Terus bersambung — tiada kod panjang, tidak perlu WiFi yang sama. Seorang tekan Cipta Bilik dan beritahu rakan <b>5 aksara</b> kod itu.</p>
        <div class="nbtn"><button class="btn" data-n="rmhost"${this.busy?' disabled':''}>🏠 Cipta Bilik</button><button class="btn" data-n="rmjoinui">🔗 Masukkan Kod</button></div>
        <p class="hnote">${this.p2p()
          ?'Sambungan terus antara pelayar melalui WebRTC. Tiada akaun, tiada pelayan — rakan hanya perlu buka pautan permainan yang sama.'
          :'Rakan perlu log masuk ke Claude dan dijemput ke halaman ini melalui menu <b>Share</b> (beri kebenaran mengedit). Pautan awam sahaja tidak mencukupi.'}</p>`
        :(Rm.tried?`<p class="nerr">${esc(Rm.why||'Tidak tersedia dalam paparan ini.')}</p>`:'<p class="hnote">Memeriksa saluran bilik…</p>'))
      +`</div>`

      +`<div class="nsec"><h3>✉️ Main Melalui Mesej <small class="any">tanpa akaun</small></h3>
        <p class="hnote">Tiada sambungan langsung. Setiap giliran menghasilkan kod pendek (4–6 aksara) yang anda hantar melalui WhatsApp. Berfungsi pada mana-mana pelayar, mana-mana rangkaian, tanpa log masuk.</p>
        <div class="nbtn"><button class="btn" data-n="msgnew">▶ Mula (saya Pemain 1)</button><button class="btn" data-n="msgjoinui">🔗 Sertai dengan Kod</button></div>
        <p class="hnote">Pemain 1 memilih papan, biji dan kedua-dua pahlawan dalam Persiapan dahulu.</p></div>`
      +`${this.busy?'<p class="hnote">Menyediakan sambungan…</p>':''}`;
    }
    else if(this.stage==='msgout')b=`<ol class="nstep"><li>Hantar <b>kod mula</b> ini kepada rakan sekali sahaja.</li><li>Tekan Mula Main. Anda bergerak dahulu.</li></ol>${ta('ncode','',this.code)}<div class="center"><button class="btn sm" data-n="copy">📋 Salin</button> <button class="btn sm" data-n="share">📤 Kongsi</button></div><div class="center"><button class="btn" data-n="msggo">▶ Mula Main</button></div>`;
    else if(this.stage==='msgjoin')b=`<ol class="nstep"><li>Tampal <b>kod mula</b> daripada rakan.</li></ol>${ta('msgin','Tampal kod mula…')}<div class="center"><button class="btn" data-n="msgjoin"${this.busy?' disabled':''}>Sertai Permainan</button></div>`;
    else if(this.stage==='rmjoin')b=`<ol class="nstep"><li>Masukkan <b>5 aksara</b> kod bilik daripada rakan. Ia akan menyertai sendiri sebaik cukup.</li></ol><div class="center"><input id="rmin" class="rmin" maxlength="5" autocomplete="off" spellcheck="false" placeholder="- - - - -"></div><div class="center"><button class="btn" data-n="rmjoin"${this.busy?' disabled':''}>Sertai</button></div>`;
    else if(this.stage==='rmwait'){const wt=this.t0?Math.round((Date.now()-this.t0)/1000):0;
      b=`<p class="hnote">Beritahu rakan kod ini. Mereka buka halaman yang sama, tekan <b>Dalam Talian → Masukkan Kod</b>.</p>
      <div class="rmcode" id="ncode2">${esc((Rm.code||'').toUpperCase())}</div>
      <div class="center"><button class="btn sm" data-n="copyrm">📋 Salin Kod</button> <button class="btn sm" data-n="wa">💬 WhatsApp</button></div>
      <p class="hnote">${this.role==='host'?'Menunggu rakan menyertai…':'Menunggu pemain lain dalam bilik…'} ${wt?'('+wt+'s)':''}</p>
      <p class="nst">Saluran: <b>${Rm.connected()?'bersambung ✓':'menyambung…'}</b></p>
      ${wt>25?'<p class="nerr">Masih tiada sesiapa. Pastikan rakan menaip kod yang sama, dan mereka log masuk ke Claude serta dijemput ke halaman ini melalui menu Share.</p>':''}`;}
    else if(this.stage==='host')b=`<ol class="nstep"><li>Hantar <b>kod bilik</b> ini kepada rakan (WhatsApp, Telegram, apa sahaja). Kalau butang Salin tidak menjadi, kod akan dipilih — tekan & tahan lalu pilih Salin.</li></ol>${ta('ncode','',this.code)}<div class="center"><button class="btn sm" data-n="copy">📋 Salin</button> <button class="btn sm" data-n="share">📤 Kongsi</button></div><ol class="nstep" start="2"><li>Rakan hantar balik <b>kod jawapan</b>. Tampal di sini, kemudian tekan Sambung.</li></ol>${ta('nans','Tampal kod jawapan…')}<div class="center"><button class="btn" data-n="accept"${this.busy?' disabled':''}>Sambung</button></div>${this.stLine()}`;
    else if(this.stage==='join')b=`<ol class="nstep"><li>Tampal <b>kod bilik</b> daripada rakan di sini, kemudian tekan butang di bawah.</li></ol>${ta('nin','Tampal kod bilik…')}<div class="center"><button class="btn" data-n="join"${this.busy?' disabled':''}>Jana Kod Jawapan</button></div>`;
    else if(this.stage==='guest')b=`<ol class="nstep" start="2"><li>Hantar <b>kod jawapan</b> ini kembali kepada hos. Sambungan bermula sendiri sebaik hos menekan Sambung.</li></ol>${ta('ncode','',this.code)}<div class="center"><button class="btn sm" data-n="copy">📋 Salin</button> <button class="btn sm" data-n="share">📤 Kongsi</button></div><p class="hnote">Menunggu hos menyambung…</p>${this.stLine()}`;
    else if(this.stage==='wait')b=`<p class="hnote">Menyambung ke rakan…</p>${this.stLine()}`;
    else if(this.stage==='lobby'){
      const host=this.role==='host',c=host?this.hostCfg():(this.hc||this.hostCfg()),ph=this.peer.h;
      const pick=`<h3>Pilih pahlawan anda</h3><div class="chips">${HEROES.slice(0,NBASE).map((a,j)=>`<button class="av${this.mine.h===j?' on':''}"${ph===j?' disabled':''} data-n="hero" data-v="${j}"><img src="${IMGS[j]}" alt=""><u class="elc" style="--ec:${ELEM[elOf(j)].c}">${ELEM[elOf(j)].e}</u>${esc(a.n)}</button>`).join('')}</div>`;
      b=`<div class="lobby"><div class="lb1"><img src="${IMGS[this.mine.h]}" alt=""><b>${esc(HEROES[this.mine.h].n)}</b>${elBadge(this.mine.h)}<small>Anda · Lv ${L}</small></div><div class="vs">VS</div><div class="lb1">${ph>=0?`<img src="${IMGS[ph]}" alt=""><b>${esc(HEROES[ph].n)}</b>${elBadge(ph)}<small>Lawan · Lv ${this.peer.lv}</small>`:'<div class="q">?</div><b>Menunggu…</b>'}</div></div>${pick}
      ${host?this.chips('n','Bilangan lubang',[[5,'5'],[6,'6'],[7,'7'],[8,'8'],[9,'9']],c.n)+this.chips('wood','Jenis kayu',WOODN,c.wood,v=>Prof.okWood(v,L)?0:Prof.lvOf('wood',v))+this.chips('seed','Jenis biji',SEEDS,c.seed,v=>Prof.okSeed(v,L)?0:Prof.lvOf('seed',v))+this.chips('seeds','Biji setiap lubang',[[3,'3'],[5,'5'],[7,'7']],c.seeds)+this.chips('fight','Pertarungan tikam',[['live','Interaktif'],['auto','Auto'],['skip','Langkau']],c.fight):`<p class="hnote">Hos menetapkan papan: ${c.n} lubang · ${esc((WOODN.find(w=>w[0]===c.wood)||[0,c.wood])[1])} · ${esc((SEEDS.find(w=>w[0]===c.seed)||[0,c.seed])[1])} · ${c.seeds} biji</p>`}
      ${host?`<div class="center"><button class="btn" data-n="go"${ph<0?' disabled':''}>▶ MULA MAIN</button></div>`:'<p class="hnote">Menunggu hos memulakan permainan…</p>'}`;
    }
    o.innerHTML=`<div class="panel net"><h2>Main Dalam Talian</h2>${this.err?`<p class="nerr">${esc(this.err)}</p>`:''}${b}<div class="center"><button class="btn sm" data-n="close">${this.open?'Keluar Bilik':'Tutup'}</button></div></div>`;
    for(const id in keep){const e=document.getElementById(id);if(e)e.value=keep[id]}
  },
  click(e){
    if(e.target&&e.target.id==='nlong'){cfg.longcode=!!e.target.checked;saveCfg();return}
    if(e.target&&e.target.id==='rmin')return;
    const g=e.target.closest('[data-n],[data-nk]');if(!g)return;const n=g.dataset.n,v=g.dataset.v,$=id=>{const x=document.getElementById(id);return x?x.value.trim():''};
    if(g.dataset.nk){if(g.classList.contains('lock'))return Toast.show('Dibuka pada level yang lebih tinggi.');const k=g.dataset.nk;cfg[k]=['n','seeds','speed'].includes(k)?+v:v;saveCfg();this.send({t:'cfg',c:this.hostCfg()});return this.ui()}
    switch(n){
      case'msgnew':return Msg.start();
      case'msggo':return Msg.go();
      case'msgjoinui':this.stage='msgjoin';this.err='';return this.ui();
      case'msgjoin':return Msg.join($('msgin'));
      case'copyrm':{const t=(Rm.code||'').toUpperCase();const el=document.getElementById('ncode2');
        const ok=()=>Toast.show('Kod disalin.');
        try{if(navigator.clipboard&&navigator.clipboard.writeText)return void navigator.clipboard.writeText(t).then(ok,()=>Msg.selRange(el))}catch(er){}
        return Msg.selRange(el)}
      case'wa':{const t='Jom main Congkak Melayu! Kod bilik: '+(Rm.code||'').toUpperCase()+' — buka permainan, tekan Dalam Talian, Masukkan Kod.';
        try{window.open('https://wa.me/?text='+encodeURIComponent(t),'_blank','noopener')}catch(er){Toast.show('Tidak dapat membuka WhatsApp. Guna butang Salin.')}return}
      case'rmhost':return this.roomHost();
      case'rmjoinui':this.stage='rmjoin';this.err='';return this.ui();
      case'rmjoin':return this.roomJoin($('rmin'));
      case'host':return this.host();
      case'joinui':this.stage='join';this.err='';return this.ui();
      case'join':return this.join($('nin'));
      case'accept':return this.accept($('nans'));
      case'copy':return this.copy();
      case'share':{if(navigator.share){try{navigator.share({text:this.code}).catch(()=>this.copy())}catch(er){this.copy()}}else this.copy();return}
      case'hero':this.mine.h=+v;this.send({t:'pick',h:+v,lv:Prof.lvl()});if(this.tx==='room')Rm.pres({h:+v,lv:Prof.lvl(),host:this.role==='host'});return this.ui();
      case'go':return this.goHost();
      case'close':if(this.open)return this.leave();this.unwatch();this.close(true);this.roomOff();this.stage='menu';document.getElementById('net').hidden=true;return;
    }
  },
  /* tekan 'Main Semula' di skrin keputusan */
  again(){this.rm[this.me]=true;this.send({t:'rm'});this.chkRm();Toast.show('Menunggu lawan bersetuju…')}
};
