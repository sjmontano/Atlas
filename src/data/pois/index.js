import { BREDUNCO_POIS } from './bredunco.js'
import { FORMAS_PAISAJE_POIS } from './formas-paisaje.js'

export const POIS = {
  'chapter1-bredunco': BREDUNCO_POIS,
  'chapter1-formas-paisaje': FORMAS_PAISAJE_POIS,
}

export function getPois(mapId) {
  return POIS[mapId] ?? null
}
