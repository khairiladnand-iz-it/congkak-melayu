const U2=()=>new Proxy(function(){},{get:(t,k)=>k===Symbol.toPrimitive?()=>0:U2(),apply:()=>U2(),set:()=>true});
window.AudioContext=function(){return new Proxy({get currentTime(){return window.__T||0},sampleRate:8000,state:'running',createBuffer:()=>({getChannelData:()=>new Float32Array(8000)})},{get:(t,k)=>k in t?t[k]:(()=>U2()),set:()=>true})};
const mk=()=>new Proxy(function(){},{get:(t,k)=>k==='currentTime'?0:k==='sampleRate'?8000:k==='getChannelData'?()=>new Float32Array(8000):(()=>mk()),set:()=>true,apply:()=>mk()});
let ct=0;
cfg.music=true;Snd.mute=false;
Mus.start();console.log('mus on',Mus.on);
for(const m of['menu','game','duel']){Mus.set(m)}
['gong','drum','chime','clang','whoosh','hit','tikam','fanfare'].forEach(k=>Snd[k]());
Hist.open(-1);Hist.open(3);console.log('hist html',document.getElementById('hist').innerHTML.length>1000);
Mus.sync();cfg.music=false;Mus.sync();console.log('ok2');

cfg.music=true;Mus.start();window.__T=0;for(const m of['menu','game','duel']){Mus.set(m);for(let k=1;k<=40;k++){window.__T=(window.__T||0)+1;Mus.tick()}}console.log('ticks ok');
