/**
 * 🗺️ LIB/MAPLIBRE — Adaptador público de MapLibre GL JS
 * ========================================================
 * Encapsula la creación y destrucción de instancias MapLibre.
 * Si MapLibre GL cambia su API, solo se toca este directorio.
 */

export {
    createMapInstance,
    destroyMapInstance,
    registerMapEventHandlers
} from "./MapLibreAdapter";
export type { MapEventHandlers, MapInstanceOptions } from "./MapLibreAdapter";

