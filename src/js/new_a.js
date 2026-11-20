const SEEDS=[['saga','Biji Saga'],['guli','Guli Kaca'],['batu','Batu Sungai'],['kulit','Cangkerang'],['emas','Emas'],['mutiara','Mutiara'],['zamrud','Zamrud'],['delima','Delima'],['nilam','Nilam'],['bara','Bara Api'],['planet','Planet'],['bintang','Bintang Bercahaya']];
const WOODN=[['jati','Jati'],['hitam','Kayu Hitam'],['merah','Merbau Merah'],['emas','Nangka Emas'],['cendana','Cendana'],['giok','Giok Hijau'],['nilam','Nilam Biru'],['perak','Perak Ukir'],['bara','Bara Menyala'],['angkasa','Angkasa Malam'],['diraja','Songket Diraja']];
const KD={multi:['🗡️','#f2c14e','Hujan Senjata'],x:['⚔️','#ff5a5a','Tetakan Silang'],rain:['🏹','#7affc8','Hujan Panah'],rings:['👑','#ffd45a','Gelombang Diraja'],stamp:['TITAH','#ffd45a','Cop Titah'],stomp:['🐘','#c8a070','Hentakan Berat'],petals:['🌸','#ff9ac8','Kelopak Berputar'],ink:['✒️','#8a6aff','Percikan Tinta'],aura:['👊','#e8f0ff','Aura Silat'],wave:['🔱','#6ac8ff','Ombak Besar']};
/* ===== TETAPAN ===== */
const FLN=[['songket','Songket Emas'],['jubin','Jubin Bunga Istana'],['tikar','Tikar Mengkuang'],['rebung','Pucuk Rebung'],['kawung','Batik Kawung'],['marmar','Marmar Diraja'],['langit','Cermin Langit']];
const DEF={face:true,vibe:true,longcode:false,wood:'jati',floor:'songket',n:7,seeds:7,seed:'saga',p:[0,1],vs:'ai',lvl:2,fight:'live',speed:1,confirm:'auto',mute:false,music:true};
const cfg=JSON.parse(JSON.stringify(DEF));
function fixCfg(free){
  /* peringkat Kembara memakai papan wataknya sendiri, tanpa mengira level */
  if(!free&&typeof Quest!=='undefined'&&Quest.bak!=null)free=true;
  if(!WOODN.some(w=>w[0]===cfg.wood))cfg.wood='jati';
  if(typeof cfg.vibe!=='boolean')cfg.vibe=true;
  if(typeof cfg.face!=='boolean')cfg.face=true;
  if(!FLN.some(f=>f[0]===cfg.floor))cfg.floor='songket';
  if(!free){const L=Prof.lvl();if(!Prof.okFloor(cfg.floor,L))cfg.floor='songket';if(!Prof.okWood(cfg.wood,L))cfg.wood='jati';if(!Prof.okSeed(cfg.seed,L))cfg.seed='saga'}
  if(![5,6,7,8,9].includes(cfg.n))cfg.n=7;
  if(![3,5,7].includes(cfg.seeds))cfg.seeds=7;
  if(!SEEDS.some(s=>s[0]===cfg.seed))cfg.seed='saga';
  if(!Array.isArray(cfg.p)||!HEROES[cfg.p[0]])cfg.p=[0,1];
  if(!HEROES[cfg.p[1]]||cfg.p[1]===cfg.p[0])cfg.p[1]=cfg.p[0]===0?1:0;
  if(![1,2,3].includes(cfg.lvl))cfg.lvl=2;
  if(!['live','auto','skip'].includes(cfg.fight))cfg.fight='live';
  if(![1.6,1,.65,.4,.22].includes(cfg.speed))cfg.speed=1;
  if(!['auto','2'].includes(cfg.confirm))cfg.confirm='auto';
  if(cfg.vs!=='2')cfg.vs='ai';if(!Array.isArray(cfg.p)||cfg.p.some(i=>!HEROES[i]))cfg.p=[0,1];
  cfg.mute=!!cfg.mute;cfg.music=cfg.music!==false;Snd.mute=cfg.mute;
}
function loadCfg(){try{const o=JSON.parse(localStorage.getItem('cm14')||'null');if(o)for(const k in DEF)if(o[k]!==undefined)cfg[k]=o[k]}catch(e){}fixCfg()}
function saveCfg(){try{localStorage.setItem('cm14',JSON.stringify(cfg))}catch(e){}}
const initView=()=>{const n=cfg.n,a=Array(2*n+2).fill(cfg.seeds);a[n]=0;a[2*n+1]=0;return a};
