/* Had kadar bingkai — menghalang telefon daripada panas. */
let ok=true;const chk=(c,m)=>{if(!c){ok=false;console.log('FAIL',m)}};
chk(World.fps===30,'papan dihadkan 30 fps: '+World.fps);
chk(World.istEvery===2,'Istana separuh kadar: setiap '+World.istEvery);

/* tab di belakang -> jangan lukis langsung */
World._nextDraw=0;
chk(World.shouldDraw(1000,true,false)===false,'tab tersembunyi tidak dilukis');
chk(World._nextDraw===0,'bingkai tersembunyi tidak menjadualkan apa-apa');

/* lapisan penuh menutup papan -> jangan lukis */
chk(World.shouldDraw(1000,false,true)===false,'papan tertutup tidak dilukis');

/* had kadar: pada 30fps, jarak minimum 33.3ms */
World._nextDraw=0;
chk(World.shouldDraw(1000,false,false)===true,'bingkai pertama dilukis');
chk(World.shouldDraw(1010,false,false)===false,'10ms kemudian dilangkau');
chk(World.shouldDraw(1020,false,false)===false,'20ms kemudian dilangkau');
chk(World.shouldDraw(1040,false,false)===true,'40ms kemudian dilukis');

/* pada skrin 120Hz: daripada 120 panggilan sesaat, lebih kurang 30 dilukis */
World._nextDraw=0;let drawn=0;
for(let i=0;i<120;i++)if(World.shouldDraw(2000+i*(1000/120),false,false))drawn++;
/* grid 8.33ms tidak sejajar tepat dengan 33.3ms, jadi 24-31 adalah betul;
   yang penting ia jauh di bawah 120 */
chk(drawn>=24&&drawn<=31,'skrin 120Hz -> '+drawn+' lukisan sesaat, bukan 120');
chk(drawn<120/3,'kerja dikurangkan sekurang-kurangnya 3 kali ganda');

/* skrin 60Hz */
World._nextDraw=0;drawn=0;
for(let i=0;i<60;i++)if(World.shouldDraw(4000+i*(1000/60),false,false))drawn++;
chk(drawn>=24&&drawn<=31,'skrin 60Hz -> '+drawn+' lukisan sesaat, bukan 60');

chk(typeof World.covered==='function','pengesan lapisan wujud');
chk(MenuFx.fps===30,'kelopak menu dihadkan 30 fps: '+MenuFx.fps);
console.log(ok?'PERF OK':'PERF FAILED');
