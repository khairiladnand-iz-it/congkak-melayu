/* ===== ENJIN PERATURAN (tiada DOM) =====
   Susunan indeks: P1 = 0..n-1 (kanan→kiri), ibu P1 = n,
   P2 = n+1..2n (kiri→kanan), ibu P2 = 2n+1. Tabur dari kanan ke kiri (ikut arah jam). */
const Rules={
  store:(n,p)=>p?2*n+1:n,
  own:(n,p,i)=>p?(i>n&&i<=2*n):i<n,
  holes:(n,p)=>Array.from({length:n},(_,k)=>p?n+1+k:k),
  legal:(b,n,p)=>Rules.holes(n,p).filter(i=>b[i]>0),
  opposite:(n,i)=>2*n-i,
  /* Satu langkah penuh -> senarai peristiwa. Animasi, AI dan petunjuk semuanya guna fungsi ini. */
  resolve(b0,n,p,h){
    const b=b0.slice(),sz=2*n+2,mine=Rules.store(n,p),opp=Rules.store(n,1-p),ev=[];
    let hand=b[h],pos=h,g=0,extra=false,cap=0,lap=0;
    b[h]=0;ev.push({t:'pick',i:h,c:hand});
    for(;;){
      while(hand>0){pos=(pos+1)%sz;if(pos===opp)continue;b[pos]++;hand--;if(pos===mine)lap++;ev.push({t:'drop',i:pos,left:hand})}
      if(pos===mine){extra=true;break}
      if(b[pos]>1&&++g<60){hand=b[pos];b[pos]=0;ev.push({t:'chain',i:pos,c:hand});continue}
      if(b[pos]===1&&Rules.own(n,p,pos)){
        const o=Rules.opposite(n,pos);
        /* Tikam hanya sah selepas biji melepasi rumah sendiri (satu pusingan penuh). */
        if(b[o]>0){if(lap>0){cap=b[o]+1;ev.push({t:'capture',i:pos,o,gain:cap});b[mine]+=cap;b[o]=0;b[pos]=0}
                   else ev.push({t:'nocap',i:pos,o})}
      }
      break;
    }
    return{b,ev,extra,cap,lap};
  },
  over:(b,n)=>!Rules.legal(b,n,0).length||!Rules.legal(b,n,1).length,
  sweep(b,n){const r=b.slice();for(const p of[0,1])for(const i of Rules.holes(n,p)){r[Rules.store(n,p)]+=r[i];r[i]=0}return r},
  winner(b,n){const a=b[n],c=b[2*n+1];return a>c?0:c>a?1:-1}
};
const AI={
  eval(b,n,me){const side=q=>Rules.holes(n,q).reduce((s,i)=>s+b[i],0);return b[Rules.store(n,me)]-b[Rules.store(n,1-me)]+.3*(side(me)-side(1-me))},
  search(b,n,p,d,me,al,be){
    const mv=Rules.legal(b,n,p);if(!mv.length||d===0)return AI.eval(b,n,me);
    let best=p===me?-1e9:1e9;
    for(const m of mv){
      const r=Rules.resolve(b,n,p,m),v=AI.search(r.b,n,r.extra?p:1-p,d-1,me,al,be);
      if(p===me){if(v>best)best=v;al=Math.max(al,v)}else{if(v<best)best=v;be=Math.min(be,v)}
      if(be<=al)break;
    }
    return best;
  },
  /* tahap 1 rawak · 2 tamak · 3 carian 4 langkah */
  pick(b,n,p,lvl){
    const mv=Rules.legal(b,n,p);if(!mv.length)return -1;
    if(lvl<=1)return mv[RNG.next()*mv.length|0];
    let best=-1e9,bm=mv[0];
    for(const m of mv){
      const r=Rules.resolve(b,n,p,m),s=Rules.store(n,p);
      const v=lvl===2?(r.b[s]-b[s])+(r.extra?2.5:0)+RNG.next()*.6:AI.search(r.b,n,r.extra?p:1-p,4,p,-1e9,1e9)+RNG.next()*.01;
      if(v>best){best=v;bm=m}
    }
    return bm;
  },
  /* petunjuk: langkah terbaik + sebabnya */
  hint(b,n,p){
    const mv=Rules.legal(b,n,p);if(!mv.length)return null;
    let best=-1e9,bm=mv[0],br=null;
    for(const m of mv){const r=Rules.resolve(b,n,p,m),v=AI.search(r.b,n,r.extra?p:1-p,3,p,-1e9,1e9);if(v>best){best=v;bm=m;br=r}}
    return{i:bm,cap:br.cap,extra:br.extra};
  }
};
