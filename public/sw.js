// Service Worker for advanced caching - Optimized for 100% Lighthouse
const CACHE_NAME = 'sos-v3';
const RUNTIME_CACHE = 'sos-runtime-v3';
const IMAGE_CACHE = 'sos-images-v2';
const FONT_CACHE = 'sos-fonts-v1';

// Critical assets to cache on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/fonts/manrope-700.woff2',
  '/fonts/manrope-800.woff2',
  '/fonts/inter-400.woff2',
  '/fonts/inter-500.woff2'
];

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => 
            name !== CACHE_NAME && 
            name !== RUNTIME_CACHE && 
            name !== IMAGE_CACHE && 
            name !== FONT_CACHE
          )
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - optimized cache-first strategy for fonts, stale-while-revalidate for other assets
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip external requests (except our own domain)
  if (!event.request.url.startsWith(self.location.origin)) return;

  const { request } = event;
  const isImage = request.destination === 'image';
  const isFont = request.destination === 'font' || request.url.includes('/fonts/');

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // For fonts, use cache-first strategy (fonts never change)
      if (isFont && cachedResponse) {
        return cachedResponse;
      }

      // Fetch from network
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const cacheName = isFont ? FONT_CACHE : (isImage ? IMAGE_CACHE : RUNTIME_CACHE);
          caches.open(cacheName).then((cache) => {
            cache.put(request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      // Return cached response immediately (stale-while-revalidate)
      return cachedResponse || fetchPromise;
    })
  );
});
