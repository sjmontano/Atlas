/**
 * 📏 HOOK DE DIMENSIONES DE IMAGEN
 * =================================
 *
 * Hook para cargar dimensiones de imágenes de forma asíncrona.
 * Cachea resultados para evitar recargas innecesarias.
 */

import { getErrorMessage } from "@shared/utils/errorUtils";
import { useCallback, useEffect, useState } from "react";
import {
  getImageDimensions,
  type ImageDimensions,
} from "../services/ImageDimensions";
import { logger } from "../services/MapLogger";

export type { ImageDimensions };

export interface UseMapDimensionsResult {
  dimensions: ImageDimensions | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Carga dimensiones de imagen con caché LRU automático (vía ImageDimensions.ts).
 * El caché local (useRef<Map>) fue eliminado — delega en el singleton centralizado.
 */
export function useMapDimensions(
  imagePath: string,
  initialDimensions?: ImageDimensions,
): UseMapDimensionsResult {
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(
    initialDimensions ?? null,
  );
  const [loading, setLoading] = useState(!initialDimensions && !!imagePath);
  const [error, setError] = useState<string | null>(null);

  const loadDimensions = useCallback(async () => {
    if (initialDimensions) {
      setDimensions(initialDimensions);
      setLoading(false);
      return;
    }
    if (!imagePath) return;

    setLoading(true);
    setError(null);

    try {
      const dims = await getImageDimensions(imagePath);

      if (
        !dims.width ||
        !dims.height ||
        !Number.isFinite(dims.width) ||
        !Number.isFinite(dims.height)
      ) {
        throw new Error(
          "Dimensiones inválidas (width/height deben ser números finitos positivos)",
        );
      }

      setDimensions(dims);
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      setError(msg);
      logger.error("hooks", `[useMapDimensions] ${msg}`);
    } finally {
      setLoading(false);
    }
  }, [imagePath, initialDimensions]);

  useEffect(() => {
    loadDimensions();
  }, [loadDimensions]);

  return { dimensions, loading, error, reload: loadDimensions };
}
