"""Penguji pelayar: serangan balas mengurangkan HP penyerang; anak panah papan kekunci.
Pertarungan langsung, AI menyerang, pemain bertahan. Skrip menekan anak panah lorong yang
betul 560 ms selepas telegraf (tetingkap tangkis sempurna = 360 ms sebelum hentaman).
THREE_LOCAL=/laluan/three.min.js (r128) jika tiada rangkaian. Jalankan selepas binaan."""
import asyncio, os, sys
from playwright.async_api import async_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAGAL=[]
def ok(c,m):
    print(('LULUS ' if c else 'GAGAL ')+m)
    if not c: GAGAL.append(m)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); c=await b.new_context(viewport={'width':430,'height':880},device_scale_factor=2); pg=await c.new_page()
        if os.environ.get('THREE_LOCAL'): await pg.route('**/three.min.js',lambda r: r.fulfill(path=os.environ['THREE_LOCAL'],content_type='application/javascript'))
        await pg.route('**/fonts.g*/**',lambda r: r.abort())
        errs=[];pg.on('pageerror',lambda e: errs.append(str(e)[:160]))
        await pg.goto('file://'+os.path.join(ROOT,'dist','index.html'),wait_until='domcontentloaded'); await pg.wait_for_timeout(3000)
        await pg.evaluate("()=>{Prof.d.seen=99;cfg.vs='ai';cfg.lvl=3;cfg.fight='live';cfg.p=[0,1];document.querySelector('[data-go=play]').click()}"); await pg.wait_for_timeout(1500)
        await pg.evaluate("""()=>{window.__w=[];window.__shot=0;const te=()=>document.getElementById('tel');
          window.__mo=new MutationObserver(()=>{const t=te();if(!t||!t.classList.contains('go')||t.__seen===t.innerHTML+t.dataset.l)return;
            t.__seen=t.innerHTML+t.dataset.l;const L=+t.dataset.l;
            setTimeout(()=>document.dispatchEvent(new KeyboardEvent('keydown',{key:['ArrowUp','ArrowRight','ArrowDown'][L],bubbles:true,cancelable:true})),560)});
          const iv=setInterval(()=>{const t=te();if(t){window.__mo.observe(t,{attributes:true,attributeFilter:['class']});clearInterval(iv)}},20);
          const ah=()=>document.getElementById('ahp');
          const iv2=setInterval(()=>{const a=ah();if(a){new MutationObserver(()=>window.__w.push(a.style.width)).observe(a,{attributes:true,attributeFilter:['style']});clearInterval(iv2)}},20);
          window.__r=Duel.run(1,14)}""")
        # rakam bukti visual pada balasan pertama
        for _ in range(140):
            await pg.wait_for_timeout(100)
            if await pg.evaluate("()=>!!document.querySelector('#duel .dmg.ka')") and not await pg.evaluate("()=>window.__shot"):
                await pg.evaluate("()=>window.__shot=1"); await pg.screenshot(path='/tmp/balas.png')
            if await pg.evaluate("()=>document.getElementById('duel').classList.contains('fin')"): break
        r=await pg.evaluate("""async()=>{const res=await window.__r;return {w:window.__w,dt:document.getElementById('dt').textContent,
          rows:[...document.querySelectorAll('#dq .mta i')].map(i=>i.textContent),res,vhp:document.getElementById('vhp').style.width}}""")
        print('  HP penyerang:',r['w'],'| tajuk:',r['dt'],'|',r['rows'],'| keputusan:',r['res'])
        ok(len(r['w'])>0 and r['w'][-1]!='100%','HP penyerang berkurang selepas tangkis sempurna/balas')
        ws=[float(x.rstrip('%')) for x in r['w']]
        ok(all(ws[i]>=ws[i+1] for i in range(len(ws)-1)),'HP penyerang hanya turun, tidak naik')
        ok(any('Penyerang terkena balas' in x for x in r['rows']),'ringkasan menyebut balasan pada penyerang')
        # ---- angka kuasa pada meter (pemain menyerang) ----
        await pg.wait_for_timeout(2500)
        await pg.evaluate("()=>{document.getElementById('duel').hidden=true;window.__r2=Duel.run(0,14)}")
        await pg.wait_for_function("()=>{const d=document.getElementById('dt');return d&&/LAWAN/.test(d.textContent)}",timeout=10000)
        smp=await pg.evaluate("""()=>new Promise(r=>{const o=[];const iv=setInterval(()=>{const p=document.getElementById('mpin'),w=document.getElementById('mpw');
          if(p&&w)o.push([parseFloat(p.style.left)/100,parseInt(w.textContent)]);if(o.length>=60){clearInterval(iv);r(o)}},23)})""")
        bad=[(x,v) for x,v in smp if abs(v-round(100*max(0,1-abs(x-.5)*2)**1.6))>4]
        ok(len(bad)<=3,f'angka kuasa ikut kedudukan penunjuk ({len(smp)} sampel, {len(bad)} luar toleransi: {bad[:3]})')
        ok(max(v for _,v in smp)>=90 and min(v for _,v in smp)<=15,f'julat kuasa 0..100 dicapai (min {min(v for _,v in smp)}, maks {max(v for _,v in smp)})')
        sy0=await pg.evaluate("()=>scrollY")
        await pg.keyboard.press('ArrowDown')
        await pg.wait_for_timeout(120)
        tl=await pg.evaluate("()=>document.getElementById('tel').dataset.l")
        ok(tl=='2' and await pg.evaluate("()=>scrollY")==sy0,f'anak panah ↓ menikam garis Bawah tanpa menatal halaman (garis {tl})')
        # kuasa: tekan dalam halaman pada saat angka >= 95 (Playwright terlalu lambat untuk penunjuk yang bergerak)
        await pg.wait_for_timeout(800)
        await pg.evaluate("""()=>new Promise(r=>{const iv=setInterval(()=>{if(parseInt(document.getElementById('mpw').textContent)>=95){clearInterval(iv);
          document.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowUp',bubbles:true,cancelable:true}));r()}},2)})""")
        await pg.wait_for_timeout(120)
        kp=await pg.evaluate("()=>[...document.querySelectorAll('#duel .kpw')].map(e=>e.textContent)")
        ok(kp and int(kp[-1].split()[-1].rstrip('%'))>=88,f'tikaman di tengah memaparkan kuasa tinggi {kp}')
        await pg.screenshot(path='/tmp/kuasa.png')
        ok(not errs,f'tiada ralat {errs[:2]}')
        print('BALAS: '+('SEMUA LULUS' if not GAGAL else f'{len(GAGAL)} GAGAL')); await b.close(); sys.exit(1 if GAGAL else 0)
asyncio.run(main())
