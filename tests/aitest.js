/* Keseimbangan AI: tahap Susah mesti boleh dikalahkan oleh manusia.
   "Pemula" = AI.nampak (langkah yang manusia nampak tanpa mengira rantaian sambung).
   Dulu pemula menang 15% lawan Sederhana dan 0% lawan Susah. Benih tetap supaya keputusan stabil. */
let ok=true;const chk=(c,m)=>{if(!c){ok=false;console.log('FAIL',m)}};
const pemula=(b,n,p)=>AI.nampak(b,n,p,Rules.legal(b,n,p));
function game(A,B,n,s,first){let b=Array(2*n+2).fill(0);for(const p of[0,1])for(const i of Rules.holes(n,p))b[i]=s;
  let t=first,g=0;const pl=[A,B];
  while(!Rules.over(b,n)&&g++<500){const r=Rules.resolve(b,n,t,pl[t](b,n,t));b=r.b;if(!r.extra)t=1-t}
  return Rules.winner(Rules.sweep(b,n),n)}
const kadar=lvl=>{RNG.seed(4242+lvl);let w=0;const N=160;
  for(let i=0;i<N;i++)if(game(pemula,(b,n,p)=>AI.pick(b,n,p,lvl),7,7,i%2)===0)w++;RNG.off();return w/N};
const k1=kadar(1),k2=kadar(2),k3=kadar(3);
console.log('pemula menang: Mudah',Math.round(k1*100)+'%','Sederhana',Math.round(k2*100)+'%','Susah',Math.round(k3*100)+'%');
chk(k1>=.55,'Mudah mudah dikalahkan');
chk(k2>=.3&&k2<=.6,'Sederhana seimbang untuk pemula');
chk(k3>=.15&&k3<k2,'Susah lebih sukar tetapi masih boleh dikalahkan');
chk(AI.Q[3]<1&&AI.Q[2]<AI.Q[3],'peluang mengira tepat naik ikut tahap');
console.log(ok?'AI OK':'AI FAILED');
