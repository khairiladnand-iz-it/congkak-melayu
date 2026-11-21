"""Penguji pelayar: setiap jenis biji dan setiap peringkat Kembara dilukis tanpa ralat WebGL,
dan label jumlah lubang kelihatan. Menangkap pepijat seperti 'mutiara' di Pantai Mahsuri
(API three.js r130 digunakan pada r128: pelorek gagal, biji dan jumlah hilang).
THREE_LOCAL=/laluan/three.min.js (r128) jika tiada rangkaian. Jalankan selepas binaan."""
import asyncio, os, sys
from playwright.async_api import async_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAGAL=[]
def ok(c,m):
    print(('LULUS ' if c else 'GAGAL ')+m)
    if not c: GAGAL.append(m)
CHK="""()=>{let e='';try{World.R.render(World.scene,World.cam)}catch(x){e=x.message}
  const L=[...document.querySelectorAll('#labels .n3')].slice(0,World.H.length);
  return {e,err:World.err|0,lab:L.length,num:L.filter(d=>/^\\d+$/.test(d.textContent.trim())).length,biji:World.seeds.length}}"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); c=await b.new_context(viewport={'width':430,'height':880}); pg=await c.new_page()
        if os.environ.get('THREE_LOCAL'): await pg.route('**/three.min.js',lambda r: r.fulfill(path=os.environ['THREE_LOCAL'],content_type='application/javascript'))
        await pg.route('**/fonts.g*/**',lambda r: r.abort())
        warn=[];pg.on('console',lambda m: 'THREE' in m.text and warn.append(m.text[:120]));pg.on('pageerror',lambda e: warn.append('PE '+str(e)[:120]))
        await pg.goto('file://'+os.path.join(ROOT,'dist','index.html'),wait_until='domcontentloaded'); await pg.wait_for_timeout(3000)
        await pg.evaluate("()=>{Prof.d.seen=99;Prof.d.camp=99;cfg.fight='skip';cfg.vs='ai';document.querySelector('[data-go=play]').click()}"); await pg.wait_for_timeout(1500)
        for sd in await pg.evaluate("()=>SEEDS.map(s=>s[0])"):
            await pg.evaluate(f"()=>World.setSeedType('{sd}')"); r=await pg.evaluate(CHK)
            ok(not r['e'] and r['err']==0,f"biji {sd}: dilukis {r['e'][:60]}")
        n=await pg.evaluate("()=>CAMP.length")
        for i in range(n):
            await pg.evaluate(f"()=>{{World.err=0;document.getElementById('result').hidden=true;Quest.play({i})}}"); await pg.wait_for_timeout(700)
            r=await pg.evaluate(CHK); t=await pg.evaluate(f"()=>CAMP[{i}].t+' ('+CAMP[{i}].sd+')'")
            dk=await pg.evaluate(f"()=>[document.getElementById('dWood').value===CAMP[{i}].w,document.getElementById('dSeed').value===CAMP[{i}].sd]")
            ok(all(dk),f'peringkat {i+1}: pilihan kayu/biji selari dengan papan {dk}')
            ok(not r['e'] and r['err']==0 and r['num']==r['lab']>0 and r['biji']>0,f"peringkat {i+1} {t}: biji {r['biji']}, label jumlah {r['num']}/{r['lab']} {r['e'][:50]}")
        ok(not warn,f'tiada amaran three.js {warn[:2]}')
        print('BIJI: '+('SEMUA LULUS' if not GAGAL else f'{len(GAGAL)} GAGAL')); await b.close(); sys.exit(1 if GAGAL else 0)
asyncio.run(main())
