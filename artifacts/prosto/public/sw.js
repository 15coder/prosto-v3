const CACHE_NAME = 'prosto-v1';

// الملفات التي تُحفظ عند التثبيت
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
];

// ── Install: حفظ الملفات الأساسية
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// ── Activate: حذف الكاش القديم
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch: Network-first للـ API، Cache-first لبقية الملفات
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // اتجاهات API تمر مباشرة للشبكة
  if (url.pathname.startsWith('/api/')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // حفظ نسخة في الكاش
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request)) // fallback للكاش عند انقطاع الإنترنت
  );
});
