const CACHE_VERSION = 'v3';
const CACHE_STATIC = `hamza-static-${CACHE_VERSION}`;
const CACHE_ASSETS = `hamza-assets-${CACHE_VERSION}`;
const CACHE_IMAGES = `hamza-images-${CACHE_VERSION}`;
const CACHE_PAGES = `hamza-pages-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline.html';

const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json',
  OFFLINE_URL,
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_STATIC).then(cache => cache.addAll(urlsToCache)),
      self.skipWaiting()
    ])
  );
});

// Listen for skip waiting message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName.startsWith('hamza-') && 
              ![
                CACHE_STATIC, 
                CACHE_ASSETS, 
                CACHE_IMAGES, 
                CACHE_PAGES
              ].includes(cacheName)
            )
            .map(cacheName => {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      self.clients.claim()
    ])
  );
  
  // Notify clients about update
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'SW_ACTIVATED',
        version: CACHE_VERSION
      });
    });
  });
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Navigation requests: network-first with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_PAGES);
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          const cache = await caches.open(CACHE_PAGES);
          const cached = await cache.match(request);
          if (cached) return cached;
          
          // Return offline page if available
          const offlinePage = await cache.match(OFFLINE_URL);
          return offlinePage || new Response('Offline', { 
            status: 503, 
            statusText: 'Service Unavailable' 
          });
        }
      })()
    );
    return;
  }

  // Images: cache-first with stale-while-revalidate
  if (request.destination === 'image') {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_IMAGES);
        const cached = await cache.match(request);
        
        // Return cached version immediately
        if (cached) {
          // Update cache in background
          fetch(request).then(response => {
            if (response && response.status === 200) {
              cache.put(request, response.clone());
            }
          }).catch(() => {});
          return cached;
        }
        
        // Fetch and cache if not in cache
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          return new Response('Image unavailable', { 
            status: 503 
          });
        }
      })()
    );
    return;
  }

  // Static assets (JS, CSS, fonts): stale-while-revalidate
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_ASSETS);
        const cached = await cache.match(request);
        
        // Fetch from network in parallel
        const networkPromise = fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => undefined);
        
        // Return cached version immediately, or wait for network
        return cached || networkPromise;
      })()
    );
    return;
  }

  // Default: network-first with cache fallback
  event.respondWith(
    (async () => {
      try {
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.status === 200) {
          const cache = await caches.open(CACHE_ASSETS);
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        const cache = await caches.open(CACHE_ASSETS);
        return await cache.match(request) || new Response('Offline', { 
          status: 503 
        });
      }
    })()
  );
});

// Background sync for contact form retries
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-contact-form') {
    event.waitUntil(
      (async () => {
        // Get stored contact form submissions from IndexedDB
        const db = await openContactDB();
        const submissions = await getAllPendingSubmissions(db);
        
        for (const submission of submissions) {
          try {
            const response = await fetch('/api/contact', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(submission.data)
            });
            
            if (response.ok) {
              await deleteSubmission(db, submission.id);
            }
          } catch (error) {
            console.error('Failed to sync contact form:', error);
          }
        }
      })()
    );
  }
});

// Helper functions for IndexedDB (simplified)
async function openContactDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('contact-forms', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('submissions')) {
        db.createObjectStore('submissions', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

async function getAllPendingSubmissions(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['submissions'], 'readonly');
    const store = transaction.objectStore('submissions');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function deleteSubmission(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['submissions'], 'readwrite');
    const store = transaction.objectStore('submissions');
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
