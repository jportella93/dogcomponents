// IMPORTANT (Safari): never serve cached redirect responses from a Service Worker.
// Some static hosts redirect `./` (or `/`) -> `/index.html`; caching that 301/302 breaks Safari.
const cacheName = 'dog-v2';
const staticAssets = [
  './index.html',
  './style.css',
  './script.js',
  './dogApi.js',
  './dog-card.js',
  './app-banner.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      await precacheStaticAssets(cache, staticAssets);
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== cacheName).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', async e => {
  const req = e.request;
  const url = new URL(req.url);

  if (req.method !== 'GET') return;
  // Avoid intercepting navigations (Safari redirect + SW is fragile).
  if (req.mode === 'navigate') return;

  if (url.origin === location.origin) {
    e.respondWith(returnCachedIfAvailable(req));
  } else {
    e.respondWith(fetchAndCache(req));
  }
});

async function returnCachedIfAvailable(req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  if (cached && !isRedirectResponse(cached)) return cached;

  const fresh = await fetchAvoidingRedirectResponse(req);
  if (isCacheableSameOriginResponse(fresh)) {
    await cache.put(req, fresh.clone());
  }
  return fresh;
}

async function fetchAndCache(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetchAvoidingRedirectResponse(req);
    if (fresh && !isRedirectResponse(fresh) && (fresh.ok || fresh.type === 'opaque')) {
      await cache.put(req, fresh.clone());
    }
    return fresh;
  } catch (e) {
    const cached = await cache.match(req);
    return cached;
  }
}

function isRedirectResponse(res) {
  return Boolean(res && (res.redirected || res.type === 'opaqueredirect' || (res.status >= 300 && res.status < 400)));
}

function isCacheableSameOriginResponse(res) {
  return Boolean(res && !isRedirectResponse(res) && res.status === 200 && (res.type === 'basic' || res.type === 'cors'));
}

async function fetchAvoidingRedirectResponse(req) {
  const res = await fetch(req);
  if (!isRedirectResponse(res)) return res;

  if (res.url) {
    try {
      const directReq = new Request(res.url, { cache: 'no-store' });
      const directRes = await fetch(directReq);
      return directRes;
    } catch (_) {
      return res;
    }
  }

  return res;
}

async function precacheStaticAssets(cache, assets) {
  for (const asset of assets) {
    try {
      const req = new Request(asset, { cache: 'reload' });
      const res = await fetchAvoidingRedirectResponse(req);
      if (isCacheableSameOriginResponse(res)) {
        await cache.put(req, res.clone());
      }
    } catch (_) {
      // Ignore individual precache failures.
    }
  }
}
