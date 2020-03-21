const cacheName = 'dog-cache-v1';
const staticAssets = [
  './index.html',
  './style.css',
  './app-banner.js',
  './dog-card.js',
  './dogApi.js',
  './manifest.json',
  './script.js'
]

self.addEventListener('install', async () => {
  const cache = await caches.open(cacheName);
  // cache all static assets
  await cache.addAll(staticAssets)
})

// Intercept HTTP requests
self.addEventListener('fetch', async e => {
  const req = e.request;
  const url = new URL(req.url);

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
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  // If there isn't anything cached, do the HTTP request
  return cached || fetch(req);
}

async function fetchAndCache(req) {
  const cache = await caches.open(cacheName);
  try {
    // Try to get a fresh version of the resource first
    const fresh = await fetch(req);
    // Update the cache with fresh version
    await cache.put(req, fresh.clone());
    // return fresh version
    return fresh;
  } catch (e) {
    // If offline or error, send cached version
    const cached = await cache.match(req);
    return cached;
  }
}
