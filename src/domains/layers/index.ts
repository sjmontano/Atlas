/**
 * 🧱 DOMINIO LAYERS — API PÚBLICA
 * ================================
 * Capas vectoriales GeoJSON, visibilidad, opacidad, categorización.
 */

// Tipos geoespaciales
export type { GeoFeature, GeoLayer, LayerMetadata } from "./types/geo";

// Servicio de capas (para uso directo con instancia MapLibre)
export { LayerManager, createLayerManager } from "./services/LayerManager";
export type { LayerConfig, LayerState } from "./services/LayerManager";

// Hooks públicos
export { useGeoLayers } from "./hooks/useGeoLayers";
export type { UseGeoLayersOptions } from "./hooks/useGeoLayers";
export { useMapLayers } from "./hooks/useMapLayers";
export type {
    MapLayerOptions,
    UseMapLayersOptions
} from "./hooks/useMapLayers";

// Datos estáticos (categorías y metadatos — NO los GeoJSON crudos)
export {
    LAYER_CATEGORIES,
    LAYER_METADATA,
    LAYER_NAME_TO_ID,
    LAYER_SLUG_MAP,
    getAllLayerMetadata,
    getLayersByCategory,
    getMetadataByCategory,
    getMetadataById,
    getSlugById,
    hasLayer
} from "./data";

