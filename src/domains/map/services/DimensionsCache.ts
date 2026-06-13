/**
 * 🔇 DIMENSIONS CACHE — LRU con límite de 30 entradas
 * =====================================================
 * Reemplaza el Map sin límite de ImageDimensions.ts y el useRef local
 * duplicado en useMapDimensions.ts. Un único singleton compartido.
 *
 * Complejidad: O(1) get/set gracias a Map (orden de inserción garantizado).
 */

import type { ImageDimensions } from "./ImageDimensions";

const MAX_ENTRIES = 30;

class LRUDimensionsCache {
  private readonly store = new Map<string, ImageDimensions>();

  get(key: string): ImageDimensions | undefined {
    const value = this.store.get(key);
    if (value !== undefined) {
      // Re-insertar al final para refrescar posición LRU
      this.store.delete(key);
      this.store.set(key, value);
    }
    return value;
  }

  set(key: string, value: ImageDimensions): void {
    if (this.store.has(key)) {
      this.store.delete(key);
    } else if (this.store.size >= MAX_ENTRIES) {
      // Eliminar el más antiguo (primer elemento del Map)
      const oldest = this.store.keys().next().value;
      if (oldest !== undefined) this.store.delete(oldest);
    }
    this.store.set(key, value);
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  get size(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }
}

/** Singleton — compartido entre ImageDimensions.ts y useMapDimensions.ts */
export const dimensionsCache = new LRUDimensionsCache();
