/* ===== P2P: lobi & bilik terus antara pelayar, tanpa akaun dan tanpa pelayan =====
   Menggunakan PeerJS (MIT) — isyarat melalui PeerServer awam, data melalui WebRTC.
   Modul dimuatkan hanya apabila pemain membuka mod dalam talian, jadi permainan
   tetap berfungsi sepenuhnya tanpa internet.

   Topologi bintang: orang pertama yang menuntut ID bilik menjadi HOS dan
   menyampaikan semula setiap mesej kepada yang lain. Sesiapa yang mendapati
   ID itu sudah diambil akan menyambung kepada hos sebagai KLIEN. Bila hos
   pergi, klien berebut menuntut ID itu semula.

   Ia menyamar sebagai ruang nama bilik Claude: emit/on/presence/peers/onPeers/
   onConnection/join, supaya Rm, Net dan Lobi boleh menggunakannya tanpa diubah. */
const P2P = {
  URL: 'https://cdn.jsdelivr.net/npm/peerjs@1.5.5/+esm',
  APP: 'ckm1',
  lib: null, loading: null, why: '', root: null,

  /* WebRTC hanya wujud di luar bingkai artifact, dan hanya pada asal yang selamat */
  avail() {
    try {
      if (typeof RTCPeerConnection === 'undefined') { this.why = 'Pelayar ini tidak menyokong WebRTC.'; return false }
      if (!(location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(location.hostname))) {
        this.why = 'Mod terus perlu halaman HTTPS.'; return false
      }
      return true;
    } catch (e) { return false }
  },

  async load() {
    if (this.lib) return this.lib;
    if (this.loading) return this.loading;
    this.loading = import(/* webpackIgnore: true */ this.URL)
      .then(m => (this.lib = m.Peer ? m : (m.default && m.default.Peer ? m.default : { Peer: m.default })))
      .catch(e => { this.why = 'Pustaka P2P gagal dimuatkan (perlu internet).'; this.loading = null; throw e });
    return this.loading;
  },

  /* ID PeerServer hanya menerima huruf, nombor, - dan _ */
  id(name) { return (this.APP + '-' + String(name)).replace(/[^A-Za-z0-9_-]/g, '-').slice(0, 60) },

  /* buat objek Peer; selesai apabila 'open' atau gagal dengan jenis ralat */
  _peer(Peer, wantId) {
    return new Promise((res, rej) => {
      let p;
      try { p = wantId ? new Peer(wantId) : new Peer() } catch (e) { return rej(e) }
      const done = (fn, v) => { clearTimeout(t); p.off && p.off('open', ok); p.off && p.off('error', bad); fn(v) };
      const ok = () => done(res, p);
      const bad = e => { const ty = (e && e.type) || 'network'; try { p.destroy() } catch (x) {} done(rej, Object.assign(new Error(ty), { type: ty })) };
      const t = setTimeout(() => bad({ type: 'timeout' }), 15000);
      p.on('open', ok); p.on('error', bad);
    });
  },

  /* ---- satu bilik, dibungkus menjadi ruang nama gaya Claude ---- */
  async _wrap(name) {
    const lib = await this.load();
    const Peer = lib.Peer;
    const hubId = this.id(name);

    let peer = null, isHub = false, hubConn = null;
    const conns = new Map();            /* id klien -> DataConnection (hos sahaja) */
    const pres = new Map();             /* id -> keadaan */
    const subs = {}, offs = [];
    let me = '', mine = {}, peerCb = [], connCb = [], dead = false;

    /* ---- sertai: cuba jadi hos, kalau tidak jadi klien ---- */
    const nap = ms => new Promise(r => setTimeout(r, ms));
    const seat = async (try_ = 0) => {
      try {
        peer = await P2P._peer(Peer, hubId);
        isHub = true; me = hubId;
      } catch (e) {
        if (e.type !== 'unavailable-id') throw e;
        /* Seseorang memegang ID hos. Ia mungkin baru sahaja menuntutnya dan
           belum bersedia menerima sambungan, atau ia mungkin sudah pergi dan
           tuntutannya belum luput. Kedua-duanya patut dicuba semula, bukan
           dilaporkan sebagai gagal. */
        try {
          peer = await P2P._peer(Peer, null);
          isHub = false; me = peer.id;
          hubConn = await link(hubId);
        } catch (e2) {
          try { peer && peer.destroy() } catch (x) {}
          peer = null; hubConn = null;
          if (dead || try_ >= 4) throw e2;
          await nap(500 + try_ * 700 + Math.random() * 400);
          return seat(try_ + 1);
        }
      }
      wire();
    };

    const link = idTo => new Promise((res, rej) => {
      const c = peer.connect(idTo, { reliable: true });
      const t = setTimeout(() => rej(new Error('timeout')), 15000);
      c.on('open', () => { clearTimeout(t); res(c) });
      c.on('error', e => { clearTimeout(t); rej(e) });
    });

    const wire = () => {
      peer.on('error', () => {});
      if (isHub) {
        peer.on('connection', c => {
          c.on('open', () => {
            conns.set(c.peer, c);
            /* beritahu pendatang tentang semua orang, dan semua orang tentangnya */
            c.send({ k: 'pr', from: me, v: mine });
            for (const [id, v] of pres) c.send({ k: 'pr', from: id, v });
            pushPeers(); for (const f of connCb) f();
          });
          c.on('data', d => hubRelay(c.peer, d));
          c.on('close', () => { conns.delete(c.peer); pres.delete(c.peer); pushPeers() });
        });
      } else {
        hubConn.on('data', d => take(d));
        hubConn.on('close', () => { if (!dead) reseat() });
        for (const f of connCb) f();
      }
    };

    /* hos: terima daripada seorang klien, hantar semula kepada yang lain */
    const hubRelay = (from, d) => {
      if (!d || typeof d !== 'object') return;
      d.from = from;
      if (d.k === 'pr') pres.set(from, d.v || {});
      for (const [id, c] of conns) if (id !== from) { try { c.send(d) } catch (e) {} }
      take(d);
    };

    const take = d => {
      if (!d || typeof d !== 'object' || d.from === me) return;
      if (d.k === 'pr') { pres.set(d.from, d.v || {}); pushPeers(); return }
      if (d.k === 'ev') fire(d.t, { data: d.d, peer: d.from, by: d.from, isMe: false, sameTab: false, kind: 'viewer', guest: false });
    };

    const out = d => {
      try {
        if (isHub) { for (const c of conns.values()) c.send(d) }
        else if (hubConn && hubConn.open) hubConn.send(d);
      } catch (e) {}
    };

    /* hos hilang: cuba ambil alih selepas jeda rawak supaya tidak berebut */
    const reseat = () => {
      pres.clear(); conns.clear(); hubConn = null; pushPeers();
      setTimeout(async () => {
        if (dead) return;
        try { peer.destroy() } catch (e) {}
        try { await seat(); if (Object.keys(mine).length) self.presence(mine); pushPeers() } catch (e) {}
      }, 400 + Math.random() * 1200);
    };

    const fire = (t, m) => { for (const f of (subs[t] || [])) { try { f(m) } catch (e) { console.error(e) } } };

    const list = () => {
      const o = [{ peer: me, by: me, isMe: true, sameTab: true, kind: 'viewer', guest: false, presence: mine }];
      for (const [id, v] of pres) if (id !== me) o.push({ peer: id, by: id, isMe: false, sameTab: false, kind: 'viewer', guest: false, presence: v });
      if (isHub) for (const id of conns.keys()) if (id !== me && !pres.has(id))
        o.push({ peer: id, by: id, isMe: false, sameTab: false, kind: 'viewer', guest: false, presence: {} });
      else if (hubConn && !pres.has(hubId) && hubId !== me)
        o.push({ peer: hubId, by: hubId, isMe: false, sameTab: false, kind: 'viewer', guest: false, presence: {} });
      return o;
    };

    /* Bilik Claude menghantar {peers, joined, left}; Net.roomPeers bergantung pada
       'joined' untuk menghantar pertukaran pahlawan & tetapan. */
    let prevIds = new Set();
    const pushPeers = () => {
      const ps = list(), ids = new Set(ps.map(p => p.peer));
      const joined = ps.filter(p => !prevIds.has(p.peer));
      const left = [...prevIds].filter(id => !ids.has(id))
        .map(id => ({ peer: id, by: id, isMe: false, sameTab: false, kind: 'viewer', guest: false, presence: {} }));
      prevIds = ids;
      const c = { peers: ps, joined, left };
      for (const f of peerCb) { try { f(c) } catch (e) {} }
    };
    const sync = () => {
      const ids = new Set(list().map(p => p.peer));
      if (ids.size !== prevIds.size || [...ids].some(x => !prevIds.has(x))) { pushPeers(); return true }
      return false;
    };
    const tick = setInterval(sync, 2000);
    offs.push(() => clearInterval(tick));

    await seat();

    const self = {
      kind: 'p2p', hub: () => isHub, me,
      _sync: sync,
      emit(topic, data) {
        out({ k: 'ev', t: topic, d: data, from: me });
        /* bilik Claude memulangkan mesej sendiri; tiru itu supaya UI sama */
        setTimeout(() => fire(topic, { data, peer: me, by: me, isMe: true, sameTab: true, kind: 'viewer', guest: false }), 0);
        return Promise.resolve();
      },
      on(topic, fn) {
        (subs[topic] = subs[topic] || []).push(fn);
        return () => { subs[topic] = (subs[topic] || []).filter(f => f !== fn) };
      },
      presence(patch) {
        mine = Object.assign({}, mine, patch || {});
        out({ k: 'pr', v: mine, from: me });
        pushPeers();
        return Promise.resolve();
      },
      peers() { return list() },
      onPeers(fn) { peerCb.push(fn); setTimeout(() => pushPeers(), 0); return () => { peerCb = peerCb.filter(f => f !== fn) } },
      onConnection(fn) { connCb.push(fn); return () => { connCb = connCb.filter(f => f !== fn) } },
      connected() { return isHub ? conns.size > 0 : !!(hubConn && hubConn.open) },
      async join(sub) { return P2P._wrap(sub) },
      async leave() {
        dead = true;
        for (const f of offs) { try { f() } catch (e) {} }
        try { peer && peer.destroy() } catch (e) {}
      }
    };
    /* `me` ditetapkan selepas seat(); salin semula supaya betul */
    self.me = me;
    return self;
  },

  /* ruang nama lobi awam — satu untuk semua pemain */
  async ns() {
    if (this.root) return this.root;
    if (!this.avail()) return null;
    try { this.root = await this._wrap('lobi') }
    catch (e) {
      this.err = (e && (e.type || e.message)) || 'ralat';
      console.error('[P2P] gagal menyertai bilik:', e);
      this.why = 'Tidak dapat menyambung ke pelayan isyarat (' + this.err + ').';
      this.root = null;
    }
    return this.root;
  }
};
