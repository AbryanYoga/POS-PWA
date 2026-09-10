// Versi cache app-shell — ubah string ini saat rilis versi baru
const CACHE_VERSION = 'v1.0.1';
const CACHE_NAME = `app-shell-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline.html';

// Asset statis inti yang dicache saat install (App Shell)
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.webmanifest',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-maskable-192x192.png',
  '/icons/icon-maskable-512x512.png',
  '/icons/icon.svg',
];

// 1. Install Event: Pra-cache app shell & aktifkan segera
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  // Panggil skipWaiting() supaya service worker baru langsung aktif tanpa menunggu tab ditutup
  self.skipWaiting();
});

// 2. Activate Event: Bersihkan cache versi lama & klaim semua client aktif
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Menghapus cache usang:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        // Ambil kendali seluruh tab/client yang sedang terbuka seketika
        return self.clients.claim();
      })
  );
});

// 3. Fetch Event: Routing & Caching Strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // A. HANYA tangani request method GET (abaikan semua POST/Server Actions)
  if (request.method !== 'GET') {
    return;
  }

  // B. ZERO-CACHE UNTUK DATA BISNIS & OTENTIKASI:
  //    - API endpoints (/api/*)
  //    - NextAuth routes
  //    - Next.js RSC payload (_rsc)
  //    - Server actions & data transaksi
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_next/data/') ||
    url.pathname === '/login' ||
    url.searchParams.has('_rsc')
  ) {
    // Selalu ambil fresh data dari network
    return;
  }

  // C. HTML Navigation Requests (Halaman Web): Network-First dengan Fallback Offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedOffline = await cache.match(OFFLINE_URL);
        return cachedOffline || Response.error();
      })
    );
    return;
  }

  // D. Static Assets (JS Chunks, CSS, Images, Fonts, Icons):
  //    Stale-While-Revalidate untuk aset statis agar loading instan
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        // Fetch dari network untuk update cache di background
        const networkFetch = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const resToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, resToCache));
            }
            return networkResponse;
          })
          .catch(() => {
            // Jika fetch gagal saat offline, tidak ada masalah (sudah ditangani cache)
            return null;
          });

        // Kembalikan versi cache jika ada, jika belum ada tunggu network response
        return cachedResponse || networkFetch;
      })
    );
  }
});
