import type { Layer, LayerGroup } from '@types/layer'
export const LAYERS: Record<string, Layer[]>
export const LAYER_GROUPS: Record<string, LayerGroup[]>
export function getMapLayers(mapId: string): Layer[] | null
export function getLayerGroups(mapId: string): LayerGroup[] | null
