const CACHE_NAME = 'dog-cache-v2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './dogApi.js',
  './dog-card.js',
  './app-banner.js',
  './manifest.json',
  './icons/dog.png',
  './images/icons/icon-72x72.png',
  './images/icons/icon-96x96.png',
  './images/icons/icon-128x128.png',
  './images/icons/icon-144x144.png',
  './images/icons/icon-152x152.png',
  './images/icons/icon-192x192.png',
  './images/icons/icon-384x384.png',
  './images/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(STATIC_ASSETS);
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

// Intercept HTTP requests
self.addEventListener('fetch', async e => {
  const req = e.request;
  const url = new URL(req.url);

  if (req.method !== 'GET') return;

  // For SPA-ish navigation requests, serve the cached shell if available.
  if (req.mode === 'navigate') {
    e.respondWith(returnCachedIfAvailable('./index.html'));
    return;
  }

  if (url.origin === location.origin) {
    // Is a local resource
    // (we have already cached them in the install event)
    e.respondWith(returnCachedIfAvailable(req));
  } else {
    // Is a external resource (like dog picture
    // from an API somewhere in the Internet)
    e.respondWith(fetchAndCache(req));
  }
});

async function returnCachedIfAvailable(req) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(req);
  // If there isn't anything cached, do the HTTP request
  return cached || fetch(req);
}

async function fetchAndCache(req) {
  const cache = await caches.open(CACHE_NAME);
  try {
    // Try to get a fresh version of the resource first
    const fresh = await fetch(req);
    // Update the cache with fresh version (opaque is common for <img> fetches)
    if (fresh && (fresh.ok || fresh.type === 'opaque')) {
      await cache.put(req, fresh.clone());
    }
    // return fresh version
    return fresh;
  } catch (e) {
    // If offline or error, send cached version
    const cached = await cache.match(req);
    return (
      cached ||
      new Response('Offline', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      })
    );
  }
}
