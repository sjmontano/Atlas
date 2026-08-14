import { BREDUNCO_POIS } from './bredunco.js'
import { FORMAS_PAISAJE_POIS } from './formas-paisaje.js'
import { CAP2_VALLE_POIS } from './cap2-valle.js'
import { CAP2_SUAREZ_POIS } from './cap2-suarez.js'
import { CAP2_VILLA_RICA_POIS } from './cap2-villa-rica.js'
import { CAP2_CALI_POIS } from './cap2-cali.js'

export const POIS = {
  'chapter1-bredunco': BREDUNCO_POIS,
  'chapter1-formas-paisaje': FORMAS_PAISAJE_POIS,
  'chapter2-valle': CAP2_VALLE_POIS,
  'chapter2-suarez': CAP2_SUAREZ_POIS,
  'chapter2-villa-rica': CAP2_VILLA_RICA_POIS,
  'chapter2-cali': CAP2_CALI_POIS,
}

export function getPois(mapId) {
  return POIS[mapId] ?? null
}
