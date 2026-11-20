#!/usr/bin/env python3
"""Penguji dalam talian: dua pemain sebenar, kod permainan sebenar.

Menjalankan tiga penguji seperti yang diminta:
  1. tanpa ID log masuk  -> laluan P2P (window.claude tiada)
  2. dengan ID log masuk -> laluan bilik Claude (claude.use('room') ada)
  3. telefon             -> laluan P2P pada port pandangan telefon

Pengangkutan Nostr/WebRTC diganti dengan Trystero tiruan atas BroadcastChannel
(tests/mock_trystero.js) yang API-nya sama. Semua yang lain — P2P -> Rm -> Net
-> Lobi -> Match — ialah kod keluaran sebenar.
"""
import asyncio, os, sys, http.server, socketserver, threading, functools

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, 'dist')
PORT = 8801
MOCK = open(os.path.join(ROOT, 'tests', 'mock_trystero.js'), encoding='utf-8').read()

# bilik Claude tiruan: API ruang nama `room` keupayaan artifact, atas BroadcastChannel
CLAUDE_SHIM = """
window.__mkClaudeRoom = (name) => {
  const me = 'c' + Math.random().toString(36).slice(2,8);
  const ch = new BroadcastChannel('claude:' + name);
  const pres = new Map(); const subs = {}; let peerCb = [], connCb = [], mine = {}, alive = true;
  const list = () => { const o = [{peer:me,by:me,isMe:true,sameTab:true,kind:'viewer',guest:false,presence:mine}];
    for (const [u,p] of pres) o.push({peer:u,by:u,isMe:false,sameTab:false,kind:'viewer',guest:false,presence:p});
    return o; };
  let prev = new Set();
  const push = () => { const ps = list(), ids = new Set(ps.map(p=>p.peer));
    const joined = ps.filter(p=>!prev.has(p.peer));
    const left = [...prev].filter(i=>!ids.has(i)).map(i=>({peer:i,isMe:false,kind:'viewer',presence:{}}));
    prev = ids; const c = {peers:ps, joined, left};
    for (const f of peerCb) f(c); };
  ch.onmessage = e => { const m = e.data; if (!m || m.from === me) return;
    if (m.k === 'hai') { pres.set(m.from, m.p||{}); ch.postMessage({from:me,k:'oi',p:mine}); push();
      for (const f of connCb) f(); return; }
    if (m.k === 'oi') { pres.set(m.from, m.p||{}); push(); for (const f of connCb) f(); return; }
    if (m.k === 'pr') { pres.set(m.from, m.p||{}); push(); return; }
    if (m.k === 'bai') { pres.delete(m.from); push(); return; }
    if (m.k === 'ev') { for (const f of (subs[m.t]||[]))
      f({data:m.d, peer:m.from, by:m.from, isMe:false, sameTab:false, kind:'viewer', guest:false}); return; } };
  const ns = {
    emit(t,d){ ch.postMessage({from:me,k:'ev',t,d});
      setTimeout(()=>{ for (const f of (subs[t]||[]))
        f({data:d,peer:me,by:me,isMe:true,sameTab:true,kind:'viewer',guest:false}); },0);
      return Promise.resolve(); },
    on(t,f){ (subs[t]=subs[t]||[]).push(f); return ()=>{subs[t]=subs[t].filter(x=>x!==f)}; },
    presence(p){ mine = Object.assign({},mine,p||{}); ch.postMessage({from:me,k:'pr',p:mine}); push();
      return Promise.resolve(); },
    peers(){ return list() },
    onPeers(f){ peerCb.push(f); setTimeout(push,0); return ()=>{peerCb=peerCb.filter(x=>x!==f)} },
    onConnection(f){ connCb.push(f); return ()=>{connCb=connCb.filter(x=>x!==f)} },
    connected(){ return pres.size > 0 },
    async join(sub){ return window.__mkClaudeRoom(name + '/' + sub) },
    async leave(){ alive = false; try{ch.postMessage({from:me,k:'bai'})}catch(e){} try{ch.close()}catch(e){} }
  };
  /* BroadcastChannel tiada ulang siar: terus umumkan diri sehingga ada rakan.
     Runner CI yang perlahan membuka tab kedua jauh lewat. */
  const hai = () => { try { ch.postMessage({from:me,k:'hai',p:mine}) } catch(e){} };
  let n = 0;
  const beat = setInterval(() => { if (!alive || ++n > 30) return clearInterval(beat); hai() }, 500);
  hai();
  return ns;
};
window.claude = { use: async (n) => n === 'room' ? window.__mkClaudeRoom('lobi') : null };
"""

PHONE = {'width': 390, 'height': 844}
DESK = {'width': 1280, 'height': 860}

def serve():
    h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=DIST)
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(('127.0.0.1', PORT), h)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd

class Run:
    def __init__(self, label):
        self.label, self.fails, self.n = label, [], 0
    def chk(self, cond, msg):
        self.n += 1
        if not cond:
            self.fails.append(msg)
            print(f'    GAGAL  {msg}')
        else:
            print(f'    ok     {msg}')

async def mk_page(ctx, login):
    pg = await ctx.new_page()
    pg.on('pageerror', lambda e: print('    [ralat js]', str(e)[:140]))
    if login:
        await pg.add_init_script(CLAUDE_SHIM)
    await pg.goto(f'http://127.0.0.1:{PORT}/', wait_until='domcontentloaded', timeout=60000)
    await pg.wait_for_timeout(int(2500 * float(os.environ.get('SLOW','1'))))
    if not login:
        # pasang Trystero tiruan sebelum mod dalam talian dibuka
        await pg.evaluate(MOCK)
        await pg.evaluate("() => { P2P.lib = window.__trysteroMock; P2P.URL = 'mock'; }")
    return pg

async def wait_for(pg, expr, ms=9000, step=200):
    ms = int(ms * float(os.environ.get('SLOW', '1')))
    for _ in range(ms // step):
        try:
            if await pg.evaluate(expr):
                return True
        except Exception:
            pass
        await pg.wait_for_timeout(step)
    return False

async def scenario(browser, label, login, viewport):
    r = Run(label)
    print(f'\n=== {label} ===')
    ctx = await browser.new_context(viewport=viewport)
    A = await mk_page(ctx, login)
    B = await mk_page(ctx, login)

    # --- 1. lobi menyambung ---
    for p in (A, B):
        await p.evaluate("() => { try{localStorage.setItem('cm15lobi','1')}catch(e){} }")
        await p.evaluate("() => document.querySelector('[data-go=\\'lobi\\']').click()")
    ok = await wait_for(A, "() => Lobi.ready === true")
    r.chk(ok, 'lobi A menyambung')
    r.chk(await wait_for(B, "() => Lobi.ready === true"), 'lobi B menyambung')
    r.chk(not await A.evaluate("() => !!Lobi.err"),
          'tiada ralat lobi' + (' -> ' + (await A.evaluate("() => Lobi.err") or '') if await A.evaluate("() => !!Lobi.err") else ''))

    # --- 2. saling nampak (pepijat lobi kosong) ---
    seen = await wait_for(A, "() => Lobi.peers.filter(p=>!p.isMe).length > 0", 12000)
    r.chk(seen, 'A nampak pemain lain dalam lobi')
    r.chk(await wait_for(B, "() => Lobi.peers.filter(p=>!p.isMe).length > 0", 12000),
          'B nampak pemain lain dalam lobi')
    r.chk(await A.evaluate("() => Lobi.count() >= 2"), 'kiraan dalam talian >= 2')
    r.chk(await A.evaluate("() => document.getElementById('lbps').innerHTML.includes('Cabar')"),
          'butang Cabar dipaparkan')

    # --- 3. nama ---
    await A.evaluate("() => Prof.setNick('Khairil')")
    await A.evaluate("() => Lobi.push()")
    r.chk(await wait_for(B, "() => Lobi.peers.some(p=>!p.isMe && p.presence && p.presence.n==='Khairil')"),
          'B nampak nama A bertukar')

    # --- 4. sembang frasa tetap ---
    await A.evaluate("() => Lobi.say(1)")
    r.chk(await wait_for(B, "() => Lobi.chat.length > 0"), 'frasa A sampai kepada B')
    r.chk(await wait_for(A, "() => Lobi.chat.some(m=>m.me)"), 'frasa sendiri bergema pada A')

    # --- 5. cabaran -> perlawanan (pepijat tersangkut pada bersambung) ---
    fired = await A.evaluate("""() => { const b=[...document.querySelectorAll('[data-l=\\'chal\\']')][0];
                               if (!b) return false; Lobi.challenge(b.dataset.p); return true; }""")
    r.chk(fired, 'cabaran dihantar')
    got = fired and await wait_for(B, "() => !!Lobi.inv", 9000)
    r.chk(got, 'B menerima kad cabaran')
    if got:
        await B.evaluate("() => Lobi.accept()")
        r.chk(await wait_for(A, "() => Net.stage==='lobby' || Net.stage==='rmwait'", 9000),
              'A masuk bilik perlawanan')
        r.chk(await wait_for(B, "() => Net.stage==='lobby' || Net.stage==='rmwait'", 9000),
              'B masuk bilik perlawanan')
        # INI pepijat sebenar: rakan dikesan tetapi handshake tidak berlaku
        r.chk(await wait_for(A, "() => Net.stage==='lobby'", 15000),
              'A melepasi "bersambung" ke pentas lobi perlawanan')
        r.chk(await wait_for(A, "() => Net.peer && Net.peer.h >= 0", 15000),
              'A menerima pahlawan pilihan B (handshake joined)')
        r.chk(await wait_for(B, "() => Net.peer && Net.peer.h >= 0", 15000),
              'B menerima pahlawan pilihan A')

        # --- 6. mulakan perlawanan & gerak (hanya hos ada butang MULA) ---
        host = A if await A.evaluate("() => Net.role === 'host'") else B
        r.chk(await wait_for(host, "() => { const b=document.querySelector('[data-n=\\'go\\']'); return b && !b.disabled }", 9000),
              'butang MULA MAIN aktif pada hos')
        await host.evaluate("() => { const b=document.querySelector('[data-n=\\'go\\']'); if(b) b.click() }")
        r.chk(await wait_for(A, "() => Match.online === true && !!Match.s", 15000),
              'perlawanan bermula pada A')
        r.chk(await wait_for(B, "() => Match.online === true && !!Match.s", 15000),
              'perlawanan bermula pada B')

        if await A.evaluate("() => !!Match.s"):
            board0 = await B.evaluate("() => JSON.stringify(Match.s.b)")
            mover = A if await A.evaluate("() => Match.s.turn === Match.me") else B
            other = B if mover is A else A
            await mover.evaluate("""() => { const s=Match.s, n=s.n, me=Match.me;
                for (let i=0;i<n;i++){ const h=me*(n+1)+i; if (s.b[h]>0) { Match.choose(h); break } } }""")
            r.chk(await wait_for(other, f"() => JSON.stringify(Match.s.b) !== {board0!r}", 25000),
                  'gerakan satu pemain muncul pada skrin seorang lagi')
            r.chk(await wait_for(mover, f"() => JSON.stringify(Match.s.b) !== {board0!r}", 25000),
                  'papan pemain yang bergerak turut berubah')

    await ctx.close()
    return r

async def share_code(browser, label, login):
    """Laluan kod perkongsian: hos buka bilik, tetamu masuk dengan kod."""
    r = Run(label); print(f'\n=== {label} ===')
    ctx = await browser.new_context(viewport=DESK)
    A = await mk_page(ctx, login); B = await mk_page(ctx, login)
    await A.evaluate("() => { Net.show(); return Net.roomHost(); }")
    ok = await wait_for(A, "() => !!Rm.code", 9000)
    if not ok:
        print('    [nyahpepijat] err =', await A.evaluate("() => Net.err || ''"),
              '| stage =', await A.evaluate("() => Net.stage"),
              '| mode =', await A.evaluate("() => Rm.mode"),
              '| why =', await A.evaluate("() => Rm.why || P2P.why || ''"))
    r.chk(ok, 'hos menjana kod bilik')
    if ok:
        code = await A.evaluate("() => Rm.code")
        await B.evaluate(f"() => {{ Net.show(); return Net.roomEnter('{code}', false); }}")
        r.chk(await wait_for(B, "() => Rm.avail() && !!Rm.room", 9000), 'tetamu masuk bilik')
        r.chk(await wait_for(A, "() => Net.stage==='lobby'", 15000),
              'hos melepasi "bersambung" ke pentas lobi')
        r.chk(await wait_for(A, "() => Net.peer && Net.peer.h >= 0", 15000),
              'hos menerima pahlawan tetamu')
        r.chk(await wait_for(B, "() => Net.peer && Net.peer.h >= 0", 15000),
              'tetamu menerima pahlawan hos')
    await ctx.close()
    return r

async def main():
    from playwright.async_api import async_playwright
    httpd = serve()
    runs = []
    async with async_playwright() as p:
        b = await p.chromium.launch()
        if not os.environ.get('ONLY4'): runs.append(await scenario(b, 'PENGUJI 1 — tanpa ID log masuk (P2P), desktop', False, DESK))
        if not os.environ.get('ONLY4'): runs.append(await scenario(b, 'PENGUJI 2 — dengan ID log masuk (bilik Claude), desktop', True, DESK))
        if not os.environ.get('ONLY4'): runs.append(await scenario(b, 'PENGUJI 3 — tanpa ID log masuk (P2P), telefon', False, PHONE))
        runs.append(await share_code(b, 'PENGUJI 4 — kod perkongsian (P2P)', False))
        await b.close()
    httpd.shutdown()

    print('\n' + '=' * 60)
    bad = 0
    for r in runs:
        mark = 'LULUS' if not r.fails else f'{len(r.fails)} GAGAL'
        print(f'{r.label}: {r.n - len(r.fails)}/{r.n} {mark}')
        for f in r.fails:
            print('   -', f)
        bad += len(r.fails)
    print('=' * 60)
    print('SEMUA PENGUJI LULUS' if not bad else f'JUMLAH KEGAGALAN: {bad}')
    sys.exit(1 if bad else 0)

asyncio.run(main())
