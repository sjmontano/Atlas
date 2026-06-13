/**
 * 🗺️ GEO LAYER LOADER
 * ====================
 *
 * Servicio de carga lazy de capas geográficas.
 * Las geometrías GeoJSON se sirven como activos estáticos en
 * /assets/geo-layers/{slug}.json y se descargan solo cuando el
 * usuario activa esa capa por primera vez.
 *
 * Caché en memoria por sesión:
 *   - Primera activación: fetch HTTP
 *   - Siguientes activaciones: respuesta inmediata desde caché
 *   - Requests simultáneos del mismo slug: se comparte la misma Promise
 */

import type { GeoLayer } from "../types/geo";

/** URL base de los JSON de capas en public/ */
const BASE_URL = "/assets/geo-layers";

/** Caché permanente de la sesión: slug → GeoLayer */
const cache = new Map<string, GeoLayer>();

/** Deduplica requests simultáneos del mismo slug */
const pending = new Map<string, Promise<GeoLayer>>();

/**
 * Carga una capa geográfica por su slug.
 * Si ya está en caché, retorna inmediatamente.
 * Si hay un request en vuelo para el mismo slug, lo reutiliza.
 *
 * @param slug - Slug de la capa (ej. "rio-cauca")
 * @throws Error si el servidor retorna !ok
 */
export async function loadGeoLayer(slug: string): Promise<GeoLayer> {
  if (cache.has(slug)) return cache.get(slug)!;

  if (pending.has(slug)) return pending.get(slug)!;

  const promise = fetch(`${BASE_URL}/${slug}.json`)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status} — ${slug}.json`);
      return res.json() as Promise<GeoLayer>;
    })
    .then((data) => {
      cache.set(slug, data);
      pending.delete(slug);
      return data;
    })
    .catch((err) => {
      pending.delete(slug);
      throw err;
    });

  pending.set(slug, promise);
  return promise;
}

/**
 * Retorna la capa desde caché sin hacer fetch.
 * Útil para lecturas síncronas después de la primera carga.
 */
export function getLoadedGeoLayer(slug: string): GeoLayer | undefined {
  return cache.get(slug);
}

/** Precarga una lista de slugs en segundo plano sin bloquear. */
export function prefetchGeoLayers(slugs: string[]): void {
  for (const slug of slugs) {
    if (!cache.has(slug) && !pending.has(slug)) {
      loadGeoLayer(slug).catch(() => {
        /* silencioso — es prefetch, no crítico */
      });
    }
  }
}

/** Vacía el caché (útil en tests o cuando los datos cambian). */
export function clearGeoLayerCache(): void {
  cache.clear();
}

/** Cuántas capas hay cargadas en memoria ahora. */
export function getCachedLayerCount(): number {
  return cache.size;
}
