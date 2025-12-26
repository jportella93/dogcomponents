// IMPORTANT (Safari): never serve cached redirect responses from a Service Worker.
// Some static hosts redirect `./` (or `/`) -> `/index.html`; caching that 301/302 breaks Safari.
const CACHE_NAME = 'dog-cache-v3';
const STATIC_ASSETS = [
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
      // Avoid cache.addAll() because it will happily cache redirects.
      await precacheStaticAssets(cache, STATIC_ASSETS);
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
  if (cached && !isRedirectResponse(cached)) return cached;

  const fresh = await fetch(req);
  // Never cache redirects; only cache successful same-origin responses.
  if (isCacheableSameOriginResponse(fresh)) {
    await cache.put(req, fresh.clone());
  }
  return fresh;
}

async function fetchAndCache(req) {
  const cache = await caches.open(CACHE_NAME);
  try {
    // Try to get a fresh version of the resource first
    const fresh = await fetch(req);
    // Update the cache with fresh version (opaque is common for <img> fetches)
    if (fresh && !isRedirectResponse(fresh) && (fresh.ok || fresh.type === 'opaque')) {
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

function isRedirectResponse(res) {
  // `res.redirected` is true for followed redirects; `opaqueredirect` is explicit redirect type.
  return Boolean(res && (res.redirected || res.type === 'opaqueredirect' || (res.status >= 300 && res.status < 400)));
}

function isCacheableSameOriginResponse(res) {
  // Same-origin static assets should be basic/cors with status 200. Never cache redirects.
  return Boolean(res && !isRedirectResponse(res) && res.status === 200 && (res.type === 'basic' || res.type === 'cors'));
}

async function precacheStaticAssets(cache, assets) {
  for (const asset of assets) {
    try {
      // cache: 'reload' avoids an already-cached redirect being reused during install.
      const req = new Request(asset, { cache: 'reload' });
      const res = await fetch(req);
      if (isCacheableSameOriginResponse(res)) {
        await cache.put(req, res.clone());
      }
    } catch (_) {
      // Ignore individual precache failures (app still works online).
    }
  }
}
