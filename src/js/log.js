/* ===== APA BAHARU: sejarah perubahan dalam permainan =====
   Data CHANGELOG disuntik oleh tools/build.py daripada src/changelog.json (satu sumber,
   yang juga menjana CHANGELOG.md). Versi yang dipaparkan SENTIASA entri terbaru —
   jangan tambah pemalar versi kedua. Tutup (X, Kembali, latar, Escape) melalui satu fungsi. */
const VERSI=CHANGELOG[0].v;
const Log={
  ref:null,
  tarikh(d){const B=['Januari','Februari','Mac','April','Mei','Jun','Julai','Ogos','September','Oktober','November','Disember'];
    const [y,m,h]=d.split('-').map(Number);return h+' '+B[m-1]+' '+y},
  init(){
    const b=document.getElementById('ver'),o=document.getElementById('log');if(!b||!o)return;
    b.textContent='v'+VERSI+' · Apa Baharu';b.setAttribute('aria-expanded','false');
    b.addEventListener('click',()=>{Snd.ui&&Snd.ui(true);this.toggle()});
    o.addEventListener('click',e=>{if(e.target===o||(e.target.closest&&e.target.closest('[data-log]')))this.close()});
    /* satu-satunya pengendali Escape, aktif hanya bila skrin ini terbuka */
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!o.hidden){e.preventDefault();this.close()}});
  },
  html(){
    return`<div class="panel logp"><div class="logh"><h2 id="logh">Apa Baharu</h2><span class="logv">Versi ${esc(VERSI)}</span>
      <button class="logx" data-log="x" aria-label="Tutup sejarah perubahan">✕</button></div>
      <div class="logl">${CHANGELOG.map((e,i)=>`<section class="loge${i===0?' now':''}">
        <h3>${esc(e.v)} — ${esc(e.t)}${i===0?' <em>Terkini</em>':''}</h3><time datetime="${e.d}">${this.tarikh(e.d)}</time>
        <ul>${e.n.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section>`).join('')}</div>
      <div class="center"><button class="btn" data-log="back">Kembali</button></div></div>`},
  open(){const o=document.getElementById('log'),b=document.getElementById('ver');if(!o)return;
    this.ref=document.activeElement;o.innerHTML=this.html();o.hidden=false;
    if(b)b.setAttribute('aria-expanded','true');const x=o.querySelector('.logx');if(x&&x.focus)x.focus()},
  close(){const o=document.getElementById('log'),b=document.getElementById('ver');if(!o||o.hidden)return;
    o.hidden=true;if(b)b.setAttribute('aria-expanded','false');
    try{const r=this.ref&&this.ref.focus?this.ref:b;r&&r.focus&&r.focus()}catch(e){}},
  toggle(){const o=document.getElementById('log');if(!o)return;o.hidden?this.open():this.close()}
};
