import type { Layer, LayerGroup } from '../../types/layer.ts'
import { CHAPTER1_ECOSYSTEMS_LAYERS } from './chapter1-ecosistemas.ts'
import { ECOSYSTEMS_GROUPS } from './groups/ecosistemas.ts'
import { CHAPTER1_WATER_LAYERS } from './chapter1-mosaicos-del-agua.ts'
import { WATER_GROUPS } from './groups/mosaicos-del-agua.ts'
import { CHAPTER1_URIOCAUCA_LAYERS } from './chapter1-un-rio-cauca.ts'
import { URIOCAUCA_GROUPS } from './groups/un-rio-cauca.ts'
import {
  CAP2_VALLE_LAYERS,
  CAP2_M_SUAREZ_LAYERS,
  CAP2_M_VILLA_RICA_LAYERS,
  CAP2_M_ORIENTE_CALI_LAYERS,
} from './cap2-nodos.ts'

export const LAYERS: Record<string, Layer[]> = {
  'chapter1-ecosistemas': CHAPTER1_ECOSYSTEMS_LAYERS,
  'chapter1-mosaicos-del-agua': CHAPTER1_WATER_LAYERS,
  'chapter1-un-rio-cauca': CHAPTER1_URIOCAUCA_LAYERS,
  'chapter2-valle': CAP2_VALLE_LAYERS,
  'chapter2-m-suarez': CAP2_M_SUAREZ_LAYERS,
  'chapter2-m-villa-rica': CAP2_M_VILLA_RICA_LAYERS,
  'chapter2-m-oriente-cali': CAP2_M_ORIENTE_CALI_LAYERS,
}

export const LAYER_GROUPS: Record<string, LayerGroup[]> = {
  'chapter1-ecosistemas': ECOSYSTEMS_GROUPS,
  'chapter1-mosaicos-del-agua': WATER_GROUPS,
  'chapter1-un-rio-cauca': URIOCAUCA_GROUPS,
}

export function getMapLayers(mapId: string): Layer[] | null {
  return LAYERS[mapId] ?? null
}

export function getLayerGroups(mapId: string): LayerGroup[] | null {
  return LAYER_GROUPS[mapId] ?? null
}
