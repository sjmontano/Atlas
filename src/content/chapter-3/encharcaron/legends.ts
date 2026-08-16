import type { LegendItem } from '../../../types/layer'
import { SWATCH } from '../../theme/swatches'
import { LEG_RIO_CAUCA, TEXTO_SALVAJINA } from '../shared'

export const LEGENDS: LegendItem[] = [
  { ...LEG_RIO_CAUCA('encharcaron-leyenda-rio-1970', 10), group: '1970' },
  {
    id: 'encharcaron-leyenda-construcciones-1970',
    name: 'Construcciones',
    swatch: SWATCH.construccion,
    group: '1970',
    order: 20,
  },
  {
    id: 'encharcaron-leyenda-vias-1970',
    name: 'Vías',
    swatch: SWATCH.via,
    group: '1970',
    order: 30,
  },
  {
    id: 'encharcaron-leyenda-quebradas-1970',
    name: 'Quebradas',
    swatch: SWATCH.quebrada,
    group: '1970',
    order: 40,
  },
  { ...LEG_RIO_CAUCA('encharcaron-leyenda-rio-2022', 50), group: '2022' },
  {
    id: 'encharcaron-leyenda-construcciones-2022',
    name: 'Construcciones',
    swatch: SWATCH.construccion,
    group: '2022',
    order: 60,
  },
  {
    id: 'encharcaron-leyenda-salvajina',
    name: 'Salvajina',
    swatch: SWATCH.represa,
    group: '2022',
    order: 70,
    longText: TEXTO_SALVAJINA,
  },
  {
    id: 'encharcaron-leyenda-red-hidrica',
    name: 'Red hídrica',
    swatch: SWATCH.quebrada,
    group: '2022',
    order: 80,
  },
]
