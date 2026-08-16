import type { LegendItem } from '../../../types/layer'
import { legenda } from '../shared'

export const LEGENDS: LegendItem[] = [
  legenda('asoyoge-leyenda-vivienda', '1. Vivienda y espacios asociados', 'viviendaEspaciosAsociados.svg', 10, 'Zonificación'),
  legenda('asoyoge-leyenda-transformacion', '5. Transformación productiva', 'transformacionProductiva.svg', 20, 'Zonificación'),
  legenda('asoyoge-leyenda-delimitacion', 'Delimitación', 'delimitacion.svg', 30, 'Zonificación'),
  legenda('asoyoge-leyenda-trocha', 'Trocha', 'trocha.svg', 40, 'Zonificación'),
]
