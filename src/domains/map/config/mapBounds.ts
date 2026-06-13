/**
 * 🗺️ CONFIGURACIÓN SIMPLIFICADA DE BOUNDS - ATLAS
 * ==============================================
 */

export interface MapBoundsConfig {
  /** Correcciones manuales en grados geográficos (opcional) */
  corrections?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
}

// Configuraciones específicas solo cuando difieren del default
const mapBoundsConfigs: Record<string, MapBoundsConfig> = {
  "chapter1-encuadres": {
    corrections: { top: 0, left: 0, right: 0, bottom: 0 },
  },
  "chapter2-valle": {
    corrections: { top: 0.005, left: 0.01, right: -0.01 },
  },
};

// Defaults aplicados automáticamente
const DEFAULT_CONFIG: Required<MapBoundsConfig> = {
  corrections: {},
};

export function getMapBoundsConfig(mapId: string): Required<MapBoundsConfig> {
  const config = mapBoundsConfigs[mapId] || {};
  return { ...DEFAULT_CONFIG, ...config };
}
