// ANVG service worker.
// - Public pages: always try the internet first, and show the offline page if there is no connection.
// - Styling and script files: kept on the phone, because their names change on every new version.
// - Admin pages and Supabase data: never cached.
const VERSION = 'anvg-v1';
const STATIC_CACHE = `${VERSION}-static`;
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.add(OFFLINE_URL)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Delete caches from older versions.
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k.startsWith('anvg-') && k !== STATIC_CACHE).map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

// The page sends this message when the visitor taps Refresh on the update banner.
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Only handle GET requests for this website. Other websites (Supabase, images) go straight to the internet.
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Never touch the admin area.
  if (url.pathname.startsWith('/admin')) return;

  // Page visits: internet first, offline page if the connection fails.
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
    return;
  }

  // Built styling and script files: keep a copy on the phone.
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const hit = await cache.match(request);
        if (hit) return hit;
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      })
    );
  }
});
