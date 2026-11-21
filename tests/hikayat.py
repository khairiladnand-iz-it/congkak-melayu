"""Penguji pelayar: Hikayat Pahlawan dalam Congkak Melayu (dist/index.html). Jalankan selepas binaan.
Menu -> Hikayat -> peta -> adegan -> perlawanan SEBENAR (Match, papan 3D) -> menang -> XP + kad ->
belayar ke perhentian seterusnya; kalah -> cuba lagi; slot pahlawan dipinjam dan dipulihkan.
THREE_LOCAL=/laluan/three.min.js jika tiada rangkaian. Tangkapan skrin ke /tmp/hk_*.png."""
import asyncio, os, http.server, threading, functools
from playwright.async_api import async_playwright
GAGAL = []
def ok(c, m):
    print(('LULUS ' if c else 'GAGAL ') + m)
    if not c: GAGAL.append(m)
DIST = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'dist')

# tamatkan perlawanan semasa dengan keputusan tertentu (papan disusun, kemudian Match.finish sebenar)
TAMAT = """async(menang)=>{const s=Match.s,n=s.n;s.b=Array(2*n+2).fill(0);s.b[n]=menang?40:5;s.b[2*n+1]=menang?5:40;
  Match.view=s.b.slice();World.sync(Match.view);await Match.finish()}"""

async def lapis(pg, ms=8000):
    await pg.wait_for_function("()=>!document.querySelector('#hik .hlapis').hidden", timeout=ms)

async def sesi(b, nama, vp, port):
    c = await b.new_context(viewport=vp, device_scale_factor=1); pg = await c.new_page()
    if os.environ.get('THREE_LOCAL'):
        await pg.route('**/three.min.js', lambda r: r.fulfill(path=os.environ['THREE_LOCAL'], content_type='application/javascript'))
    await pg.route('**/fonts.g*/**', lambda r: r.abort())
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
    await pg.goto(f'http://127.0.0.1:{port}/', wait_until='domcontentloaded'); await pg.wait_for_timeout(2500)
    await pg.evaluate("()=>{Prof.d.seen=99;cfg.fight='skip';saveCfg()}")
    W = vp['width']
    p0 = await pg.evaluate("()=>cfg.p.slice()")
    xp0 = await pg.evaluate("()=>Prof.d.xp")
    # ---- menu ----
    ok(await pg.locator('[data-go=hik]').is_visible(), f'{nama}: butang Hikayat Pahlawan di menu')
    fits = await pg.evaluate("()=>document.querySelector('[data-go=\"set\"]').getBoundingClientRect().bottom<=innerHeight+2")
    ok(fits, f'{nama}: menu masih muat tanpa tatal')
    await pg.evaluate("()=>document.querySelector('[data-go=hik]').click()"); await pg.wait_for_timeout(300)
    ok(await pg.locator('#hik .hhero').count() == 16, f'{nama}: 16 hikayat')
    sw = await pg.evaluate("()=>document.getElementById('hik').scrollWidth<=document.getElementById('hik').clientWidth+1")
    ok(sw, f'{nama}: lapisan Hikayat tiada tatal mendatar')
    await pg.screenshot(path=f'/tmp/hk_{nama}_rumah.png')
    # ---- Hang Nadim: peta ----
    k = await pg.evaluate("()=>HIKAYAT.findIndex(H=>H.id==='nadim')")
    await pg.click(f'#hik .hhero[data-hh="{k}"]'); await pg.wait_for_timeout(1800)
    ok(await pg.locator('#hplap .pn').count() == 5 and await pg.locator('#hplap .pn.kini').count() == 1, f'{nama}: peta 5 perhentian, satu terbuka')
    px = await pg.evaluate("()=>{const c=document.getElementById('hpcv').getContext('2d'),d=c.getImageData(0,0,c.canvas.width,c.canvas.height).data;let n=0;for(let i=0;i<d.length;i+=4*97)if(d[i]>50&&d[i+1]>35)n++;return n}")
    ok(px > 50, f'{nama}: peta melukis darat ({px})')
    await pg.screenshot(path=f'/tmp/hk_{nama}_peta.png')
    # ---- adegan ----
    await pg.click('#hplap .pn.kini'); await lapis(pg)
    t = await pg.text_content('#hik .hkertas'); ok('Seterusnya' in t and 'didramatisasi' in t, f'{nama}: adegan berbabak dengan nota dramatisasi')
    await pg.click('#hik [data-hk=langkau]'); await pg.wait_for_timeout(100)
    t = await pg.text_content('#hik .hkertas'); ok('Todak' in t and 'Mula Perlawanan' in t and 'XP' in t, f'{nama}: babak akhir: lawan Todak, XP dinyatakan')
    ok(await pg.locator('#hik .hkertas .med.hav img').count() == 1, f'{nama}: avatar chibi lawan')
    await pg.screenshot(path=f'/tmp/hk_{nama}_adegan.png')
    # ---- perlawanan sebenar ----
    await pg.click('#hik [data-hk=mula]'); await pg.wait_for_timeout(1500)
    st = await pg.evaluate("()=>({scr:document.body.dataset.screen,hik:document.getElementById('hik').hidden,n:cfg.n,sd:cfg.seeds,p0:cfg.p[0],c1:document.getElementById('c1').textContent,pin:!!Hikayat._pinjam(),view:Match.view.reduce((a,b)=>a+b,0)})")
    ok(st['scr'] == 'match' and st['hik'], f'{nama}: gelanggang 3D permainan asal dibuka {st["scr"]}')
    ok(st['n'] == 7 and st['sd'] == 3 and st['view'] == 42, f'{nama}: papan prolog 7 lubang × 3 biji ({st["view"]})')
    ok('Todak' in st['c1'] and st['pin'], f'{nama}: kad lawan memaparkan watak sampingan ({st["c1"][:40]})')
    ok(st['p0'] == 4, f'{nama}: pemain bermain sebagai Hang Nadim')
    await pg.screenshot(path=f'/tmp/hk_{nama}_laga.png')
    # langkah sebenar melalui Match
    mv = await pg.evaluate("async()=>{const i=Rules.legal(Match.s.b,Match.s.n,0)[0];await Match.play(i);return Match.s.hist.length}")
    ok(mv >= 1, f'{nama}: langkah ditabur oleh enjin animasi asal')
    await pg.wait_for_function("()=>!Match.s.busy", timeout=30000)
    # ---- menang -> XP + kad ----
    await pg.evaluate(TAMAT, True); await pg.wait_for_timeout(600)
    r = await pg.evaluate("()=>({t:document.getElementById('result').textContent,b:[...document.querySelectorAll('#result [data-r]')].map(x=>x.dataset.r),hk:Prof.d.hk_nadim,xp:Prof.d.xp})")
    ok('hkad' in r['b'] and 'hpeta' in r['b'], f'{nama}: panel keputusan ada butang Hikayat {r["b"]}')
    ok(r['hk'] == 1 and '+30 XP Hikayat' in r['t'], f'{nama}: kemajuan disimpan dalam Prof dan XP Hikayat diberi')
    ok(r['xp'] > xp0, f'{nama}: XP dan level bertambah daripada perlawanan ({xp0} -> {r["xp"]})')
    await pg.screenshot(path=f'/tmp/hk_{nama}_keputusan.png')
    await pg.click('#result [data-r=hkad]'); await lapis(pg)
    t = await pg.text_content('#hik .hkertas'); ok('Teruskan Perjalanan' in t and 'Sumber:' in t, f'{nama}: kad fakta selepas menang')
    s2 = await pg.evaluate("()=>({pin:Hikayat._pinjam(),n:HEROES[2].n,img:IMGS[2]===ASSET.box[2]||IMGS[2].length>0,scr:document.body.dataset.screen})")
    ok(s2['pin'] is None and s2['n'] == 'Hang Lekiu', f'{nama}: slot pahlawan dipulihkan selepas gelanggang')
    await pg.screenshot(path=f'/tmp/hk_{nama}_kad.png')
    await pg.click('#hik [data-hk=seterus]'); await pg.wait_for_timeout(400)
    ok(await pg.evaluate("()=>Peta._keadaan().kapal"), f'{nama}: potret belayar di peta')
    await lapis(pg, 9000)
    t = await pg.text_content('#hik .hkertas'); ok('Perhentian 1' in t and 'Melaka, 1511' in t, f'{nama}: selepas belayar, adegan perhentian 1')
    # ---- kalah -> cuba lagi ----
    await pg.click('#hik [data-hk=langkau]'); await pg.click('#hik [data-hk=mula]'); await pg.wait_for_timeout(1200)
    await pg.evaluate(TAMAT, False); await pg.wait_for_timeout(500)
    b2 = await pg.evaluate("()=>[...document.querySelectorAll('#result [data-r]')].map(x=>x.dataset.r)")
    ok('hagain' in b2 and await pg.evaluate("()=>Prof.d.hk_nadim") == 1, f'{nama}: kalah -> Cuba Lagi, kemajuan tidak bertambah')
    await pg.click('#result [data-r=hagain]'); await pg.wait_for_timeout(1200)
    ok(await pg.evaluate("()=>document.body.dataset.screen==='match'&&Match.s.turn===0&&!Match.s.over&&/Pengawal/.test(document.getElementById('c1').textContent)"), f'{nama}: Cuba Lagi memulakan semula perhentian yang sama')
    # ---- keluar ke menu: tetapan pemain dipulihkan ----
    await pg.evaluate("()=>Screen.go('menu')"); await pg.wait_for_timeout(300)
    ok(await pg.evaluate("()=>!document.getElementById('cont').hidden"), f'{nama}: perlawanan Hikayat boleh disambung dari menu')
    await pg.evaluate("()=>{document.querySelector('[data-go=cont]').click()}"); await pg.wait_for_timeout(600)
    ok(await pg.evaluate("()=>/Pengawal/.test(document.getElementById('c1').textContent)&&cfg.p[0]===4"), f'{nama}: sambung perlawanan memulihkan lawan Hikayat')
    await pg.evaluate("()=>Screen.go('menu')"); await pg.wait_for_timeout(200)
    await pg.evaluate("()=>{document.querySelector('[data-go=help]').click();document.getElementById('help').hidden=true}"); await pg.wait_for_timeout(200)
    p1 = await pg.evaluate("()=>cfg.p.slice()")
    ok(p1 == p0 and await pg.evaluate("()=>!Hikayat._pinjam()&&Quest.bak==null"), f'{nama}: memilih menu lain memulihkan pahlawan dan tetapan pemain {p0} -> {p1}')
    # ---- galeri ----
    await pg.evaluate("()=>document.querySelector('[data-go=hik]').click()"); await pg.wait_for_timeout(200)
    await pg.click('#hik [data-hk=watak]'); await pg.wait_for_timeout(200)
    n = await pg.locator('#hik .gw').count(); ni = await pg.locator('#hik .gw .med.hav img').count()
    ok(n == 54 and ni == 54, f'{nama}: galeri 54 watak, semuanya berpotret ({n}/{ni})')
    bentuk = await pg.evaluate("()=>[...document.querySelectorAll('#hgaleri .gw .med img')].every(i=>{const r=i.getBoundingClientRect(),m=i.parentElement.getBoundingClientRect(),c=getComputedStyle(i);return Math.abs(r.width-m.width+4)<=1&&parseFloat(c.borderTopWidth)===0})")
    ok(bentuk, f'{nama}: potret memenuhi medalion bulat, tiada bingkai kotak')
    await pg.screenshot(path=f'/tmp/hk_{nama}_galeri.png')
    # ---- alamat lama ----
    await pg.goto(f'http://127.0.0.1:{port}/hikayat.html'); await pg.wait_for_timeout(3500)
    ok(await pg.evaluate("()=>!document.getElementById('hik').hidden"), f'{nama}: hikayat.html lama membuka Hikayat dalam permainan')
    ok(not errs, f'{nama}: tiada ralat JS {errs[:3]}')
    await c.close()

async def main():
    h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=DIST)
    h.log_message = lambda *a: None
    httpd = http.server.ThreadingHTTPServer(('127.0.0.1', 0), h); port = httpd.server_address[1]
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    async with async_playwright() as p:
        b = await p.chromium.launch()
        await sesi(b, 'telefon', {'width': 390, 'height': 844}, port)
        await sesi(b, 'desktop', {'width': 1280, 'height': 860}, port)
        await b.close()
    httpd.shutdown()
    print('HIKAYAT PELAYAR', 'GAGAL: ' + str(len(GAGAL)) if GAGAL else 'LULUS SEMUA')
    raise SystemExit(1 if GAGAL else 0)
asyncio.run(main())
