// AUAPW LLC Service Worker
// Cache strategy: Network-first with cache fallback

const CACHE_VERSION = 'v1'
const CACHE_NAME = `auapw-${CACHE_VERSION}`

// Assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/globals.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
]

// Install event: precache essential assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...')
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Precaching assets')
      return cache.addAll(PRECACHE_ASSETS)
    })
  )
})

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => {
            console.log('[Service Worker] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          })
      )
    })
  )
})

// Fetch event: network-first strategy
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // API requests: network-first, fallback to cache
  if (request.url.includes('/api/') || request.url.includes('/product-images/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            // Cache successful API responses
            const cache = caches.open(CACHE_NAME)
            cache.then((c) => c.put(request, response.clone()))
          }
          return response
        })
        .catch(() => {
          // Fallback to cache on network error
          return caches.match(request)
        })
    )
    return
  }

  // HTML pages: network-first
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const cache = caches.open(CACHE_NAME)
            cache.then((c) => c.put(request, response.clone()))
          }
          return response
        })
        .catch(() => caches.match(request))
    )
    return
  }

  // Static assets: cache-first
  event.respondWith(
    caches
      .match(request)
      .then((response) => {
        if (response) {
          return response
        }

        return fetch(request).then((response) => {
          if (response.ok) {
            const cache = caches.open(CACHE_NAME)
            cache.then((c) => c.put(request, response.clone()))
          }
          return response
        })
      })
      .catch(() => {
        // Return offline page if available
        return caches.match('/offline.html')
      })
  )
})

// Background sync for offline support
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-intercom') {
    event.waitUntil(
      // Sync Intercom messages when connection is restored
      fetch('/api/intercom-sync').catch((err) => {
        console.log('[Service Worker] Intercom sync failed:', err)
      })
    )
  }
})

// Message handler for client communication
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

console.log('[Service Worker] Loaded')
