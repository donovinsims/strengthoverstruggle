// Service Worker for advanced caching strategy - Optimized for mobile
const CACHE_NAME = 'sos-v2';
const RUNTIME_CACHE = 'sos-runtime-v2';
const IMAGE_CACHE = 'sos-images-v1';

// Critical assets to cache on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json'
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
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE && name !== IMAGE_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - stale-while-revalidate strategy for optimal mobile performance
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  const { request } = event;
  const isImage = request.destination === 'image';

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Fetch from network in background
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const cacheName = isImage ? IMAGE_CACHE : RUNTIME_CACHE;
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
