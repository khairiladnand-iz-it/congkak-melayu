/* ===== LATAR: ISTANA KESULTANAN MELAYU MELAKA (render 3D mini atas kanvas) ===== */
const IC=[0,0,0];
function IH(a,b){const x=Math.sin(a*127.1+b*311.7)*43758.5453;return x-Math.floor(x)}
function IN(a){const l=Math.hypot(a[0],a[1],a[2])||1;return[a[0]/l,a[1]/l,a[2]/l]}
function IFB(u,a,b){return u<a?0:u>b?1:(u-a)/(b-a)}
/* tekstur: u = kedudukan dunia (atau tempatan), v = jarak dari tepi atas/bawah muka */
const ITEX={
  /* sirap belian: baris bertindih, celah menegak, lumut & cuaca */
  sirap(u,v,f){
    const rh=.46,sw=.64,row=Math.floor(v/rh),tr=v/rh-row,off=(row&1)*.32,
      cu=(u+off)/sw,cl=Math.floor(cu),tc=cu-cl,h=IH(row*3.7,cl*7.1),w2=IH(cl*1.37,row*.23);
    let r=40+h*20,g=38+h*18,b=36+h*16;
    if(w2>.9){r*=.78;g*=.88;b*=.74}else if(w2<.07){r*=1.16;g*=1.12;b*=1.06}
    const st=IH(cl*.41,0);if(st>.8){const k=.84+.16*tr;r*=k;g*=k;b*=k}
    if(tr<.26){const k=.4+.6*(tr/.26);r*=k;g*=k;b*=k}
    if(tc<.07||tc>.95){r*=.58;g*=.58;b*=.58}
    if(tr>.74){const k=1+(tr-.74)*.62;r*=k;g*=k;b*=k}
    const pch=IH(Math.floor(u/3.4),Math.floor(v/2.6));const pk=.86+.24*pch;r*=pk;g*=pk;b*=pk;
    const ao=1-.46*IFB(v,f.vh-3.4,f.vh)-.08*IFB(.9-v,0,.9);r*=ao;g*=ao;b*=ao;
    IC[0]=r;IC[1]=g;IC[2]=b;return IC},
  /* dinding papan menegak bergurat */
  papan(u,v,f){
    const pw=.27,cu=u/pw,cl=Math.floor(cu),tc=cu-cl,h=IH(cl*5.1,0);
    let r=92+h*30,g=61+h*23,b=36+h*15;
    const gr=.6+.4*Math.abs(Math.sin(v*2.1+cl*2.7));r*=.86+.14*gr;g*=.86+.14*gr;b*=.86+.14*gr;
    if(tc<.09||tc>.93){r*=.52;g*=.5;b*=.48}
    const ao=.52+.48*IFB(v,0,2.2)*(1-.35*IFB(v,f.vh-1.2,f.vh));r*=ao;g*=ao;b*=ao;
    IC[0]=r;IC[1]=g;IC[2]=b;return IC},
  /* papan kekisi jarang (dinding atas) */
  kisi(u,v,f){
    const pw=.3,tc=(u/pw)-Math.floor(u/pw);
    if(tc>.52&&v>.35&&v<f.vh-.35){IC[0]=14;IC[1]=10;IC[2]=8;return IC}
    const h=IH(Math.floor(u/pw)*3.3,0);IC[0]=118+h*30;IC[1]=82+h*22;IC[2]=50+h*16;return IC},
  /* tiang kayu bulat-segi */
  tiang(u,v,f){
    const h=IH(Math.floor(u*4),0);let k=.84+.16*h;
    const ao=.45+.55*IFB(v,0,1.4);IC[0]=86*k*ao+6;IC[1]=58*k*ao+4;IC[2]=34*k*ao+3;return IC},
  /* bata/batu pelantar */
  batu(u,v,f){
    const bh=.62,row=Math.floor(v/bh),tr=v/bh-row,bw=1.3,off=(row&1)*.65,
      cu=(u+off)/bw,cl=Math.floor(cu),tc=cu-cl,h=IH(cl*2.3,row*6.1);
    let r=112+h*30,g=103+h*26,b=88+h*22;
    const sp=IH(u*31,v*27);r*=.93+.14*sp;g*=.93+.14*sp;b*=.93+.14*sp;
    if(tr<.07||tc<.03||tc>.97){r*=.66;g*=.66;b*=.64}
    const ao=.62+.38*IFB(v,0,1.1);r*=ao;g*=ao;b*=ao;
    IC[0]=r;IC[1]=g;IC[2]=b;return IC},
  /* papan cantik berukir tembus di bawah cucur atap */
  ukir(u,v,f){
    const p=1.15,t=Math.abs(((u%p)+p)%p/p-.5)*2,s=v/f.vh;
    if(s>.26+.64*t*t)return null;
    if(s>.1&&s<.2&&t<.3)return null;
    const h=IH(Math.floor(u/p)*4.1,0);let r=176+h*34,g=136+h*26,b=86+h*18;
    const e=IFB(.26+.64*t*t-s,0,.1);const k=.62+.38*e;r*=k;g*=k;b*=k;
    IC[0]=r;IC[1]=g;IC[2]=b;return IC},
  /* susur/pagar berjeriji */
  pagar(u,v,f){
    const p=.26,tc=((u%p)+p)%p/p,s=v/f.vh;
    if(s>.2&&s<.78&&tc>.42)return null;
    const h=IH(Math.floor(u/p)*2.7,0);let r=150+h*30,g=112+h*22,b=70+h*16;
    if(s<.12){r*=1.08;g*=1.06;b*=1.02}
    IC[0]=r;IC[1]=g;IC[2]=b;return IC},
  /* tingkap: bingkai + kekisi + kaca gelap */
  tingkap(u,v,f){
    const w=f.uw,h=f.vh,fr=.24;
    if(u<fr||u>w-fr||v<fr||v>h-fr){const q=.9+.2*IH(u*3.3,v*3.7);let r=168*q,g=124*q,b=76*q;if(v<fr)
      {r*=.66;g*=.66;b*=.66}IC[0]=r;IC[1]=g;IC[2]=b;return IC}
    const m=(u-fr)/((w-2*fr)/3),mr=Math.round(m);
    if(mr>0&&mr<3&&Math.abs(m-mr)<.08){IC[0]=104;IC[1]=72;IC[2]=44;return IC}
    const s=(v-fr)/(h-2*fr);let r=24+10*(1-s),g=23+12*(1-s),b=28+18*(1-s);
    if(s<.34){const k=(.34-s)/.34;r+=58*k;g+=66*k;b+=80*k}
    IC[0]=r;IC[1]=g;IC[2]=b;return IC},
  /* pintu gerbang */
  pintu(u,v,f){
    const w=f.uw,h=f.vh,fr=.3;
    if(u<fr||u>w-fr||v<fr){const q=.9+.2*IH(u*3,v*3);IC[0]=176*q;IC[1]=130*q;IC[2]=78*q;return IC}
    const s=v/h;IC[0]=22+14*(1-s);IC[1]=18+12*(1-s);IC[2]=16+12*(1-s);return IC},
  /* perabung / jalur bubung */
  perabung(u,v,f){const h=IH(Math.floor(u/.42),0),s=Math.abs(v/f.vh-.5)*2,k=(1.3-.55*s)*(.9+.2*h);
    IC[0]=58*k;IC[1]=53*k;IC[2]=48*k;return IC},
  /* anak tangga */
  tangga(u,v,f){const h=IH(Math.floor(u*1.3),Math.floor(v*3));IC[0]=124+h*26;IC[1]=114+h*22;IC[2]=98+h*18;return IC}
};
const Istana={
  c:null,g:null,w:0,h:0,dpr:1,ok:false,ck:'',pk:'',hq:0,pal:null,gnd:null,tre:null,grn:null,
  rnd:(()=>{let s=7;return()=>(s=(s*16807)%2147483647)/2147483647})(),
  init(){
    this.c=document.getElementById('ist');if(!this.c)return;this.g=this.c.getContext('2d');if(!this.g)return;
    const r=this.rnd;
    this.stars=Array.from({length:150},()=>({x:r(),y:r()*.92,s:.4+r()*1.4,p:r()*6}));
    this.ff=Array.from({length:26},()=>({x:r(),y:r(),p:r()*6,s:.4+r()*.8,r:1.3+r()*1.6}));
    this.pt=Array.from({length:14},()=>({x:r(),y:r(),p:r()*6,s:.028+r()*.04,z:2.6+r()*3.4,c:r()<.5?'#ff6a86':'#ffc8d8'}));
    this.bd=Array.from({length:6},()=>({x:r(),y:.14+r()*.5,s:.012+r()*.013,p:r()*6,z:.6+r()*.7}));
    this.ships=[{x:.18,s:.62,z:1},{x:.68,s:.4,z:.72}];
    this.cl=Array.from({length:7},(_,i)=>({x:r(),y:.05+r()*.52,s:.0035+r()*.0055,z:.7+r()*1.3,v:i%2}));
    this.cloud=[this.mkCloud('255,206,160'),this.mkCloud('126,126,186')];
    try{this.grn=this.mkGrain()}catch(e){this.grn=null}
    this.ok=true;
  },
  mkGrain(){const c=document.createElement('canvas');c.width=c.height=96;const g=c.getContext('2d'),d=g.createImageData(96,96),a=d.data;
    for(let i=0;i<a.length;i+=4){const v=120+Math.random()*68;a[i]=a[i+1]=a[i+2]=v;a[i+3]=22}g.putImageData(d,0,0);return c},
  mkCloud(rgb){
    const c=document.createElement('canvas');c.width=300;c.height=110;const g=c.getContext('2d');
    for(let i=0;i<22;i++){const x=28+i*11+Math.sin(i*2.3)*14,y=62-Math.sin(i/21*Math.PI)*24+Math.cos(i*1.7)*7,r=14+Math.sin(i*1.9)*7+12,gr=g.createRadialGradient(x,y-r*.3,0,x,y,r);
      gr.addColorStop(0,'rgba('+rgb+',.6)');gr.addColorStop(.6,'rgba('+rgb+',.24)');gr.addColorStop(1,'rgba('+rgb+',0)');g.fillStyle=gr;g.fillRect(x-r,y-r,2*r,2*r)}
    return c},
  mix(a,b,t){const A=this.hex(a),B=this.hex(b);return'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')+')'},
  hex(h){const n=parseInt(h.slice(1),16);return[n>>16,n>>8&255,n&255]},

  /* ================= kamera & muka ================= */
  setCam(fl,cx,cy,eye,tgt){
    const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],cr=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
    const f=IN(sub(tgt,eye)),r=IN(cr(f,[0,1,0])),u=cr(r,f);
    this.cm={eye,f,r,u,fl,cx,cy};
  },
  pr(p){const c=this.cm,dx=p[0]-c.eye[0],dy=p[1]-c.eye[1],dz=p[2]-c.eye[2],
    z=dx*c.f[0]+dy*c.f[1]+dz*c.f[2];if(z<.5)return null;
    return[c.cx+(dx*c.r[0]+dy*c.r[1]+dz*c.r[2])*c.fl/z,c.cy-(dx*c.u[0]+dy*c.u[1]+dz*c.u[2])*c.fl/z,z]},
  quad(F,A,B,C,D,ctr,o){
    const ux=B[0]-A[0],uy=B[1]-A[1],uz=B[2]-A[2],vx=D[0]-A[0],vy=D[1]-A[1],vz=D[2]-A[2];
    let n=IN([uy*vz-uz*vy,uz*vx-ux*vz,ux*vy-uy*vx]);
    const fc=[(A[0]+C[0])/2,(A[1]+C[1])/2,(A[2]+C[2])/2];
    if(ctr&&(n[0]*(fc[0]-ctr[0])+n[1]*(fc[1]-ctr[1])+n[2]*(fc[2]-ctr[2]))<0)n=[-n[0],-n[1],-n[2]];
    const e=this.cm.eye,wx=fc[0]-e[0],wy=fc[1]-e[1],wz=fc[2]-e[2];
    if(n[0]*wx+n[1]*wy+n[2]*wz>0)return;
    const uw=Math.hypot(ux,uy,uz),vh=Math.hypot(vx,vy,vz);
    F.push(Object.assign({A,B,C,D,n,fc,uw,vh,z:Math.hypot(wx,wy,wz),
      su:Math.max(1,Math.min(190,Math.round(uw/(o.du||.3)))),sv:Math.max(1,Math.min(90,Math.round(vh/(o.dv||.5))))},o));
  },
  /* kotak: 4 sisi (+ atas) */
  box(F,x0,x1,y0,y1,z0,z1,o){
    const c=[(x0+x1)/2,(y0+y1)/2,(z0+z1)/2];
    this.quad(F,[x0,y1,z1],[x1,y1,z1],[x1,y0,z1],[x0,y0,z1],c,Object.assign({ux:0},o));
    this.quad(F,[x1,y1,z0],[x0,y1,z0],[x0,y0,z0],[x1,y0,z0],c,Object.assign({ux:0},o));
    this.quad(F,[x1,y1,z1],[x1,y1,z0],[x1,y0,z0],[x1,y0,z1],c,Object.assign({ux:2},o));
    this.quad(F,[x0,y1,z0],[x0,y1,z1],[x0,y0,z1],[x0,y0,z0],c,Object.assign({ux:2},o));
    if(o.top)this.quad(F,[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1],c,Object.assign({},o,{tex:o.topTex||o.tex,ux:0}));
  },
  /* atap limas terpancung */
  atap(F,x0,x1,z0,z1,y0,tx0,tx1,tz0,tz1,y1,o){
    const c=[0,(y0+y1)/2,0],O=Object.assign({tex:ITEX.sirap,du:.42,dv:.3},o);
    this.quad(F,[x0,y0,z1],[x1,y0,z1],[tx1,y1,tz1],[tx0,y1,tz1],c,Object.assign({ux:0},O));
    this.quad(F,[x1,y0,z0],[x0,y0,z0],[tx0,y1,tz0],[tx1,y1,tz0],c,Object.assign({ux:0},O));
    this.quad(F,[x1,y0,z1],[x1,y0,z0],[tx1,y1,tz0],[tx1,y1,tz1],c,Object.assign({ux:2},O));
    this.quad(F,[x0,y0,z0],[x0,y0,z1],[tx0,y1,tz1],[tx0,y1,tz0],c,Object.assign({ux:2},O));
    if(o.hip!==0){const wd=o.hw||.34;
      this.hip(F,[x0,y0,z0],[tx0,y1,tz0],wd);this.hip(F,[x1,y0,z0],[tx1,y1,tz0],wd);
      this.hip(F,[x0,y0,z1],[tx0,y1,tz1],wd);this.hip(F,[x1,y0,z1],[tx1,y1,tz1],wd)}
  },
  hip(F,p0,p1,wd){
    const dx=p1[0]-p0[0],dz=p1[2]-p0[2],L=Math.hypot(dx,dz)||1,px=-dz/L*wd,pz=dx/L*wd,
      mx=(p0[0]+p1[0])/2,my=(p0[1]+p1[1])/2,mz=(p0[2]+p1[2])/2;
    const c0=[p0[0],p0[1]+.3,p0[2]],c1=[p1[0],p1[1]+.3,p1[2]];
    for(const s of[-1,1]){
      const A=[p0[0]+s*px,p0[1]+.06,p0[2]+s*pz],B=[p1[0]+s*px,p1[1]+.06,p1[2]+s*pz];
      this.quad(F,c0,c1,B,A,[mx-s*px*6,my-1,mz-s*pz*6],{tex:ITEX.perabung,du:.3,dv:.14});
    }
  },
  /* jalur menegak keliling (papan cantik / pagar) */
  jalur(F,x0,x1,z0,z1,y0,y1,o){
    const c=[(x0+x1)/2,(y0+y1)/2,(z0+z1)/2],O=Object.assign({seam:0,two:1,du:.12,dv:.1},o);
    this.quad(F,[x0,y1,z1],[x1,y1,z1],[x1,y0,z1],[x0,y0,z1],c,Object.assign({ux:0},O));
    this.quad(F,[x1,y1,z0],[x0,y1,z0],[x0,y0,z0],[x1,y0,z0],c,Object.assign({ux:0},O));
    this.quad(F,[x1,y1,z1],[x1,y1,z0],[x1,y0,z0],[x1,y0,z1],c,Object.assign({ux:2},O));
    this.quad(F,[x0,y1,z0],[x0,y1,z1],[x0,y0,z1],[x0,y0,z0],c,Object.assign({ux:2},O));
  },
  winRow(F,y0,y1,xs,wd,z,dir,o){
    for(const x of xs)this.quad(F,[x-wd/2,y1,z],[x+wd/2,y1,z],[x+wd/2,y0,z],[x-wd/2,y0,z],
      [0,(y0+y1)/2,z-dir*4],Object.assign({tex:ITEX.tingkap,du:.1,dv:.12,glow:1},o));
  },
  winSide(F,y0,y1,zs,wd,x,dir,o){
    for(const z of zs)this.quad(F,[x,y1,z-wd/2],[x,y1,z+wd/2],[x,y0,z+wd/2],[x,y0,z-wd/2],
      [x-dir*4,(y0+y1)/2,0],Object.assign({tex:ITEX.tingkap,du:.1,dv:.12,glow:1},o));
  },

  /* ================= geometri istana ================= */
  geo(F){
    const B=ITEX,P=[];
    /* pelantar batu berperingkat */
    this.box(F,-30,30,0,1.1,-20,20,{tex:B.batu,du:.4,dv:.3,top:1,topTex:B.tangga});
    this.box(F,-27,27,1.1,2.9,-18,18,{tex:B.batu,du:.4,dv:.3,top:1,topTex:B.tangga});
    /* tiang serambi */
    for(let x=-23;x<=23;x+=3.85){
      this.box(F,x-.33,x+.33,2.9,10.4,13.6,14.26,{tex:B.tiang,du:.25,dv:.6});
      this.box(F,x-.33,x+.33,2.9,10.4,-14.26,-13.6,{tex:B.tiang,du:.25,dv:.6});
    }
    for(let z=-11;z<=11;z+=3.7){
      this.box(F,-20.26,-19.6,2.9,10.4,z-.33,z+.33,{tex:B.tiang,du:.25,dv:.6});
      this.box(F,19.6,20.26,2.9,10.4,z-.33,z+.33,{tex:B.tiang,du:.25,dv:.6});
    }
    /* pagar serambi */
    this.jalur(F,-20.4,20.4,-14.4,14.4,2.9,4.3,{tex:B.pagar});
    /* badan aras bawah */
    this.box(F,-17,17,2.9,10.4,-10,10,{tex:B.papan,du:.14,dv:.7});
    this.winRow(F,4.4,8.6,[-13.5,-9,-4.5,4.5,9,13.5],2.5,10.06,1,{});
    this.winSide(F,4.4,8.6,[-6.6,-2.2,2.2,6.6],2.5,17.06,1,{});
    this.winSide(F,4.4,8.6,[-6.6,-2.2,2.2,6.6],2.5,-17.06,-1,{});
    /* dinding kekisi bawah cucur */
    this.box(F,-17,17,8.9,10.3,-10.02,10.02,{tex:B.kisi,du:.12,dv:.4});
    /* ATAP 1 + papan cantik */
    this.jalur(F,-26.6,26.6,-19.4,19.4,9.2,10.5,{tex:B.ukir});
    this.atap(F,-26.6,26.6,-19.4,19.4,10.5,-12.6,12.6,-7.2,7.2,18.6,{});
    /* aras 2 */
    this.box(F,-11.6,11.6,16.6,22.4,-6.4,6.4,{tex:B.papan,du:.14,dv:.7});
    this.winRow(F,17.8,21.1,[-8.4,-4.2,0,4.2,8.4],2.2,6.46,1,{});
    this.winSide(F,17.8,21.1,[-3.6,0,3.6],2.2,11.66,1,{});
    this.winSide(F,17.8,21.1,[-3.6,0,3.6],2.2,-11.66,-1,{});
    this.jalur(F,-16.6,16.6,-11.4,11.4,21.1,22.5,{tex:B.ukir});
    this.atap(F,-16.6,16.6,-11.4,11.4,22.5,-6.8,6.8,-3.9,3.9,28.4,{});
    /* aras 3 (anjung puncak) */
    this.box(F,-6.2,6.2,26.6,30.3,-3.5,3.5,{tex:B.papan,du:.14,dv:.7});
    this.winRow(F,27.5,29.5,[-3.4,0,3.4],1.9,3.56,1,{});
    this.jalur(F,-9.6,9.6,-6.6,6.6,29,30.4,{tex:B.ukir});
    this.atap(F,-9.6,9.6,-6.6,6.6,30.4,-3.4,3.4,-.45,.45,38.6,{});
    this.hip(F,[-3.6,38.6,0],[3.6,38.6,0],.42);
    this.box(F,-.26,.26,38.4,41.4,-.26,.26,{tex:B.tiang,du:.2,dv:.5,top:1});
    this.box(F,-1.1,1.1,39.2,39.6,-1.1,1.1,{tex:B.ukir,du:.14,dv:.12,seam:0,top:1});
    /* anjung hadapan + tangga */
    this.box(F,-6,6,2.9,8.6,10,18,{tex:B.papan,du:.14,dv:.7});
    this.quad(F,[-2.1,7.4,18.06],[2.1,7.4,18.06],[2.1,2.9,18.06],[-2.1,2.9,18.06],[0,5,14],{tex:B.pintu,du:.12,dv:.14,glow:1});
    for(const x of[-6.4,6.4])this.box(F,x-.36,x+.36,2.9,8.6,17.3,18.02,{tex:B.tiang,du:.25,dv:.6});
    this.jalur(F,-9.4,9.4,8.6,21.4,7.4,8.7,{tex:B.ukir});
    this.atap(F,-9.4,9.4,8.6,21.4,8.7,-3,3,11.6,15.4,13.2,{});
    for(let k=0;k<7;k++){const y=2.9-k*.41,zz=18+k*.78;
      this.box(F,-4.6,4.6,y-.41,y,zz,zz+.78,{tex:B.tangga,du:.5,dv:.3,top:1})}
    this.jalur(F,-5.4,5.4,18,23.6,1.4,2.7,{tex:B.pagar});
    /* tiang bendera */
    for(const x of[-32,32]){this.box(F,x-.26,x+.26,0,15.5,16.4,16.92,{tex:B.tiang,du:.2,dv:.6});P.push([x,15.4,16.66])}
    return P;
  },
  drawFace(g,f){
    const su=f.su,sv=f.sv,A=f.A,B=f.B,C=f.C,D=f.D,gp=[],g3=[];
    for(let j=0;j<=sv;j++){
      const v=j/sv,r=[],r3=[];
      for(let i=0;i<=su;i++){const u=i/su,
        ax=A[0]+(B[0]-A[0])*u,ay=A[1]+(B[1]-A[1])*u,az=A[2]+(B[2]-A[2])*u,
        bx=D[0]+(C[0]-D[0])*u,by=D[1]+(C[1]-D[1])*u,bz=D[2]+(C[2]-D[2])*u,
        p=[ax+(bx-ax)*v,ay+(by-ay)*v,az+(bz-az)*v];
        r3.push(p);r.push(this.pr(p))}
      gp.push(r);g3.push(r3)}
    const L=f.lit,tex=f.tex,ux=f.ux;
    for(let j=0;j<sv;j++)for(let i=0;i<su;i++){
      const p0=gp[j][i],p1=gp[j][i+1],p2=gp[j+1][i+1],p3=gp[j+1][i];
      if(!p0||!p1||!p2||!p3)continue;
      const m0=g3[j][i],m2=g3[j+1][i+1],
        uu=ux===undefined?(i+.5)/su*f.uw:(m0[ux]+m2[ux])/2,
        vv=(j+.5)/sv*f.vh,
        c=tex(uu,vv,f);
      if(!c)continue;
      const r0=c[0]*L,g0=c[1]*L,b0=c[2]*L,
        s='rgb('+(r0>255?255:r0|0)+','+(g0>255?255:g0|0)+','+(b0>255?255:b0|0)+')';
      g.fillStyle=s;g.beginPath();g.moveTo(p0[0],p0[1]);g.lineTo(p1[0],p1[1]);g.lineTo(p2[0],p2[1]);g.lineTo(p3[0],p3[1]);g.closePath();g.fill();
      if(f.seam!==0){g.strokeStyle=s;g.lineWidth=1;g.stroke()}
    }
  },
  build3(ppm,k){
    const D=185,a=20*Math.PI/180,eye=[-D*Math.sin(a),19,D*Math.cos(a)],tgt=[0,19,0];
    this.setCam(ppm*k*D,0,0,eye,tgt);
    const F=[],poles=this.geo(F);
    let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;
    for(const f of F)for(const p of[f.A,f.B,f.C,f.D]){const q=this.pr(p);if(!q)continue;
      if(q[0]<x0)x0=q[0];if(q[0]>x1)x1=q[0];if(q[1]<y0)y0=q[1];if(q[1]>y1)y1=q[1]}
    const pad=10*k,sw=Math.ceil(x1-x0+2*pad),sh=Math.ceil(y1-y0+2*pad);
    this.setCam(ppm*k*D,-x0+pad,-y0+pad,eye,tgt);
    const c=document.createElement('canvas');c.width=sw;c.height=sh;const g=c.getContext('2d');
    const SUN=IN([.66,.58,.52]);
    F.sort((p,q)=>q.z-p.z);
    const wins=[];
    for(const f of F){
      const d=Math.max(0,f.n[0]*SUN[0]+f.n[1]*SUN[1]+f.n[2]*SUN[2]);
      f.lit=Math.min(1.2,.2+.15*(f.n[1]*.5+.5)+.08*Math.max(0,-f.n[0])+.92*d);
      this.drawFace(g,f);
      if(f.glow){const q=this.pr(f.fc);if(q)wins.push([q[0],q[1],Math.max(3*k,f.uw*ppm*k*.7)])}
    }
    const sil=col=>{const q=document.createElement('canvas');q.width=sw;q.height=sh;const x=q.getContext('2d');
      x.drawImage(c,0,0);x.globalCompositeOperation='source-in';x.fillStyle=col;x.fillRect(0,0,sw,sh);return q};
    const an=this.pr([0,0,0]),pl=[];
    for(const p of poles){const q=this.pr(p);if(q)pl.push(q)}
    return{c,dark:sil('#111a3e'),warm:sil('#ff9038'),sw,sh,aY:an?an[1]:sh,wins,poles:pl,k};
  },

  /* ================= latar belakang & komposit ================= */
  mkTrees(w,hor,k){
    const hh=Math.max(30,hor*.4),c=document.createElement('canvas');c.width=Math.ceil(w*k);c.height=Math.ceil(hh*k);
    const g=c.getContext('2d');g.scale(k,k);const r=this.rnd;
    for(let L=0;L<3;L++){
      const base=hh*(.74+L*.11),sc=.42+L*.36;
      for(let i=0;i<Math.ceil(w/(26*sc))+2;i++){
        const x=i*26*sc+r()*24*sc-14,hgt=hh*(.22+r()*.62)*sc,top=base-hgt;
        if(r()<.3){ /* nyiur */
          g.strokeStyle='rgba('+[62,38,18][L]+','+[74,54,32][L]+','+[76,44,22][L]+',.95)';g.lineWidth=1.6*sc;g.beginPath();g.moveTo(x,base);g.quadraticCurveTo(x+3*sc,top+hgt*.4,x+5*sc,top);g.stroke();
          g.strokeStyle='rgba('+[64,84,84][L]+','+[80,100,72][L]+','+[74,60,40][L]+',.92)';
          for(let f=0;f<7;f++){const ang=-Math.PI/2+(f-3)*.44,Ln=hgt*.42;g.lineWidth=2.2*sc;g.beginPath();g.moveTo(x+5*sc,top);
            g.quadraticCurveTo(x+5*sc+Math.cos(ang)*Ln*.6,top+Math.sin(ang)*Ln*.6-Ln*.2,x+5*sc+Math.cos(ang)*Ln,top+Math.sin(ang)*Ln+Ln*.34);g.stroke()}
        }else{
          const cl=10+r()*8,CC=[[58,76,82],[32,50,40],[13,26,17]][L];
          for(let b=0;b<13;b++){const q=.78+r()*.34;
            g.fillStyle='rgba('+(CC[0]*q|0)+','+(CC[1]*q|0)+','+(CC[2]*q|0)+',.92)';
            const bx=x+(r()-.5)*cl*1.8,by=top+hgt*.32+(r()-.5)*hgt*.46,br=(cl*.42+r()*cl*.4)*sc;
            g.beginPath();g.arc(bx,by,br,0,7);g.fill()}
          g.fillStyle='rgba('+(CC[0]*.6|0)+','+(CC[1]*.6|0)+','+(CC[2]*.6|0)+',.9)';
          g.fillRect(x-1*sc,top+hgt*.55,2*sc,base-top-hgt*.55);
        }
      }
    }
    return{c,hh,k};
  },
  mkGround(w,h,hor,k){
    const c=document.createElement('canvas');c.width=Math.ceil(w*k);c.height=Math.ceil((h-hor+8)*k);
    const g=c.getContext('2d');g.scale(k,k);g.translate(0,-hor+4);
    const gr=g.createLinearGradient(0,hor,0,h);gr.addColorStop(0,'#5d5346');gr.addColorStop(.35,'#6d6052');gr.addColorStop(1,'#3a3027');
    g.fillStyle=gr;g.fillRect(0,hor-4,w,h-hor+8);
    const N=16,rows=[];for(let i=0;i<=N;i++)rows.push(hor+(h-hor)*Math.pow(i/N,2.25));
    const cx=w/2,gap=Math.max(78,w/9);
    for(let i=0;i<N;i++){
      const y0=rows[i],y1=rows[i+1],f0=.1+.9*Math.pow(i/N,1.05),f1=.1+.9*Math.pow((i+1)/N,1.05);
      for(let j=-16;j<16;j++){
        const a0=cx+j*gap*f0,a1=cx+(j+1)*gap*f0,b0=cx+j*gap*f1,b1=cx+(j+1)*gap*f1;
        const hsh=IH(j*3.1,i*7.7);
        g.fillStyle='rgba('+(142+hsh*40|0)+','+(130+hsh*34|0)+','+(108+hsh*28|0)+','+(.08+.2*(i/N))+')';
        g.beginPath();g.moveTo(a0,y0);g.lineTo(a1,y0);g.lineTo(b1,y1);g.lineTo(b0,y1);g.closePath();g.fill();
        g.strokeStyle='rgba(28,20,12,'+(.05+.16*(i/N))+')';g.lineWidth=.7+i*.07;g.stroke();
      }
    }
    g.fillStyle='rgba(20,14,8,.42)';g.fillRect(0,hor-4,w,6);
    const vg=g.createLinearGradient(0,hor,0,hor+(h-hor)*.35);vg.addColorStop(0,'rgba(18,12,6,.5)');vg.addColorStop(1,'rgba(18,12,6,0)');
    g.fillStyle=vg;g.fillRect(0,hor-4,w,(h-hor)*.4);
    return{c,k,y:hor-4};
  },
  resize(w,h){this.w=w;this.h=h;this.dpr=Math.min(window.devicePixelRatio||1,1.6);
    this.c.width=Math.round(w*this.dpr);this.c.height=Math.round(h*this.dpr);this.ck='';this.pk=''},
  frame(now,az,hor0,w,h){
    if(!this.ok||!this.g)return;
    if(w!==this.w||h!==this.h)this.resize(w,h);
    const g=this.g,k=this.dpr,t=now/1000;
    const hor=Math.max(h*.13,Math.min(h*.5,isFinite(hor0)?hor0:h*.3)),hq=Math.round(hor/6)*6,key=w+'_'+h+'_'+hq;
    const pk=w+'_'+h;
    if(pk!==this.pk){this.pk=pk;
      const ppm=Math.max(2,Math.min(w*.76/64,h*.5/42.6));
      try{this.pal=this.build3(ppm,k);if(this.pal)this.pal.ppm=ppm}catch(e){this.pal=null}}
    if(key!==this.ck){this.ck=key;this.hq=hq;
      this.tre=this.mkTrees(w,hq,k);this.gnd=this.mkGround(w,h,hq,k);}
    const H0=this.hq;
    g.setTransform(k,0,0,k,0,0);g.globalAlpha=1;g.globalCompositeOperation='source-over';
    const d=.5+.5*Math.cos(t/170*Math.PI*2-.5),night=1-d,ox=Math.sin(az)*34;
    /* --- langit --- */
    const sky=g.createLinearGradient(0,0,0,H0+10);
    sky.addColorStop(0,this.mix('#050824','#1f4f96',d));
    sky.addColorStop(.42,this.mix('#141a4e','#79a6cf',d));
    sky.addColorStop(.74,this.mix('#2f2355','#e8a968',d));
    sky.addColorStop(1,this.mix('#5a3550','#ffd9a2',d));
    g.fillStyle=sky;g.fillRect(0,0,w,H0+10);
    if(night>.05){for(const q of this.stars){g.globalAlpha=night*(.3+.7*Math.abs(Math.sin(t*q.s+q.p)))*(1-q.y*.45);g.fillStyle='#fff';g.fillRect(q.x*w+ox*.04,q.y*H0*.9,q.s,q.s)}g.globalAlpha=1}
    const sx=w*.76+ox*.08,sy=H0*(.3+.42*(1-d));
    if(d>.02){const r=Math.max(44,H0*.42),gr=g.createRadialGradient(sx,sy,2,sx,sy,r);
      gr.addColorStop(0,'rgba(255,248,214,'+(.98*d)+')');gr.addColorStop(.12,'rgba(255,214,140,'+(.7*d)+')');gr.addColorStop(.42,'rgba(255,150,80,'+(.26*d)+')');gr.addColorStop(1,'rgba(255,110,60,0)');
      g.fillStyle=gr;g.fillRect(sx-r,sy-r,2*r,2*r)}
    if(night>.05){const mx=w*.22-ox*.08,my=H0*.2,r=Math.max(8,H0*.052);g.globalAlpha=night;
      let gr=g.createRadialGradient(mx,my,r*.6,mx,my,r*5);gr.addColorStop(0,'rgba(190,212,255,.34)');gr.addColorStop(1,'rgba(190,212,255,0)');g.fillStyle=gr;g.fillRect(mx-r*5,my-r*5,r*10,r*10);
      g.fillStyle='#f6f2e4';g.beginPath();g.arc(mx,my,r,0,7);g.fill();
      g.fillStyle='rgba(180,180,200,.25)';g.beginPath();g.arc(mx-r*.3,my-r*.2,r*.22,0,7);g.arc(mx+r*.35,my+r*.3,r*.16,0,7);g.fill();g.globalAlpha=1}
    /* awan (kabur) */
    if(g.filter!==undefined)g.filter='blur(1.6px)';
    for(const c of this.cl){const cw=300*c.z*Math.max(.42,H0/330),ch=110*c.z*Math.max(.42,H0/330),
      x=(((c.x+t*c.s)%1.35)-.18)*w-cw/2+ox*.05,y=c.y*H0*.72;
      g.globalAlpha=d*.85;g.drawImage(this.cloud[0],x,y,cw,ch);g.globalAlpha=night*.7;g.drawImage(this.cloud[1],x,y,cw,ch)}
    g.globalAlpha=1;if(g.filter!==undefined)g.filter='none';
    /* bukit berlapis + jerebu */
    const mt=(base,amp,ph,f,col,par,al)=>{g.globalAlpha=al;g.fillStyle=col;g.beginPath();g.moveTo(-10,H0+6);
      for(let x=-10;x<=w+10;x+=10){const u=x+ox*par;g.lineTo(x,base-amp*(.5+.3*Math.sin(u*f+ph)+.2*Math.sin(u*f*2.4+ph*1.9)))}
      g.lineTo(w+10,H0+6);g.closePath();g.fill();g.globalAlpha=1};
    if(g.filter!==undefined)g.filter='blur(2px)';
    mt(H0*.8,H0*.46,1,.0042,this.mix('#2b3160','#9aa6c4',d),.1,.75);
    mt(H0*.87,H0*.34,3.1,.0061,this.mix('#1b2046','#6f7f9c',d),.2,.85);
    if(g.filter!==undefined)g.filter='blur(1px)';
    mt(H0*.93,H0*.24,5.4,.0082,this.mix('#101436','#3f5a52',d),.32,.95);
    if(g.filter!==undefined)g.filter='none';
    /* selat */
    const sy0=H0*.9,sea=g.createLinearGradient(0,sy0,0,H0+4);
    sea.addColorStop(0,this.mix('#121940','#9a7a62',d));sea.addColorStop(1,this.mix('#080c24','#5c4436',d));
    g.fillStyle=sea;g.fillRect(0,sy0,w,H0-sy0+6);
    g.strokeStyle='rgba(255,226,160,'+(.3*d+.08)+')';g.lineWidth=1;
    for(let i=0;i<46;i++){const y=sy0+((i*37)%100)/100*(H0-sy0),x=((i*97)%100)/100*w;
      g.globalAlpha=(.4+.6*Math.sin(t*1.4+i))*.6;g.beginPath();g.moveTo(x,y);g.lineTo(x+10+(i%5)*6,y);g.stroke()}
    g.globalAlpha=1;
    if(H0>80)for(const sh of this.ships){const sc=H0*.12*sh.s,x=((sh.x+t*.005*sh.z)%1.25-.12)*w,y=sy0+(H0-sy0)*.5+Math.sin(t*1.1+sh.x*9)*1.4;
      g.fillStyle=this.mix('#0b0f28','#3a2414',d);g.beginPath();g.moveTo(x-sc*.5,y-sc*.06);g.quadraticCurveTo(x,y+sc*.14,x+sc*.55,y-sc*.1);g.lineTo(x+sc*.4,y);g.quadraticCurveTo(x,y+sc*.1,x-sc*.4,y);g.closePath();g.fill();
      g.strokeStyle=this.mix('#0b0f28','#3a2414',d);g.lineWidth=1;g.beginPath();g.moveTo(x,y-sc*.05);g.lineTo(x,y-sc*.85);g.stroke();
      g.fillStyle=this.mix('#6f6a86','#efd7ad',d);g.beginPath();g.moveTo(x+1,y-sc*.82);g.quadraticCurveTo(x+sc*.42,y-sc*.42,x+sc*.44,y-sc*.12);g.lineTo(x+1,y-sc*.1);g.fill()}
    /* barisan pokok di belakang istana */
    if(this.tre){const T=this.tre;g.globalAlpha=.95;g.drawImage(T.c,0,H0-T.hh+2,w,T.hh);g.globalAlpha=1;
      if(night>.02){g.globalAlpha=night*.6;g.fillStyle='#070a1e';g.fillRect(0,H0-T.hh+2,w,T.hh);g.globalAlpha=1}}
    /* --- ISTANA --- */
    const P=this.pal;
    if(P){
      const sc=Math.min(1,H0*.97/(42.6*P.ppm)),sw=P.sw/k*sc,sh=P.sh/k*sc,px=w/2-sw/2+ox*.3,py=H0+4-P.aY/k*sc;
      g.drawImage(P.c,px,py,sw,sh);
      if(night>.02){g.globalAlpha=night*.66;g.drawImage(P.dark,px,py,sw,sh)}
      if(d>.02){g.globalAlpha=d*.09;g.drawImage(P.warm,px,py,sw,sh)}
      g.globalAlpha=1;
      /* cahaya tingkap & pelita */
      const fl=.84+.16*Math.sin(t*6.3)+.06*Math.sin(t*12.7),ga=Math.min(1,.12+night*1)*fl;
      if(ga>.04){g.globalCompositeOperation='lighter';
        for(const q of P.wins){const X=px+q[0]/k*sc,Y=py+q[1]/k*sc,r=Math.max(4,q[2]/k*sc*2.6);
          const gr=g.createRadialGradient(X,Y,0,X,Y,r);gr.addColorStop(0,'rgba(255,206,122,'+(ga*.85)+')');gr.addColorStop(.3,'rgba(255,170,70,'+(ga*.4)+')');gr.addColorStop(1,'rgba(255,140,40,0)');
          g.fillStyle=gr;g.fillRect(X-r,Y-r,2*r,2*r)}
        g.globalCompositeOperation='source-over'}
      /* bendera berkibar di tiang */
      for(let i=0;i<P.poles.length;i++){const q=P.poles[i],X=px+q[0]/k*sc,Y=py+q[1]/k*sc,L=Math.max(10,30*sw/420),Hh=L*.8;
        for(let s=0;s<3;s++){g.fillStyle=s===1?'#f2cf62':(i?'#1f7a4a':'#b8212f');g.beginPath();
          const y0=Y+s*Hh/3;g.moveTo(X,y0);
          for(let u=0;u<=8;u++){const fq=u/8;g.lineTo(X+fq*L,y0+Math.sin(t*4.4+fq*4.6+i)*fq*2.4)}
          for(let u=8;u>=0;u--){const fq=u/8;g.lineTo(X+fq*L,y0+Hh/3+Math.sin(t*4.4+fq*4.6+i)*fq*2.4)}
          g.closePath();g.fill()}}
    }
    /* jerebu di kaki istana */
    const hz=g.createLinearGradient(0,H0-H0*.13,0,H0+6);
    hz.addColorStop(0,'rgba(0,0,0,0)');
    hz.addColorStop(1,d>.45?'rgba(255,198,140,'+(.2*d)+')':'rgba(64,76,128,'+(.26*night)+')');
    g.fillStyle=hz;g.fillRect(0,H0-H0*.13,w,H0*.13+6);
    /* --- halaman --- */
    if(this.gnd)g.drawImage(this.gnd.c,0,this.gnd.y,w,this.gnd.c.height/k);
    /* bayang istana */
    if(P){const bw=P.sw/k*Math.min(1,H0*.97/(42.6*P.ppm))*.7,bx=w/2+ox*.3;const bg=g.createRadialGradient(bx,H0+6,2,bx,H0+6,bw);
      bg.addColorStop(0,'rgba(12,8,4,.5)');bg.addColorStop(1,'rgba(12,8,4,0)');g.fillStyle=bg;
      g.save();g.beginPath();g.ellipse(bx,H0+6,bw,Math.max(10,(h-H0)*.12),0,0,7);g.fill();g.restore()}
    if(night>.02){const gr=g.createLinearGradient(0,H0,0,h);gr.addColorStop(0,'rgba(10,10,38,'+(night*.55)+')');gr.addColorStop(1,'rgba(6,6,24,'+(night*.74)+')');g.fillStyle=gr;g.fillRect(0,H0-4,w,h-H0+4)}
    /* pelita tiang */
    const lamp=(x,y,sz)=>{
      g.fillStyle='#2a1a0c';g.fillRect(x-sz*.045,y-sz*2.1,sz*.09,sz*2.1);
      g.fillStyle='#caa04a';g.fillRect(x-sz*.14,y-sz*2.18,sz*.28,sz*.06);
      g.fillStyle='#6e1a16';g.beginPath();g.moveTo(x-sz*.19,y-sz*2.12);g.lineTo(x-sz*.28,y-sz*2.62);g.lineTo(x+sz*.28,y-sz*2.62);g.lineTo(x+sz*.19,y-sz*2.12);g.closePath();g.fill();
      g.fillStyle='#e8c25a';g.fillRect(x-sz*.3,y-sz*2.68,sz*.6,sz*.07);
      const f2=.82+.18*Math.sin(t*7.6+x),a=Math.min(1,.26+night*.92)*f2,r=sz*(1.9+night*2.4);
      g.globalCompositeOperation='lighter';const gr=g.createRadialGradient(x,y-sz*2.36,1,x,y-sz*2.36,r);
      gr.addColorStop(0,'rgba(255,208,112,'+a+')');gr.addColorStop(.3,'rgba(255,164,60,'+(a*.42)+')');gr.addColorStop(1,'rgba(255,140,40,0)');
      g.fillStyle=gr;g.fillRect(x-r,y-sz*2.36-r,2*r,2*r);g.globalCompositeOperation='source-over'};
    const ly=H0+(h-H0)*.46,lsz=Math.max(24,(h-H0)*.15);lamp(w*.055,ly,lsz);lamp(w*.945,ly,lsz);
    /* burung */
    if(H0>80)for(const b of this.bd){const x=((b.x+t*b.s)%1.24-.12)*w,y=H0*b.y+Math.sin(t*.7+b.p)*6,
      sc=b.z*Math.max(.55,H0/320)*8,fw=Math.sin(t*8.6+b.p)*sc*.5;
      g.strokeStyle=this.mix('#0a0a22','#2e2024',d);g.lineWidth=1.3;g.beginPath();
      g.moveTo(x-sc,y-fw);g.quadraticCurveTo(x-sc*.4,y-sc*.5,x,y);g.quadraticCurveTo(x+sc*.4,y-sc*.5,x+sc,y-fw);g.stroke()}
    /* nyiur depan (kabur sedikit = kedalaman) */
    const palm=(x,y,hh,dir,ph)=>{
      g.strokeStyle=this.mix('#120c1e','#432a16',d);g.lineWidth=hh*.042;g.lineCap='round';
      const tx=x+dir*hh*.2,ty=y-hh;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+dir*hh*.02,y-hh*.55,tx,ty);g.stroke();
      for(let i=0;i<9;i++){const a=-Math.PI/2+(i-4)*.4+Math.sin(t*1.1+ph+i)*.055,Ln=hh*.33;
        g.strokeStyle=this.mix('#0a2217','#27603a',d);g.lineWidth=hh*.026;g.beginPath();g.moveTo(tx,ty);
        g.quadraticCurveTo(tx+Math.cos(a)*Ln*.6,ty+Math.sin(a)*Ln*.6-Ln*.2,tx+Math.cos(a)*Ln,ty+Math.sin(a)*Ln+Ln*.3+Math.sin(t*1.5+ph+i)*3);g.stroke()}
      g.lineCap='butt'};
    if(g.filter!==undefined)g.filter='blur(1.2px)';
    {const ph=Math.min(h*.5,w*1.05);palm(w*.012,h*1.03,ph,1,0);palm(w*.988,h*1.03,ph*.92,-1,2.1);}
    if(g.filter!==undefined)g.filter='none';
    /* kelip-kelip & kelopak */
    g.globalCompositeOperation='lighter';
    for(const f of this.ff){const x=((f.x+Math.sin(t*.2*f.s+f.p)*.04)%1)*w,
      y=H0*.6+((f.y+Math.cos(t*.25*f.s+f.p)*.05)%1)*(h-H0*.6),
      a=(night*.85+.1)*(.35+.65*Math.abs(Math.sin(t*f.s*1.7+f.p)));
      const gr=g.createRadialGradient(x,y,0,x,y,f.r*4.5);gr.addColorStop(0,'rgba(255,238,140,'+a+')');gr.addColorStop(1,'rgba(255,214,70,0)');
      g.fillStyle=gr;g.fillRect(x-f.r*4.5,y-f.r*4.5,f.r*9,f.r*9)}
    g.globalCompositeOperation='source-over';
    for(const p of this.pt){const y=((p.y+t*p.s)%1.1-.05)*h,x=(p.x+Math.sin(t*.6+p.p)*.04)*w,a=t*1.3+p.p;
      g.save();g.translate(x,y);g.rotate(a);g.scale(1,.5+.5*Math.cos(a*1.3));g.fillStyle=p.c;g.globalAlpha=.75;
      g.beginPath();g.ellipse(0,0,p.z,p.z*.55,0,0,7);g.fill();g.restore()}
    g.globalAlpha=1;
    /* pancaran cahaya matahari */
    if(d>.25){g.globalCompositeOperation='lighter';g.globalAlpha=(d-.25)*.1;
      for(let i=0;i<4;i++){const a=-1.2+i*.3+Math.sin(t*.2+i)*.02,L=h*1.1;
        const gr=g.createLinearGradient(sx,sy,sx+Math.cos(a)*L,sy+Math.sin(a)*L);
        gr.addColorStop(0,'rgba(255,224,160,.5)');gr.addColorStop(1,'rgba(255,200,120,0)');
        g.fillStyle=gr;g.beginPath();g.moveTo(sx,sy);g.lineTo(sx+Math.cos(a-.06)*L,sy+Math.sin(a-.06)*L);g.lineTo(sx+Math.cos(a+.06)*L,sy+Math.sin(a+.06)*L);g.closePath();g.fill()}
      g.globalAlpha=1;g.globalCompositeOperation='source-over'}
    /* bintik filem + vinyet */
    if(this.grn){const pt=g.createPattern(this.grn,'repeat');if(pt){g.globalAlpha=.5;g.globalCompositeOperation='overlay';g.fillStyle=pt;g.fillRect(0,0,w,h);g.globalAlpha=1;g.globalCompositeOperation='source-over'}}
    const vg=g.createRadialGradient(w/2,h*.46,Math.min(w,h)*.3,w/2,h*.46,Math.max(w,h)*.78);
    vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.55)');g.fillStyle=vg;g.fillRect(0,0,w,h);
  }
};
