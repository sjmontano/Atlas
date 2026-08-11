import { BREDUNCO_POIS } from './bredunco.js'

export const POIS = {
  'chapter1-bredunco': BREDUNCO_POIS,
}

export function getPois(mapId) {
  return POIS[mapId] ?? null
}
