// Service Worker for ProWeb Studio PWA
// Version 1.0.0

const CACHE_NAME = 'prowebstudio-v1';
const STATIC_CACHE = 'prowebstudio-static-v1';
const DYNAMIC_CACHE = 'prowebstudio-dynamic-v1';
const THREE_CACHE = 'prowebstudio-three-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/assets/logo/logo-proweb-icon.svg',
  '/assets/logo/logo-proweb-lockup.svg',
  '/offline.html', // We'll create this
];

// Three.js and heavy assets to cache strategically
const THREE_ASSETS = [
  '/_next/static/chunks/three.js',
  // Three.js chunks will be dynamically identified and cached
];

// Routes to cache with stale-while-revalidate strategy
const CACHED_ROUTES = [
  '/',
  '/diensten',
  '/werkwijze',
  '/contact',
  '/speeltuin',
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== CACHE_NAME && 
              cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== THREE_CACHE
            ) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all pages
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip cross-origin requests (except for specific CDNs)
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  try {
    // Strategy 1: Cache First for static assets
    if (isStaticAsset(pathname)) {
      return await cacheFirst(request, STATIC_CACHE);
    }

    // Strategy 2: Stale While Revalidate for Three.js chunks
    if (isThreeAsset(pathname)) {
      return await staleWhileRevalidate(request, THREE_CACHE);
    }

    // Strategy 3: Network First for API calls
    if (pathname.startsWith('/api/')) {
      return await networkFirst(request, DYNAMIC_CACHE);
    }

    // Strategy 4: Stale While Revalidate for pages
    if (CACHED_ROUTES.includes(pathname) || pathname.startsWith('/_next/')) {
      return await staleWhileRevalidate(request, DYNAMIC_CACHE);
    }

    // Strategy 5: Network Only for everything else
    return await fetch(request);

  } catch (error) {
    console.log('Service Worker: Fetch failed, serving offline page:', error);
    
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      const offlineResponse = await caches.match('/offline.html');
      return offlineResponse || new Response('Offline', { status: 503 });
    }
    
    // Return a generic offline response for other requests
    return new Response('Offline', { status: 503 });
  }
}

// Cache strategies
async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  const cache = await caches.open(cacheName);
  cache.put(request, networkResponse.clone());
  return networkResponse;
}

async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(cacheName);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || Promise.reject(error);
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  const networkResponsePromise = fetch(request).then((networkResponse) => {
    cache.put(request, networkResponse.clone());
    return networkResponse;
  });
  
  return cachedResponse || networkResponsePromise;
}

// Utility functions
function isStaticAsset(pathname) {
  return (
    pathname.startsWith('/assets/') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.avif') ||
    pathname.includes('/manifest.json')
  );
}

function isThreeAsset(pathname) {
  return (
    pathname.includes('three') ||
    pathname.includes('@react-three') ||
    pathname.includes('chunks/three') ||
    pathname.includes('chunks/vendor') // Three.js often in vendor chunks
  );
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered:', event.tag);
  
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForm());
  }
});

async function syncContactForm() {
  // Get offline form submissions from IndexedDB
  // This would integrate with your contact form
  try {
    const offlineSubmissions = await getOfflineSubmissions();
    for (const submission of offlineSubmissions) {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });
      await removeOfflineSubmission(submission.id);
    }
  } catch (error) {
    console.log('Service Worker: Failed to sync contact form:', error);
  }
}

// Push notification support
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/assets/logo/logo-proweb-icon.svg',
    badge: '/assets/logo/logo-proweb-icon.svg',
    vibrate: [100, 50, 100],
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Open Website'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('ProWeb Studio', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/')
    );
  }
});

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PERFORMANCE_MARK') {
    console.log('Service Worker: Performance mark:', event.data.name, event.data.duration);
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Cache size management
async function cleanupCaches() {
  const cacheNames = await caches.keys();
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    // Limit cache size to prevent storage bloat
    if (requests.length > 100) {
      const oldestRequests = requests.slice(0, requests.length - 50);
      for (const request of oldestRequests) {
        await cache.delete(request);
      }
    }
  }
}

// Cleanup caches periodically
setInterval(cleanupCaches, 24 * 60 * 60 * 1000); // Daily cleanup

// IndexedDB helpers for offline functionality
async function getOfflineSubmissions() {
  // Implement IndexedDB operations for offline form storage
  return [];
}

async function removeOfflineSubmission(id) {
  // Implement IndexedDB delete operation
  return true;
}

console.log('Service Worker: Loaded successfully');
