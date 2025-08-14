// Service Worker for aggressive caching and mobile optimization
const CACHE_NAME = 'redactoria-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Critical resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/favicon.ico',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json'
];

// Install event - cache critical resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", function (event) {
  const url = new URL(event.request.url);

  // Skip Google Ads and external services for faster loading
  if (url.hostname.includes('googlesyndication.com') ||
      url.hostname.includes('doubleclick.net') ||
      url.hostname.includes('google.com') ||
      url.hostname.includes('fundingchoicesmessages.google.com')) {
    return;
  }

  // Detectar solicitudes a localhost - API redirect
  if (url.host === "localhost:5000") {
    const newUrl = new URL(
      url.pathname,
      "https://academico3-production.up.railway.app"
    );

    const modifiedRequest = new Request(newUrl.toString(), {
      method: event.request.method,
      headers: event.request.headers,
      body: event.request.body,
      mode: "cors",
      credentials: event.request.credentials,
      redirect: event.request.redirect,
    });

    event.respondWith(fetch(modifiedRequest));
    return;
  }

  // API requests - network first with cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then(cache => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // Static assets - cache first for mobile performance
  if (event.request.destination === 'script' || 
      event.request.destination === 'style' ||
      event.request.destination === 'document' ||
      event.request.destination === 'image') {
    
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(event.request)
            .then(response => {
              if (response.status === 200) {
                const responseClone = response.clone();
                const cacheName = event.request.destination === 'document' ? DYNAMIC_CACHE : STATIC_CACHE;
                
                caches.open(cacheName)
                  .then(cache => cache.put(event.request, responseClone));
              }
              return response;
            });
        })
    );
    return;
  }

  // Default behavior for other requests
  event.respondWith(fetch(event.request));
});
