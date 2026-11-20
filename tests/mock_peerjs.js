/* PeerJS tiruan yang menyambungkan tab melalui BroadcastChannel.
   Menyediakan kelas Peer dengan tingkah laku yang sama: peristiwa 'open',
   ralat 'unavailable-id' bila ID sudah diambil, peer.connect(), peristiwa
   'connection', dan DataConnection dengan 'open'/'data'/'close'.

   Disuntik oleh tests/online.py. Bukan sebahagian daripada keluaran. */
window.__peerjsMock = (() => {
  const ctl = new BroadcastChannel('pjmock');
  const held = new Set();                  /* ID yang dipegang oleh tab ini */
  const peers = new Map();                 /* ID -> Peer */
  const conns = new Map();                 /* cid -> Conn */
  const rnd = () => Math.random().toString(36).slice(2, 10);

  class Emitter {
    constructor() { this._ev = {} }
    on(e, f) { (this._ev[e] = this._ev[e] || []).push(f); return this }
    off(e, f) { this._ev[e] = (this._ev[e] || []).filter(x => x !== f); return this }
    emit(e, v) { for (const f of (this._ev[e] || []).slice()) { try { f(v) } catch (x) { console.error(x) } } }
  }

  class Conn extends Emitter {
    constructor(cid, peerId, mineId) {
      super(); this.connectionId = cid; this.peer = peerId; this._mine = mineId;
      this.open = false; this.reliable = true;
      conns.set(cid, this);
    }
    send(d) { if (this.open) ctl.postMessage({ k: 'data', cid: this.connectionId, from: this._mine, d }) }
    close() {
      if (!this.open) return;
      this.open = false; ctl.postMessage({ k: 'close', cid: this.connectionId });
      conns.delete(this.connectionId); this.emit('close');
    }
  }

  class Peer extends Emitter {
    constructor(id) {
      super();
      this.destroyed = false; this.disconnected = false;
      this.id = id || ('mk' + rnd());
      const wanted = !!id;
      setTimeout(() => {
        if (this.destroyed) return;
        if (!wanted) return this._up();
        /* Pelayan sebenar menimbang tara tuntutan serentak. localStorage
           dikongsi antara tab dan tulisannya bersiri, jadi tulis-kemudian-baca
           memberi tingkah laku yang sama: hanya satu token boleh bertahan. */
        const key = 'pjclaim:' + this.id, tok = rnd(), now = Date.now();
        let cur = null;
        try { cur = JSON.parse(localStorage.getItem(key) || 'null') } catch (e) {}
        const lose = () => {
          const e = new Error('ID "' + this.id + '" is taken'); e.type = 'unavailable-id';
          this.emit('error', e);
        };
        if (cur && now - cur.t < 8000) return lose();
        try { localStorage.setItem(key, JSON.stringify({ t: now, tok })) } catch (e) {}
        setTimeout(() => {
          if (this.destroyed) return;
          let back = null;
          try { back = JSON.parse(localStorage.getItem(key) || 'null') } catch (e) {}
          if (!back || back.tok !== tok) return lose();
          this._key = key; this._tok = tok;
          /* degupan supaya tuntutan tidak luput semasa masih hidup */
          this._beat = setInterval(() => {
            try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), tok })) } catch (e) {}
          }, 3000);
          this._up();
        }, 250);
      }, 0);
    }
    _up() { held.add(this.id); peers.set(this.id, this); this.open = true; this.emit('open', this.id) }
    connect(to) {
      const cid = 'c' + rnd();
      const c = new Conn(cid, to, this.id);
      ctl.postMessage({ k: 'conn', to, from: this.id, cid });
      setTimeout(() => {
        if (!c.open && !c.destroyed) { const e = new Error('peer unavailable'); e.type = 'peer-unavailable'; c.emit('error', e) }
      }, 3000);
      return c;
    }
    destroy() {
      this.destroyed = true; this.open = false;
      clearInterval(this._beat);
      if (this._key) { try { localStorage.removeItem(this._key) } catch (e) {} this._key = null }
      held.delete(this.id); peers.delete(this.id);
      for (const c of [...conns.values()]) if (c._mine === this.id) { conns.delete(c.connectionId); ctl.postMessage({ k: 'close', cid: c.connectionId }) }
      this.emit('close');
    }
    disconnect() { this.disconnected = true }
  }

  ctl.onmessage = e => {
    const m = e.data; if (!m) return;
    if (m.k === 'probe') { if (held.has(m.id)) ctl.postMessage({ k: 'taken', id: m.id }); return }
    if (m.k === 'conn') {
      const p = peers.get(m.to); if (!p) return;
      const c = new Conn(m.cid, m.from, m.to);
      c.open = true;
      ctl.postMessage({ k: 'ack', cid: m.cid });
      p.emit('connection', c);
      setTimeout(() => c.emit('open'), 0);
      return;
    }
    if (m.k === 'ack') { const c = conns.get(m.cid); if (c && !c.open) { c.open = true; c.emit('open') } return }
    if (m.k === 'data') { const c = conns.get(m.cid); if (c && c._mine !== m.from) c.emit('data', m.d); return }
    if (m.k === 'close') { const c = conns.get(m.cid); if (c) { c.open = false; conns.delete(m.cid); c.emit('close') } return }
  };

  return { Peer };
})();
