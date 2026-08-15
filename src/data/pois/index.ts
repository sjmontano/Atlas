import type { Poi } from '../../types/poi.ts'
import { BREDUNCO_POIS } from './bredunco.ts'
import { FORMAS_PAISAJE_POIS } from './formas-paisaje.ts'
import { CAP2_VALLE_POIS } from './cap2-valle.ts'
import { CAP2_SUAREZ_POIS } from './cap2-suarez.ts'
import { CAP2_VILLA_RICA_POIS } from './cap2-villa-rica.ts'
import { CAP2_CALI_POIS } from './cap2-cali.ts'

export const POIS: Record<string, Poi[]> = {
  'chapter1-bredunco': BREDUNCO_POIS,
  'chapter1-formas-paisaje': FORMAS_PAISAJE_POIS,
  'chapter2-valle': CAP2_VALLE_POIS,
  'chapter2-suarez': CAP2_SUAREZ_POIS,
  'chapter2-villa-rica': CAP2_VILLA_RICA_POIS,
  'chapter2-cali': CAP2_CALI_POIS,
}

export function getPois(mapId: string): Poi[] | null {
  return POIS[mapId] ?? null
}
