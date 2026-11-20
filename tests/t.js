let bad=0;const E=__els,fail=m=>{console.log('FAIL',m);bad++};
const toast=()=>{const x=(E['#toast']&&E['#toast'].textContent)||'';return /Misi selesai|Kelajuan:/.test(x)?'':x};
const settle=async()=>{let g=0;while(Match.s.busy&&g++<200000)await new Promise(r=>setTimeout(r,0))};
if(Screen.cur!=='menu')fail('start screen');
if(World.ok&&toast())fail('toast after init: '+toast());
const tot=a=>a.reduce((x,y)=>x+y,0);
const held=()=>World.hold.map(a=>a.length);
let games=0;
for(const n of[5,6,7,8,9])for(const sp of[.6,1]){
  cfg.n=n;cfg.vs='2';cfg.fight='skip';cfg.seeds=5;cfg.speed=sp;cfg.wood=['jati','hitam','merah','emas'][n%4];cfg.seed=SEEDS[n%5][0];
  Match.start();const s=Match.s,T=2*n*5;let mv=0;
  while(!s.over&&mv<500){
    const cs=[...Match.canSet()];if(!cs.length){fail('no moves');break}
    Match.choose(cs[Math.random()*cs.length|0]);await settle();mv++;
    if(tot(s.b)!==T){fail('seed loss n='+n);break}
    if(World.ok&&JSON.stringify(held())!==JSON.stringify(s.b)){fail('3D piles differ from state n='+n+' '+held()+' vs '+s.b);break}
    if(World.ok&&World.hand.length){fail('hand not empty');break}
  }
  if(!s.over)fail('unfinished n='+n);games++;
}
console.log('games',games);
for(const lvl of[1,2,3]){cfg.n=7;cfg.vs='ai';cfg.lvl=lvl;cfg.fight='auto';cfg.speed=1;Match.start();const s=Match.s;let mv=0;
  while(!s.over&&mv<300){await settle();if(s.over)break;const cs=[...Match.canSet()];if(!cs.length){await new Promise(r=>setTimeout(r,0));mv++;continue}Match.choose(cs[0]);await settle();mv++}
  if(!s.over)fail('AI unfinished '+lvl)}
cfg.vs='2';cfg.fight='skip';cfg.confirm='auto';Match.start();const b0=Match.s.b.slice();
Match.hover(2);Match.hint();Match.choose(2);await settle();if(JSON.stringify(Match.s.b)===JSON.stringify(b0))fail('choose');
Match.undo();if(JSON.stringify(Match.s.b)!==JSON.stringify(b0))fail('undo');if(World.ok&&JSON.stringify(held())!==JSON.stringify(b0))fail('undo 3D');
cfg.confirm='2';Match.choose(1);if(Match.s.pend!==1||Match.s.busy)fail('confirm');cfg.confirm='auto';
for(const t of['mod','hero','board','more']){try{Setup.render(t)}catch(e){fail('setup '+t+' '+e.message)}}
const click=(k,v)=>Setup.click({target:{closest:()=>({dataset:{k,v}})}});
click('n','9');if(cfg.n!==9||(World.ok&&World.H.length!==20))fail('n select');
click('wood','hitam');click('seed','guli');click('p0','3');click('p1','3');if(cfg.p[0]===cfg.p[1])fail('same hero');
Match.resume();if(World.ok&&World.H.length!==2*Match.s.n+2)fail('resume rebuild');
cfg.vs='ai';cfg.fight='live';Prof.d.seen=99;{const z=await Duel.run(0,4);if(!z||typeof z.a!=='number'||typeof z.d!=='number')fail('duel')}
cfg.wood='zz';cfg.n=3;cfg.p=[9,99];fixCfg();if(cfg.wood!=='jati'||cfg.n!==7||cfg.p[0]===cfg.p[1])fail('fixCfg');
if(World.ok&&toast())fail('toast: '+toast());
console.log('problems',bad);
