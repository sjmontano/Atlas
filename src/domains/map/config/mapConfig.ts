/**
 * ⚙️ CONFIGURACIÓN Y LÓGICA DE MAPAS - ATLAS
 * ==========================================
 *
 * Interfaces, tipos y funciones utilitarias para mapas georreferenciados
 */

import { ATLAS_MAP_DATA } from "../data/atlasMapData.ts";
import {
  calculateGeographicBounds as calculateGeographicBoundsFromPgw,
  processBounds as processBoundsFromPgw,
  type PGWData,
} from "../services/BoundsCalculator";

/**
 * Interfaz para configuración de un mapa
 */
export interface MapConfig {
  id: string;
  name: string;
  description: string;
  imagePath: string;
  /** Imagen ligera (~50KB) para carga inmediata como base raster. Los tiles se muestran encima. */
  lowResImagePath?: string;
  pgwData: [number, number, number, number, number, number]; // [a, d, b, e, c, f]
  dimensions?: {
    // OPCIONAL: se calcula automáticamente si no se provee
    width: number;
    height: number;
  };
  chapter?: number;
  territory?: string;
}

/**
 * Tipo para los bounds geográficos [west, south, east, north]
 */
export type GeographicBounds = [number, number, number, number];

/**
 * Configuración completa de mapas (datos + tipado)
 */
export const ATLAS_MAP_CONFIGS: Record<string, MapConfig> = ATLAS_MAP_DATA;

/**
 * Convierte datos PGW a bounds geográficos [west, south, east, north]
 *
 * @param pgwData - Array con datos PGW [a, d, b, e, c, f]
 * @param width - Ancho de la imagen en píxeles
 * @param height - Alto de la imagen en píxeles
 * @returns Bounds geográficos [west, south, east, north]
 */
export function calculateGeographicBounds(
  pgwData: readonly [number, number, number, number, number, number],
  width: number,
  height: number,
): GeographicBounds {
  return calculateGeographicBoundsFromPgw(pgwData as PGWData, width, height);
}

/**
 * Procesa bounds con correcciones opcionales
 */
export function processBounds(
  pgwData: readonly [number, number, number, number, number, number],
  width: number,
  height: number,
  corrections: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  } = {},
): GeographicBounds {
  const result = processBoundsFromPgw(
    pgwData,
    width,
    height,
    {
      top: corrections.top,
      bottom: corrections.bottom,
      left: corrections.left,
      right: corrections.right,
    },
  );

  return result.bounds;
}

/**
 * Valida que los datos PGW sean válidos
 */
export function validatePGWData(pgwData: readonly number[]): boolean {
  return (
    pgwData.length === 6 &&
    pgwData.every((value) => typeof value === "number" && !isNaN(value))
  );
}

/**
 * Obtiene configuración de un mapa por ID
 */
export const getMapConfig = (mapId: string): MapConfig | undefined => {
  return ATLAS_MAP_CONFIGS[mapId];
};

/**
 * Obtiene todos los mapas de un capítulo
 */
export const getMapsByChapter = (chapter: number): MapConfig[] => {
  return Object.values(ATLAS_MAP_CONFIGS).filter(
    (map) => map.chapter === chapter,
  );
};

/**
 * Obtiene mapas por territorio
 */
export const getMapsByTerritory = (territory: string): MapConfig[] => {
  return Object.values(ATLAS_MAP_CONFIGS).filter(
    (map) => map.territory === territory,
  );
};

/**
 * Lista todos los IDs de mapas disponibles
 */
export const getAvailableMapIds = (): string[] => {
  return Object.keys(ATLAS_MAP_CONFIGS);
};

/**
 * Lista todos los mapas configurados
 */
export const getAllMapConfigs = (): MapConfig[] => {
  return Object.values(ATLAS_MAP_CONFIGS);
};

/**
 * Obtiene mapas por filtros múltiples
 */
export const getMapsByFilters = (filters: {
  chapter?: number;
  territory?: string;
  hasValidPGW?: boolean;
}): MapConfig[] => {
  return Object.values(ATLAS_MAP_CONFIGS).filter((map) => {
    if (filters.chapter && map.chapter !== filters.chapter) return false;
    if (filters.territory && map.territory !== filters.territory) return false;
    if (filters.hasValidPGW !== undefined) {
      const isValid = validatePGWData(map.pgwData);
      if (filters.hasValidPGW !== isValid) return false;
    }
    return true;
  });
};
