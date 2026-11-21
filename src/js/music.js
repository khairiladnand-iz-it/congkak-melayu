/* ===== ARAHAN AUDIO: muzik gamelan & kesan bunyi (sintesis WebAudio, tiada fail audio) =====
   Rantaian: alat -> bas (mus/sfx) -> [kering + dewan(convolver) + gema] -> pemampat -> keluar */
const Mus=(()=>{
  const SC=[0,1,3,7,8],ROOT=146.83;              /* pelog-ringkas pada D */
  const fr=d=>ROOT*Math.pow(2,(SC[((d%5)+5)%5]+12*Math.floor(d/5))/12);
  let ctx=null,mst=null,sbus=null,wet=null,nb=null,ir=null,timer=null,
      nt=0,st=0,bar=0,mood='menu',on=false,started=false,heat=0,hT=0,vol=1;
  const LOW=(()=>{try{const c=navigator.hardwareConcurrency||4;
    return c<=4&&/Android|iPhone|iPad|iPod/i.test(navigator.userAgent||'')}catch(e){return false}})();
  const ac=()=>{if(ctx)return ctx;const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;
    ctx=Snd.ctx=Snd.ctx||new C();return ctx};
  const noise=()=>{if(nb)return nb;const n=ctx.sampleRate;nb=ctx.createBuffer(1,n,n);
    const d=nb.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;return nb};
  /* dewan batu istana: impuls sintetik (stereo, awal + ekor) */
  const impulse=()=>{if(ir)return ir;const sr=ctx.sampleRate,len=Math.floor(sr*(LOW?1.1:2.1));
    ir=ctx.createBuffer(2,len,sr);
    for(let c=0;c<2;c++){const d=ir.getChannelData(c);
      for(let i=0;i<len;i++){const x=i/len;
        d[i]=(Math.random()*2-1)*Math.pow(1-x,2.6)*(1-x*.25);}
      /* pantulan awal dinding */
      for(const[ms,a]of[[11,.5],[19,.42],[29,.34],[43,.26],[61,.2]]){
        const k=Math.floor(sr*(ms+c*3)/1000);if(k<len)d[k]+=a*(c?-1:1)}
    }
    return ir};
  const out=d=>d||mst||ctx.destination;

  /* ---------- alat muzik ---------- */
  /* gong ageng / suwukan: separa-harmonik, degupan halus */
  function gong(f,t,v,d,dest){
    const P=[[1,1],[2.01,.5],[2.76,.45],[4.07,.25],[5.4,.15],[7.3,.08]];
    P.forEach(([m,a],k)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
      o.frequency.setValueAtTime(f*m*1.014,t);o.frequency.exponentialRampToValueAtTime(f*m,t+.5);
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v*a,t+.014);
      g.gain.exponentialRampToValueAtTime(.0001,t+d/(1+k*.32));
      o.connect(g);g.connect(out(dest));o.start(t);o.stop(t+d+.1)});
    /* hembusan udara saat dipalu */
    const n=ctx.createBufferSource(),ng=ctx.createGain(),nf=ctx.createBiquadFilter();
    n.buffer=noise();nf.type='lowpass';nf.frequency.value=700;
    ng.gain.setValueAtTime(v*.5,t);ng.gain.exponentialRampToValueAtTime(.0001,t+.17);
    n.connect(nf);nf.connect(ng);ng.connect(out(dest));n.start(t,Math.random()*.4);n.stop(t+.2)}
  /* kempul: gong gantung sederhana, lebih pendek */
  function kempul(f,t,v,dest){[[1,1],[2.4,.4],[3.6,.2],[5.8,.1]].forEach(([m,a])=>{
    const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=f*m;
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v*a,t+.008);
    g.gain.exponentialRampToValueAtTime(.0001,t+1.9/m);
    o.connect(g);g.connect(out(dest));o.start(t);o.stop(t+2.1)})}
  /* bonang / canang: periuk tembaga kecil */
  function bonang(f,t,v,dest){[[1,1],[2.32,.35],[3.9,.18],[6.1,.07]].forEach(([m,a])=>{
    const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=f*m;
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v*a,t+.005);
    g.gain.exponentialRampToValueAtTime(.0001,t+.9/m*1.6);
    o.connect(g);g.connect(out(dest));o.start(t);o.stop(t+1)})}
  /* saron: bilah gangsa — serangan keras, nada tak-harmonik, dimatikan tangan */
  function saron(f,t,v,dest,hold){
    const dur=hold||.46;
    [[1,1],[2.76,.5],[5.4,.28],[8.93,.12]].forEach(([m,a])=>{
      const o=ctx.createOscillator(),g=ctx.createGain();o.type=m>4?'square':'triangle';
      o.frequency.value=f*m;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v*a*(m>4?.2:1),t+.004);
      g.gain.exponentialRampToValueAtTime(.0001,t+dur/(1+(m-1)*.5));
      o.connect(g);g.connect(out(dest));o.start(t);o.stop(t+dur+.06)});
    const k=ctx.createBufferSource(),kg=ctx.createGain(),kf=ctx.createBiquadFilter();
    k.buffer=noise();kf.type='bandpass';kf.frequency.value=3400;kf.Q.value=1.1;
    kg.gain.setValueAtTime(v*.3,t);kg.gain.exponentialRampToValueAtTime(.0001,t+.04);
    k.connect(kf);kf.connect(kg);kg.connect(out(dest));k.start(t,Math.random()*.3);k.stop(t+.06)}
  /* gambus: petikan tali */
  function petik(f,t,v,dest){
    const o=ctx.createOscillator(),o2=ctx.createOscillator(),g=ctx.createGain(),lp=ctx.createBiquadFilter();
    o.type='sawtooth';o2.type='triangle';o.frequency.value=f;o2.frequency.value=f*2.003;
    lp.type='lowpass';lp.frequency.setValueAtTime(3800,t);lp.frequency.exponentialRampToValueAtTime(900,t+.5);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.006);
    g.gain.exponentialRampToValueAtTime(.0001,t+1.1);
    o.connect(lp);o2.connect(lp);lp.connect(g);g.connect(out(dest));
    [o,o2].forEach(x=>{x.start(t);x.stop(t+1.2)})}
  /* suling: seruling bambu, nafas + getar */
  function suling(f,t,d,v,dest){
    const o=ctx.createOscillator(),o2=ctx.createOscillator(),g=ctx.createGain(),
      l=ctx.createOscillator(),lg=ctx.createGain(),lp=ctx.createBiquadFilter();
    o.type='triangle';o2.type='sine';o.frequency.setValueAtTime(f*.985,t);
    o.frequency.linearRampToValueAtTime(f,t+.07);o2.frequency.value=f*2;
    l.frequency.value=5.2;lg.gain.value=f*.013;l.connect(lg);lg.connect(o.frequency);lg.connect(o2.frequency);
    lp.type='lowpass';lp.frequency.value=2600;
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.09);
    g.gain.setValueAtTime(v*.85,t+d*.6);g.gain.linearRampToValueAtTime(0,t+d);
    o.connect(lp);o2.connect(lp);lp.connect(g);g.connect(out(dest));
    [o,o2,l].forEach(x=>{x.start(t);x.stop(t+d+.05)});
    const n=ctx.createBufferSource(),ng=ctx.createGain(),nf=ctx.createBiquadFilter();
    n.buffer=noise();nf.type='bandpass';nf.frequency.value=f*2;nf.Q.value=3;
    ng.gain.setValueAtTime(0,t);ng.gain.linearRampToValueAtTime(v*.2,t+.05);ng.gain.linearRampToValueAtTime(0,t+d);
    n.connect(nf);nf.connect(ng);ng.connect(out(dest));n.start(t);n.stop(t+d+.05)}
  /* serunai: hobo Melayu — nyaring, menusuk */
  function serunai(f,t,d,v,dest){
    const o=ctx.createOscillator(),g=ctx.createGain(),b=ctx.createBiquadFilter(),
      b2=ctx.createBiquadFilter(),l=ctx.createOscillator(),lg=ctx.createGain();
    o.type='sawtooth';o.frequency.setValueAtTime(f*.97,t);o.frequency.linearRampToValueAtTime(f,t+.06);
    l.frequency.value=6;lg.gain.value=f*.016;l.connect(lg);lg.connect(o.frequency);
    b.type='bandpass';b.frequency.value=1250;b.Q.value=2.2;
    b2.type='peaking';b2.frequency.value=2300;b2.gain.value=6;
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.03);
    g.gain.setValueAtTime(v,t+d*.7);g.gain.linearRampToValueAtTime(0,t+d);
    o.connect(b);b.connect(b2);b2.connect(g);g.connect(out(dest));
    o.start(t);l.start(t);o.stop(t+d+.05);l.stop(t+d+.05)}
  /* rebab: tali digesek — dron ketegangan */
  function rebab(f,t,d,v,dest){
    const o=ctx.createOscillator(),o2=ctx.createOscillator(),g=ctx.createGain(),
      bp=ctx.createBiquadFilter(),l=ctx.createOscillator(),lg=ctx.createGain();
    o.type='sawtooth';o2.type='sawtooth';o.frequency.value=f;o2.frequency.value=f*1.006;
    l.frequency.value=4.4;lg.gain.value=f*.01;l.connect(lg);lg.connect(o.frequency);
    bp.type='bandpass';bp.frequency.value=f*3.2;bp.Q.value=1.6;
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.22);
    g.gain.setValueAtTime(v*.9,t+d*.75);g.gain.linearRampToValueAtTime(0,t+d);
    o.connect(bp);o2.connect(bp);bp.connect(g);g.connect(out(dest));
    [o,o2,l].forEach(x=>{x.start(t);x.stop(t+d+.06)})}
  /* gendang */
  function drum(k,t,v,dest){
    if(k==='dung'||k==='dang'||k==='duk'){
      const o=ctx.createOscillator(),g=ctx.createGain(),
        f0=k==='dung'?150:k==='duk'?110:220;
      o.type='sine';o.frequency.setValueAtTime(f0*1.5,t);
      o.frequency.exponentialRampToValueAtTime(f0*.5,t+(k==='duk'?.3:.22));
      g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+.32);
      o.connect(g);g.connect(out(dest));o.start(t);o.stop(t+.38)}
    const n=ctx.createBufferSource(),g=ctx.createGain(),f=ctx.createBiquadFilter();
    n.buffer=noise();f.type='bandpass';
    f.frequency.value=k==='tak'?2400:k==='tik'?4200:900;f.Q.value=1.2;
    g.gain.setValueAtTime(k==='tak'?v*.8:k==='tik'?v*.45:v*.25,t);
    g.gain.exponentialRampToValueAtTime(.0001,t+(k==='tak'?.09:.06));
    n.connect(f);f.connect(g);g.connect(out(dest));n.start(t,Math.random()*.5);n.stop(t+.12)}
  /* kerincing: gegaran logam kecil */
  function kerincing(t,v,dest){
    const n=ctx.createBufferSource(),g=ctx.createGain(),f=ctx.createBiquadFilter();
    n.buffer=noise();f.type='highpass';f.frequency.value=5200;
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.006);
    g.gain.exponentialRampToValueAtTime(.0001,t+.1);
    n.connect(f);f.connect(g);g.connect(out(dest));n.start(t,Math.random()*.5);n.stop(t+.14)}

  /* ---------- alat Melayu asli (rujukan: muzik latar "Instrumental Melayu Asli") ---------- */
  /* tangga nada asli: minor harmonik pada D. Langkah 'tambah' Bb→C# memberi warna lagu asli */
  const SA=[0,2,3,5,7,8,11];
  const fa=d=>ROOT*Math.pow(2,(SA[((d%7)+7)%7]+12*Math.floor(d/7))/12);
  /* pentatonik sape Borneo */
  const SP=[0,2,4,7,9];
  const fp=d=>ROOT*Math.pow(2,(SP[((d%5)+5)%5]+12*Math.floor(d/5))/12);
  const st12=n=>ROOT*Math.pow(2,n/12);
  /* biola: dua tali gergaji dengan formant badan kayu, vibrato yang masuk lewat,
     dan cengkok — not hiasan dari atas yang menjadi ciri gesekan lagu asli */
  function biola(f,t,d,v,dest,orn){
    const g=ctx.createGain(),b1=ctx.createBiquadFilter(),b2=ctx.createBiquadFilter(),lp=ctx.createBiquadFilter(),
      o=ctx.createOscillator(),o2=ctx.createOscillator(),l=ctx.createOscillator(),lg=ctx.createGain();
    o.type='sawtooth';o2.type='sawtooth';o2.detune.value=7;
    if(orn){for(const x of[o,o2]){x.frequency.setValueAtTime(orn,t);x.frequency.setValueAtTime(f,t+.075)}}
    else{for(const x of[o,o2]){x.frequency.setValueAtTime(f*.985,t);x.frequency.linearRampToValueAtTime(f,t+.06)}}
    l.frequency.value=5.6;lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(f*.012,t+Math.min(.4,d*.5));
    l.connect(lg);lg.connect(o.frequency);lg.connect(o2.frequency);
    b1.type='peaking';b1.frequency.value=1050;b1.Q.value=1.1;b1.gain.value=7;
    b2.type='peaking';b2.frequency.value=2800;b2.Q.value=1.4;b2.gain.value=4;
    lp.type='lowpass';lp.frequency.value=4800;
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.09);
    g.gain.setValueAtTime(v*.9,t+d*.72);g.gain.linearRampToValueAtTime(0,t+d);
    o.connect(b1);o2.connect(b1);b1.connect(b2);b2.connect(lp);lp.connect(g);g.connect(out(dest));
    [o,o2,l].forEach(x=>{x.start(t);x.stop(t+d+.06)})}
  /* akordion: buluh berganda (musette, sedikit sumbang) dengan tremolo tiupan */
  function akordion(fs,t,d,v,dest){
    const g=ctx.createGain(),lp=ctx.createBiquadFilter(),tr=ctx.createOscillator(),tg=ctx.createGain(),os=[];
    lp.type='lowpass';lp.frequency.value=2300;lp.Q.value=.6;
    tr.frequency.value=4.8;tg.gain.value=v*.22;tr.connect(tg);tg.connect(g.gain);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.1);
    g.gain.setValueAtTime(v,t+d*.82);g.gain.linearRampToValueAtTime(0,t+d);
    fs.slice(0,LOW?2:3).forEach(f=>{for(const dt of LOW?[5]:[-5,5]){const o=ctx.createOscillator();
      o.type='square';o.frequency.value=f;o.detune.value=dt;o.connect(lp);os.push(o)}});
    lp.connect(g);g.connect(out(dest));[...os,tr].forEach(x=>{x.start(t);x.stop(t+d+.06)})}
  /* rebana / rapa'i: 'dum' bas di tengah, 'tung' terbuka, 'pak' tepuk di bibir */
  function rebana(k,t,v,dest){
    if(k!=='pak'){const o=ctx.createOscillator(),g=ctx.createGain(),f0=k==='dum'?92:186;
      o.type='sine';o.frequency.setValueAtTime(f0*1.7,t);o.frequency.exponentialRampToValueAtTime(f0,t+.045);
      g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+(k==='dum'?.42:.24));
      o.connect(g);g.connect(out(dest));o.start(t);o.stop(t+.46)}
    const n=ctx.createBufferSource(),g=ctx.createGain(),f=ctx.createBiquadFilter();
    n.buffer=noise();f.type='bandpass';f.frequency.value=k==='pak'?1750:k==='dum'?480:1050;f.Q.value=1.3;
    g.gain.setValueAtTime(v*(k==='pak'?.95:.3),t);g.gain.exponentialRampToValueAtTime(.0001,t+(k==='pak'?.11:.06));
    n.connect(f);f.connect(g);g.connect(out(dest));n.start(t,Math.random()*.5);n.stop(t+.14)}
  /* sape: kecapi Orang Ulu, petikan terang dengan dengung panjang */
  function sape(f,t,v,dest){
    const o=ctx.createOscillator(),o2=ctx.createOscillator(),g2=ctx.createGain(),g=ctx.createGain(),lp=ctx.createBiquadFilter();
    o.type='triangle';o2.type='square';o.frequency.value=f;o2.frequency.value=f*2.004;g2.gain.value=.1;
    lp.type='lowpass';lp.frequency.setValueAtTime(4200,t);lp.frequency.exponentialRampToValueAtTime(1100,t+.9);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+1.9);
    o.connect(lp);o2.connect(g2);g2.connect(lp);lp.connect(g);g.connect(out(dest));
    [o,o2].forEach(x=>{x.start(t);x.stop(t+2)})}

  /* ---------- gaya muzik ikut asal pahlawan (selari dengan indeks HEROES) ---------- */
  const HG=['asli','asli','asli','asli','asli','asli','asli','asli','asli','asli',
            'kelantan','asli','kelantan','asli','borneo','aceh','pantai','asli'];
  let gy='asli';
  /* motif pendek setiap pahlawan: darjah tangga nada gaya mereka, diputar mengikut indeks */
  const MOTIF=[[7,9,10,11,10],[11,10,9,7,6,7],[4,7,9,8,7],[7,8,9,11,9,7],[4,6,7,9,11],[0,4,7,9,7],
               [7,9,11,9,8,7],[9,8,7,6,7],[4,5,7,8,7,5],[7,11,10,9,7],[0,2,3,5,3],[9,10,11,10,9,7],
               [5,4,3,2,0],[11,9,7,9,11],[0,2,4,2,0],[7,7,9,7,5,4],[9,7,5,4,7],[7,8,9,8,7,6,7]];

  /* ---------- corak (16 langkah / bar) ---------- */
  const MEL={
    menu:[[2,-1,-1,3,-1,4,-1,-1,3,-1,2,-1,0,-1,-1,-1],[0,-1,2,-1,3,-1,-1,-1,4,-1,3,-1,2,-1,-1,-1],
          [5,-1,-1,4,-1,3,-1,-1,2,-1,3,-1,2,-1,-1,-1],[0,-1,-1,-1,2,-1,3,-1,2,-1,0,-1,-1,-1,-1,-1]],
    game:[[0,-1,2,-1,3,-1,2,-1,0,-1,-1,-1,-2,-1,0,-1],[3,-1,4,-1,5,-1,4,-1,3,-1,2,-1,3,-1,-1,-1]],
    kembara:[[0,-1,3,-1,4,-1,3,2,0,-1,2,-1,3,-1,-1,-1],[4,-1,5,-1,7,-1,5,4,3,-1,4,-1,2,-1,0,-1],
             [2,-1,3,4,-1,5,-1,4,3,-1,2,-1,0,-1,-1,-1],[5,-1,7,-1,8,-1,7,5,4,-1,3,-1,2,-1,-1,-1]],
    duel:[[5,-1,5,3,-1,4,5,-1,7,-1,5,4,3,-1,2,-1],[7,-1,7,5,-1,6,7,-1,9,-1,7,5,4,-1,3,-1]],
    win:[[7,-1,7,-1,8,-1,9,-1,8,-1,7,-1,5,-1,-1,-1],[5,-1,7,-1,8,-1,7,-1,5,-1,4,-1,3,-1,-1,-1]]
  };
  /* imbal: dua bonang berselang-seli */
  const IMB=[0,-1,3,-1,2,-1,4,-1,3,-1,2,-1,0,-1,2,-1];
  const M={menu:{bpm:66,vol:.9},game:{bpm:84,vol:.78},kembara:{bpm:96,vol:.86},
           duel:{bpm:128,vol:1},win:{bpm:104,vol:.95}};
  /* tempo: asli perlahan (66), inang (80), joget pantas (132); Aceh lebih rancak */
  const GT={asli:{game:80,kembara:92,win:132},pantai:{game:76,kembara:86,win:110},borneo:{game:78,kembara:90,win:104},aceh:{game:96,kembara:108,win:120}};
  /* penala paras setiap gaya (diukur: asli perlawanan -29.4, Borneo/Aceh -28.5, pantai -25.4,
     Kelantan -23.4 LUFS). Sasaran ~-25 supaya bertukar pahlawan tidak mengejutkan telinga */
  const GV={asli:1.55,borneo:1.45,aceh:1.45,pantai:1,kelantan:.9};
  const LV=m=>{m=m||mood;return .55*M[m].vol*vol*(m==='game'||m==='kembara'?GV[gy]||1:1)};
  const BPM=()=>mood==='menu'||mood==='duel'||!GT[gy]?M[mood].bpm:GT[gy][mood]||M[mood].bpm;
  /* asli: i–iv–V–i, i–VI–V–i (Dm, Gm, A, Bb) */
  const CH=[[0,3,7],[5,8,12],[7,11,14],[0,3,7],[0,3,7],[-4,0,3],[7,11,14],[0,3,7]];
  const MA=[[11,-1,-1,-1,-1,-1,10,9,10,-1,-1,-1,9,-1,8,-1],[7,-1,-1,-1,-1,-1,8,9,10,-1,9,-1,8,-1,7,-1],
            [6,-1,-1,-1,7,-1,8,-1,6,-1,-1,-1,5,-1,4,-1],[7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [4,-1,5,-1,6,-1,7,-1,9,-1,-1,-1,8,-1,7,-1],[5,-1,-1,-1,7,-1,9,-1,8,-1,7,-1,5,-1,-1,-1],
            [6,-1,7,6,4,-1,-1,-1,5,-1,6,-1,4,-1,-1,-1],[2,-1,3,-1,4,-1,-1,-1,-1,-1,-1,-1,0,-1,-1,-1]];
  /* panjang not = jarak ke not seterusnya dalam bar yang sama */
  const len=(row,s)=>{let k=s+1;while(k<16&&row[k]===-1)k++;return k-s};
  function lead(inst,row,s,t,q,v,deg){
    const d=row[s];if(d===-1)return;const n=len(row,s),f=deg(d+7);
    if(inst==='biola')biola(f,t,q*n*.96,v,null,n>=4&&(s===0||row[s-1]===-1)?deg(d+8):0);
    else if(inst==='suling')suling(f,t,q*n*.95,v);
    else if(inst==='serunai')serunai(f,t,q*Math.min(n,3)*.95,v);
    else if(inst==='rebab')rebab(f*.5,t,q*n*.95,v);
  }
  /* gaya asli: menu (asli perlahan), game (inang ringan), kembara (lebih padu), win (joget) */
  function stepAsli(t,s,b,m,q,H){
    const c=CH[b%8].map(st12),row=MA[b%8];
    if(m==='win'){ /* joget: rasa 3+3+2, akordion menghentak, biola berlari */
      if(s===0||s===6||s===10)rebana('dum',t,.3);if(s===3||s===8||s===12||s===14)rebana('pak',t,.22);
      if(s===0||s===6||s===10)akordion(c.map(f=>f*2),t,q*2.2,.014);
      if(s%2===0)biola(fa(MA[(b+4)%8][s]>=0?MA[(b+4)%8][s]+7:[7,9,11,9][s/2%4]+0),t,q*1.8,.05);
      if(s===0&&b%2===0)gong(ROOT/2,t,.26,3.5);return}
    if(s===0&&b%2===0)gong(ROOT/2,t,m==='menu'?.26:.2,5);
    if(m==='menu'){ /* asli: dum . . tung . . pak . dum . dum . pak . tung . */
      if(s===0||s===8||s===10)rebana('dum',t,.22);if(s===6||s===12)rebana('pak',t,.16);if(s===3||s===14)rebana('tung',t,.08);
      if(s===0)akordion(c,t,q*16,.012);
      lead('biola',row,s,t,q,.05,fa);
      if(s===4||s===12)petik(c[0]*.5,t,.05);
    }else{ /* inang (game) / kembara */
      const k=m==='kembara';
      if(s===0||s===8||(k&&s===10))rebana('dum',t,k?.26:.2);if(s===4||s===12)rebana('pak',t,k?.2:.15);
      if(s===3||s===7||s===14)rebana('tung',t,.08);if(k&&s%2===1)drum('tik',t,.04);
      if(s===4||s===12)akordion(c,t,q*2.4,k?.013:.01);       /* hentakan akordion di luar rentak */
      if(k||b%2===1)lead('biola',row,s,t,q,k?.05:.042,fa);   /* inang memberi ruang: biola setiap bar kedua */
      else if(s===2||s===10)petik(c[(s/8)|0]*.5,t,.06);
    }
  }
  /* gaya pantai (Mahsuri): suling menyanyi di atas petikan gambus dan rebana lembut */
  function stepPantai(t,s,b,m,q,H){
    const c=CH[b%8].map(st12),row=MA[b%8];
    if(s===0&&b%2===0)gong(ROOT/2,t,.18,5);
    if(s%4===0)petik(c[(s/4)%3]*.5,t,.06);if(s%4===2)petik(c[(((s/4)|0)+1)%3],t,.04);
    if(s===0||s===8)rebana('dum',t,.16);if(s===12)rebana('pak',t,.12);
    lead('suling',row,s,t,q,m==='kembara'?.1:.085,fa);
    if(m==='win'&&s%4===0)biola(fa(row[s]>=0?row[s]+7:7),t,q*3.5,.04);
  }
  /* gaya Borneo (Santubong): ostinato sape pentatonik, gong, rebana jarang */
  const OST=[0,2,4,2,5,4,2,4];
  function stepBorneo(t,s,b,m,q,H){
    if(s===0)gong(ROOT/2,t,.2,5);if(s===8)kempul(ROOT*.75,t,.12);
    if(s%2===0)sape(fp(OST[(s/2)%8]+5+(b%4===3&&s>=8?2:0)),t,.07);
    if(m!=='menu'&&(s===0||s===6||s===10))rebana('dum',t,m==='kembara'?.22:.16);
    if(s===12)rebana('pak',t,.12);
    if((b%2===1||m==='win')&&s%4===0)sape(fp([7,9,10,9][(s/4)%4]+3),t+q*.5,.05);
  }
  /* gaya Aceh (Malahayati): rapa'i bertingkah dan serunai */
  function stepAceh(t,s,b,m,q,H){
    if(s===0&&b%2===0)gong(ROOT/2,t,.24,4);
    if(s%4===0)rebana('dum',t,.26);if(s%4===2)rebana('pak',t,.2);if(s%2===1&&m!=='menu')rebana('pak',t,.08);
    if(s===14)rebana('tung',t,.1);
    lead('serunai',MA[(b+2)%8],s,t,q,m==='kembara'?.07:.06,fa);
    if(s===0&&b%4===0)rebab(ROOT,t,q*16,.03);
  }
  function step(t,s,b,m){
    const q=60/BPM()/4,H=heat;
    /* menu sentiasa asli; perlawanan mengikut gaya pahlawan (kelantan = gamelan asal di bawah) */
    const g=m==='menu'?'asli':gy;
    if(m!=='duel'&&g==='asli')return stepAsli(t,s,b,m,q,H);
    if(m!=='duel'&&m!=='menu'&&g==='pantai')return stepPantai(t,s,b,m,q,H);
    if(m!=='duel'&&m!=='menu'&&g==='borneo')return stepBorneo(t,s,b,m,q,H);
    if(m!=='duel'&&m!=='menu'&&g==='aceh')return stepAceh(t,s,b,m,q,H);
    if(m==='menu'){
      if(s===0){gong(ROOT/2,t,.34,5.5);if(b%2===0)kempul(ROOT*.75,t+q*8,.16)}
      if(s%2===0){const a=[0,2,3,2,4,3,2,1][(s/2+b)%8];bonang(fr(a+5),t,.07)}
      const p=MEL.menu[b%4][s];if(p!==-1)suling(fr(p+5),t,q*3.4,.1);
      if(s===8&&b%2===1)drum('dung',t,.16);
      if(s===12&&b%4===3)petik(fr(0+3),t,.09);
    }else if(m==='game'){
      if(s===0)gong(ROOT/2,t,.24,4.5);
      if(s===8)kempul(ROOT*.75,t,.12);
      if(s===0||s===6||s===10)drum('dung',t,.2);
      if(s===4||s===12||s===14)drum('tak',t,.16);
      if(s%2===1)drum('tik',t,.05);
      if(H>.3&&(s===3||s===11))drum('duk',t,.14*H);
      if(IMB[s]!==-1)bonang(fr(IMB[s]+5),t,.055+ .02*H);
      if(IMB[(s+8)%16]!==-1&&s%2===1)bonang(fr(IMB[(s+8)%16]+10),t,.03);
      const p=MEL.game[b%2][s];if(p!==-1)suling(fr(p+5),t,q*3,.085)
    }else if(m==='kembara'){
      if(s===0)gong(ROOT/2,t,.3,5);
      if(s===8)kempul(ROOT*.75,t,.16);
      if(s===0||s===5||s===10)drum('dung',t,.26);
      if(s===4||s===7||s===12)drum('tak',t,.2);
      if(s%2===1)kerincing(t,.035,null);
      const p=MEL.kembara[b%4][s];
      if(p!==-1){saron(fr(p+5),t,.09,null,q*2.6);if(b%2===1)saron(fr(p+10),t,.045,null,q*1.6)}
      if(s===6||s===14)serunai(fr(MEL.kembara[b%4][s===6?4:12]+5),t,q*2.2,.05)
    }else if(m==='win'){
      if(s===0){gong(ROOT/2,t,.34,5);bonang(fr(10),t,.1)}
      if(s===0||s===4||s===8||s===12)drum('dung',t,.26);
      if(s===2||s===6||s===10||s===14)drum('tak',t,.2);
      if(s%2===1)kerincing(t,.05,null);
      const p=MEL.win[b%2][s];if(p!==-1){saron(fr(p+5),t,.1);bonang(fr(p+10),t,.05)}
    }else{ /* duel */
      if(s===0||s===8)gong(ROOT/2,t,.3,2.2);
      if(s%4===0)drum('dung',t,.3+.08*H);
      if(s%4===2||s===7||s===15)drum('tak',t,.22+.07*H);
      if(s%2===1)drum('tik',t,.08+.05*H);
      if(s===12||s===13)drum('dang',t,.22);
      if(H>.45&&(s===5||s===9))drum('duk',t,.2*H);
      if(s===0&&b%2===0)rebab(fr(0),t,q*14,.05+.03*H);
      const p=MEL.duel[b%2][s];
      if(p!==-1)serunai(fr(p+5),t,q*1.7,.07+.025*H);
      if(H>.6&&s%4===1)saron(fr(MEL.duel[b%2][s-1]+10),t,.05*H)
    }
  }
  function tick(){
    if(!on||!ctx)return;
    if(hT){const k=Math.min(1,(ctx.currentTime-hT)/10);heat=Math.max(0,heat*(1-k*.004))}
    while(nt<ctx.currentTime+.35){step(nt,st,bar,mood);nt+=60/BPM()/4;if(++st>=16){st=0;bar++}}}
  function bus(){
    if(mst)return;
    const cmp=ctx.createDynamicsCompressor();
    cmp.threshold.value=-14;cmp.knee.value=18;cmp.ratio.value=4;cmp.attack.value=.006;cmp.release.value=.22;
    const air=ctx.createBiquadFilter();air.type='highshelf';air.frequency.value=5200;air.gain.value=2.5;
    cmp.connect(air);air.connect(ctx.destination);
    mst=ctx.createGain();mst.gain.value=0;mst.connect(cmp);
    sbus=ctx.createGain();sbus.gain.value=1;sbus.connect(cmp);
    /* kirim dewan: muzik + kesan bunyi berkongsi ruang yang sama */
    wet=ctx.createGain();wet.gain.value=LOW?.16:.26;
    try{const cv=ctx.createConvolver();cv.buffer=impulse();wet.connect(cv);cv.connect(cmp)}
    catch(e){const dl=ctx.createDelay(1),fb=ctx.createGain();dl.delayTime.value=.26;fb.gain.value=.3;
      wet.connect(dl);dl.connect(fb);fb.connect(dl);dl.connect(cmp)}
    mst.connect(wet);sbus.connect(wet);
  }
  return{
    get on(){return on},get heatv(){return heat},
    /* naikkan ketegangan: 0..1, reda sendiri */
    hot(x){heat=Math.max(heat,Math.min(1,+x||0));hT=ctx?ctx.currentTime:0;
      if(on&&mst)mst.gain.setTargetAtTime(LV()*(1+.12*heat),ctx.currentTime,.6)},
    cool(){heat=0},
    gain(v){vol=Math.max(0,Math.min(1.4,+v||0));
      if(on&&mst)mst.gain.setTargetAtTime(LV(),ctx.currentTime,.3)},
    start(){ /* mesti dipanggil selepas sentuhan pengguna */
      if(!cfg.music||started&&on)return;if(!ac())return;
      try{ctx.resume&&ctx.resume()}catch(e){}
      bus();
      on=true;started=true;st=0;bar=0;nt=ctx.currentTime+.1;
      clearInterval(timer);timer=setInterval(tick,90);
      mst.gain.cancelScheduledValues(ctx.currentTime);
      mst.gain.linearRampToValueAtTime(LV(),ctx.currentTime+1.5)},
    stop(){if(!ctx||!mst)return;on=false;clearInterval(timer);
      mst.gain.cancelScheduledValues(ctx.currentTime);mst.gain.setTargetAtTime(0,ctx.currentTime,.25)},
    set(m){if(!M[m]||m===mood)return;const o=mood;mood=m;st=0;bar=0;
      if(!on||!ctx)return;
      /* silang-pudar pendek supaya peralihan tidak mengejut */
      mst.gain.cancelScheduledValues(ctx.currentTime);
      mst.gain.setTargetAtTime(.1,ctx.currentTime,.12);
      nt=ctx.currentTime+.45;
      setTimeout(()=>{if(on&&mst)mst.gain.setTargetAtTime(LV(m),ctx.currentTime,.35)},260);
      if(o==='duel'||m==='duel')heat=m==='duel'?.35:0},
    /* gaya muzik ikut pahlawan i */
    gaya(i){const g=HG[i]||'asli';if(g===gy)return;gy=g;if(mood!=='menu'&&mood!=='duel'){st=0;bar=0;if(on&&mst)mst.gain.setTargetAtTime(LV(),ctx.currentTime,.4)}},
    get gy(){return gy},gayaOf:i=>HG[i]||'asli',
    /* leitmotif pahlawan: motif pendek dalam alat gaya mereka */
    motif(i,v=.09){if(Snd.mute||!ac())return;const g=HG[i]||'asli',m=MOTIF[i%MOTIF.length],t=ctx.currentTime+.05,d=Mus.fx,q=.17;
      m.forEach((x,k)=>{const tt=t+k*q,last=k===m.length-1,dd=last?.9:q*1.05;
        if(g==='borneo')sape(fp(x+5),tt,v*.9,d);
        else if(g==='kelantan')rebab(fr(x+5),tt,dd,v*.7,d);
        else if(g==='aceh')serunai(fa(x+7),tt,dd,v*.75,d);
        else if(g==='pantai')suling(fa(x+7),tt,dd,v*1.1,d);
        else biola(fa(x+7),tt,dd,v*.6,d,k===0?fa(x+8):0)});
      if(g==='asli')akordion(CH[0].map(st12),t,q*m.length+.6,.008,d)},
    /* tunduk muzik seketika supaya hentaman penting kedengaran (keutamaan campuran) */
    duck(k=.45){if(!on||!mst||!ctx)return;const t=ctx.currentTime,base=LV()*(1+.12*heat);
      mst.gain.cancelScheduledValues(t);mst.gain.setTargetAtTime(base*k,t,.012);mst.gain.setTargetAtTime(base,t+.14,.28)},
    tick,sync(){if(cfg.music&&!cfg.mute)this.start();else this.stop()},
    sfx:{gong,kempul,bonang,saron,petik,drum,serunai,suling,rebab,kerincing,biola,akordion,rebana,sape},
    ac,noise,get ctx(){return ctx},get master(){return mst},
    get fx(){bus();return sbus||(ctx?ctx.destination:null)}
  }
})();

/* ===== KESAN BUNYI: semuanya melalui bas sfx supaya sekata & bergema sama ===== */
Object.assign(Snd,{
  /* had suara: isyarat biasa ditolak bila terlalu banyak dalam 100 ms (cth. taburan biji laju);
     isyarat penting (kr=true: hentaman, tangkis, menang) sentiasa lalu */
  _w:0,_n:0,
  _ok(kr){if(this.mute)return false;const now=Date.now();if(now-this._w>100){this._w=now;this._n=0}
    if(++this._n>12&&!kr)return false;const c=Mus.ac();if(!c)return false;
    try{c.resume&&c.resume()}catch(e){}return true},
  _d(){return Mus.fx||Mus.ctx.destination},
  gong(f=110,v=.3){if(!this._ok())return;Mus.sfx.gong(f,Mus.ctx.currentTime,v,3.2,this._d())},
  drum(k='dung',v=.3){if(!this._ok())return;Mus.sfx.drum(k,Mus.ctx.currentTime,v,this._d())},
  /* biji jatuh ke lubang kayu: nada mengikut bilangan biji supaya terasa "mengisi" */
  knock(n){if(!this._ok())return;const c=Mus.ctx,t=c.currentTime,d=this._d(),
    k=Math.max(0,Math.min(9,(n|0))),f=300+k*26+Math.random()*40;
    const o=c.createOscillator(),g=c.createGain(),bp=c.createBiquadFilter();
    o.type='triangle';o.frequency.setValueAtTime(f*1.7,t);o.frequency.exponentialRampToValueAtTime(f,t+.03);
    bp.type='bandpass';bp.frequency.value=f*2.4;bp.Q.value=1.4;
    g.gain.setValueAtTime(.12,t);g.gain.exponentialRampToValueAtTime(.0001,t+.085);
    o.connect(bp);bp.connect(g);g.connect(d);o.start(t);o.stop(t+.1);
    /* kulit biji saga berlaga */
    const nz=c.createBufferSource(),ng=c.createGain(),nf=c.createBiquadFilter();
    nz.buffer=Mus.noise();nf.type='bandpass';nf.frequency.value=2600+Math.random()*900;nf.Q.value=.9;
    ng.gain.setValueAtTime(.07,t);ng.gain.exponentialRampToValueAtTime(.0001,t+.045);
    nz.connect(nf);nf.connect(ng);ng.connect(d);nz.start(t,Math.random()*.4);nz.stop(t+.06)},
  /* kocak segenggam biji */
  sow(n=5){if(!this._ok())return;const c=Mus.ctx,t=c.currentTime,d=this._d();
    for(let i=0;i<Math.min(9,n);i++){const nz=c.createBufferSource(),g=c.createGain(),f=c.createBiquadFilter();
      nz.buffer=Mus.noise();f.type='bandpass';f.frequency.value=1800+Math.random()*2200;f.Q.value=1.1;
      const tt=t+i*.022+Math.random()*.012;
      g.gain.setValueAtTime(.05,tt);g.gain.exponentialRampToValueAtTime(.0001,tt+.05);
      nz.connect(f);f.connect(g);g.connect(d);nz.start(tt,Math.random()*.4);nz.stop(tt+.07)}},
  chime(){if(!this._ok())return;const c=Mus.ctx,t=c.currentTime,d=this._d();
    [0,3,7,12].forEach((s,i)=>Mus.sfx.bonang(293.66*Math.pow(2,s/12),t+i*.09,.12,d))},
  clang(v=.14){if(!this._ok())return;const c=Mus.ctx,t=c.currentTime,d=this._d();
    [[1,1],[2.76,.7],[5.4,.5],[8.9,.3]].forEach(([m,a])=>{
      const o=c.createOscillator(),g=c.createGain();o.type='square';o.frequency.value=1250*m;
      g.gain.setValueAtTime(v*a*.25,t);g.gain.exponentialRampToValueAtTime(.0001,t+.28);
      o.connect(g);g.connect(d);o.start(t);o.stop(t+.3)})},
  whoosh(dd=.35,up){if(!this._ok())return;const c=Mus.ctx,t=c.currentTime,d=this._d(),
    n=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();
    n.buffer=Mus.noise();f.type='bandpass';f.Q.value=1.4;
    f.frequency.setValueAtTime(up===false?3200:400,t);
    f.frequency.exponentialRampToValueAtTime(up===false?400:3200,t+dd);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.16,t+dd*.5);g.gain.linearRampToValueAtTime(0,t+dd);
    n.connect(f);f.connect(g);g.connect(d);n.start(t);n.stop(t+dd+.05)},
  /* bunyi antara muka: ketukan kayu halus */
  ui(hi){if(!this._ok())return;const c=Mus.ctx,t=c.currentTime,d=this._d(),
    o=c.createOscillator(),g=c.createGain();
    o.type='sine';o.frequency.setValueAtTime(hi?880:520,t);
    o.frequency.exponentialRampToValueAtTime(hi?660:390,t+.06);
    g.gain.setValueAtTime(.06,t);g.gain.exponentialRampToValueAtTime(.0001,t+.09);
    o.connect(g);g.connect(d);o.start(t);o.stop(t+.11)},
  hit(){Mus.duck(.5);this.drum('dung',.34);this.drum('tak',.3);this.clang(.1);Mus.hot(.5)},
  /* tikam: gesekan logam + hentakan + gong rendah */
  tikam(n){if(!this._ok(true))return;const c=Mus.ctx,t=c.currentTime,d=this._d();
    Mus.duck(.4);this.whoosh(.22);this.drum('dung',.42);
    Mus.sfx.gong(98,t+.04,.3,2.6,d);
    const big=Math.min(1,(n||3)/8);
    if(big>.4)Mus.sfx.kempul(146.83,t+.1,.18*big,d);
    this.clang(.1+.12*big);Mus.hot(.55+.3*big)},
  /* tangkis sempurna: logam bertemu logam */
  parry(){if(!this._ok(true))return;const c=Mus.ctx,t=c.currentTime,d=this._d();
    [[1,1],[2.1,.8],[3.7,.6],[6.4,.35],[9.8,.2]].forEach(([m,a])=>{
      const o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.value=1900*m;
      g.gain.setValueAtTime(.08*a,t);g.gain.exponentialRampToValueAtTime(.0001,t+.5/m);
      o.connect(g);g.connect(d);o.start(t);o.stop(t+.55)});
    this.drum('tak',.2);Mus.hot(.6)},
  /* perisai menahan: bunyi tumpul */
  block(){if(!this._ok(true))return;const c=Mus.ctx,t=c.currentTime,d=this._d(),
    n=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();
    n.buffer=Mus.noise();f.type='lowpass';f.frequency.setValueAtTime(1400,t);
    f.frequency.exponentialRampToValueAtTime(260,t+.2);
    g.gain.setValueAtTime(.2,t);g.gain.exponentialRampToValueAtTime(.0001,t+.24);
    n.connect(f);f.connect(g);g.connect(d);n.start(t);n.stop(t+.26);
    this.drum('duk',.26)},
  /* naik level / lencana */
  level(){if(!this._ok(true))return;const c=Mus.ctx,t=c.currentTime,d=this._d();
    [0,4,7,12,16].forEach((s,i)=>Mus.sfx.saron(293.66*Math.pow(2,s/12),t+i*.1,.12,d,.5));
    Mus.sfx.kempul(220,t+.1,.14,d)},
  lose(){if(!this._ok(true))return;const c=Mus.ctx,t=c.currentTime,d=this._d();
    Mus.sfx.gong(82,t,.3,4,d);
    [0,-2,-5].forEach((s,i)=>Mus.sfx.suling(220*Math.pow(2,s/12),t+.2+i*.42,.6,.08,d))},
  /* bunyi senjata pusaka: dipadankan dengan kesan visual wFx dalam Duel */
  senjata(fx){if(!this._ok(true))return;const c=Mus.ctx,t=c.currentTime,d=this._d(),S=Mus.sfx;Mus.duck(.4);
    if(fx==='luk'){this.clang(.12);S.saron(1174.7,t+.02,.07,d,.3);S.saron(1396.9,t+.09,.05,d,.3)}
    else if(fx==='cakar'){for(let i=0;i<3;i++)setTimeout(()=>this.whoosh(.09,false),i*55);this.drum('tik',.2)}
    else if(fx==='tusuk'){this.drum('tik',.34);this.clang(.07);setTimeout(()=>{this.drum('tik',.3);this.clang(.06)},110)}
    else if(fx==='kilau'){S.bonang(1760,t,.08,d);S.bonang(2349,t+.06,.05,d);S.kerincing(t,.08,d)}
    else if(fx==='tujah'){this.whoosh(.3);setTimeout(()=>{this.drum('duk',.4);this.drum('dang',.2)},180)}
    else if(fx==='libas'){this.whoosh(.2,false);this.drum('dung',.4);this.sow(6)}
    else if(fx==='taming'){const n=c.createBufferSource(),g=c.createGain(),f=c.createBiquadFilter();
      n.buffer=Mus.noise();f.type='lowpass';f.frequency.setValueAtTime(900,t);f.frequency.exponentialRampToValueAtTime(120,t+1.2);
      g.gain.setValueAtTime(.32,t);g.gain.exponentialRampToValueAtTime(.0001,t+1.3);n.connect(f);f.connect(g);g.connect(d);n.start(t);n.stop(t+1.35);
      S.gong(73.4,t+.03,.3,3,d);S.kempul(146.83,t+.12,.14,d);this.clang(.16)}},
  fanfare(){if(!this._ok(true))return;const c=Mus.ctx,t=c.currentTime,d=this._d();
    Mus.sfx.gong(110,t,.34,4.4,d);
    [0,3,5,7,8,12,15].forEach((s,i)=>{Mus.sfx.saron(293.66*Math.pow(2,s/12),t+.25+i*.13,.12,d,.46);
      Mus.sfx.bonang(293.66*Math.pow(2,s/12)*2,t+.25+i*.13,.05,d)});
    Mus.sfx.kerincing(t+.2,.06,d);Mus.sfx.kerincing(t+1.3,.06,d)}
});
