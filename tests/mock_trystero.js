/* Trystero tiruan yang menyambungkan dua tab melalui BroadcastChannel.
   API-nya sama persis dengan Trystero 0.27 (joinRoom, makeAction, makeUserState,
   onUserJoin, onUserLeave, getPeers, getSelf, leave), jadi SELURUH laluan
   P2P -> Rm -> Net -> Match diuji — semuanya kecuali pengangkutan Nostr/WebRTC.

   Disuntik oleh tests/online.py. Bukan sebahagian daripada keluaran. */
window.__trysteroMock = (() => {
  const uid = 'u' + Math.random().toString(36).slice(2, 8);

  const joinRoom = (cfg, roomId) => {
    const key = (cfg && cfg.appId || 'app') + '|' + roomId;
    const ch = new BroadcastChannel('mock:' + key);
    const peers = new Map();            /* userId -> peerId */
    const state = new Map();            /* ns -> Map(userId -> value) */
    const acts = new Map();             /* nama -> [cb] */
    const joinCb = [], leaveCb = [], errCb = [];
    const stateCb = new Map();          /* ns -> [cb] */
    let alive = true;

    const post = m => { if (alive) ch.postMessage(Object.assign({ from: uid }, m)) };

    ch.onmessage = e => {
      const m = e.data;
      if (!alive || !m || m.from === uid) return;

      if (m.k === 'hai' || m.k === 'oi') {
        const isNew = !peers.has(m.from);
        peers.set(m.from, 'p-' + m.from);
        /* kenalkan diri kepada pendatang baharu */
        if (m.k === 'hai') {
          post({ k: 'oi' });
          for (const [ns, map] of state) {
            const mine = map.get(uid);
            if (mine !== undefined) post({ k: 'st', ns, v: mine });
          }
        }
        if (isNew) for (const f of joinCb) f({ userId: m.from, peerId: 'p-' + m.from, roles: [] });
        return;
      }
      if (m.k === 'bai') {
        if (peers.delete(m.from)) {
          for (const map of state.values()) map.delete(m.from);
          for (const f of leaveCb) f({ userId: m.from, peerId: 'p-' + m.from });
        }
        return;
      }
      if (m.k === 'act') {
        if (m.target && m.target !== uid) return;
        for (const f of (acts.get(m.n) || []))
          f(m.d, { userId: m.from, peerId: 'p-' + m.from, self: false });
        return;
      }
      if (m.k === 'st') {
        let map = state.get(m.ns); if (!map) state.set(m.ns, map = new Map());
        map.set(m.from, m.v);
        for (const f of (stateCb.get(m.ns) || []))
          f(m.v, { userId: m.from, peerId: 'p-' + m.from, self: false, removed: false });
        return;
      }
    };

    const room = {
      ready: Promise.resolve(),
      async getSelf() { return { userId: uid, peerId: 'p-' + uid, roomId } },
      getPeers() { const o = {}; for (const [u, p] of peers) o[p] = { userId: u }; return o },
      makeAction(name) {
        return {
          send(d, opt) { post({ k: 'act', n: name, d, target: opt && opt.target }); return Promise.resolve() },
          onMessage(cb) {
            const a = acts.get(name) || []; a.push(cb); acts.set(name, a);
            return () => acts.set(name, (acts.get(name) || []).filter(f => f !== cb));
          }
        };
      },
      makeUserState(ns, init) {
        let map = state.get(ns); if (!map) state.set(ns, map = new Map());
        return {
          set(v) { map.set(uid, v); post({ k: 'st', ns, v }); return Promise.resolve() },
          get(u) { return map.get(u) },
          has(u) { return map.has(u) },
          clear() { map.delete(uid); return Promise.resolve() },
          getMeta() { return {} },
          getAll() { const o = {}; for (const [u, v] of map) o[u] = v; return o },
          onChange(cb) {
            const a = stateCb.get(ns) || []; a.push(cb); stateCb.set(ns, a);
            for (const [u, v] of map) if (u !== uid) cb(v, { userId: u, peerId: 'p-' + u, self: false });
            return () => stateCb.set(ns, (stateCb.get(ns) || []).filter(f => f !== cb));
          }
        };
      },
      onUserJoin(cb) { joinCb.push(cb); return () => joinCb.splice(joinCb.indexOf(cb), 1) },
      onUserLeave(cb) { leaveCb.push(cb); return () => leaveCb.splice(leaveCb.indexOf(cb), 1) },
      onError(cb) { errCb.push(cb); return () => {} },
      async leave() { post({ k: 'bai' }); alive = false; try { ch.close() } catch (e) {} }
    };

    post({ k: 'hai' });
    return room;
  };

  return { joinRoom, selfId: uid };
})();
