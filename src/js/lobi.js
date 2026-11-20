/* ===== TAPISAN BAHASA ===== */
const Tapis=(()=>{
  /* senarai teras (Melayu + Inggeris). Padanan: perkataan penuh, dan sisipan untuk perkataan panjang. */
  const W=('babi,bodoh,bangsat,bangang,bahlul,celaka,sial,sialan,keparat,pukimak,pantat,lancau,kote,konek,butuh,'
   +'jubur,cipap,cipai,pepek,kimak,lahanat,haramjadah,anjing,anjeng,bajingan,bedebah,'
   +'jahanam,setan,syaitan,iblis,bangpat,tolol,goblok,puki,memek,ngentot,kontol,'
   +'fuck,fucking,fucker,shit,bullshit,bitch,bastard,asshole,arsehole,dick,cunt,whore,slut,nigger,nigga,'
   +'faggot,fag,retard,rape,pussy,cock,wank,motherfucker,mf,wtf,stfu').split(',').map(x=>x.trim()).filter(Boolean);
  const HARD=['pukimak','cipap','pepek','kimak','puki','ngentot','kontol','cunt','nigger','nigga','faggot','motherfucker','fuck','shit','bitch'];
  const MAP={'0':'o','1':'i','!':'i','3':'e','4':'a','@':'a','5':'s','$':'s','7':'t','+':'t','8':'b','9':'g','|':'i'};
  const base=t=>String(t||'').toLowerCase().replace(/[\u0300-\u036f]/g,'')
    .replace(/[01345789!@$+|]/g,c=>MAP[c]||c).replace(/[^a-z\s]/g,'');
  /* dua bentuk: asal, dan ulangan huruf dimampatkan (fuuuck -> fuck) */
  const forms=t=>{const a=base(t);return[a,a.replace(/([a-z])\1+/g,'$1')]};
  const set=new Set();for(const w of W)for(const f of forms(w))set.add(f.replace(/\s+/g,''));
  const SUB=[];for(const w of W.concat(HARD))for(const f of forms(w)){const s=f.replace(/\s+/g,'');
    if(s.length>=5&&SUB.indexOf(s)<0)SUB.push(s)}
  for(const w of HARD)for(const f of forms(w)){const s=f.replace(/\s+/g,'');if(SUB.indexOf(s)<0)SUB.push(s)}
  const hitTok=n=>{if(!n)return false;if(set.has(n))return true;
    for(const s of SUB)if(n.includes(s))return true;return false};
  return{
    /* ada perkataan kesat? */
    bad(t){
      for(const f of forms(t)){
        if(hitTok(f.replace(/\s+/g,'')))return true;
        for(const w of f.split(/\s+/))if(hitTok(w))return true;
      }
      return false;
    },
    /* ganti dengan bintang, kekalkan ayat selebihnya */
    clean(t){
      return String(t||'').split(/(\s+)/).map(tok=>{
        if(!tok.trim())return tok;
        for(const f of forms(tok))if(hitTok(f.replace(/\s+/g,'')))
          return '*'.repeat(Math.max(3,Math.min(tok.length,12)));
        return tok;
      }).join('');
    }
  };
})();

/* ===== FRASA TETAP: tiada taip bebas, jadi tiada ruang untuk bot atau spam ===== */
const FRASA=[
  {e:'\uD83D\uDC4B',t:'Salam semua!'},   {e:'\uD83D\uDE00',t:'Jom main!'},
  {e:'\u2694\uFE0F',t:'Siapa nak lawan?'},{e:'\uD83D\uDC4D',t:'Syabas!'},
  {e:'\uD83D\uDD25',t:'Hebat betul!'},    {e:'\uD83D\uDE05',t:'Nasib baik\u2026'},
  {e:'\uD83D\uDE2E',t:'Wah!'},            {e:'\uD83D\uDE42',t:'Tak apa, cuba lagi'},
  {e:'\u23F3',t:'Sekejap ya'},             {e:'\uD83E\uDD1D',t:'Jom sekali lagi'},
  {e:'\uD83C\uDFAE',t:'Permainan yang baik!'},{e:'\uD83D\uDC4B',t:'Saya keluar dulu'}
];

/* ===== LOBI AWAM: senarai pemain, sembang, cabaran ===== */
const Lobi={
  ns:null,ready:false,me:'',peers:[],chat:[],inv:null,invT:0,last:0,built:false,off:[],err:'',editing:false,
  esc(t){return esc(String(t||''))},
  nick(){return Prof.nick()},
  count(){return this.peers.filter(p=>p.kind!=='agent').length},
  /* Dua pemanggil boleh tiba serentak (Lobi.auto selepas 1.2s dan ketukan
     butang Lobi). Tanpa menyimpan janji yang sedang berjalan, kedua-duanya
     melepasi pemeriksa 'ready' dan melanggan sembang dua kali — mesej
     kelihatan berganda. */
  init(){
    if(this.ready)return Promise.resolve(this.ns);
    if(this._p)return this._p;
    this._p=this._init().then(v=>{this._p=null;return v},e=>{this._p=null;throw e});
    return this._p;
  },
  async _init(){
    if(this.ready)return this.ns;
    const ns=await Rm.init();
    if(!ns){this.err=Rm.why||'Lobi tidak tersedia dalam paparan ini.';return null}
    this.ns=ns;this.ready=true;
    try{
      this.off.push(ns.on('chat',m=>this.onChat(m),e=>{this.err='Saluran sembang terputus: '+(e&&e.message||'');this.paint()}));
      this.off.push(ns.on('inv',m=>this.onInv(m)));
      this.off.push(ns.onPeers(c=>{this.peers=(c&&c.peers)||ns.peers()||[];
        const mine=this.peers.find(p=>p.isMe&&p.sameTab);if(mine)this.me=mine.peer;
        this.badge();this.paint()}));
      this.off.push(ns.onConnection(()=>this.paint()));
      await this.push();
    }catch(e){this.err='Lobi gagal dimuatkan.';}
    return this.ns;
  },
  /* hantar keadaan saya */
  push(st){
    if(!this.ns)return Promise.resolve();
    const o={n:this.nick().slice(0,16),lv:Prof.lvl(),st:st||(Match.s&&!Match.s.over?'main':'idle'),h:cfg.p[0]|0};
    return this.ns.presence(o).catch(()=>{});
  },
  status(st){this.push(st)},
  /* ---- sembang ---- */
  /* hanya nombor frasa diterima — teks bebas dibuang terus, walau dari klien lama */
  onChat(m){
    if(!m||!m.data)return;
    const i=m.data.i;
    if(!Number.isInteger(i)||i<0||i>=FRASA.length)return;
    const who=m.isMe?this.nick():this.nameOf(m);
    this.chat.push({w:who,i,me:!!m.isMe,g:!!m.guest,at:Date.now()});
    if(this.chat.length>60)this.chat.splice(0,this.chat.length-60);
    if(!m.isMe&&document.getElementById('lobi').hidden)Snd.ui(1);
    this.paintChat();
  },
  nameOf(m){
    const p=this.peers.find(x=>x.peer===(m.peer||m));
    const n=p&&p.presence&&p.presence.n;
    return Tapis.clean(String(n||'Pemain')).slice(0,20)||'Pemain';
  },
  sent:[],
  say(i){
    i=+i;if(!Number.isInteger(i)||i<0||i>=FRASA.length)return;
    if(!this.ns){Toast.show('Lobi tidak bersambung.');return}
    const now=Date.now();
    if(now-this.last<1800){Toast.show('Perlahan sikit \u2014 tunggu sekejap.');return}
    this.sent=this.sent.filter(t=>now-t<30000);
    if(this.sent.length>=6){Toast.show('Terlalu banyak mesej. Cuba lagi sebentar nanti.');return}
    this.last=now;this.sent.push(now);Snd.ui();
    this.ns.emit('chat',{i}).catch(err=>{
      if(err&&err.code==='not_permitted')Toast.show('Paparan ini tidak dibenarkan menghantar mesej dalam lobi.');
      else Toast.show('Mesej tidak dapat dihantar.');
    });
  },
  /* ---- cabaran ---- */
  challenge(peer){
    if(!this.ns)return;
    const code=Rm.mkCode();
    this.pend={peer,code,at:Date.now()};
    this.ns.emit('inv',{to:peer,code,n:this.nick().slice(0,16)}).catch(()=>Toast.show('Cabaran tidak dapat dihantar.'));
    Toast.show('Cabaran dihantar. Menunggu jawapan…');
    this.paint();
    setTimeout(()=>{if(this.pend&&this.pend.peer===peer&&Date.now()-this.pend.at>24000){this.pend=null;Toast.show('Tiada jawapan.');this.paint()}},25000);
  },
  onInv(m){
    if(!m||!m.data||m.isMe)return;const d=m.data;
    if(d.to!==this.me)return;
    if(d.acc){
      if(this.pend&&this.pend.code===d.code){const c=this.pend.code;this.pend=null;this.close();Net.show();Net.roomEnter(c,true)}
      return;
    }
    if(d.no){if(this.pend&&this.pend.peer===m.peer){this.pend=null;Toast.show('Cabaran ditolak.');this.paint()}return}
    if(!d.code)return;
    this.inv={peer:m.peer,code:String(d.code).slice(0,8),n:Tapis.clean(String(d.n||'Pemain')).slice(0,20)};
    this.invT=Date.now();Snd.chime();
    if(document.getElementById('lobi').hidden){this.open()}
    this.paint();
    setTimeout(()=>{if(this.inv&&Date.now()-this.invT>24000){this.inv=null;this.paint()}},25000);
  },
  accept(){
    const i=this.inv;if(!i||!this.ns)return;this.inv=null;
    this.ns.emit('inv',{to:i.peer,acc:1,code:i.code}).catch(()=>{});
    this.close();Net.show();Net.roomEnter(i.code,false);
  },
  decline(){
    const i=this.inv;if(!i)return;this.inv=null;
    if(this.ns)this.ns.emit('inv',{to:i.peer,no:1}).catch(()=>{});
    this.paint();
  },
  /* ---- paparan ---- */
  /* kiraan pada butang menu */
  badge(){const e=document.getElementById('lbc');if(!e)return;
    const n=this.count();e.textContent=this.ready?(n+' dalam talian'):'—';},
  /* sambung semula secara automatik hanya untuk pemain yang pernah guna lobi */
  auto(){
    let w=false;try{w=localStorage.getItem('cm15lobi')==='1'}catch(e){}
    if(!w)return;
    setTimeout(()=>{this.init().then(()=>this.badge())},1200);
  },
  async open(){
    const o=document.getElementById('lobi');if(!o)return;
    o.hidden=false;this.built=false;this.paint();
    await this.init();this.paint();this.push();
  },
  close(){const o=document.getElementById('lobi');if(o)o.hidden=true},
  shell(){
    return`<div class="panel lobi"><h2>Lobi Congkak <i class="live"><b id="lbn">0</b> dalam talian</i></h2>
      <div class="lbme">
        <img src="${IMGS[cfg.p[0]]||IMGS[0]}" alt="">
        <div><small>Nama anda</small><b id="lbnk">${this.esc(this.nick())}</b></div>
        <button class="btn sm" data-l="nick">✏️ Tukar</button>
      </div>
      <div id="lberr"></div><small class="lbdg" id="lbdg"></small>
      <div class="lbgrid">
        <div class="lbcol"><h3>Pemain</h3><div class="lblist" id="lbps"></div></div>
        <div class="lbcol"><h3>Sembang Pantas</h3><div class="lbchat" id="lbch"></div>
          <div class="lbfr">${FRASA.map((f,i)=>`<button class="frc" data-l="say" data-i="${i}"><u>${f.e}</u>${this.esc(f.t)}</button>`).join('')}</div>
          <small class="lbnote">Frasa tetap sahaja — tiada taip bebas, jadi tiada spam atau kata kesat.</small></div>
      </div>
      <div class="center"><button class="btn" data-l="close">Tutup</button></div></div>`;
  },
  paint(){
    const o=document.getElementById('lobi');if(!o||o.hidden)return;
    if(!this.built){o.innerHTML=this.shell();this.built=true;
}
    const n=document.getElementById('lbn');if(n)n.textContent=this.count();
    const nk=document.getElementById('lbnk');if(nk)nk.textContent=this.nick();
    const er=document.getElementById('lberr');
    const art=(typeof P2P!=='undefined'&&!P2P.avail()&&/WebRTC/.test(P2P.why||''));
    if(er)er.innerHTML=this.err
      ?(art
        ?`<div class="lbsite"><b>Anda sedang membuka salinan pratonton.</b>
            <p>Lobi dalam talian tidak boleh berjalan di sini — pratonton ini tidak membenarkan
               sambungan terus antara pelayar, dan ia meminta log masuk Claude.
               <b>Laman penuh tidak meminta apa-apa log masuk.</b></p>
            <a class="btn" href="${SITE}" target="_blank" rel="noopener">🌐 Buka Laman Penuh</a>
            <small>Kongsi pautan ini dengan kawan anda — bukan pautan pratonton.</small></div>`
        :`<p class="nerr">${this.esc(this.err)}</p>`)
        +`<div class="lbanon"><b>Dua cara yang tidak perlukan pelayan</b>
          <p><b>WiFi Sama</b> — kedua-dua peranti pada WiFi yang sama bercakap terus antara satu sama lain. Tiada pelayan di tengah.</p>
          <p><b>Mod Mesej</b> — setiap giliran jadi kod pendek yang anda hantar melalui WhatsApp. Berfungsi di mana-mana.</p>
          <button class="btn" data-l="anon">📶 Buka Kedua-duanya</button></div>`
      :(!this.ready?'<p class="hnote">Menyambung ke lobi…</p>':'');
    const dg=document.getElementById('lbdg');
    if(dg){
      let c=false;try{c=!!(this.ns&&this.ns.connected&&this.ns.connected())}catch(e){}
      dg.textContent=this.ready
        ?[Rm.mode==='p2p'?'P2P':'Bilik Claude','ID '+String(this.me||'?').slice(0,6),
          this.count()+' dalam bilik',c?'bersambung':'menunggu rakan'].join(' · ')
        : '';
    }
    this.paintPeers();this.paintChat();
  },
  paintPeers(){
    const e=document.getElementById('lbps');if(!e)return;
    const rows=this.peers.filter(p=>p.kind!=='agent');
    const inv=this.inv;
    let h=inv?`<div class="lbinv"><b>${this.esc(inv.n)}</b> mencabar anda!<div><button class="btn sm" data-l="acc">Terima</button> <button class="btn sm" data-l="dec">Tolak</button></div></div>`:'';
    h+=rows.map(p=>{
      const pr=p.presence||{},nm=Tapis.clean(String(pr.n||'Pemain')).slice(0,20)||'Pemain',
        lv=+pr.lv||1,st=pr.st==='main'?'Sedang bermain':'Menunggu lawan',
        hi=Number.isInteger(pr.h)&&HEROES[pr.h]?pr.h:0,
        meRow=p.isMe&&p.sameTab,wait=this.pend&&this.pend.peer===p.peer;
      return`<div class="lbp${meRow?' me':''}"><img src="${IMGS[hi]}" alt="">
        <div class="lbi"><b>${this.esc(nm)}${p.guest?' <i class="tag">tetamu</i>':''}${meRow?' <i class="tag you">anda</i>':''}</b>
          <small><i class="lv">Lv ${lv}</i> ${this.esc(st)}</small></div>
        ${meRow?'':`<button class="btn sm${wait?' wait':''}" data-l="chal" data-p="${this.esc(p.peer)}"${wait||pr.st==='main'?' disabled':''}>${wait?'Menunggu…':'⚔️ Cabar'}</button>`}</div>`;
    }).join('');
    if(rows.length<=1)h+='<p class="hnote">'+(Rm.mode==='p2p'
      ?'Belum ada pemain lain dalam lobi. Kongsi pautan permainan ini — sesiapa sahaja boleh masuk, tanpa akaun.'
      :'Belum ada pemain lain. Kongsi pautan permainan ini dengan kawan — mereka perlu log masuk ke Claude dan dijemput ke halaman ini.')+'</p>';
    e.innerHTML=h;
  },
  paintChat(){
    const e=document.getElementById('lbch');if(!e)return;
    const stick=e.scrollTop+e.clientHeight>=e.scrollHeight-24;
    e.innerHTML=this.chat.length?this.chat.map(m=>{const f=FRASA[m.i]||FRASA[0];
      return`<div class="lbm${m.me?' me':''}"><b>${this.esc(m.w)}</b><span><u>${f.e}</u>${this.esc(f.t)}</span></div>`}).join('')
      :'<p class="hnote">Belum ada mesej. Pilih frasa di bawah untuk menyapa.</p>';
    if(stick)e.scrollTop=e.scrollHeight;
  },
  askNick(){
    const cur=this.nick();
    const o=document.getElementById('lobi');
    const d=document.createElement('div');d.className='lbnd';
    d.innerHTML=`<div class="lbnw"><h3>Tukar nama</h3>
      <input id="lbni" maxlength="16" value="${this.esc(cur)}" autocomplete="off">
      <p class="hnote">3 hingga 16 aksara. Bahasa kesat tidak dibenarkan.</p>
      <div class="center"><button class="btn sm" data-l="nickok">Simpan</button> <button class="btn sm" data-l="nickno">Batal</button></div></div>`;
    o.appendChild(d);setTimeout(()=>{const i=document.getElementById('lbni');if(i){i.focus();i.select()}},50);
  },
  saveNick(){
    const i=document.getElementById('lbni');if(!i)return;
    const r=Prof.setNick(i.value);
    if(r!==true){Toast.show(r);return}
    const d=document.querySelector('#lobi .lbnd');if(d)d.remove();
    this.push();this.paint();Toast.show('Nama ditukar.');
  },
  click(ev){
    const g=ev.target.closest('[data-l]');
    if(!g){if(ev.target.id==='lobi')this.close();return}
    const k=g.dataset.l;
    if(k==='close')return this.close();
    if(k==='nick')return this.askNick();
    if(k==='nickok')return this.saveNick();
    if(k==='nickno'){const d=document.querySelector('#lobi .lbnd');if(d)d.remove();return}
    if(k==='acc')return this.accept();
    if(k==='dec')return this.decline();
    if(k==='anon'){this.close();Net.show();return}
    if(k==='say')return this.say(g.dataset.i);
    if(k==='chal'&&!g.disabled)return this.challenge(g.dataset.p);
  }
};
