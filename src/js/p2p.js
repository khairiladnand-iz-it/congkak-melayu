/* ===== P2P: lobi & bilik terus antara pelayar, tanpa akaun dan tanpa pelayan =====
   Menggunakan Trystero (MIT) — isyarat melalui relay Nostr awam, data melalui WebRTC.
   Modul dimuatkan hanya apabila pemain membuka mod dalam talian, jadi permainan
   tetap berfungsi sepenuhnya tanpa internet.

   Ia menyamar sebagai ruang nama bilik Claude: emit/on/presence/peers/onPeers/
   onConnection/join, supaya Rm, Net dan Lobi boleh menggunakannya tanpa diubah. */
const P2P = {
  URL: 'https://cdn.jsdelivr.net/npm/trystero@0.27.0/+esm',
  APP: 'congkak-melayu-v1',
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
      .then(m => (this.lib = m))
      .catch(e => { this.why = 'Pustaka P2P gagal dimuatkan (perlu internet).'; this.loading = null; throw e });
    return this.loading;
  },

  /* langgan pendengar sama ada gaya panggilan atau gaya umpukan */
  _sub(o, k, fn) {
    try {
      const r = o[k](fn);
      if (typeof r === 'function') return r;
      if (r && typeof r.unsubscribe === 'function') return () => r.unsubscribe();
      return () => {};
    } catch (e) {
      try { o[k] = fn; return () => { try { o[k] = null } catch (x) {} } } catch (x) { return () => {} }
    }
  },

  /* ---- bungkus satu bilik Trystero menjadi ruang nama gaya Claude ---- */
  async _wrap(name) {
    const lib = await this.load();
    const room = lib.joinRoom({ appId: this.APP }, name);
    if (room.ready) { try { await room.ready } catch (e) {} }

    let me = '';
    try { const s = await room.getSelf(); me = s && (s.userId || s.peerId) || '' } catch (e) {}
    if (!me) { try { me = lib.selfId || '' } catch (e) {} }
    if (!me) me = 'p' + Math.random().toString(36).slice(2, 10);

    const acts = {}, subs = { }, offs = [];
    const pres = new Map();                 /* userId -> keadaan */
    const gone = new Set();                 /* yang sudah keluar: elak baris hantu */
    let mine = {}, peerCb = [], connCb = [], live = false;

    const act = t => {
      if (acts[t]) return acts[t];
      const a = acts[t] = room.makeAction(t.slice(0, 12));
      offs.push(this._sub(a, 'onMessage', (data, ctx) => {
        const id = (ctx && (ctx.userId || ctx.peerId)) || '';
        fire(t, { data, peer: id, by: id, isMe: false, sameTab: false, kind: 'viewer', guest: false });
      }));
      return a;
    };
    const fire = (t, m) => { for (const f of (subs[t] || [])) { try { f(m) } catch (e) { console.error(e) } } };

    const list = () => {
      const out = [{ peer: me, by: me, isMe: true, sameTab: true, kind: 'viewer', guest: false, presence: mine }];
      for (const [id, p] of pres) if (id !== me) out.push({ peer: id, by: id, isMe: false, sameTab: false, kind: 'viewer', guest: false, presence: p });
      try {
        for (const info of Object.values(room.getPeers() || {})) {
          const id = (info && info.userId) || '';
          if (id && id !== me && !pres.has(id) && !gone.has(id)) out.push({ peer: id, by: id, isMe: false, sameTab: false, kind: 'viewer', guest: false, presence: {} });
        }
      } catch (e) {}
      return out;
    };
    const pushPeers = () => { const c = { peers: list() }; for (const f of peerCb) { try { f(c) } catch (e) {} } };
    const pushConn = () => { for (const f of connCb) { try { f() } catch (e) {} } };

    /* keadaan pemain disiarkan melalui makeUserState bila ada, jika tidak melalui tindakan biasa */
    let st = null;
    try { st = room.makeUserState('pres', {}) } catch (e) { st = null }
    if (st) {
      offs.push(this._sub(st, 'onChange', (val, ctx) => {
        const id = (ctx && (ctx.userId || ctx.peerId)) || '';
        if (!id) return;
        if (ctx && ctx.removed) { pres.delete(id); gone.add(id) } else { pres.set(id, val || {}); gone.delete(id) }
        pushPeers();
      }));
      try { const all = st.getAll && st.getAll(); if (all) for (const [k, v] of Object.entries(all)) if (k !== me) pres.set(k, v) } catch (e) {}
    } else {
      offs.push(this._sub(act('pres'), 'onMessage', () => {}));
      subs['pres'] = [m => { pres.set(m.peer, m.data || {}); pushPeers() }];
    }

    offs.push(this._sub(room, 'onUserJoin', ctx => {
      live = true;
      const jid = (ctx && (ctx.userId || ctx.peerId)) || ''; if (jid) gone.delete(jid);
      /* beritahu pendatang baharu keadaan saya */
      if (st) { try { st.set(mine) } catch (e) {} } else { try { act('pres').send(mine) } catch (e) {} }
      pushPeers(); pushConn();
    }));
    offs.push(this._sub(room, 'onUserLeave', ctx => {
      const id = (ctx && (ctx.userId || ctx.peerId)) || '';
      if (id) { pres.delete(id); gone.add(id) }
      pushPeers();
    }));
    offs.push(this._sub(room, 'onError', () => {}));

    const self = {
      kind: 'p2p',
      me,
      emit(topic, data) {
        try { act(topic).send(data) } catch (e) { return Promise.reject(e) }
        /* bilik Claude memulangkan mesej sendiri; tiru itu supaya UI sama */
        setTimeout(() => fire(topic, { data, peer: me, by: me, isMe: true, sameTab: true, kind: 'viewer', guest: false }), 0);
        return Promise.resolve();
      },
      on(topic, fn) {
        act(topic);
        (subs[topic] = subs[topic] || []).push(fn);
        return () => { subs[topic] = (subs[topic] || []).filter(f => f !== fn) };
      },
      presence(patch) {
        mine = Object.assign({}, mine, patch || {});
        try { st ? st.set(mine) : act('pres').send(mine) } catch (e) {}
        pushPeers();
        return Promise.resolve();
      },
      peers() { return list() },
      onPeers(fn) { peerCb.push(fn); setTimeout(() => { try { fn({ peers: list() }) } catch (e) {} }, 0); return () => { peerCb = peerCb.filter(f => f !== fn) } },
      onConnection(fn) { connCb.push(fn); return () => { connCb = connCb.filter(f => f !== fn) } },
      connected() { try { return live || Object.keys(room.getPeers() || {}).length > 0 } catch (e) { return live } },
      async join(sub) { return P2P._wrap(P2P.APP + '-' + sub) },
      async leave() {
        for (const f of offs) { try { f() } catch (e) {} }
        try { await room.leave() } catch (e) {}
      }
    };
    return self;
  },

  /* ruang nama lobi awam — satu untuk semua pemain */
  async ns() {
    if (this.root) return this.root;
    if (!this.avail()) return null;
    try { this.root = await this._wrap(this.APP + '-lobi') } catch (e) { this.root = null }
    return this.root;
  }
};
