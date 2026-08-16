import type { LegendItem } from '../../../types/layer'
import { legenda } from '../shared'

export const LEGENDS: LegendItem[] = [
  legenda('los-bajios-leyenda-aljibe', 'Cuerpos de agua - Aljibe', 'aljibe.svg', 10, 'Zonificación'),
  legenda('los-bajios-leyenda-huerta', 'Huerta', 'huertas.svg', 20, 'Zonificación'),
  legenda('los-bajios-leyenda-construccion', 'Construcción', 'construccion.svg', 30, 'Zonificación'),
  legenda('los-bajios-leyenda-cultivos', 'Cultivos diversos', 'cultivoDiverso.svg', 40, 'Zonificación'),
  legenda('los-bajios-leyenda-delimitacion', 'Delimitación', 'delimitacion.svg', 50, 'Zonificación'),
  legenda('los-bajios-leyenda-trocha', 'Trocha', 'trocha.svg', 60, 'Zonificación'),
]
