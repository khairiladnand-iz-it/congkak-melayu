"""Penguji pelayar: Hikayat Pahlawan (dist/hikayat.html). Jalankan selepas binaan.
Perjalanan pemain: pilih pahlawan -> adegan -> perlawanan sebenar -> menang -> kad fakta ->
perhentian seterusnya -> simpan/sambung; kalah -> cuba lagi; adegan rekaan memaparkan penyataannya.
Telefon menegak dan desktop. Tangkapan skrin ke /tmp/hk_*.png."""
import asyncio, os
from playwright.async_api import async_playwright
GAGAL = []
def ok(c, m):
    print(('LULUS ' if c else 'GAGAL ') + m)
    if not c: GAGAL.append(m)
URL = 'file://' + os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'dist', 'hikayat.html')

# papan: semua kosong kecuali satu biji di lubang 6 (masuk rumah -> baris pemain kosong -> tamat)
MENANG = "()=>{const G=Hikayat.Gel,s=G.s,n=s.n;s.b=Array(2*n+2).fill(0);s.b[n-1]=1;s.b[n]=30;s.b[n+1]=2;s.b[2*n+1]=5;s.p=0;G.lihat=s.b.slice();G.lukis();}"
KALAH  = "()=>{const G=Hikayat.Gel,s=G.s,n=s.n;s.b=Array(2*n+2).fill(0);s.b[n-1]=1;s.b[n]=3;s.b[n+1]=9;s.b[2*n+1]=40;s.p=0;G.lihat=s.b.slice();G.lukis();}"

async def tunggu_lapis(pg, ms=6000):
    await pg.wait_for_function("()=>!document.getElementById('lapis').hidden", timeout=ms)

async def sesi(b, nama, vp):
    c = await b.new_context(viewport=vp, device_scale_factor=1); pg = await c.new_page()
    await pg.route('**/fonts.g*/**', lambda r: r.abort())
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
    pg.on('console', lambda m: m.type == 'error' and 'ERR_FAILED' not in m.text and errs.append(m.text[:200]))
    await pg.goto(URL); await pg.wait_for_timeout(400)
    await pg.evaluate("()=>localStorage.clear()"); await pg.reload(); await pg.wait_for_timeout(400)
    W = vp['width']
    # ---- rumah ----
    n = await pg.locator('.hero').count(); ok(n == 16, f'{nama}: 16 pahlawan di rumah ({n})')
    n = await pg.locator('#label-senarai dt').count(); ok(n == 4, f'{nama}: empat label diterangkan, termasuk Rekaan ({n})')
    sw = await pg.evaluate("()=>document.documentElement.scrollWidth"); ok(sw <= W, f'{nama}: rumah tiada tatal mendatar ({sw}>{W}?)')
    await pg.screenshot(path=f'/tmp/hk_{nama}_rumah.png')
    # ---- Hikayat Hang Nadim: prolog + 4 ----
    k = await pg.evaluate("()=>Hikayat.HIKAYAT.findIndex(H=>H.id==='nadim')")
    await pg.click(f'.hero[data-h="{k}"]')
    st = await pg.evaluate("()=>[...document.querySelectorAll('.ph')].map(e=>e.className.split(' ')[1])")
    ok(st == ['kini', 'kunci', 'kunci', 'kunci', 'kunci'], f'{nama}: Hang Nadim 5 perhentian, hanya prolog terbuka {st}')
    ok(await pg.locator('.ph.kunci .phb[disabled]').count() == 4, f'{nama}: perhentian terkunci tidak boleh ditekan')
    await pg.screenshot(path=f'/tmp/hk_{nama}_jalan.png', full_page=True)
    # ---- peta beranimasi ----
    await pg.wait_for_timeout(1700)
    pk = await pg.evaluate("()=>Hikayat.Peta._keadaan()")
    ok(pk['lakar'] == 1 and pk['n'] == 5 and pk['W'] > 200, f'{nama}: peta dilakar dengan 5 perhentian {pk}')
    ok(await pg.locator('#plap .pn').count() == 5 and await pg.locator('#plap .pn.kini').count() == 1, f'{nama}: butang perhentian di atas peta')
    px = await pg.evaluate("()=>{const c=document.getElementById('pcv').getContext('2d'),d=c.getImageData(0,0,c.canvas.width,c.canvas.height).data;let n=0;for(let i=0;i<d.length;i+=4*97)if(d[i]>50&&d[i+1]>35)n++;return n}")
    ok(px > 50, f'{nama}: peta melukis darat ({px})')
    await pg.screenshot(path=f'/tmp/hk_{nama}_peta.png')
    await pg.click('#plap .pn.kini'); await tunggu_lapis(pg)
    t = await pg.text_content('#lapis'); ok('Prolog' in t and 'Seterusnya' in t and 'Mula Perlawanan' not in t and 'didramatisasi' in t, f'{nama}: adegan dibuka babak demi babak, dengan nota dramatisasi')
    await pg.click('[data-k=babak]'); await pg.wait_for_timeout(100)
    ok(await pg.locator('#lapis .babak .narasi').count() == 2, f'{nama}: Seterusnya membuka babak kedua')
    await pg.click('[data-k=langkau]'); await pg.wait_for_timeout(100)
    t = await pg.text_content('#lapis'); ok('Todak' in t and 'Mula Perlawanan' in t, f'{nama}: babak akhir menunjukkan lawan Todak')
    ok(await pg.locator('#lapis .med.av img').count() == 1, f'{nama}: lawan tanpa potret pahlawan diberi avatar chibi')
    await pg.screenshot(path=f'/tmp/hk_{nama}_adegan.png')
    await pg.click('[data-k=mula]'); await pg.wait_for_timeout(300)
    ok(await pg.evaluate("()=>document.body.dataset.skrin") == 'laga', f'{nama}: masuk gelanggang')
    sah = await pg.locator('.lb.sah').count(); ok(sah == 7, f'{nama}: tujuh lubang pemain boleh dipilih ({sah})')
    jum = await pg.evaluate("()=>Hikayat.Gel.lihat.reduce((a,b)=>a+b,0)"); ok(jum == 42, f'{nama}: prolog 3 biji x 14 lubang ({jum})')
    sw = await pg.evaluate("()=>document.documentElement.scrollWidth"); ok(sw <= W, f'{nama}: gelanggang tiada tatal mendatar ({sw})')
    # langkah sebenar melalui klik: lubang paling kanan pemain (indeks 0)
    await pg.click('.lb[data-l="0"]')
    await pg.wait_for_function("()=>!Hikayat.Gel.sibuk", timeout=8000)
    g = await pg.evaluate("()=>({m:Hikayat.Gel.s.gerak,j:Hikayat.Gel.lihat.reduce((a,b)=>a+b,0),p:Hikayat.Gel.s.p})")
    ok(g['m'] >= 1 and g['j'] == 42, f'{nama}: klik lubang menabur biji, jumlah kekal {g}')
    await pg.screenshot(path=f'/tmp/hk_{nama}_laga.png')
    # tunggu giliran pemain semula (AI bergerak sendiri)
    await pg.wait_for_function("()=>Hikayat.Gel.s.over||(Hikayat.Gel.s.p===0&&!Hikayat.Gel.sibuk)", timeout=20000)
    ok(not await pg.evaluate("()=>Hikayat.Gel.s.over") and await pg.evaluate("()=>Hikayat.Gel.s.p") == 0, f'{nama}: AI bergerak dan giliran kembali kepada pemain')
    # papan kekunci: 1 = lubang paling kiri (indeks 6)
    b6 = await pg.evaluate("()=>Hikayat.Gel.s.b[6]")
    if b6 > 0:
        await pg.keyboard.press('1'); await pg.wait_for_timeout(80)
        ok(await pg.evaluate("()=>Hikayat.Gel.s.b[6]") == 0 or await pg.evaluate("()=>Hikayat.Gel.sibuk"), f'{nama}: kekunci 1 memilih lubang paling kiri')
        await pg.wait_for_function("()=>Hikayat.Gel.s.over||(Hikayat.Gel.s.p===0&&!Hikayat.Gel.sibuk)", timeout=20000)
    # ---- menang -> kad fakta ----
    await pg.evaluate(MENANG); await pg.click('.lb[data-l="6"]'); await tunggu_lapis(pg)
    t = await pg.text_content('#lapis')
    ok('Menang' in t and 'Sumber:' in t and 'Lagenda' in t, f'{nama}: kad fakta prolog bersumber dan berlabel')
    ok('Teruskan Perjalanan' in t, f'{nama}: butang teruskan perjalanan')
    await pg.screenshot(path=f'/tmp/hk_{nama}_kad.png')
    await pg.click('[data-k=seterus]'); await pg.wait_for_timeout(400)
    ok(await pg.evaluate("()=>Hikayat.Peta._keadaan().kapal"), f'{nama}: potret belayar di peta ke perhentian seterusnya')
    await tunggu_lapis(pg, 8000)
    t = await pg.text_content('#lapis'); ok('Perhentian 1' in t and 'Melaka, 1511' in t, f'{nama}: selepas belayar, adegan perhentian 1 dibuka')
    await pg.click('[data-k=langkau]')
    # ---- kalah -> cuba lagi ----
    await pg.click('[data-k=mula]'); await pg.wait_for_timeout(200)
    await pg.evaluate(KALAH); await pg.click('.lb[data-l="6"]'); await tunggu_lapis(pg)
    t = await pg.text_content('#lapis'); ok('Cuba Lagi' in t and 'tidak tamat' in t, f'{nama}: kalah memberi cuba lagi, perjalanan tidak tamat')
    ok(await pg.evaluate("()=>Hikayat.Simpan.maju('nadim')") == 1, f'{nama}: kalah tidak memajukan perjalanan')
    # ---- simpan / sambung ----
    await pg.reload(); await pg.wait_for_timeout(300)
    pip = await pg.locator(f'.hero[data-h="{k}"] .pip i.on').count(); ok(pip == 1, f'{nama}: kemajuan kekal selepas muat semula ({pip})')
    await pg.click(f'.hero[data-h="{k}"]')
    st = await pg.evaluate("()=>[...document.querySelectorAll('.ph')].map(e=>e.className.split(' ')[1])")
    ok(st[:2] == ['selesai', 'kini'], f'{nama}: prolog selesai, perhentian 1 terbuka {st}')
    await pg.click('.ph.selesai .phb'); await tunggu_lapis(pg)
    ok('Kad perhentian' in await pg.text_content('#lapis'), f'{nama}: kad yang dimenangi boleh dibaca semula')
    await pg.keyboard.press('Escape'); ok(await pg.evaluate("()=>document.getElementById('lapis').hidden"), f'{nama}: Escape menutup kad')
    # ---- adegan rekaan: penyataan wajib kelihatan ----
    await pg.evaluate("()=>{Hikayat.Simpan.d.maju.abusyahid=2;Hikayat.Simpan.simpan()}")
    await pg.click('[data-k=rumah]')
    k2 = await pg.evaluate("()=>Hikayat.HIKAYAT.findIndex(H=>H.id==='abusyahid')")
    await pg.click(f'.hero[data-h="{k2}"]'); await pg.click('.ph.kini .phb'); await tunggu_lapis(pg); await pg.click('[data-k=langkau]')
    vis = await pg.locator('#lapis .rekaan').is_visible()
    t = await pg.text_content('#lapis'); ok(vis and 'Penyataan rekaan' in t, f'{nama}: adegan rekaan memaparkan penyataannya')
    ok(await pg.locator('#lapis .med.rek').count() == 1, f'{nama}: lawan rekaan bermedalion putus-putus')
    await pg.screenshot(path=f'/tmp/hk_{nama}_rekaan.png')
    # ---- tamat perjalanan: epilog & lencana ----
    await pg.evaluate("()=>{Hikayat.Simpan.d.maju.abusyahid=4;Hikayat.Simpan.simpan()}")
    await pg.keyboard.press('Escape'); await pg.click('[data-k=rumah]'); await pg.click(f'.hero[data-h="{k2}"]')
    ok(await pg.locator('#epilog').is_visible() and 'Penghafal Hikayat' in await pg.text_content('#epilog'), f'{nama}: epilog dan lencana selepas 4 perhentian')
    await pg.click('[data-k=rumah]')
    ok(await pg.locator(f'.hero[data-h="{k2}"] .lencana').count() == 1, f'{nama}: lencana pada jubin pahlawan')
    # ---- galeri watak ----
    await pg.click('[data-k=watak]'); await pg.wait_for_timeout(200)
    n = await pg.locator('#galeri .gw').count(); nw = await pg.evaluate("()=>Object.keys(Hikayat.WATAK).length")
    ok(n == nw and n >= 50, f'{nama}: galeri menyenaraikan semua watak sampingan ({n})')
    ok(await pg.locator('#galeri .gw .med.av').count() == n, f'{nama}: setiap watak ada avatar')
    ok(await pg.locator('#galeri .gw .med.av img').count() >= n - 1, f'{nama}: avatar chibi daripada roster')
    sw = await pg.evaluate("()=>document.documentElement.scrollWidth"); ok(sw <= W, f'{nama}: galeri tiada tatal mendatar ({sw})')
    await pg.screenshot(path=f'/tmp/hk_{nama}_galeri.png')
    ok(not errs, f'{nama}: tiada ralat konsol {errs[:3]}')
    await c.close()

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        await sesi(b, 'telefon', {'width': 390, 'height': 844})
        await sesi(b, 'desktop', {'width': 1280, 'height': 860})
        await b.close()
    print('HIKAYAT PELAYAR', 'GAGAL: ' + str(len(GAGAL)) if GAGAL else 'LULUS SEMUA')
    raise SystemExit(1 if GAGAL else 0)
asyncio.run(main())
