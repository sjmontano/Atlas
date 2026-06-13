/**
 * 📐 HOOK DE BOUNDS GEOGRÁFICOS
 * ==============================
 *
 * Hook para calcular bounds geográficos desde datos PGW.
 * Usa boundsCalculator y memoiza resultados.
 */

import { useMemo } from "react";
import {
  processBounds,
  type BoundsCorrections,
  type GeographicBounds,
  type ImageCoordinates,
  type PGWData,
} from "../services/BoundsCalculator";
import type { ImageDimensions } from "./useMapDimensions";

export interface UseMapBoundsResult {
  /** Bounds geográficos [west, south, east, north] */
  bounds: GeographicBounds;
  /** Coordenadas para MapLibre image source [TL, TR, BR, BL] */
  coordinates: ImageCoordinates;
  /** Centro calculado [lng, lat] */
  center: [number, number];
  /** Si los bounds son válidos */
  isValid: boolean;
}

/**
 * Hook para calcular bounds geográficos
 *
 * @param pgwData - Datos PGW [a, d, b, e, c, f]
 * @param dimensions - Dimensiones de la imagen
 * @param corrections - Correcciones opcionales a aplicar
 * @returns Bounds, centro y validación
 *
 * @example
 * ```ts
 * const { bounds, center, isValid } = useMapBounds(
 *   [0.0001, 0, 0, -0.0001, -76.5, 3.5],
 *   { width: 2000, height: 1500 },
 *   { left: 0.01, right: -0.01 }
 * );
 *
 * if (!isValid) {
 *   console.error('Bounds inválidos');
 * }
 * ```
 */
export function useMapBounds(
  pgwData: PGWData,
  dimensions: ImageDimensions | null,
  corrections?: BoundsCorrections,
  mapId?: string,
): UseMapBoundsResult | null {
  // Memoizar cálculo de bounds
  const result = useMemo(() => {
    if (!dimensions) {
      return null;
    }

    const boundsResult = processBounds(
      pgwData,
      dimensions.width,
      dimensions.height,
      corrections,
      {
        mapId,
        source: "useMapBounds",
      },
    );

    return boundsResult;
  }, [pgwData, dimensions, corrections, mapId]);

  return result;
}
