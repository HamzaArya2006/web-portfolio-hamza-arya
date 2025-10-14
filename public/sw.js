const CACHE_NAME = 'hamza-portfolio-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/scripts/main.js',
  '/src/styles/main.css',
  '/favicon.svg',
  '/manifest.json',
  '/pages/about.html',
  '/pages/blog.html',
  '/pages/contact.html',
  '/pages/services.html',
  '/pages/case-studies.html',
  '/pages/resume.html'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
