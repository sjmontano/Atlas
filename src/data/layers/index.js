import { CHAPTER1_ECOSYSTEMS_LAYERS } from './chapter1-ecosistemas.js'
import { ECOSYSTEMS_GROUPS } from './groups/ecosistemas.js'
import { CHAPTER1_WATER_LAYERS } from './chapter1-mosaicos-del-agua.js'
import { WATER_GROUPS } from './groups/mosaicos-del-agua.js'
import { CHAPTER1_URIOCAUCA_LAYERS } from './chapter1-un-rio-cauca.js'
import { URIOCAUCA_GROUPS } from './groups/un-rio-cauca.js'

export const LAYERS = {
  'chapter1-ecosistemas': CHAPTER1_ECOSYSTEMS_LAYERS,
  'chapter1-mosaicos-del-agua': CHAPTER1_WATER_LAYERS,
  'chapter1-un-rio-cauca': CHAPTER1_URIOCAUCA_LAYERS,
}

export const LAYER_GROUPS = {
  'chapter1-ecosistemas': ECOSYSTEMS_GROUPS,
  'chapter1-mosaicos-del-agua': WATER_GROUPS,
  'chapter1-un-rio-cauca': URIOCAUCA_GROUPS,
}

export function getMapLayers(mapId) {
  return LAYERS[mapId] ?? null
}

export function getLayerGroups(mapId) {
  return LAYER_GROUPS[mapId] ?? null
}
