import type { LegendItem } from '../../../types/layer'
import { SWATCH } from '../../theme/swatches'
import { LEG_RIO_CAUCA, TEXTO_CUERPOS_DE_AGUA } from '../shared'

export const LEGENDS: LegendItem[] = [
  { ...LEG_RIO_CAUCA('cali-deseca-leyenda-rio-cauca', 10), group: '2022' },
  {
    id: 'cali-deseca-leyenda-cuerpos-de-agua',
    name: 'Cuerpos de agua',
    swatch: SWATCH.rio,
    group: '2022',
    order: 20,
    longText: TEXTO_CUERPOS_DE_AGUA,
  },
  {
    id: 'cali-deseca-leyenda-area-urbana',
    name: 'Área urbana',
    swatch: SWATCH.zonaUrbana,
    group: '2022',
    order: 30,
  },
]
