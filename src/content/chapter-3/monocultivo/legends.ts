import type { LegendItem } from '../../../types/layer'
import { SWATCH } from '../../theme/swatches'
import { TEXTO_MONOCULTIVO } from '../shared'

export const LEGENDS: LegendItem[] = [
  {
    id: 'monocultivo-leyenda-rios-principales',
    name: 'Ríos principales',
    swatch: SWATCH.rio,
    order: 10,
  },
  {
    id: 'monocultivo-leyenda-rios-tributarios',
    name: 'Ríos tributarios',
    swatch: SWATCH.quebrada,
    order: 20,
  },
  {
    id: 'monocultivo-leyenda-represas',
    name: 'Represas',
    swatch: SWATCH.represa,
    order: 30,
  },
  {
    id: 'monocultivo-leyenda-zonas-urbanas',
    name: 'Zonas urbanas',
    swatch: SWATCH.zonaUrbana,
    order: 40,
  },
  {
    id: 'monocultivo-leyenda-red-vial',
    name: 'Red vial',
    swatch: SWATCH.via,
    order: 50,
  },
  {
    id: 'monocultivo-leyenda-fincas-tradicionales',
    name: 'Fincas tradicionales y cultivos diversos',
    swatch: SWATCH.finca,
    order: 60,
  },
  {
    id: 'monocultivo-leyenda-bosques',
    name: 'Bosques',
    swatch: SWATCH.bosque,
    order: 70,
  },
  {
    id: 'monocultivo-leyenda-monocultivos',
    name: 'Monocultivos (caña de azúcar)',
    swatch: SWATCH.monocultivo,
    order: 80,
    longText: TEXTO_MONOCULTIVO,
  },
]
