// PixelPress Service Worker
// Caches the app shell + CDN assets on first load, serves from cache when offline

const CACHE_NAME = 'pixelpress-v6';

// All resources to pre-cache on install
const PRECACHE_URLS = [
  './',
  './index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
];

// ── INSTALL: cache everything we need ──────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      // Cache local files immediately
      await cache.addAll(['./index.html']);

      // Cache CDN assets individually (don't fail install if one is unreachable)
      const cdnUrls = [
        'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
      ];

      await Promise.allSettled(
        cdnUrls.map(url =>
          fetch(url, { mode: 'cors' })
            .then(res => { if (res.ok) cache.put(url, res); })
            .catch(() => {}) // silently fail — will be cached on first online visit
        )
      );
    })
  );
  // Activate immediately without waiting for old SW to die
  self.skipWaiting();
});

// ── ACTIVATE: remove old caches ────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ── FETCH: cache-first for CDN assets, network-first for HTML ──────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip chrome-extension and non-http requests
  if (!url.protocol.startsWith('http')) return;

  const isCDN = url.hostname.includes('cdnjs') ||
                url.hostname.includes('fonts.googleapis') ||
                url.hostname.includes('fonts.gstatic');

  const isHTML = event.request.headers.get('accept')?.includes('text/html');

  if (isCDN) {
    // Cache-first: serve from cache, fall back to network and update cache
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => new Response('/* offline */', { headers: { 'Content-Type': 'text/javascript' } }));
      })
    );
  } else if (isHTML) {
    // Network-first for HTML: try to get fresh copy, fall back to cache
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request) || caches.match('./index.html'))
    );
  } else {
    // Stale-while-revalidate for everything else
    event.respondWith(
      caches.match(event.request).then(cached => {
        const networkFetch = fetch(event.request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => cached);
        return cached || networkFetch;
      })
    );
  }
});
