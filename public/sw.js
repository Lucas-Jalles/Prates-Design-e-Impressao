// Service Worker for Prates Gráfica PWA
// Cache strategy: Stale-while-revalidate for assets, Network-first for API

const CACHE_NAME = 'prates-catalogo-v1';
const STATIC_ASSETS = [
  '/',
  '/categorias',
  '/carrinho',
  '/manifest.json',
];

const CACHE_STRATEGIES = {
  // Static assets - cache first
  static: 'cache-first',
  // API calls - network first with fallback
  api: 'network-first',
  // Images - stale while revalidate
  images: 'stale-while-revalidate',
  // Navigation - network first
  navigation: 'network-first',
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension, etc.
  if (!url.protocol.startsWith('http')) return;

  // Determine strategy based on request type
  const isAPI = url.pathname.startsWith('/api/');
  const isImage = request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|webp|svg|gif|ico)$/);
  const isNavigation = request.mode === 'navigate';
  const isStaticAsset = url.pathname.match(/\.(js|css|woff2?|ttf|eot)$/);

  let strategy;
  if (isAPI) strategy = 'network-first';
  else if (isImage) strategy = 'stale-while-revalidate';
  else if (isNavigation) strategy = 'network-first';
  else if (isStaticAsset) strategy = 'cache-first';
  else strategy = 'network-first';

  event.respondWith(handleRequest(request, strategy));
});

async function handleRequest(request, strategy) {
  const cache = await caches.open(CACHE_NAME);

  switch (strategy) {
    case 'cache-first': {
      const cached = await cache.match(request);
      if (cached) return cached;
      try {
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      } catch {
        return new Response('Offline', { status: 503 });
      }
    }

    case 'network-first': {
      try {
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      } catch {
        const cached = await cache.match(request);
        if (cached) return cached;
        // For navigation, return offline page
        if (request.mode === 'navigate') {
          return cache.match('/') || new Response('Offline', { status: 503 });
        }
        return new Response('Offline', { status: 503 });
      }
    }

    case 'stale-while-revalidate': {
      const cached = await cache.match(request);
      const fetchPromise = fetch(request).then((response) => {
        if (response.ok) cache.put(request, response.clone());
        return response;
      }).catch(() => cached);
      return cached || fetchPromise;
    }

    default:
      return fetch(request);
  }
}

// Background sync for offline actions (future enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-cart') {
    event.waitUntil(syncCart());
  }
});

async function syncCart() {
  // Future: sync cart to server when online
  console.log('[SW] Background sync triggered');
}

// Push notifications (future enhancement)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      data: data.url,
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.notification.data) {
    event.waitUntil(clients.openWindow(event.notification.data));
  }
});