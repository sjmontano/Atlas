import type { LegendItem } from '../../../types/layer'
import { legenda } from '../shared'

export const LEGENDS: LegendItem[] = [
  legenda('el-buhido-leyenda-residuos', '2. Disposición de residuos', 'disposicionResiduos.svg', 10, 'Zonificación'),
  legenda('el-buhido-leyenda-entrada', '1. Entrada', 'entradaPredio.svg', 20, 'Zonificación'),
  legenda('el-buhido-leyenda-vivienda', '1. Vivienda y espacios asociados', 'viviendaEspaciosAsociados.svg', 30, 'Zonificación'),
  legenda('el-buhido-leyenda-animales', '4. Cría de animales', 'criaAnimales.svg', 40, 'Zonificación'),
  legenda('el-buhido-leyenda-bosques', '6. Bosques y áreas de conservación', 'bosqueAreaExtracion.svg', 50, 'Zonificación'),
  legenda('el-buhido-leyenda-cultivos', '9. Cultivos diversos', 'cultivoDiverso.svg', 60, 'Zonificación'),
  legenda('el-buhido-leyenda-transicion', '7. Zonas en transición', 'zonaTransicion.svg', 70, 'Zonificación'),
  legenda('el-buhido-leyenda-productivas', '10. Productivas especiales', 'productivasEspeciales.svg', 80, 'Zonificación'),
  legenda('el-buhido-leyenda-delimitacion', 'Delimitación', 'delimitacion.svg', 90, 'Zonificación'),
  legenda('el-buhido-leyenda-trocha', 'Trocha', 'trocha.svg', 100, 'Zonificación'),
]
