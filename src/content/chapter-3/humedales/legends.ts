import type { LegendItem } from '../../../types/layer'
import { SWATCH } from '../../theme/swatches'
import { LEG_RIO_CAUCA, TEXTO_HUMEDALES } from '../shared'

export const LEGENDS: LegendItem[] = [
  { ...LEG_RIO_CAUCA('humedales-leyenda-rio-1970', 10), group: '1970' },
  { ...LEG_RIO_CAUCA('humedales-leyenda-rio-2022', 20), group: '2022' },
  {
    id: 'humedales-leyenda-rios-principales',
    name: 'Ríos principales',
    swatch: SWATCH.rio,
    order: 30,
  },
  {
    id: 'humedales-leyenda-represas',
    name: 'Represas',
    swatch: SWATCH.represa,
    order: 40,
  },
  {
    id: 'humedales-leyenda-humedales',
    name: 'Humedales',
    swatch: SWATCH.humedal,
    order: 50,
    longText: TEXTO_HUMEDALES,
  },
  {
    id: 'humedales-leyenda-zonas-urbanas',
    name: 'Zonas urbanas',
    swatch: SWATCH.zonaUrbana,
    order: 60,
  },
  {
    id: 'humedales-leyenda-diques-bordas',
    name: 'Diques y bordas',
    swatch: SWATCH.dique,
    order: 70,
  },
  {
    id: 'humedales-leyenda-curvas-nivel',
    name: 'Curvas de nivel',
    swatch: SWATCH.curvaNivel,
    order: 80,
  },
]
