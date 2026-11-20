/* Congkak Melayu — service worker: main di luar talian, muat semula serta-merta */
const V = '__VERSION__';
const CACHE = 'congkak-' + V;
const SHELL = ['./', './index.html', './manifest.webmanifest',
               './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const url = new URL(r.url);

  /* jangan simpan isyarat rakan sebaya atau apa-apa yang bukan HTTP */
  if (!url.protocol.startsWith('http')) return;
  if (url.hostname.endsWith('.nostr.watch') || url.protocol === 'wss:') return;

  /* halaman: cuba rangkaian dahulu supaya versi baharu sampai, jatuh balik ke cache */
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put('./index.html', copy));
      return res;
    }).catch(() => caches.match('./index.html')));
    return;
  }

  /* selebihnya: cache dahulu, kemudian rangkaian (termasuk CDN three.js) */
  e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => {
    if (res && (res.ok || res.type === 'opaque')) {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(r, copy));
    }
    return res;
  }).catch(() => hit)));
});
