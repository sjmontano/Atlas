import type { LegendItem } from '../../../types/layer'
import { SWATCH } from '../../theme/swatches'
import { LEG_RIO_CAUCA } from '../shared'

export const LEGENDS: LegendItem[] = [
  LEG_RIO_CAUCA('arcilla-leyenda-rio-cauca', 10),
  {
    id: 'arcilla-leyenda-fincas-tradicionales',
    name: 'Fincas tradicionales, cultivos diversos y bosques',
    swatch: SWATCH.finca,
    order: 20,
  },
  {
    id: 'arcilla-leyenda-titulo-minero',
    name: 'Título minero vigente',
    swatch: SWATCH.tituloMinero,
    order: 30,
  },
  {
    id: 'arcilla-leyenda-veredas',
    name: 'Veredas',
    swatch: SWATCH.zonaUrbana,
    order: 40,
  },
  {
    id: 'arcilla-leyenda-rios-quebradas',
    name: 'Ríos y quebradas',
    swatch: SWATCH.quebrada,
    order: 50,
  },
]
