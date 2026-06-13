/**
 * 🗺️ DOMINIO MAP — API PÚBLICA
 * ================================
 * Solo lo exportado aquí puede importarse desde fuera del dominio.
 * Los internos (MapLogger, BoundsCalculator, ImageDimensions) son detalles.
 */

// Tipos públicos
export type { GeographicBounds, MapConfig } from "./config/mapConfig";
export type { CompleteMapConfig } from "./config/mapConfigProvider";
export type { MapSettings, TilesConfig } from "./config/mapSettings";

// Datos
export {
    getAllMapConfigs, getAvailableMapIds, getMapConfig, getMapsByChapter,
    getMapsByTerritory, validatePGWData
} from "./config/mapConfig";
export { ATLAS_MAP_DATA } from "./data/atlasMapData";

// Configuración completa (config + settings + bounds + styles)
export {
    clearConfigCache, getCompleteMapConfig
} from "./config/mapConfigProvider";
export { getMapSettings } from "./config/mapSettings";
export { getMapStyleConfig } from "./config/mapStyles";

// Renderizado
export {
    createMapRenderer,
    validateMapForRendering
} from "./services/MapRenderer";
export type { MapRenderer } from "./services/MapRenderer";

// Hooks
export { useAtlasMap } from "./hooks/useAtlasMap";
export type {
    UseAtlasMapOptions,
    UseAtlasMapResult
} from "./hooks/useAtlasMap";
export { useMapBounds } from "./hooks/useMapBounds";
export { useMapConfiguration } from "./hooks/useMapConfiguration";
export { useMapDimensions } from "./hooks/useMapDimensions";
export { useMapZoom } from "./hooks/useMapZoom";

