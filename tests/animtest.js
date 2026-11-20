let ok=true;const chk=(c,m)=>{if(!c){ok=false;console.log('FAIL',m)}};
const near=(a,b,t)=>Math.abs(a-b)<(t||1e-6);

/* ---- lengkung pelonggaran ---- */
chk(typeof EASE==='object','EASE wujud');
for(const k of ['lin','inout','out','back','bounce']){
  const f=EASE[k];
  chk(typeof f==='function','ada '+k);
  chk(near(f(0),0,1e-6),k+': bermula pada 0 -> '+f(0));
  chk(near(f(1),1,1e-6),k+': berakhir pada 1 -> '+f(1));
  /* tiada NaN di mana-mana */
  let bad=null;
  for(let u=0;u<=1.0001;u+=0.01){const v=f(u);if(!isFinite(v)){bad=u;break}}
  chk(bad===null,k+': nilai tak terhingga pada u='+bad);
}
/* 'back' mesti melajak melebihi 1 (itu yang memberi rasa berat) */
let maxBack=0;for(let u=0;u<=1;u+=0.01)maxBack=Math.max(maxBack,EASE.back(u));
chk(maxBack>1.02,'back melajak melebihi 1: '+maxBack.toFixed(3));
/* 'out' mesti pantas pada mulanya */
chk(EASE.out(0.25)>0.5,'out bermula pantas: '+EASE.out(0.25).toFixed(3));
/* 'bounce' mesti melantun (sekurang-kurangnya satu penurunan) */
let dips=0,prev=EASE.bounce(0);
for(let u=0.01;u<=1;u+=0.01){const v=EASE.bounce(u);if(v<prev-1e-9)dips++;prev=v}
chk(dips>0,'bounce melantun: '+dips+' penurunan');
/* inout simetri di tengah */
chk(near(EASE.inout(0.5),0.5,1e-9),'inout simetri');

/* ---- kadar masa & gerak perlahan ---- */
chk(World.rate===1,'kadar lalai 1');
chk(typeof World.slomo==='function','slomo wujud');
World.slomo(2.1,30);
chk(World.rate===2.1,'slomo menaikkan kadar: '+World.rate);

/* tempoh mesti didarab dengan kadar ketika tween dicipta */
World.ok=true;World.tw=[];
const fake={p:{x:0,y:0,z:0},m:{position:{set(){}},visible:true}};
World.tween(fake,{x:10,y:0,z:0},200,0,'out');
chk(World.tw.length===1,'tween didaftar');
chk(near(World.tw[0].dur,420,1e-6),'tempoh didarab kadar: '+World.tw[0].dur);
chk(World.tw[0].ez==='out','nama lengkung disimpan: '+World.tw[0].ez);
World.tw=[];

await new Promise(r=>setTimeout(r,60));
chk(World.rate===1,'kadar pulih selepas slomo: '+World.rate);

/* tween tanpa 3D mesti selesai serta-merta, bukan tergantung */
World.ok=false;
let done=false;
World.tween(fake,{x:1,y:1,z:1},0,0,'back').then(()=>{done=true});
await new Promise(r=>setTimeout(r,10));
chk(done===true,'tempoh sifar selesai serta-merta (tiada gelung tergantung)');

console.log(ok?'ANIM OK':'ANIM FAILED');
