let ok=true;const chk=(c,m)=>{if(!c){ok=false;console.log('FAIL',m)}};
/* --- tapisan bahasa --- */
chk(Tapis.bad('babi kau'),'bad simple');
chk(Tapis.bad('b4b1'),'leetspeak');
chk(Tapis.bad('PUKIMAK!!!'),'hard caps');
chk(Tapis.bad('you are a f u c k'===0?'':'fuuuck'),'repeat stretch');
chk(Tapis.bad('sh!t'),'symbol sub');
chk(!Tapis.bad('selamat pagi semua'),'clean malay');
chk(!Tapis.bad('bagus sekali permainan ni'),'clean 2');
chk(!Tapis.bad('Hang Tuah lawan Hang Jebat'),'names ok');
chk(!Tapis.bad('assassin classic'),'no substring false-positive');
chk(Tapis.clean('kau ni bodoh betul')==='kau ni ***** betul','clean mask ['+Tapis.clean('kau ni bodoh betul')+']');
chk(Tapis.clean('apa khabar')==='apa khabar','clean passthrough');
/* --- nick --- */
chk(Prof.setNick('ab')!==true,'nick too short');
chk(Prof.setNick('bodoh123')!==true,'nick profanity');
chk(Prof.setNick('Khai<script>')!==true,'nick symbols');
chk(Prof.setNick('Panglima Awang')===true,'nick ok');
chk(Prof.nick()==='Panglima Awang','nick stored '+Prof.nick());
chk(JSON.parse(JSON.stringify(Prof.pack())).nk==='Panglima Awang','nick packed');
const p2={xp:9,nk:'Tun Teja'};Prof.nk='';Prof.merge(p2);chk(Prof.nick()==='Tun Teja','nick merged '+Prof.nick());
/* --- lobi tanpa bilik (Rm tak tersedia) --- */
Lobi.peers=[{peer:'a',isMe:true,sameTab:true,presence:{n:'Saya',lv:7,st:'idle',h:0}},
            {peer:'b',isMe:false,guest:true,presence:{n:'kau bodoh',lv:3,st:'main',h:2}},
            {peer:'c',kind:'agent',presence:{n:'ejen'}}];
Lobi.me='a';Lobi.ready=true;
chk(Lobi.count()===2,'count ignores agent '+Lobi.count());
document.getElementById('lobi').hidden=false;Lobi.paint();
const h=document.getElementById('lobi').innerHTML;
chk(h.length>500,'shell built '+h.length);
Lobi.paintPeers();
const ph=document.getElementById('lbps').innerHTML;
chk(ph.includes('Lv 7')&&ph.includes('Lv 3'),'levels shown');
chk(ph.includes('*****'),'peer nick filtered');
chk(ph.includes('tetamu'),'guest tag');
chk(ph.includes('Sedang bermain'),'status');
chk((ph.match(/data-l="chal"/g)||[]).length===1,'one challenge button');
/* --- sembang --- */
Lobi.onChat({peer:'b',isMe:false,data:{i:0}});
Lobi.onChat({peer:'a',isMe:true,data:{i:1}});
chk(Lobi.chat.length===2,'chat len');
chk(Lobi.chat[1].me===true,'own msg flagged');
/* teks bebas MESTI ditolak sepenuhnya */
Lobi.onChat({peer:'b',data:{t:'BELI MURAH www.spam.com'}});
Lobi.onChat({peer:'b',data:{i:'1'}});
Lobi.onChat({peer:'b',data:{i:999}});
Lobi.onChat({peer:'b',data:{i:-1}});
Lobi.onChat({peer:'b',data:{i:1.5}});
chk(Lobi.chat.length===2,'free text + bad index rejected '+Lobi.chat.length);
Lobi.paintChat();
chk(document.getElementById('lbch').innerHTML.includes('Jom main'),'chat painted');
for(let i=0;i<140;i++)Lobi.onChat({peer:'b',data:{i:i%12}});
chk(Lobi.chat.length===60,'chat capped '+Lobi.chat.length);
/* had kadar */
let em=0;Lobi.ns={emit:()=>{em++;return Promise.resolve()},presence:()=>Promise.resolve()};
Lobi.last=0;Lobi.sent=[];Lobi.say(2);chk(em===1,'say sent');
Lobi.say(3);chk(em===1,'rate limited');
chk(FRASA.length===12,'frasa count');
/* --- cabaran --- */
let sent=[];Lobi.ns={emit:(t,d)=>{sent.push([t,d]);return Promise.resolve()},presence:()=>Promise.resolve()};
Lobi.onInv({peer:'b',isMe:false,data:{to:'a',code:'ab12c',n:'Jebat kesat bodoh'}});
chk(Lobi.inv&&Lobi.inv.code==='ab12c','invite stored');
chk(Lobi.inv.n.includes('*****'),'invite nick filtered '+Lobi.inv.n);
Lobi.paintPeers();chk(document.getElementById('lbps').innerHTML.includes('mencabar anda'),'invite shown');
Lobi.onInv({peer:'b',isMe:false,data:{to:'someone-else',code:'zz'}});
chk(Lobi.inv.code==='ab12c','invite for others ignored');
Lobi.decline();chk(Lobi.inv===null&&sent.some(x=>x[1].no),'decline sent');
/* --- muzik: semua mood sah --- */
for(const m of['menu','game','kembara','duel','win']){Mus.set(m);}
chk(typeof Mus.hot==='function'&&typeof Mus.gain==='function','mus api');
Mus.hot(.8);chk(Mus.heatv>.7,'heat set '+Mus.heatv);
Mus.cool();chk(Mus.heatv===0,'cool');
for(const k of['gong','kempul','bonang','saron','petik','drum','serunai','suling','rebab','kerincing'])
  chk(typeof Mus.sfx[k]==='function','sfx '+k);
for(const k of['knock','sow','tikam','parry','block','level','lose','fanfare','chime','clang','whoosh','ui','hit'])
  chk(typeof Snd[k]==='function','snd '+k);
Snd.mute=true;Snd.knock(4);Snd.sow(7);Snd.tikam(6);Snd.parry();Snd.block();Snd.level();Snd.lose();Snd.ui(1);
/* REGRESI: dua Lobi.init() serentak mesti melanggan SEKALI sahaja.
   Dulu Lobi.auto() dan ketukan butang berlumba, kedua-duanya melepasi
   pemeriksa 'ready', dan setiap mesej muncul dua kali. */
await (async()=>{
  let subs=0,chatCb=[];
  const fakeNs={
    on(t,f){subs++;if(t==='chat')chatCb.push(f);return()=>{}},
    onPeers(){return()=>{}},onConnection(){return()=>{}},
    presence(){return Promise.resolve()},peers(){return[]},connected(){return false}
  };
  Rm.tried=false;Rm.ns=null;Rm._p=null;Rm.mode='p2p';
  Rm.init=async()=>{await new Promise(r=>setTimeout(r,5));return fakeNs};
  Lobi.ready=false;Lobi.ns=null;Lobi._p=null;Lobi.off=[];Lobi.chat=[];
  await Promise.all([Lobi.init(),Lobi.init(),Lobi.init()]);
  chk(Lobi.ready===true,'lobi sedia selepas init serentak');
  chk(chatCb.length===1,'saluran sembang dilanggan sekali, bukan '+chatCb.length);
  /* satu mesej masuk mesti muncul sekali */
  for(const f of chatCb)f({peer:'x',isMe:false,data:{i:2}});
  chk(Lobi.chat.length===1,'mesej muncul sekali, bukan '+Lobi.chat.length+' kali');
})();

console.log(ok?'LOBI OK':'LOBI FAILED');
