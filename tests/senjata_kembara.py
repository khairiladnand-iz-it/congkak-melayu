"""Penguji pelayar: Kembara (peringkat seterusnya, kad Kisah, pulih tetapan) dan Senjata Pusaka
(tab, kad sejarah, cahaya & kesan dalam pertarungan). Jalankan selepas binaan.
THREE_LOCAL=/laluan/three.min.js jika tiada rangkaian."""
import asyncio
from playwright.async_api import async_playwright
GAGAL=[]
def ok(c,m):
    print(('LULUS ' if c else 'GAGAL ')+m)
    if not c: GAGAL.append(m)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); c=await b.new_context(viewport={'width':430,'height':880},device_scale_factor=2); pg=await c.new_page()
        if __import__('os').environ.get('THREE_LOCAL'): await pg.route('**/three.min.js',lambda r: r.fulfill(path=__import__('os').environ['THREE_LOCAL'],content_type='application/javascript'))
        await pg.route('**/fonts.g*/**',lambda r: r.abort())
        errs=[];pg.on('pageerror',lambda e: errs.append(str(e)[:200]))
        await pg.goto('file://'+__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.dirname(__import__('os').path.abspath(__file__))),'dist','index.html')+'',wait_until='domcontentloaded'); await pg.wait_for_timeout(3000)
        # ---- Kembara: menang peringkat 1, butang seterusnya ----
        await pg.evaluate("()=>{Prof.d.seen=99;Prof.d.camp=0;cfg.fight='skip';cfg.wood='jati';cfg.n=7;Quest.play(0)}"); await pg.wait_for_timeout(1500)
        await pg.evaluate("()=>{const s=Match.s,n=s.n;s.b=Array(2*n+2).fill(0);s.b[n]=60;s.b[2*n+1]=38;Match.view=s.b.slice();return Match.finish()}")
        await pg.wait_for_timeout(600)
        st=await pg.evaluate("()=>({btn:[...document.querySelectorAll('#result [data-r]')].map(b=>b.dataset.r+':'+b.textContent.trim()),camp:Prof.d.camp})")
        ok(any(x.startswith('next:') for x in st['btn']),f"keputusan Kembara ada butang seterusnya {st['btn']}")
        ok(any(x.startswith('camp:') for x in st['btn']),'ada butang Peta Kembara')
        await pg.wait_for_timeout(1300)
        ks=await pg.evaluate("()=>!document.getElementById('kisah').hidden")
        ok(ks,'kad Kisah muncul selepas menewaskan pahlawan Kembara (pepijat lama)')
        await pg.screenshot(path='/tmp/w_result.png')
        await pg.evaluate("()=>{document.getElementById('kisah').hidden=true}")
        await pg.click('#result [data-r=next]'); await pg.wait_for_timeout(1500)
        st=await pg.evaluate("()=>({camp:Match.camp,screen:document.body.dataset.screen,lawan:HEROES[cfg.p[1]].n,want:HEROES[CAMP[1].h].n})")
        ok(st['camp']==1 and st['screen']=='match' and st['lawan']==st['want'],f'terus ke peringkat 2 tanpa menu {st}')
        # ---- pulih tetapan selepas keluar Kembara ----
        await pg.evaluate("()=>{Screen.go('menu')}")
        lv=await pg.evaluate("()=>{const before=cfg.lvl;document.querySelector('[data-go=play]').click();return [before,cfg.lvl,cfg.wood,Quest.bak]}")
        ok(lv[3] is None and lv[2]=='jati',f'tetapan pemain dipulihkan selepas Kembara {lv}')
        await pg.evaluate("()=>Screen.go('menu')")
        # ---- tab Senjata ----
        await pg.evaluate("()=>{Prof.d.xp=1e7;Prof.d.wpn=6;Prof.open('wpn')}"); await pg.wait_for_timeout(500)
        n=await pg.evaluate("()=>document.querySelectorAll('#prof .wpn').length"); ok(n==7,f'tab Senjata menyenaraikan 7 senjata ({n})')
        await pg.screenshot(path='/tmp/w_tab.png')
        await pg.click('#prof [data-wsj="6"]'); await pg.wait_for_timeout(400)
        t=await pg.evaluate("()=>document.querySelector('#kisah .ktag').textContent"); ok('Dipertikai' in t,f'kad Taming Sari berlabel Dipertikai ({t})')
        await pg.screenshot(path='/tmp/w_kad.png')
        await pg.evaluate("()=>{document.getElementById('kisah').hidden=true;Prof.close()}")
        # ---- pertarungan dengan Taming Sari ----
        await pg.evaluate("()=>{cfg.vs='ai';cfg.fight='auto';cfg.p=[0,1];document.querySelector('[data-go=play]').click()}"); await pg.wait_for_timeout(2000)
        await pg.evaluate("""()=>{window.__h=[];const t0=performance.now();new MutationObserver(ms=>{for(const m of ms)if(m.target.id==='fv'&&/hurt/.test(m.target.className))window.__h.push(performance.now()-t0)}).observe(document.getElementById('duel'),{subtree:true,attributes:true,attributeFilter:['class']});window.__t0=t0;Duel.run(0,14,true)}""")
        await pg.wait_for_function("()=>window.__h.length>0",timeout=15000); await pg.wait_for_timeout(120)
        await pg.screenshot(path='/tmp/w_duel.png')
        st=await pg.evaluate("()=>({wpn:document.getElementById('fa').classList.contains('wpn'),tag:(document.querySelector('#fa .wtag')||{}).textContent,wfx:document.querySelectorAll('#duel .wfx').length})")
        ok(st['wpn'] and 'Taming Sari' in (st['tag'] or ''),f'kad pemain bercahaya dengan tag senjata {st}')
        ok(st['wfx']>0,'kesan khas senjata muncul pada hentaman')
        ok(not errs,f'tiada ralat {errs[:2]}')
        print('SENJATA/KEMBARA:',('SEMUA LULUS' if not GAGAL else f'{len(GAGAL)} GAGAL'));__import__('sys').exit(1 if GAGAL else 0)
        await b.close()
asyncio.run(main())
