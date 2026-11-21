/* ===== LATAR 3D: poster pahlawan dihidupkan dengan three.js =====
   Poster yang sama, tetapi dilukis pada satah melengkung dalam ruang 3D:
   - kamera beralih ikut tetikus (paralaks sebenar) dan dolly perlahan
   - kilauan emas menyapu karya seperti kad foil
   - sinar cahaya dari atas, kelopak dan debu emas 3D di hadapan poster
   Berkongsi pemapar World, jadi semua had haba World terpakai.
   Tanpa three.js, poster CSS asal kekal (lihat MenuFx.heroFit). */
const Latar={
  ok:false,t:0,mixT:0,ab:0,sweep:-1,nextSweep:2.5,
  init(){
    if(this.ok||!window.THREE||typeof World==='undefined'||!World.ok||typeof ART2==='undefined')return this.ok;
    const T=THREE,S=this.scene=new T.Scene();
    this.cam=new T.PerspectiveCamera(38,1,.1,60);
    const L=new T.TextureLoader(),tex=u=>{const t=L.load(u,()=>{this.dirty=true;World._heroDirty=true});t.minFilter=T.LinearFilter;t.generateMipmaps=false;return t};
    this.U={tA:{value:tex(ART2.bg)},tB:{value:tex(ART2.bg2)},mixAB:{value:0},sweep:{value:-1},
      fitA:{value:new T.Vector4(1,1,0,0)},fitB:{value:new T.Vector4(1,1,0,0)},time:{value:0}};
    /* satah poster: sedikit melengkung supaya paralaks memberi kedalaman, bukan sekadar anjakan */
    const g=new T.PlaneGeometry(1,1,24,1),pa=g.attributes.position;
    for(let i=0;i<pa.count;i++){const x=pa.getX(i);pa.setZ(i,-x*x*.9)}g.computeVertexNormals();
    this.poster=new T.Mesh(g,new T.ShaderMaterial({uniforms:this.U,toneMapped:false,depthWrite:false,
      vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader:`uniform sampler2D tA,tB;uniform float mixAB,sweep,time;uniform vec4 fitA,fitB;varying vec2 vUv;
        void main(){
          vec3 a=texture2D(tA,vUv*fitA.xy+fitA.zw).rgb,b=texture2D(tB,vUv*fitB.xy+fitB.zw).rgb;
          vec3 c=mix(a,b,mixAB);
          float l=dot(c,vec3(.299,.587,.114));
          /* gred: kontras lembut dan bayang lebih hangat */
          c=mix(c,c*c*(3.-2.*c),.35);c*=vec3(1.04,.98,.93);
          /* kilauan foil: jalur serong menyapu, lebih kuat pada bahagian terang (emas, perhiasan) */
          float s=vUv.x*.75+(1.-vUv.y)*.35-sweep,band=exp(-s*s*140.)+.35*exp(-(s+.06)*(s+.06)*900.);
          c+=vec3(1.,.82,.5)*band*smoothstep(.35,.9,l)*.55;
          /* vinyet */
          vec2 q=vUv-.5;c*=1.-dot(q*vec2(1.1,1.3),q*vec2(1.1,1.3))*1.05;
          gl_FragColor=vec4(c,1.);
        }`}));
    S.add(this.poster);
    this.rays(S);this.petals(S);this.dust(S);
    this.ok=true;this.dirty=true;return true;
  },
  /* sinar cahaya: satah tambahan yang pudar ke hujung, berayun perlahan */
  rays(S){
    const T=THREE;this.R=[];
    const m=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false,
      uniforms:{k:{value:1}},
      vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader:'uniform float k;varying vec2 vUv;void main(){float x=clamp(1.-abs(vUv.x-.5)*2.,0.,1.);float a=pow(x,2.2)*smoothstep(0.,.35,vUv.y)*pow(vUv.y,1.4)*.11*k;gl_FragColor=vec4(vec3(1.,.86,.6)*a,a);}'});
    for(let i=0;i<5;i++){const mm=m.clone();mm.uniforms.k.value=.6+Math.random()*.6;
      const r=new T.Mesh(new T.PlaneGeometry(.5+Math.random()*.5,9),mm);r.position.set(1.2+i*.9,2.2,.6+i*.1);r.rotation.z=.42+i*.03;S.add(r);this.R.push({m:r,ph:Math.random()*6,b:r.rotation.z})}
  },
  /* kelopak 3D: satu InstancedMesh, berpusing dan jatuh dengan kedalaman */
  petals(S){
    const T=THREE,sh=new T.Shape();sh.moveTo(0,-.5);sh.bezierCurveTo(.45,-.25,.4,.35,0,.5);sh.bezierCurveTo(-.4,.35,-.45,-.25,0,-.5);
    const n=this.nP=26,g=new T.ShapeGeometry(sh,6),m=new T.MeshBasicMaterial({color:0xe8506a,transparent:true,opacity:.85,side:T.DoubleSide,depthWrite:false,toneMapped:false});
    this.pm=new T.InstancedMesh(g,m,n);S.add(this.pm);this.P=[];this.o=new T.Object3D();
    for(let i=0;i<n;i++)this.P.push(this.petal(true));
  },
  petal(any){return{x:(Math.random()-.3)*14,y:any?(Math.random()-.5)*9:5.5,z:.5+Math.random()*4.5,s:.1+Math.random()*.12,
    vx:-(.25+Math.random()*.35),vy:-(.35+Math.random()*.45),rx:Math.random()*6,ry:Math.random()*6,wr:1+Math.random()*2,ph:Math.random()*6}},
  dust(S){
    const T=THREE,n=160,p=new Float32Array(n*3);
    for(let i=0;i<n;i++){p[i*3]=(Math.random()-.5)*14;p[i*3+1]=(Math.random()-.5)*9;p[i*3+2]=Math.random()*4.5}
    const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(p,3));
    this.dp=new T.Points(g,new T.PointsMaterial({color:0xffd890,size:.04,transparent:true,opacity:.7,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));S.add(this.dp);
  },
  /* muatkan imej seperti CSS background-size:cover dengan titik fokus */
  fit(tex,v,ax,fx,fy){const im=tex.image;if(!im||!im.width)return;const ia=im.width/im.height;
    let sx=1,sy=1;if(ia>ax)sx=ax/ia;else sy=ia/ax;v.value.set(sx,sy,(1-sx)*fx,(1-sy)*(1-fy))},
  /* telefon menegak: hanya jalur atas yang tidak ditutup panel, jadi poster dimuatkan
     pada jalur itu (lebar penuh, bahagian atas imej) dan bukan pada seluruh skrin */
  fitBand(tex,v,w,h,band,fx){const im=tex.image;if(!im||!im.width)return;const ia=im.width/im.height;
    const bh=band*1.35,sx=Math.min(1,(w/bh)/ia),sy=(h/w)*ia*sx;v.value.set(sx,sy,(1-sx)*fx,1-sy*1.02)},
  /* ---- gelung: dipanggil oleh World.frame dalam mod menu ---- */
  frame(dt,w,h,still,ptr,band){
    const T=THREE,U=this.U;
    if(!still)this.t+=dt;
    /* poster bertukar setiap 9.5 s dengan resapan 2.4 s, seperti dahulu */
    if(!still){this.mixT+=dt;if(this.mixT>9.5){this.mixT=0;this.ab=1-this.ab}}
    U.mixAB.value+=(this.ab-U.mixAB.value)*(still?1:1-Math.pow(.15,dt));
    /* kilauan foil setiap ~7 s */
    if(!still){this.nextSweep-=dt;if(this.nextSweep<=0){this.sweep=-.4;this.nextSweep=7+Math.random()*3}
      if(this.sweep<1.6)this.sweep+=dt*.55}
    U.sweep.value=still?-1:this.sweep;
    /* kamera: orbit cetek ikut tetikus + dolly perlahan */
    const d=10-(still?0:Math.sin(this.t*.12)*.35);
    this.cam.aspect=w/h;this.cam.updateProjectionMatrix();
    this.cam.position.set(-ptr.x*.55,ptr.y*.32,d);this.cam.lookAt(this.cam.position.x*.42,this.cam.position.y*.42,0);
    /* satah menutup frustum dengan lebihan untuk paralaks */
    const vh=2*Math.tan(19*Math.PI/180)*(d+.6),vw=vh*w/h,m=1.14;
    this.poster.scale.set(vw*m,vh*m,1);
    const ax=w/h,port=ax<.85;
    if(port&&band<h){this.fitBand(U.tA.value,U.fitA,w,h,band,.5);this.fitBand(U.tB.value,U.fitB,w,h,band,.55)}
    else{this.fit(U.tA.value,U.fitA,ax,.62,.4);this.fit(U.tB.value,U.fitB,ax,.72,.35)}
    for(const r of this.R){r.m.material.uniforms.k.value=.7+.3*Math.sin(this.t*.6+r.ph);r.m.rotation.z=r.b+Math.sin(this.t*.2+r.ph)*.04}
    if(!still)for(let i=0;i<this.nP;i++){let p=this.P[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.rx+=dt*p.wr;p.ry+=dt*p.wr*.7;
      if(p.y<-5.5||p.x<-8)p=this.P[i]=this.petal(false);
      this.o.position.set(p.x+Math.sin(this.t+p.ph)*.3,p.y,p.z);this.o.rotation.set(p.rx,p.ry,p.ph);this.o.scale.setScalar(p.s);this.o.updateMatrix();this.pm.setMatrixAt(i,this.o.matrix)}
    else if(!this.placed){for(let i=0;i<this.nP;i++){const p=this.P[i];this.o.position.set(p.x,p.y,p.z);this.o.rotation.set(p.rx,p.ry,p.ph);this.o.scale.setScalar(p.s);this.o.updateMatrix();this.pm.setMatrixAt(i,this.o.matrix)}this.placed=true}
    this.pm.instanceMatrix.needsUpdate=true;
    if(this.dp)this.dp.rotation.y=this.t*.015;
    World.R.render(this.scene,this.cam);this.dirty=false;
  }
};
