/**
 * Atlas Pluriversal — Service Worker
 *
 * Estrategia cache-first para tiles XYZ (z6-z8 precache prioritario).
 * Los tiles z6-z8 cubren la vista inicial (~20 tiles) y se cachean en la
 * primera visita. En visitas posteriores o sin conexión, se sirven desde
 * cache instantáneamente (ver FACETA_2_TILES_PLAN.md §3.2).
 */

const CACHE_NAME = 'atlas-tiles-v1'
const TILE_PREFIX = '/assets/maps/tiles/mapas/'

self.addEventListener('install', () => {
  // Skip waiting para activar inmediatamente (nueva versión reemplaza a la anterior)
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  // Limpiar caches viejos
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
      ),
    ),
  )
  // Tomar control de todos los clientes sin esperar recarga
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Solo interceptar tiles del atlas
  if (!url.pathname.startsWith(TILE_PREFIX)) return
  if (!url.pathname.endsWith('.webp')) return

  event.respondWith(
    caches.match(event.request).then((cached) => {
      // Cache hit → servir de cache (instantáneo en visitas repetidas)
      if (cached) return cached

      // Cache miss → fetch de red y guardar en cache para la próxima
      return fetch(event.request).then((response) => {
        if (!response.ok || response.status !== 200) return response

        const cloned = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned))
        return response
      })
    }),
  )
})
