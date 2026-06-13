/**
 * 🖼️ IMAGE DIMENSIONS SERVICE
 * ============================
 *
 * Servicio centralizado para cargar y cachear dimensiones de imágenes.
 * Proporciona funciones para obtener dimensiones automáticamente desde URLs.
 */

import { dimensionsCache } from "./DimensionsCache";
import { logger } from "./MapLogger";

export interface ImageDimensions {
  readonly width: number;
  readonly height: number;
}

/**
 * Caché de elementos HTMLImageElement ya cargados.
 * Permite que MapLibre reutilice la imagen como textura sin segunda descarga.
 */
const preloadedImages = new Map<string, HTMLImageElement>();

/** Devuelve el HTMLImageElement precargado para una ruta, si existe */
export function getPreloadedImage(path: string): HTMLImageElement | undefined {
  return preloadedImages.get(path);
}

/** Libera una imagen precargada de la memoria */
export function releasePreloadedImage(path: string): void {
  preloadedImages.delete(path);
  dimensionsCache["store"]?.delete(path); // limpia también el LRU si es necesario
}

/**
 * Carga una imagen y devuelve sus dimensiones.
 * Guarda el HTMLImageElement para que MapLibre pueda reutilizarlo
 * como textura sin realizar una segunda petición HTTP.
 * Usa crossOrigin="anonymous" para compatibilidad con canvas/WebGL.
 */
export async function loadImageDimensions(
  imageUrl: string,
): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    // Reutilizar imagen ya cargada si está disponible
    const existing = preloadedImages.get(imageUrl);
    if (existing?.complete && existing.naturalWidth > 0) {
      resolve({ width: existing.naturalWidth, height: existing.naturalHeight });
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous"; // necesario para canvas/WebGL/MapLibre

    img.onload = () => {
      preloadedImages.set(imageUrl, img);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };

    img.onerror = () => {
      reject(new Error(`No se pudo cargar la imagen: ${imageUrl}`));
    };

    img.src = imageUrl;
  });
}

/**
 * Obtiene dimensiones de imagen con caché LRU automático.
 * Segunda llamada con la misma URL es O(1) — sin petición de red.
 */
export async function getImageDimensions(
  imageUrl: string,
): Promise<ImageDimensions> {
  const cached = dimensionsCache.get(imageUrl);
  if (cached) {
    logger.debug(
      "dimensions",
      `cache hit (${cached.width}x${cached.height}): ${imageUrl}`,
    );
    return cached;
  }

  const dimensions = await loadImageDimensions(imageUrl);
  dimensionsCache.set(imageUrl, dimensions);
  logger.debug(
    "dimensions",
    `loaded (${dimensions.width}x${dimensions.height}): ${imageUrl}`,
  );
  return dimensions;
}

/**
 * Limpia el caché LRU (y el caché de HTMLImageElement).
 * Sin argumento limpia todo; con argumento limpia solo esa URL.
 */
export function clearDimensionsCache(imageUrl?: string): void {
  if (imageUrl) {
    preloadedImages.delete(imageUrl);
    dimensionsCache.clear();
    logger.debug("dimensions", `cache cleared for: ${imageUrl}`);
  } else {
    preloadedImages.clear();
    dimensionsCache.clear();
    logger.debug("dimensions", "cache fully cleared");
  }
}

/** Tamaño actual del caché LRU */
export function getCacheSize(): number {
  return dimensionsCache.size;
}

/** Precarga dimensiones en background sin bloquear */
export function preloadImageDimensions(imageUrls: string[]): void {
  for (const url of imageUrls) {
    if (!dimensionsCache.has(url)) {
      getImageDimensions(url).catch((err: unknown) => {
        logger.warn("dimensions", `preload failed: ${url}`, err);
      });
    }
  }
}

/** Carga dimensiones de múltiples imágenes en paralelo */
export async function loadMultipleImageDimensions(
  imageUrls: string[],
): Promise<Map<string, ImageDimensions>> {
  const results = new Map<string, ImageDimensions>();
  await Promise.all(
    imageUrls.map(async (url) => {
      try {
        results.set(url, await getImageDimensions(url));
      } catch (err: unknown) {
        logger.warn("dimensions", `failed to load ${url}`, err);
      }
    }),
  );
  return results;
}
