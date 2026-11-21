"""Penguji Papan Wira (muka hadapan 3D).
Menyemak: papan dilukis di menu; berhenti dilukis bila ditatal keluar atau ditutup lapisan;
offset kamera menu tidak bocor ke perlawanan; papan wira pulih selepas perlawanan;
tetikus mengalihkan kamera; mod kurang gerakan melukis sekali sahaja.
three.js dimuat dari CDN; tetapkan THREE_LOCAL=/laluan/three.min.js (r128) jika tiada rangkaian.
Jalankan selepas binaan:  python3 tests/hero.py"""
import asyncio, os, sys
from playwright.async_api import async_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL='file://'+os.path.join(ROOT,'dist','index.html')
LOCAL=os.environ.get('THREE_LOCAL')
GAGAL=[]
def ok(c,m):
    print(('LULUS ' if c else 'GAGAL ')+m)
    if not c: GAGAL.append(m)
async def prep(pg):
    if LOCAL: await pg.route('**/three.min.js',lambda r: r.fulfill(path=LOCAL,content_type='application/javascript'))
    await pg.route('**/fonts.g*/**',lambda r: r.abort())
CNT="""()=>new Promise(r=>{let n=0;const R=World.R,o=R.render;R.render=function(...a){n++;return o.apply(this,a)};setTimeout(()=>{R.render=o;r(n)},1500)})"""

async def telefon(p):
    if True:
        b=await p.chromium.launch(); c=await b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True); pg=await c.new_page()
        await prep(pg)
        errs=[]; pg.on('pageerror',lambda e: errs.append(str(e)[:150]))
        await pg.goto(URL,wait_until='domcontentloaded'); await pg.wait_for_timeout(3000)
        n=await pg.evaluate(CNT); ok(n>0,f'menu atas: papan wira dilukis ({n} bingkai/1.5s)')
        await pg.evaluate("()=>{const m=document.getElementById('menu');window.scrollTo(0,600);m.scrollTop=600;document.dispatchEvent(new Event('scroll'));}")
        await pg.wait_for_timeout(300)
        sc=await pg.evaluate("()=>[World.heroSc,World.heroR.ht]"); n=await pg.evaluate(CNT); ok(n==0,f'menu ditatal keluar (sc={sc}): tiada lukisan ({n})')
        await pg.evaluate("()=>{window.scrollTo(0,0);document.getElementById('menu').scrollTop=0;document.dispatchEvent(new Event('scroll'))}"); await pg.wait_for_timeout(300)
        await pg.evaluate("()=>{const o=document.querySelector('.ov');o.hidden=false;window.__o=o}")
        n=await pg.evaluate(CNT); ok(n==0,f'lapisan terbuka di atas menu: tiada lukisan ({n})')
        await pg.evaluate("()=>{window.__o.hidden=true}")
        await pg.evaluate("()=>{cfg.vs='ai';Prof.d.seen=99;document.querySelector('[data-go=play]').click()}"); await pg.wait_for_timeout(2500)
        st=await pg.evaluate("()=>({mode:World.mode,view:!!(World.cam.view&&World.cam.view.enabled),hero:document.getElementById('gl').classList.contains('hero'),m3d:document.body.classList.contains('m3d'),screen:document.body.dataset.screen,dais:World.daisM.every(m=>m.visible),pool:World.menuM.every(m=>!m.visible)})")
        ok(st['mode']!='menu' and not st['view'],f'perlawanan: tiada offset kamera menu {st}')
        ok(st['dais'] and st['pool'],'perlawanan: pelantar kembali, bayang menu disorok')
        n=await pg.evaluate(CNT); ok(n>0,f'perlawanan: papan dilukis ({n})')
        await pg.evaluate("()=>Screen.go('menu')"); await pg.wait_for_timeout(1500)
        st=await pg.evaluate("()=>({mode:World.mode,hero:!!World.heroR,m3d:document.body.classList.contains('m3d'),dais:World.daisM.some(m=>m.visible)})")
        ok(st['hero'] and st['m3d'] and not st['dais'],f'kembali ke menu: papan wira pulih {st}')
        ok(not errs,f'tiada ralat halaman {errs[:2]}')
        await b.close()

async def desktop(p,rm):
    b=await p.chromium.launch(); c=await b.new_context(viewport={'width':1280,'height':720},reduced_motion=rm); pg=await c.new_page()
    await prep(pg)
    await pg.goto(URL,wait_until='domcontentloaded'); await pg.wait_for_timeout(3000)
    if rm=='reduce':
        await pg.wait_for_timeout(800); n=await pg.evaluate(CNT); ok(n==0,f'kurang gerakan: gambar pegun, tiada lukisan berulang ({n})')
        await pg.set_viewport_size({'width':1300,'height':720}); await pg.wait_for_timeout(600)
        st=await pg.evaluate("()=>World._heroDirty"); ok(st is False,'kurang gerakan: saiz berubah -> dilukis semula sekali')
    else:
        a0=await pg.evaluate("()=>World.cam.position.toArray().map(v=>+v.toFixed(2))")
        await pg.mouse.move(1270,100); await pg.wait_for_timeout(1500)
        a1=await pg.evaluate("()=>[World.ptr.x.toFixed(2),World.ptr.tx.toFixed(2),World.cam.position.toArray().map(v=>+v.toFixed(2))]")
        ok(float(a1[0])>0.15 and a1[2][0]>a0[0],f'tetikus kanan: kamera beralih {a0} -> {a1}')
    await b.close()

async def main():
    async with async_playwright() as p:
        await telefon(p); await desktop(p,'no-preference'); await desktop(p,'reduce')
    print('PAPAN WIRA: '+('SEMUA LULUS' if not GAGAL else f'{len(GAGAL)} GAGAL')); sys.exit(1 if GAGAL else 0)
asyncio.run(main())
