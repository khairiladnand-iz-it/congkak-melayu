"""Penguji pelayar: Jurus Gemilang boleh dilepaskan, dan Semangat dibawa antara tikaman.
Dulu Semangat bermula 0 setiap tikaman (~10 s), jadi jurus ⚡100 hampir tidak pernah sedia.
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
        b=await p.chromium.launch(); c=await b.new_context(viewport={'width':430,'height':880},device_scale_factor=1); pg=await c.new_page()
        if os.environ.get('THREE_LOCAL'): await pg.route('**/three.min.js',lambda r: r.fulfill(path=os.environ['THREE_LOCAL'],content_type='application/javascript'))
        await pg.route('**/fonts.g*/**',lambda r: r.abort())
        errs=[];pg.on('pageerror',lambda e: errs.append(str(e)[:160]))
        await pg.goto('file://'+os.path.join(ROOT,'dist','index.html'),wait_until='domcontentloaded'); await pg.wait_for_timeout(3000)
        # pemain level 12: Tiupan Serunai (Lv5) & Bayang Harimau (Lv10) terbuka; pilih Serunai di slot 1
        await pg.evaluate("()=>{Prof.d.seen=99;Prof.d.xp=Prof.cum(12);Prof.d.gem=0;cfg.vs='ai';cfg.lvl=2;cfg.fight='live';cfg.p=[0,1];document.querySelector('[data-go=play]').click()}")
        await pg.wait_for_timeout(1500)
        ok(await pg.evaluate("()=>JSON.stringify(Match.sem)")=='[0,0]','perlawanan baharu bermula dengan Semangat 0')
        # tikaman 1: pemain menyerang dan menikam sahaja (tanpa jurus) -> Semangat terkumpul
        await pg.evaluate("()=>{window.__r=Duel.run(0,10)}")
        await pg.wait_for_function("()=>/LAWAN/.test((document.getElementById('dt')||{}).textContent||'')",timeout=10000)
        for i in range(14):
            await pg.keyboard.press(['ArrowUp','ArrowRight','ArrowDown'][i%3]); await pg.wait_for_timeout(620)
        await pg.evaluate("()=>window.__r"); await pg.wait_for_timeout(300)
        s1=await pg.evaluate("()=>Match.sem.slice()")
        ok(s1[0]>0,f'Semangat penyerang disimpan selepas tikaman ({s1})')
        # tikaman 2 bermula dengan baki tadi; isi hingga 100 dan lepaskan jurus [6]
        await pg.evaluate("()=>{Match.sem[0]=100;document.getElementById('duel').hidden=true;window.__r2=Duel.run(0,10)}")
        await pg.wait_for_function("()=>/LAWAN/.test((document.getElementById('dt')||{}).textContent||'')",timeout=10000)
        st=await pg.evaluate("""()=>{const b=document.querySelector('#duel .wb.gmb');return {ada:!!b,rdy:!!b&&b.classList.contains('rdy'),bar:document.getElementById('sea').style.width}}""")
        ok(st['ada'],'butang Jurus Gemilang muncul di gelanggang')
        # dulu kelas .gem bertembung dengan kad senarai Jurus di Pangkat: nama coklat gelap atas latar gelap, ikon ke kiri
        lb=await pg.evaluate("""()=>{const b=document.querySelector('#duel .wb.gmb'),s=b.querySelector('span'),i=b.querySelector('.ik'),
          rgb=getComputedStyle(s).color.match(/\\d+/g).map(Number),bi=b.getBoundingClientRect(),ii=i.getBoundingClientRect();
          return {txt:s.textContent,luma:.299*rgb[0]+.587*rgb[1]+.114*rgb[2],ikTengah:Math.abs((ii.left+ii.right)/2-(bi.left+bi.right)/2)}}""")
        ok(lb['luma']>150 and '[6]' in lb['txt'],f"nama jurus & kekunci [6] kelihatan pada butang ({lb['txt']}, kecerahan {lb['luma']:.0f})")
        ok(lb['ikTengah']<6,f"ikon jurus di tengah butang (anjakan {lb['ikTengah']:.1f}px)")
        ok(st['rdy'] and st['bar']=='100%',f'jurus sedia sejak awal tikaman kerana Semangat dibawa ({st})')
        await pg.screenshot(path='/tmp/semangat.png')
        await pg.keyboard.press('6'); await pg.wait_for_timeout(250)
        bar=await pg.evaluate("()=>document.getElementById('sea').style.width")
        ok(bar=='0%',f'menekan [6] melepaskan jurus dan menggunakan Semangat (bar {bar})')
        await pg.evaluate("()=>window.__r2")
        ok(await pg.evaluate("()=>Match.sem.every(v=>v>=0&&v<=100)"),'Semangat disimpan dalam julat 0..100')
        # perlawanan baharu mengosongkan Semangat
        await pg.evaluate("()=>{document.getElementById('duel').hidden=true;Match.start()}"); await pg.wait_for_timeout(600)
        ok(await pg.evaluate("()=>JSON.stringify(Match.sem)")=='[0,0]','perlawanan seterusnya bermula semula dari 0')
        ok(not errs,f'tiada ralat JS {errs}')
        await b.close()
    print('SEMANGAT: SEMUA LULUS' if not GAGAL else f'SEMANGAT: {len(GAGAL)} GAGAL')
    sys.exit(1 if GAGAL else 0)
asyncio.run(main())
