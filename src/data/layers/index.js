import { CHAPTER1_ECOSYSTEMS_LAYERS } from './chapter1-ecosistemas.js'
import { ECOSYSTEMS_GROUPS } from './groups/ecosistemas.js'

export const LAYERS = {
  'chapter1-ecosistemas': CHAPTER1_ECOSYSTEMS_LAYERS,
}

export const LAYER_GROUPS = {
  'chapter1-ecosistemas': ECOSYSTEMS_GROUPS,
}

export function getMapLayers(mapId) {
  return LAYERS[mapId] ?? null
}

export function getLayerGroups(mapId) {
  return LAYER_GROUPS[mapId] ?? null
}
