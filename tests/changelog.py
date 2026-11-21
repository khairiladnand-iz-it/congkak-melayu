"""Penguji pelayar Apa Baharu: buka/tutup melalui lencana, X, Kembali, latar dan Escape;
aria-expanded; fokus; senarai ditatal sendiri; menu telefon masih muat.
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
        b=await p.chromium.launch()
        for nm,vp in [('telefon',{'width':390,'height':844}),('desktop',{'width':1280,'height':800})]:
            c=await b.new_context(viewport=vp); pg=await c.new_page()
            if os.environ.get('THREE_LOCAL'): await pg.route('**/three.min.js',lambda r: r.fulfill(path=os.environ['THREE_LOCAL'],content_type='application/javascript'))
            await pg.route('**/fonts.g*/**',lambda r: r.abort())
            errs=[];pg.on('pageerror',lambda e: errs.append(str(e)[:150]))
            await pg.goto('file://'+os.path.join(ROOT,'dist','index.html'),wait_until='domcontentloaded'); await pg.wait_for_timeout(3000)
            t=await pg.evaluate("()=>document.getElementById('ver').textContent"); v=await pg.evaluate("()=>CHANGELOG[0].v")
            ok(v in t,f'{nm}: lencana menunjukkan versi terbaru ({t})')
            fits=await pg.evaluate("()=>document.querySelector('[data-go=\"set\"]').getBoundingClientRect().bottom<=innerHeight+2")
            ok(fits,f'{nm}: menu masih muat tanpa tatal')
            st=lambda: pg.evaluate("()=>({open:!document.getElementById('log').hidden,ae:document.getElementById('ver').getAttribute('aria-expanded'),f:document.activeElement&&(document.activeElement.id||document.activeElement.className)})")
            for how in ['x','back','escape','latar']:
                await pg.click('#ver'); s=await st()
                ok(s['open'] and s['ae']=='true' and s['f']=='logx',f'{nm}: buka -> fokus pada X, aria-expanded=true {s}')
                if how=='x': await pg.click('#log .logx')
                elif how=='back': await pg.click('#log [data-log=back]')
                elif how=='escape': await pg.keyboard.press('Escape')
                else: await pg.mouse.click(4,vp['height']-4)
                s=await st(); ok(not s['open'] and s['ae']=='false' and s['f']=='ver',f'{nm}: tutup dengan {how} -> fokus kembali ke lencana {s}')
            await pg.click('#ver')
            r=await pg.evaluate("""()=>{const l=document.querySelector('#log .logl'),x=document.querySelector('#log .logx');l.scrollTop=99999;
              const rx=x.getBoundingClientRect();return {scroll:l.scrollHeight>l.clientHeight,top:l.scrollTop>0,xvis:rx.top>=0&&rx.bottom<=innerHeight,n:document.querySelectorAll('#log .loge').length,want:CHANGELOG.length}}""")
            ok(r['scroll'] and r['top'] and r['xvis'],f'{nm}: senarai ditatal sendiri, X kekal kelihatan {r}')
            ok(r['n']==r['want'],f"{nm}: semua {r['want']} versi dipapar")
            if nm=='telefon': await pg.keyboard.press('Escape'); await pg.click('#ver'); await pg.screenshot(path='/tmp/log_telefon.png')
            ok(not errs,f'{nm}: tiada ralat {errs[:2]}')
            await c.close()
        print('APA BAHARU: '+('SEMUA LULUS' if not GAGAL else f'{len(GAGAL)} GAGAL')); await b.close(); sys.exit(1 if GAGAL else 0)
asyncio.run(main())
