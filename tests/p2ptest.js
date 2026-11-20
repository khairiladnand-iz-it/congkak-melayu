let ok=true;const chk=(c,m)=>{if(!c){ok=false;console.log('FAIL',m)}};
/* ---- pengesanan ---- */
chk(typeof P2P==='object','P2P wujud');
chk(typeof P2P.avail==='function','avail');
chk(P2P.URL.includes('trystero@0.27.0'),'versi disematkan: '+P2P.URL);
chk(P2P.avail()===false,'tiada WebRTC dalam harness -> avail false');
chk(/WebRTC/.test(P2P.why),'sebab dinyatakan: '+P2P.why);

/* ---- shim: pastikan ia berkelakuan seperti bilik Claude ---- */
const mkRoom=()=>{
  const H={msg:{},state:null,join:[],leave:[],err:[]};
  const room={
    ready:Promise.resolve(),
    getSelf:async()=>({userId:'saya',peerId:'p1',roomId:'r'}),
    getPeers:()=>({p2:{userId:'jebat'}}),
    makeAction:n=>({send:(d,o)=>{H.sent=H.sent||[];H.sent.push([n,d,o])},
                    onMessage:f=>{(H.msg[n]=H.msg[n]||[]).push(f);return()=>{}}}),
    makeUserState:(k,init)=>{H.state={v:init,all:{}};
      return{set:v=>{H.state.v=v},getAll:()=>H.state.all,
             onChange:f=>{H.state.cb=f;return()=>{}}}},
    onUserJoin:f=>{H.join.push(f);return()=>{}},
    onUserLeave:f=>{H.leave.push(f);return()=>{}},
    onError:f=>{H.err.push(f);return()=>{}},
    leave:async()=>{H.left=true}
  };
  return{room,H};
};
await (async()=>{
  const {room,H}=mkRoom();
  P2P.lib={joinRoom:()=>room};
  const ns=await P2P._wrap('ujian');

  chk(ns.me==='saya','identiti dari getSelf: '+ns.me);
  chk(typeof ns.emit==='function'&&typeof ns.on==='function'&&typeof ns.presence==='function'
      &&typeof ns.peers==='function'&&typeof ns.onPeers==='function'
      &&typeof ns.onConnection==='function'&&typeof ns.connected==='function'
      &&typeof ns.join==='function','antara muka lengkap gaya bilik Claude');

  /* peers mesti mengandungi diri sendiri (Lobi bergantung padanya) */
  const ps=ns.peers();
  const self=ps.find(p=>p.isMe&&p.sameTab);
  chk(!!self,'senarai peers mengandungi diri sendiri');
  chk(ps.some(p=>p.peer==='jebat'),'rakan dari getPeers disenaraikan');

  /* presence */
  await ns.presence({n:'Khairil',lv:7});
  chk(H.state.v.n==='Khairil','presence dihantar ke makeUserState');
  chk(ns.peers()[0].presence.lv===7,'presence sendiri dipaparkan');

  /* terima presence rakan */
  H.state.cb({n:'Jebat',lv:3},{userId:'jebat'});
  chk(ns.peers().find(p=>p.peer==='jebat').presence.n==='Jebat','presence rakan diterima');

  /* emit mesti hantar DAN bergema balik seperti bilik Claude */
  let got=[];
  ns.on('chat',m=>got.push(m));
  await ns.emit('chat',{i:3});
  chk(H.sent.some(([n,d])=>n==='chat'&&d.i===3),'emit menghantar melalui Trystero');
  await new Promise(r=>setTimeout(r,5));
  chk(got.length===1&&got[0].isMe===true&&got[0].sameTab===true,'gema sendiri (isMe) '+JSON.stringify(got[0]&&{i:got[0].data.i,me:got[0].isMe}));

  /* mesej masuk dari rakan */
  H.msg['chat'][0]({i:5},{userId:'jebat'});
  chk(got.length===2&&got[1].peer==='jebat'&&got[1].isMe===false,'mesej rakan dipetakan');

  /* onPeers dipanggil bila rakan masuk */
  let pc=0; ns.onPeers(()=>pc++);
  await new Promise(r=>setTimeout(r,5));
  const before=pc; H.join[0]({userId:'tuah',peerId:'p3'});
  chk(pc>before,'onPeers dipicu oleh onUserJoin');
  chk(ns.connected()===true,'connected selepas rakan masuk');

  /* keluar */
  H.leave[0]({userId:'jebat'});
  chk(!ns.peers().some(p=>p.peer==='jebat'),'rakan dibuang bila keluar');

  /* bilik anak untuk perlawanan */
  const sub=await ns.join('cm5-ab12c');
  chk(sub&&typeof sub.emit==='function','join() memulangkan bilik anak');

  await ns.leave(); chk(H.left===true,'leave menutup bilik');

  /* Rm mesti pilih P2P bila tersedia */
  P2P.avail=()=>true; P2P.root=null; P2P.ns=async()=>ns;
  Rm.tried=false; Rm.ns=null; Rm.mode='';
  const got2=await Rm.init();
  chk(got2===ns&&Rm.mode==='p2p','Rm.init memilih P2P: mode='+Rm.mode);
  chk(Rm.avail()===true,'Rm.avail true melalui P2P');

  console.log(ok?'P2P OK':'P2P FAILED');
})();
