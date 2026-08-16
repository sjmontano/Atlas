import type { LegendItem } from '../../../types/layer'
import { legenda } from '../shared'

export const LEGENDS: LegendItem[] = [
  legenda('la-caicedo-leyenda-residuos', '2. Disposición de residuos', 'dispocisionResiduos2.svg', 10, 'Zonificación'),
  legenda('la-caicedo-leyenda-entrada', '1. Entrada finca', 'entradaPredio.svg', 20, 'Zonificación'),
  legenda('la-caicedo-leyenda-vivienda', '1. Vivienda y espacios asociados', 'viviendaEspaciosAsociados.svg', 30, 'Zonificación'),
  legenda('la-caicedo-leyenda-animales', '4. Cría de animales', 'criaAnimales.svg', 40, 'Zonificación'),
  legenda('la-caicedo-leyenda-transformacion', '5. Transformación productiva', 'transformacionProductiva.svg', 50, 'Zonificación'),
  legenda('la-caicedo-leyenda-transicion', '7. Zonas en transición', 'zonaTransicion.svg', 60, 'Zonificación'),
  legenda('la-caicedo-leyenda-cultivos', '9. Cultivos diversos', 'cultivoDiverso.svg', 70, 'Zonificación'),
  legenda('la-caicedo-leyenda-delimitacion', 'Delimitación', 'delimitacion.svg', 80, 'Zonificación'),
  legenda('la-caicedo-leyenda-via', 'Vía', 'trocha.svg', 90, 'Zonificación'),
]
