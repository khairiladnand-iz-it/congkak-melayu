/* ===== DUNIA 3D (three.js r128) ===== */
const WOODS={jati:['#8f5d2e','#3d200c'],hitam:['#3a2c24','#0c0806'],merah:['#74301f','#2a0c06'],emas:['#c9983f','#6e4410'],cendana:['#dcc08e','#80602f'],giok:['#3f9c70','#0e3a28'],nilam:['#2c52a6','#0a1a4a'],perak:['#c9cfd7','#5a6068'],bara:['#4c1a10','#140404'],angkasa:['#1a1a52','#04041c'],diraja:['#7c1224','#2c050c']};
const WOODX={giok:{roughness:.2,clearcoat:1,clearcoatRoughness:.06},nilam:{roughness:.18,clearcoat:1,clearcoatRoughness:.05},perak:{metalness:.9,roughness:.3,clearcoat:.2},bara:{emissive:0xff4a10,emissiveIntensity:.55,roughness:.55},angkasa:{emissive:0x7a8aff,emissiveIntensity:.8,roughness:.4,clearcoat:.8},diraja:{roughness:.4,clearcoat:.7,metalness:.15},cendana:{roughness:.45}};
const FLOORS={songket:{tile:3.6,mat:{roughness:.6}},jubin:{tile:2.6,mat:{roughness:.25,metalness:.05}},tikar:{tile:3.2,mat:{roughness:.95}},rebung:{tile:3.2,mat:{roughness:.6}},kawung:{tile:3.2,mat:{roughness:.55}},marmar:{tile:4,mat:{roughness:.12,metalness:.05}},langit:{tile:3.2,mat:{roughness:.2,metalness:.55,emissive:0x2a3aa0,emissiveIntensity:.5}}};
const World={
  ok:false,TOP:.6,SR:.13,SP:1.2,H:[],hold:[],hand:[],handAt:-1,seeds:[],tw:[],lab:[],rings:[],picks:[],disp:[],
  mode:'menu',az:0,pol:.72,dist:14,base:14,Lx:7,key:'',seedType:'saga',onTap:null,onHover:null,
  init(){
    if(!window.THREE)throw new Error('Pustaka 3D gagal dimuatkan (perlu sambungan internet)');
    const T=THREE,cv=document.getElementById('gl');
    const R=this.R=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true,powerPreference:'high-performance'});
    /* telefon murah tersekat pada dpr penuh: hadkan ikut keupayaan peranti */
    {const dpr=window.devicePixelRatio||1,cores=navigator.hardwareConcurrency||4,
      mob=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent||''),
      cap=mob?(cores<=4?1.4:1.75):2;
     R.setPixelRatio(Math.min(dpr,cap));}R.outputEncoding=T.sRGBEncoding;R.toneMapping=T.ACESFilmicToneMapping;R.toneMappingExposure=1.05;
    R.shadowMap.enabled=true;R.shadowMap.type=T.PCFSoftShadowMap;
    const S=this.scene=new T.Scene();S.background=null;R.setClearColor(0x000000,0);
    this.cam=new T.PerspectiveCamera(36,1,.1,200);
    /* persekitaran untuk pantulan */
    const pm=new T.PMREMGenerator(R),es=new T.Scene();
    es.add(new T.Mesh(new T.SphereGeometry(30,16,8),new T.MeshBasicMaterial({color:0x241a12,side:T.BackSide})));
    const lamp=(c,k,p,s)=>{const m=new T.Mesh(new T.BoxGeometry(s[0],s[1],s[2]),new T.MeshBasicMaterial({color:new T.Color(c).multiplyScalar(k)}));m.position.set(p[0],p[1],p[2]);es.add(m)};
    lamp(0xffe8c0,12,[-12,8,4],[1,10,10]);lamp(0xffffff,5,[0,14,0],[14,1,14]);lamp(0x9fc0ff,3,[12,5,-6],[1,6,8]);
    S.environment=pm.fromScene(es,.04).texture;
    /* cahaya */
    const sun=new T.DirectionalLight(0xfff0dd,2.1);sun.position.set(-7,11,6);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
    const sc=sun.shadow.camera;sc.left=-13;sc.right=13;sc.top=9;sc.bottom=-9;sc.near=1;sc.far=40;sun.shadow.bias=-.0004;sun.shadow.normalBias=.02;sun.shadow.radius=3;
    S.add(sun);S.add(new T.HemisphereLight(0xcfd8ff,0x3a2a1a,.45));
    this.ftex={};
    
    this.sgeo=new T.SphereGeometry(this.SR,22,16);this.ray=new T.Raycaster();this.v3=new T.Vector3();
    this.grp=new T.Group();S.add(this.grp);
    this.labRoot=document.getElementById('labels');
    this.bind(cv);this.ok=true;this.resize();
    addEventListener('resize',()=>this.resize());
    this.last=Date.now();const loop=()=>{requestAnimationFrame(loop);try{this.frame()}catch(e){if(!this.err){this.err=1;Toast.show('Ralat 3D: '+e.message)}}};loop();
  },
  woodTex(base,dark,planks){
    const c=document.createElement('canvas');c.width=1024;c.height=512;const g=c.getContext('2d');
    g.fillStyle=base;g.fillRect(0,0,1024,512);
    const lines=(n,col,a0,a1)=>{g.strokeStyle=col;for(let i=0;i<n;i++){const y=Math.random()*512,a=5+Math.random()*10,f=.004+Math.random()*.01,ph=Math.random()*6;g.globalAlpha=a0+Math.random()*a1;g.lineWidth=.5+Math.random()*1.7;g.beginPath();for(let x=0;x<=1024;x+=16){const yy=y+Math.sin(x*f+ph)*a;if(x)g.lineTo(x,yy);else g.moveTo(x,yy)}g.stroke()}};
    lines(700,dark,.03,.1);lines(160,'#ffffff',.015,.035);
    if(planks){g.globalAlpha=.6;g.strokeStyle='#0c0603';g.lineWidth=3;for(let y=0;y<=512;y+=planks){g.beginPath();g.moveTo(0,y);g.lineTo(1024,y);g.stroke();const off=(y/planks%2)*256;for(let x=off;x<1024;x+=512){g.beginPath();g.moveTo(x,y);g.lineTo(x,y+planks);g.stroke()}}}
    g.globalAlpha=1;
    const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t;
  },
  starTex(){
    const c=document.createElement('canvas');c.width=1024;c.height=512;const g=c.getContext('2d'),gr=g.createLinearGradient(0,0,1024,512);gr.addColorStop(0,'#0a0a3a');gr.addColorStop(.5,'#2a1458');gr.addColorStop(1,'#08123a');g.fillStyle=gr;g.fillRect(0,0,1024,512);
    for(let i=0;i<14;i++){const x=Math.random()*1024,y=Math.random()*512,r=60+Math.random()*120,rg=g.createRadialGradient(x,y,0,x,y,r);rg.addColorStop(0,'rgba('+(i%2?'120,60,200':'40,110,220')+',.28)');rg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=rg;g.fillRect(x-r,y-r,2*r,2*r)}
    for(let i=0;i<420;i++){g.globalAlpha=.4+Math.random()*.6;g.fillStyle=i%9?'#fff':'#ffe9a0';const r=.5+Math.random()*(i%9?1.3:2.4);g.beginPath();g.arc(Math.random()*1024,Math.random()*512,r,0,7);g.fill()}
    g.globalAlpha=1;const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t;
  },
  songketTex(base){
    const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d');g.fillStyle=base;g.fillRect(0,0,512,512);
    for(let y=0;y<512;y+=3){g.fillStyle='rgba(0,0,0,'+(y%6?.05:.12)+')';g.fillRect(0,y,512,1)}
    const q=64;g.strokeStyle='#e8c25a';g.fillStyle='#e8c25a';g.lineWidth=3;
    for(let y=0;y<8;y++)for(let x=0;x<8;x++){const cx=x*q+q/2,cy=y*q+q/2,o=(y%2)*q/2;g.beginPath();g.moveTo(cx+o,cy-24);g.lineTo(cx+o+20,cy);g.lineTo(cx+o,cy+24);g.lineTo(cx+o-20,cy);g.closePath();g.stroke();g.beginPath();g.arc(cx+o,cy,5,0,7);g.fill();
      for(let k=0;k<4;k++){g.beginPath();g.moveTo(cx+o-8,cy+26+k*3);g.lineTo(cx+o,cy+36+k*3);g.lineTo(cx+o+8,cy+26+k*3);g.stroke()}}
    const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t;
  },
  weaveTex(){
    const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d'),q=32;
    for(let y=0;y<8;y++)for(let x=0;x<8;x++){const h=(x+y)%2;g.fillStyle=h?'#c9a560':'#b08a48';g.fillRect(x*q,y*q,q,q);g.strokeStyle='rgba(60,36,10,.35)';g.lineWidth=1;for(let k=4;k<q;k+=6){g.beginPath();if(h){g.moveTo(x*q+k,y*q);g.lineTo(x*q+k,y*q+q)}else{g.moveTo(x*q,y*q+k);g.lineTo(x*q+q,y*q+k)}g.stroke()}g.strokeStyle='rgba(30,16,4,.5)';g.strokeRect(x*q+.5,y*q+.5,q-1,q-1)}
    const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t;
  },

  /* ---- lantai: pelantar bercorak ---- */
  floorTex(id){
    const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d'),T=THREE;
    const star=(cx,cy,r,f,st,lw)=>{g.beginPath();for(let k=0;k<16;k++){const a=k*Math.PI/8-Math.PI/2,rr=k%2?r*.62:r;g.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr)}g.closePath();if(f){g.fillStyle=f;g.fill()}if(st){g.strokeStyle=st;g.lineWidth=lw||2;g.stroke()}};
    if(id==='jubin'){
      for(let j=0;j<2;j++)for(let i=0;i<2;i++){const x=i*256,y=j*256,a=(i+j)%2,b=a?'#1f6f6a':'#f0e3c2',o=a?'#f0e3c2':'#8a1f2c';g.fillStyle=b;g.fillRect(x,y,256,256);
        star(x+128,y+128,112,o,'#d9b24a',3);star(x+128,y+128,64,b,'#d9b24a',2);g.fillStyle='#d9b24a';g.beginPath();g.arc(x+128,y+128,16,0,7);g.fill();
        for(const q of[[0,0],[256,0],[0,256],[256,256]]){g.fillStyle=o;g.beginPath();g.arc(x+q[0],y+q[1],40,0,7);g.fill();g.strokeStyle='#d9b24a';g.lineWidth=2;g.stroke()}
        g.strokeStyle='rgba(20,10,4,.65)';g.lineWidth=4;g.strokeRect(x+2,y+2,252,252)}
    }else if(id==='tikar'){
      const q=16;for(let j=0;j<32;j++)for(let i=0;i<32;i++){const d=((i+j)%16===0||(((i-j)%16)+16)%16===0),e=((i+j)%16===8||(((i-j)%16)+16)%16===8);
        g.fillStyle=d?((i+j)%2?'#a8322a':'#c14a3a'):e?((i+j)%2?'#2f6b4a':'#3f8460'):((i+j)%2?'#d4b06a':'#b8924c');g.fillRect(i*q,j*q,q,q);
        g.strokeStyle='rgba(60,36,10,.4)';g.lineWidth=1;g.beginPath();if((i+j)%2){g.moveTo(i*q+q/2,j*q);g.lineTo(i*q+q/2,j*q+q)}else{g.moveTo(i*q,j*q+q/2);g.lineTo(i*q+q,j*q+q/2)}g.stroke();g.strokeRect(i*q+.5,j*q+.5,q-1,q-1)}
    }else if(id==='rebung'){
      g.fillStyle='#0f3a2c';g.fillRect(0,0,512,512);
      for(let r=0;r<8;r++){const y=r*64,o=(r%2)*32;for(let x=-32+o;x<544;x+=64){g.fillStyle='#d9b24a';g.beginPath();g.moveTo(x,y+60);g.lineTo(x+32,y+6);g.lineTo(x+64,y+60);g.closePath();g.fill();
        g.fillStyle=r%2?'#7a1224':'#0f3a2c';g.beginPath();g.moveTo(x+14,y+54);g.lineTo(x+32,y+22);g.lineTo(x+50,y+54);g.closePath();g.fill();g.fillStyle='#d9b24a';g.beginPath();g.arc(x+32,y+44,4,0,7);g.fill()}
        g.fillStyle='rgba(217,178,74,.55)';g.fillRect(0,y+61,512,3)}
    }else if(id==='kawung'){
      g.fillStyle='#17214f';g.fillRect(0,0,512,512);
      for(let j=0;j<4;j++)for(let i=0;i<4;i++){const cx=i*128+64,cy=j*128+64,al=(i+j)%2;
        for(let k=0;k<4;k++){const a=k*Math.PI/2;g.save();g.translate(cx,cy);g.rotate(a);g.beginPath();g.ellipse(0,-30,17,32,0,0,7);g.fillStyle=al?'#e6c25a':'#d89a3a';g.globalAlpha=.92;g.fill();g.globalAlpha=1;g.strokeStyle='#0c1236';g.lineWidth=3;g.stroke();g.beginPath();g.ellipse(0,-30,7,18,0,0,7);g.fillStyle='#17214f';g.fill();g.restore()}
        g.fillStyle='#fff3c8';g.beginPath();g.arc(cx,cy,6,0,7);g.fill();g.fillStyle='#e6c25a';for(const q of[[0,0],[128,0],[0,128],[128,128]]){g.beginPath();g.arc(i*128+q[0],j*128+q[1],4,0,7);g.fill()}}
    }else if(id==='marmar'){
      g.fillStyle='#ece7dc';g.fillRect(0,0,512,512);
      for(let k=0;k<26;k++){g.strokeStyle='rgba('+(k%3?'110,110,120':'150,120,60')+','+(.1+Math.random()*.2)+')';g.lineWidth=.6+Math.random()*1.6;g.beginPath();let x=Math.random()*512,y=Math.random()*512;g.moveTo(x,y);for(let m=0;m<8;m++){x+=Math.random()*70-20;y+=Math.random()*70-35;g.lineTo(x,y)}g.stroke()}
      for(let j=0;j<2;j++)for(let i=0;i<2;i++){const x=i*256,y=j*256,a=(i+j)%2;g.fillStyle=a?'rgba(20,20,30,.9)':'rgba(236,231,220,.0)';g.fillRect(x,y,256,256);
        star(x+128,y+128,100,a?'#e8c25a':'#1a1a22','#e8c25a',3);star(x+128,y+128,52,a?'#1a1a22':'#e8c25a',null);
        g.strokeStyle='#caa24a';g.lineWidth=5;g.strokeRect(x+3,y+3,250,250);g.strokeStyle='#1a1a22';g.lineWidth=2;g.strokeRect(x+11,y+11,234,234)}
    }else if(id==='langit'){
      g.fillStyle='#070b2a';g.fillRect(0,0,512,512);
      const gr=g.createRadialGradient(256,256,10,256,256,300);gr.addColorStop(0,'#1c2a78');gr.addColorStop(1,'#070b2a');g.fillStyle=gr;g.fillRect(0,0,512,512);
      g.strokeStyle='#e8c25a';g.lineWidth=2.5;for(let k=-8;k<=8;k++){g.beginPath();g.moveTo(k*64,0);g.lineTo(k*64+512,512);g.stroke();g.beginPath();g.moveTo(k*64+512,0);g.lineTo(k*64,512);g.stroke()}
      for(let j=0;j<4;j++)for(let i=0;i<4;i++){const cx=i*128+64,cy=j*128+64;star(cx,cy,26,'#fff0a8','#e8c25a',1.5);g.fillStyle='#070b2a';g.beginPath();g.arc(cx,cy,7,0,7);g.fill()}
      for(let k=0;k<160;k++){g.fillStyle='rgba(255,255,255,'+(.3+Math.random()*.6)+')';g.beginPath();g.arc(Math.random()*512,Math.random()*512,.6+Math.random()*1.2,0,7);g.fill()}
    }else{ /* songket */
      const t=this.songketTex('#6b0f1e');return t;
    }
    const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.encoding=T.sRGBEncoding;t.anisotropy=8;return t;
  },
  dais(Lx){
    const T=THREE,G=this.grp,id=FLOORS[cfg.floor]?cfg.floor:'songket',F=FLOORS[id],rx=Lx+1.6,rz=2.6;this.rugR={x:rx,z:rz};
    const base=this.ftex[id]||(this.ftex[id]=this.floorTex(id)),t=base.clone();t.needsUpdate=true;t.repeat.set(2*rx/F.tile,2*rz/F.tile);
    const mo=Object.assign({map:t,roughness:.7,metalness:0},F.mat||{});if(mo.emissive!==undefined)mo.emissiveMap=t;
    const m=new T.MeshStandardMaterial(mo);this.fMat=m;this.fId=id;
    const pg=new T.PlaneGeometry(2*rx,2*rz),pl=new T.Mesh(pg,m);pl.rotation.x=-Math.PI/2;pl.position.y=.004;pl.receiveShadow=true;G.add(pl);
    const bg=new T.BoxGeometry(2*rx+.7,.22,2*rz+.7),bm=new T.MeshStandardMaterial({color:0x2a1408,roughness:.55}),b=new T.Mesh(bg,bm);b.position.y=-.11;b.receiveShadow=true;G.add(b);
    const gg=new T.BoxGeometry(2*rx+.2,.08,2*rz+.2),gm=new T.MeshStandardMaterial({color:0xd9b24a,roughness:.35,metalness:.8}),gb=new T.Mesh(gg,gm);gb.position.y=-.04;G.add(gb);
    this.disp.push(t,m,pg,bg,bm,gg,gm);
  },
  /* ---- bina papan ---- */
  build(n,wood){
    if(!this.ok)return;const key=n+'|'+wood+'|'+cfg.floor;if(key===this.key)return;this.key=key;
    const T=THREE,G=this.grp,TOP=this.TOP,sp=this.SP;
    while(G.children.length)G.remove(G.children[0]);this.disp.forEach(d=>d.dispose());this.disp=[];
    const half=(n-1)/2*sp+.5,sx=half+1.35,Lx=this.Lx=half+2.75,Wz=1.48,H=this.H=[];
    for(let i=0;i<2*n+2;i++){
      if(i===n)H[i]={x:-sx,z:0,r:.85,D:.44,st:1};else if(i===2*n+1)H[i]={x:sx,z:0,r:.85,D:.44,st:1};
      else{const k=i<n?i:2*n-i;H[i]={x:-(k-(n-1)/2)*sp,z:i<n?.62:-.62,r:.5,D:.4,st:0}}
      const h=H[i];h.lx=h.x;h.lz=h.st?1.12:(h.z>0?1.3:-1.3);
    }
    const W=WOODS[wood]||WOODS.jati,tex=wood==='angkasa'?this.starTex():wood==='diraja'?this.songketTex(W[0]):this.woodTex(W[0],W[1]);tex.repeat.set(.09,.2);
    const wo=Object.assign({map:tex,bumpMap:tex,bumpScale:.012,roughness:.5,metalness:0,clearcoat:.45,clearcoatRoughness:.35},WOODX[wood]||{});if(wo.emissive!==undefined)wo.emissiveMap=tex;const wm=new T.MeshPhysicalMaterial(wo);
    const bm=new T.MeshStandardMaterial({color:new T.Color(W[0]).multiplyScalar(.42),roughness:.72,side:T.BackSide});
    this.disp.push(tex,wm,bm);
    /* badan: bentuk perahu dengan lubang tembus */
    const sh=new T.Shape(),N=96,sg=v=>v<0?-1:1;
    for(let j=0;j<N;j++){const a=j/N*Math.PI*2,c=Math.cos(a),s=Math.sin(a),x=Lx*sg(c)*Math.pow(Math.abs(c),.55),y=Wz*sg(s)*Math.pow(Math.abs(s),.75);if(j)sh.lineTo(x,y);else sh.moveTo(x,y)}
    for(const h of H){const p=new T.Path();p.absarc(h.x,-h.z,h.r,0,Math.PI*2,true);sh.holes.push(p)}
    const geo=new T.ExtrudeGeometry(sh,{depth:.5,bevelEnabled:true,bevelThickness:.05,bevelSize:.05,bevelSegments:3,curveSegments:40});
    geo.rotateX(-Math.PI/2);geo.translate(0,.05,0);
    const body=new T.Mesh(geo,wm);body.castShadow=true;body.receiveShadow=true;G.add(body);this.disp.push(geo);
    /* mangkuk cekung, cincin sorotan, cakera pilih */
    this.rings=[];this.picks=[];
    const pmat=new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false});this.disp.push(pmat);
    H.forEach((h,i)=>{
      const bg=new T.SphereGeometry(h.r+.04,36,18,0,Math.PI*2,Math.PI/2,Math.PI/2),b=new T.Mesh(bg,bm);b.scale.y=h.D/(h.r+.04);b.position.set(h.x,TOP-.05,h.z);b.receiveShadow=true;G.add(b);
      const rg=new T.TorusGeometry(h.r+.05,.04,8,56),rm=new T.MeshBasicMaterial({color:0xffd45a,transparent:true,opacity:.9}),r=new T.Mesh(rg,rm);r.rotation.x=Math.PI/2;r.position.set(h.x,TOP+.03,h.z);r.visible=false;G.add(r);this.rings[i]=r;
      const pg=new T.CircleGeometry(h.r+.08,24),p=new T.Mesh(pg,pmat);p.rotation.x=-Math.PI/2;p.position.set(h.x,TOP+.04,h.z);G.add(p);this.picks[i]=p;
      this.disp.push(bg,rg,rm,pg);
    });
    /* kepala angsa berukir di kedua hujung */
    for(const s of[-1,1]){
      const pts=[[Lx-.5,.42],[Lx+.12,.85],[Lx+.3,1.55],[Lx-.02,2.08],[Lx-.42,1.96]].map(p=>new T.Vector3(s*p[0],p[1],0));
      const tg=new T.TubeGeometry(new T.CatmullRomCurve3(pts),40,.17,14,false),neck=new T.Mesh(tg,wm);neck.castShadow=true;G.add(neck);
      const hg=new T.SphereGeometry(.25,20,14),head=new T.Mesh(hg,wm);head.scale.set(1.35,.9,.9);head.position.set(s*(Lx-.5),1.93,0);head.castShadow=true;G.add(head);
      const cg=new T.ConeGeometry(.085,.42,12),beak=new T.Mesh(cg,wm);beak.rotation.z=s*Math.PI/2;beak.position.set(s*(Lx-.98),1.9,0);beak.castShadow=true;G.add(beak);
      this.disp.push(tg,hg,cg);
    }
    this.dais(Lx);
    /* label nombor */
    this.labRoot.innerHTML='';this.lab=[];
    for(let i=0;i<=2*n+2;i++){const d=document.createElement('div');d.className='n3'+(i===2*n+2?' hand':H[i].st?' ibu':'');this.labRoot.appendChild(d);this.lab[i]=d}
    this.hold=H.map(()=>[]);this.hand=[];this.handAt=-1;this.fit();
  },
  /* ---- biji ---- */
  look(type){
    const P=o=>new THREE.MeshPhysicalMaterial(o),S=o=>new THREE.MeshStandardMaterial(o);
    switch(type){
      case 'guli':return{sc:[1,1,1],m:[0x1f6fd0,0x2aa84a,0xd9a21c,0xc8321e,0x7a3fc0,0x18a0a0].map(c=>P({color:c,roughness:.04,clearcoat:1,clearcoatRoughness:.03,envMapIntensity:1.7}))};
      case 'batu':return{sc:[1.1,.75,.95],m:[0x8d9196,0x6f747a,0xa9aca8].map(c=>S({color:c,roughness:.86}))};
      case 'kulit':return{sc:[1.25,.6,.95],m:[0xf3e6cc,0xe6d2ae].map(c=>S({color:c,roughness:.35}))};
      case 'emas':return{sc:[1,1,1],m:[S({color:0xffc24a,metalness:1,roughness:.22})]};
      case 'mutiara':return{sc:[1,1,1],m:[0xfdf6ee,0xf4e8ee,0xeef2f8].map(c=>P({color:c,roughness:.18,metalness:.05,clearcoat:1,clearcoatRoughness:.08,sheen:1,sheenColor:new THREE.Color(0xffd0f0),envMapIntensity:1.6}))};
      case 'zamrud':return{sc:[1,.9,1.1],m:[0x0fa860,0x0c8a50].map(c=>P({color:c,roughness:.03,transmission:.6,thickness:.6,ior:1.57,clearcoat:1,envMapIntensity:2,emissive:c,emissiveIntensity:.12}))};
      case 'delima':return{sc:[1,.9,1.1],m:[0xd0143c,0xa8102e].map(c=>P({color:c,roughness:.03,transmission:.5,thickness:.6,ior:1.76,clearcoat:1,envMapIntensity:2,emissive:c,emissiveIntensity:.15}))};
      case 'nilam':return{sc:[1,.9,1.1],m:[0x1c3fd0,0x2a5ae0].map(c=>P({color:c,roughness:.03,transmission:.5,thickness:.6,ior:1.77,clearcoat:1,envMapIntensity:2,emissive:c,emissiveIntensity:.15}))};
      case 'bara':return{sc:[1,1,1],m:[0xff6a1a,0xff3a0a,0xffa030].map(c=>S({color:0x301008,emissive:c,emissiveIntensity:1.1,roughness:.5}))};
      case 'planet':return{sc:[1.08,1.08,1.08],m:[[0x3a7ad8,0x2ea860],[0xd8883a,0xa8441c],[0x9a5ad8,0x4a2a9a],[0x38c8c8,0x1a6a8a],[0xe8d8a0,0xb89a58]].map(([a,b])=>{const cv=document.createElement('canvas');cv.width=128;cv.height=64;const g=cv.getContext('2d');g.fillStyle='#'+a.toString(16).padStart(6,'0');g.fillRect(0,0,128,64);g.fillStyle='#'+b.toString(16).padStart(6,'0');for(let i=0;i<9;i++){g.globalAlpha=.55;g.beginPath();g.ellipse(Math.random()*128,Math.random()*64,10+Math.random()*30,4+Math.random()*8,0,0,7);g.fill()}const t=new THREE.CanvasTexture(cv);t.encoding=THREE.sRGBEncoding;return P({map:t,roughness:.45,clearcoat:.5})})};
      case 'bintang':return{sc:[1,1,1],m:[0xfff2b0,0xffffff,0xbfe6ff].map(c=>P({color:c,emissive:c,emissiveIntensity:.9,roughness:.1,clearcoat:1}))};
      default:return{sc:[1,.78,1.15],m:[0xb5120c,0x9a0e0a,0xc41a10].map(c=>P({color:c,roughness:.16,clearcoat:1,clearcoatRoughness:.1}))};
    }
  },
  setSeedType(t){if(!this.ok)return;this.seedType=t;if(this.lk)this.lk.m.forEach(m=>m.dispose());this.lk=this.look(t);this.seeds.forEach((s,i)=>this.dress(s,i))},
  dress(s,i){const L=this.lk,j=1+((i*37)%7)*.02;s.m.material=L.m[i%L.m.length];s.m.scale.set(L.sc[0]*j,L.sc[1]*j,L.sc[2]*j);s.m.rotation.y=i*1.7},
  newSeed(){if(!this.lk)this.lk=this.look(this.seedType);const m=new THREE.Mesh(this.sgeo,this.lk.m[0]);m.castShadow=true;m.receiveShadow=true;this.scene.add(m);const s={m,p:{x:0,y:-5,z:0}};this.seeds.push(s);this.dress(s,this.seeds.length-1);return s},
  slot(i,k){
    const h=this.H[i],per=h.st?18:6,fac=h.st?.72:.6,kk=k%per,L=Math.floor(k/per),rad=h.r*fac*Math.sqrt((kk+.5)/per),ang=kk*2.399+L*1.1+i;
    return{x:h.x+rad*Math.cos(ang),y:this.TOP-.05-h.D*Math.sqrt(Math.max(0,1-Math.pow(rad/h.r,2)))+this.SR*.8+L*this.SR*1.45,z:h.z+rad*Math.sin(ang)};
  },
  hover(i,j){const h=this.H[i],r=.17*Math.sqrt(j),a=j*2.4;return{x:h.x+r*Math.cos(a),y:this.TOP+1.15+(j%3)*.12,z:h.z+r*Math.sin(a)}},
  put(s,p){s.p=p;s.m.position.set(p.x,p.y,p.z)},
  sync(view){
    if(!this.ok)return;this.tw.forEach(t=>t.res());this.tw=[];this.hand=[];this.handAt=-1;
    let total=0;for(const v of view)total+=v;while(this.seeds.length<total)this.newSeed();
    let q=0;this.hold=this.H.map(()=>[]);
    view.forEach((c,i)=>{for(let k=0;k<c;k++){const s=this.seeds[q++];s.m.visible=true;this.put(s,this.slot(i,k));this.hold[i].push(s)}});
    for(;q<this.seeds.length;q++)this.seeds[q].m.visible=false;
  },
  tween(s,to,dur,arc){
    return new Promise(res=>{
      const old=this.tw.findIndex(t=>t.s===s);if(old>=0){this.tw[old].res();this.tw.splice(old,1)}
      if(!(dur>1)){this.put(s,to);res();return}
      this.tw.push({s,f:s.p,to,t0:Date.now(),dur,arc:arc||0,res});
    });
  },
  async pick(i,dur){
    if(!this.ok)return;const a=this.hold[i];this.hold[i]=[];this.handAt=i;const ps=[];
    for(const s of a){this.hand.push(s);ps.push(this.tween(s,this.hover(i,this.hand.length-1),dur,.25))}
    await Promise.all(ps);
  },
  async drop(i,dur){
    if(!this.ok)return;const s=this.hand.pop();if(!s)return;this.handAt=i;
    this.hand.forEach((o,j)=>{this.tween(o,this.hover(i,j),dur*.85,.08)});
    const to=this.slot(i,this.hold[i].length);this.hold[i].push(s);await this.tween(s,to,dur,.35);
  },
  async capture(i,o,st,dur){
    if(!this.ok)return;const a=this.hold[i].concat(this.hold[o]);this.hold[i]=[];this.hold[o]=[];const ps=[];
    a.forEach((s,k)=>{const to=this.slot(st,this.hold[st].length);this.hold[st].push(s);ps.push(sleep(k*45*(dur>1?1:0)).then(()=>this.tween(s,to,dur,1.6)))});
    await Promise.all(ps);
  },
  async bonus(st,k,dur){
    if(!this.ok)return;const h=this.H[st],ps=[];
    for(let j=0;j<k;j++){const s=this.newSeed();s.m.visible=true;this.put(s,{x:h.x,y:this.TOP+5+j,z:h.z});const to=this.slot(st,this.hold[st].length);this.hold[st].push(s);ps.push(this.tween(s,to,dur,0))}
    await Promise.all(ps);
  },
  async sweep(n,dur){
    if(!this.ok)return;const ps=[];
    for(const p of[0,1]){const st=p?2*n+1:n;for(let k=0;k<n;k++){const i=p?n+1+k:k;for(const s of this.hold[i]){const to=this.slot(st,this.hold[st].length);this.hold[st].push(s);ps.push(this.tween(s,to,dur,1.2))}this.hold[i]=[]}}
    await Promise.all(ps);
  },
  /* ---- keadaan paparan ---- */
  setState(view,can,marks){
    if(!this.ok||!this.lab.length)return;const col={can:0xffd45a,pth:0xffffff,tgt:0x5ad8ff,hint:0x6aff8a};
    for(let i=0;i<this.H.length;i++){
      const d=this.lab[i],v=view[i],m=(marks&&marks[i])||(can.has(i)?'can':'');
      d.textContent=v;d.classList.toggle('z',!v);d.classList.toggle('can',can.has(i));
      const r=this.rings[i];r.visible=!!m;if(m)r.material.color.setHex(col[m]);
    }
  },
  screen(x,y,z){const v=this.v3.set(x,y,z).project(this.cam);return{x:(v.x*.5+.5)*this.w,y:(-v.y*.5+.5)*this.h}},
  holeScreen(i){const h=this.H[i];return h?this.screen(h.x,this.TOP+.3,h.z):{x:0,y:0}},
  /* ---- kamera & input ---- */
  setMode(m){this.mode=m;this.fit()},
  fit(){
    if(!this.ok)return;const a=this.w/this.h,vf=36*Math.PI/180,hf=2*Math.atan(Math.tan(vf/2)*a),L=this.Lx+.9;this.port=a<.85;
    if(this.port&&this.mode!=='setup'){this.az=Math.PI/2;this.pol=.6;this.base=Math.max(2.7/Math.tan(hf/2),L*.95/Math.tan(vf/2))}
    else{this.az=0;this.pol=.72;this.base=Math.max(L/Math.tan(hf/2),3.4/Math.tan(vf/2))*1.03}
    if(this.flip&&this.mode==='match')this.az+=Math.PI;
    this.dist=this.base*(this.mode==='menu'?1.12:this.mode==='setup'?1.25:1);
  },
  resize(){if(!this.ok)return;this.w=window.innerWidth||800;this.h=window.innerHeight||600;this.R.setSize(this.w,this.h,false);this.cam.aspect=this.w/this.h;this.cam.updateProjectionMatrix();this.fit()},
  bind(cv){
    const P=new Map();let st=null,pin=0,d0=0;
    const cl=(v,a,b)=>Math.max(a,Math.min(b,v)),gap=()=>{const a=[...P.values()];return Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)};
    cv.addEventListener('pointerdown',e=>{P.set(e.pointerId,{x:e.clientX,y:e.clientY});try{cv.setPointerCapture(e.pointerId)}catch(x){}
      if(P.size===1)st={x:e.clientX,y:e.clientY,az:this.az,pol:this.pol,mv:false};else if(P.size===2){pin=gap();d0=this.dist;if(st)st.mv=true}});
    cv.addEventListener('pointermove',e=>{
      if(!P.has(e.pointerId)){if(this.onHover)this.onHover(this.hit(e.clientX,e.clientY));return}
      P.set(e.pointerId,{x:e.clientX,y:e.clientY});
      if(P.size===2&&pin){this.dist=cl(d0*pin/gap(),this.base*.45,this.base*1.8);return}
      if(!st)return;const dx=e.clientX-st.x,dy=e.clientY-st.y;if(Math.abs(dx)+Math.abs(dy)>7)st.mv=true;
      if(st.mv&&this.mode!=='menu'){this.az=st.az-dx*.005;this.pol=cl(st.pol-dy*.004,.2,1.3)}});
    const up=e=>{if(!P.has(e.pointerId))return;P.delete(e.pointerId);if(st&&!st.mv&&P.size===0&&e.type==='pointerup'&&this.onTap){const i=this.hit(e.clientX,e.clientY);if(i>=0)this.onTap(i)}if(P.size===0){st=null;pin=0}};
    cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
    cv.addEventListener('wheel',e=>{e.preventDefault();this.dist=cl(this.dist*Math.exp(e.deltaY*.001),this.base*.45,this.base*1.8)},{passive:false});
  },
  hit(x,y){
    if(!this.ok)return -1;this.ray.setFromCamera({x:x/this.w*2-1,y:-(y/this.h)*2+1},this.cam);
    const hs=this.ray.intersectObjects(this.picks,false);return hs.length?this.picks.indexOf(hs[0].object):-1;
  },
  frame(){
    const now=Date.now(),dt=Math.min(.05,(now-this.last)/1000);this.last=now;
    for(let k=this.tw.length-1;k>=0;k--){const t=this.tw[k],u=Math.min(1,(now-t.t0)/t.dur),e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;
      t.s.m.position.set(t.f.x+(t.to.x-t.f.x)*e,t.f.y+(t.to.y-t.f.y)*e+t.arc*4*u*(1-u),t.f.z+(t.to.z-t.f.z)*e);
      if(u>=1){t.s.p=t.to;this.tw.splice(k,1);t.res()}}
    if(this.mode==='menu')this.az+=dt*.12;
    let rr=0,cc=0;if(this.mode==='setup'){if(this.port)cc=this.dist*.3;else rr=this.dist*.16}else if(this.mode==='menu'&&!this.port)rr=-this.dist*.2;
    const tx=rr*Math.cos(this.az)+cc*Math.sin(this.az),tz=-rr*Math.sin(this.az)+cc*Math.cos(this.az);
    const sp=Math.sin(this.pol);this.cam.position.set(tx+this.dist*sp*Math.sin(this.az),.4+this.dist*Math.cos(this.pol),tz+this.dist*sp*Math.cos(this.az));this.cam.lookAt(tx,.4,tz);
    const pulse=.55+.4*Math.sin(now*.006);for(const r of this.rings)if(r.visible)r.material.opacity=pulse;
    if(this.fMat&&this.fId==='langit')this.fMat.emissiveIntensity=.45+.25*Math.sin(now*.0016);
    this.R.render(this.scene,this.cam);
    if(this.mode!=='menu'&&this.rugR){const r=this.rugR;let a=1e9,b=-1e9;for(const x of[-r.x,r.x])for(const z of[-r.z,r.z]){const q=this.screen(x,0,z);if(q.y<a)a=q.y;if(q.y>b)b=q.y}this.rugTop=this.rugTop==null?a:this.rugTop+(a-this.rugTop)*.25;this.rugBot=b;Istana.frame(now,this.az,this.rugTop,this.w,this.h)}
    if(this.mode!=='menu'&&this.lab.length){
      for(let i=0;i<this.H.length;i++){const h=this.H[i],q=this.screen(h.lx,this.TOP+.05,h.lz);this.lab[i].style.transform=`translate(${q.x.toFixed(1)}px,${q.y.toFixed(1)}px) translate(-50%,-50%)`}
      const hd=this.lab[this.H.length];
      if(this.handAt>=0&&this.hand.length){const h=this.H[this.handAt],q=this.screen(h.x,this.TOP+1.75,h.z);hd.textContent='✋ '+this.hand.length;hd.style.opacity=1;hd.style.transform=`translate(${q.x.toFixed(1)}px,${q.y.toFixed(1)}px) translate(-50%,-50%)`}else hd.style.opacity=0;
    }
  }
};
