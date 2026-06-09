const CACHE = 'calor-design-pwa-v1';
const FILES = [
  './',
  './Calor_Design_Report_Generator_ver_01-2026_Full_Ukrainian_Localisation.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES.filter(f => !f.endsWith('.png') || false)))
      .catch(() => caches.open(CACHE).then(cache => cache.addAll([FILES[1], FILES[2]])))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    ))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(response => {
      if (response.ok && e.request.method === 'GET') {
        const clone = response.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
      }
      return response;
    }).catch(() => cached))
  );
});
