import { logger } from "@map/services/MapLogger";
import maplibregl from "maplibre-gl";

/**
 * 🗂️ LAYER MANAGER SERVICE
 * ========================
 *
 * Servicio para gestionar capas de mapas dinámicamente.
 * Maneja visibilidad, opacidad, orden y agrupación de capas.
 */

export interface LayerConfig {
  /** ID único de la capa */
  id: string;
  /** Nombre descriptivo */
  name: string;
  /** Tipo de capa */
  type: "raster" | "geojson" | "vector" | "image";
  /** Categoría para agrupación */
  category?: string;
  /** Visible por defecto */
  visible?: boolean;
  /** Opacidad inicial (0-1) */
  opacity?: number;
  /** Orden z (mayor = encima) */
  zIndex?: number;
  /** Metadata adicional */
  metadata?: Record<string, unknown>;
}

export interface LayerState {
  id: string;
  visible: boolean;
  opacity: number;
  zIndex: number;
}

export class LayerManager {
  private map: maplibregl.Map;
  private layers: Map<string, LayerConfig>;
  private layerStates: Map<string, LayerState>;
  private lastOpacityLogged: Map<string, number>;

  constructor(map: maplibregl.Map) {
    this.map = map;
    this.layers = new Map();
    this.layerStates = new Map();
    this.lastOpacityLogged = new Map();
  }

  private shouldLogOpacity(layerId: string, opacity: number): boolean {
    const prev = this.lastOpacityLogged.get(layerId);

    if (
      prev === undefined ||
      opacity === 0 ||
      opacity === 1 ||
      Math.abs(prev - opacity) >= 0.08
    ) {
      this.lastOpacityLogged.set(layerId, opacity);
      return true;
    }

    return false;
  }

  /**
   * Registra una capa en el manager
   */
  registerLayer(config: LayerConfig): void {
    this.layers.set(config.id, config);
    this.layerStates.set(config.id, {
      id: config.id,
      visible: config.visible ?? true,
      opacity: config.opacity ?? 1,
      zIndex: config.zIndex ?? 0,
    });

    logger.log("layers", `📋 Capa registrada: ${config.name} (${config.id})`);
  }

  /**
   * Muestra u oculta una capa
   */
  setLayerVisibility(layerId: string, visible: boolean): void {
    const state = this.layerStates.get(layerId);
    if (!state) {
      logger.warn("layers", `Capa no encontrada: ${layerId}`);
      return;
    }

    state.visible = visible;

    if (this.map.getLayer(layerId)) {
      this.map.setLayoutProperty(
        layerId,
        "visibility",
        visible ? "visible" : "none",
      );
      logger.log("layers", `👁️ Capa ${layerId}: ${visible ? "visible" : "oculta"}`);
    }
  }

  /**
   * Cambia la opacidad de una capa
   */
  setLayerOpacity(layerId: string, opacity: number): void {
    const state = this.layerStates.get(layerId);
    const config = this.layers.get(layerId);

    if (!state || !config) {
      logger.warn("layers", `Capa no encontrada: ${layerId}`);
      return;
    }

    const clampedOpacity = Math.max(0, Math.min(1, opacity));
    state.opacity = clampedOpacity;

    if (this.map.getLayer(layerId)) {
      // Propiedad de opacidad según tipo de capa
      const opacityProperty =
        config.type === "raster"
          ? "raster-opacity"
          : config.type === "geojson" || config.type === "vector"
            ? "fill-opacity"
            : "raster-opacity";

      this.map.setPaintProperty(layerId, opacityProperty, clampedOpacity);

      // Si se ajusta la opacidad de la capa base georreferenciada,
      // replicar el mismo valor en las capas de tiles para mantener
      // consistencia visual entre preview (low-res) y detalle (tiles).
      if (layerId === "atlas-georef-layer") {
        const styleLayers = this.map.getStyle()?.layers ?? [];
        styleLayers
          .filter((l) => l.id.endsWith("-tiles-layer"))
          .forEach((l) => {
            if (this.map.getLayer(l.id)) {
              this.map.setPaintProperty(l.id, "raster-opacity", clampedOpacity);
            }
          });
      }

      if (this.shouldLogOpacity(layerId, clampedOpacity)) {
        logger.log("layers", `🎨 Opacidad de ${layerId}: ${clampedOpacity}`);
      }
    }
  }

  /**
   * Mueve una capa a una posición específica
   */
  moveLayer(layerId: string, beforeLayerId?: string): void {
    if (!this.map.getLayer(layerId)) {
      logger.warn("layers", `Capa no encontrada en el mapa: ${layerId}`);
      return;
    }

    this.map.moveLayer(layerId, beforeLayerId);
    logger.log(
      "layers",
      `↕️ Capa ${layerId} movida ${beforeLayerId ? `antes de ${beforeLayerId}` : "al tope"}`,
    );
  }

  /**
   * Obtiene todas las capas de una categoría
   */
  getLayersByCategory(category: string): LayerConfig[] {
    return Array.from(this.layers.values()).filter(
      (layer) => layer.category === category,
    );
  }

  /**
   * Obtiene el estado de una capa
   */
  getLayerState(layerId: string): LayerState | undefined {
    return this.layerStates.get(layerId);
  }

  /**
   * Obtiene todas las capas visibles
   */
  getVisibleLayers(): LayerConfig[] {
    return Array.from(this.layers.values()).filter((layer) => {
      const state = this.layerStates.get(layer.id);
      return state?.visible ?? false;
    });
  }

  /**
   * Obtiene todas las categorías únicas
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    this.layers.forEach((layer) => {
      if (layer.category) {
        categories.add(layer.category);
      }
    });
    return Array.from(categories);
  }

  /**
   * Alterna visibilidad de todas las capas de una categoría
   */
  toggleCategory(category: string, visible: boolean): void {
    const categoryLayers = this.getLayersByCategory(category);
    categoryLayers.forEach((layer) => {
      this.setLayerVisibility(layer.id, visible);
    });
    logger.log(
      "layers",
      `📂 Categoría ${category}: ${visible ? "visible" : "oculta"}`,
    );
  }

  /**
   * Obtiene información resumida de todas las capas
   */
  getLayersSummary(): {
    total: number;
    visible: number;
    categories: number;
    layers: Array<{
      id: string;
      name: string;
      visible: boolean;
      opacity: number;
      category?: string;
    }>;
  } {
    const visible = this.getVisibleLayers().length;
    const categories = this.getCategories().length;

    const layersInfo = Array.from(this.layers.values()).map((layer) => {
      const state = this.layerStates.get(layer.id)!;
      return {
        id: layer.id,
        name: layer.name,
        visible: state.visible,
        opacity: state.opacity,
        category: layer.category,
      };
    });

    return {
      total: this.layers.size,
      visible,
      categories,
      layers: layersInfo,
    };
  }

  /**
   * Muestra todas las capas
   */
  showAllLayers(): void {
    this.layers.forEach((layer) => {
      this.setLayerVisibility(layer.id, true);
    });
    logger.log("layers", "👁️ Todas las capas visibles");
  }

  /**
   * Oculta todas las capas
   */
  hideAllLayers(): void {
    this.layers.forEach((layer) => {
      this.setLayerVisibility(layer.id, false);
    });
    logger.log("layers", "🙈 Todas las capas ocultas");
  }

  /**
   * Limpia el manager
   */
  cleanup(): void {
    this.layers.clear();
    this.layerStates.clear();
    this.lastOpacityLogged.clear();
    logger.log("layers", "🧹 LayerManager limpiado");
  }
}

/**
 * Factory para crear LayerManager
 */
export function createLayerManager(map: maplibregl.Map): LayerManager {
  return new LayerManager(map);
}
