/**
 * 🎨 CONFIGURACIÓN DE ESTILOS VISUALES - ATLAS
 * ==========================================
 *
 * Configuraciones específicas de estilos visuales para cada mapa:
 * opacidad, colores de fondo, estilos de carga, etc.
 */

export interface MapStyleConfig {
  /** Opacidad de la imagen base georreferenciada (0.0 - 1.0) */
  rasterOpacity: number;
  /** Opacidad de la capa de tiles de alta resolución (0.0 - 1.0). Si se omite, usa rasterOpacity. */
  tileLayerOpacity?: number;
  /** Color de fondo del mapa */
  backgroundColor?: string;
  /** Configuraciones de estilo de pantalla de carga */
  loadingStyle?: {
    background: string;
    borderRadius: string;
    boxShadow: string;
    backdropFilter?: string;
  };
  /** Configuraciones de transiciones */
  transitions?: {
    fadeIn: boolean;
    duration: number;
    easing: string;
  };
}

/**
 * Configuraciones de estilo por mapa
 */
const mapStyleConfigs: Record<string, Partial<MapStyleConfig>> = {
  // ─── Variantes PGW (comparación) — imagen invisible, tiles expuestos ─────
  // La imagen se sigue georreferenciando (posición correcta) pero opacity=0
  // permite ver los tiles directamente y comparar el anclaje por variante.
  "intro-pgw-current": {
    rasterOpacity: 0,       // imagen base oculta
    tileLayerOpacity: 1.0,  // tiles visibles
    backgroundColor: "#0a0a0a",
  },
  "intro-pgw-transformed": {
    rasterOpacity: 0,
    tileLayerOpacity: 1.0,
    backgroundColor: "#0a0a0a",
  },
  "intro-pgw-v17": {
    rasterOpacity: 0,
    tileLayerOpacity: 1.0,
    backgroundColor: "#0a0a0a",
  },

  intro: {
    rasterOpacity: 1.0,
    backgroundColor: "#0a0a0a",
    transitions: {
      fadeIn: true,
      duration: 1000,
      easing: "ease-in-out",
    },
  },

  "chapter1-encuadres": {
    rasterOpacity: 1.0,
    backgroundColor: "#f8f9fa",
    transitions: {
      fadeIn: true,
      duration: 800,
      easing: "ease-out",
    },
  },

  "chapter2-valle": {
    rasterOpacity: 0.95,
    backgroundColor: "#e8f4f8",
    transitions: {
      fadeIn: true,
      duration: 1000,
      easing: "ease-in-out",
    },
  },

  "chapter2-suarez": {
    rasterOpacity: 1.0,
    backgroundColor: "#f0f8f0",
    transitions: {
      fadeIn: true,
      duration: 600,
      easing: "ease-out",
    },
  },

  "chapter2-cali": {
    rasterOpacity: 0.98,
    backgroundColor: "#fff8f0",
    transitions: {
      fadeIn: true,
      duration: 700,
      easing: "ease-in-out",
    },
  },

  "chapter2-villa-rica": {
    rasterOpacity: 1.0,
    backgroundColor: "#f8f0f8",
    transitions: {
      fadeIn: true,
      duration: 800,
      easing: "ease-out",
    },
  },
};

// Configuración por defecto
const defaultStyleConfig: MapStyleConfig = {
  rasterOpacity: 1.0,
  backgroundColor: "#ffffff",
  loadingStyle: {
    background: "rgba(255,255,255,0.95)",
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    backdropFilter: "blur(4px)",
  },
  transitions: {
    fadeIn: true,
    duration: 800,
    easing: "ease-out",
  },
};

export function getMapStyleConfig(mapId: string): MapStyleConfig {
  const specific = mapStyleConfigs[mapId] || {};
  return {
    ...defaultStyleConfig,
    ...specific,
    // Merge nested objects safely
    loadingStyle: {
      ...defaultStyleConfig.loadingStyle,
      ...(specific.loadingStyle || {}),
    } as Required<typeof defaultStyleConfig.loadingStyle>,
    transitions: {
      ...defaultStyleConfig.transitions,
      ...(specific.transitions || {}),
    } as Required<typeof defaultStyleConfig.transitions>,
  };
}
