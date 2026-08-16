import type { LegendItem } from '../../../types/layer'
import { legenda } from '../shared'

export const LEGENDS: LegendItem[] = [
  legenda('el-paso-leyenda-charco', 'Charco de baño', 'charcoBano.svg', 10, 'Zonificación'),
  legenda('el-paso-leyenda-zocavones', 'Zocavones de oro', 'zocabonOro.svg', 20, 'Zonificación'),
  legenda('el-paso-leyenda-entradas', 'Entradas al predio', 'entradaPredio.svg', 30, 'Zonificación'),
  legenda('el-paso-leyenda-extraccion-oro', 'Extracción de oro aluvión', 'extraccionOro.svg', 40, 'Zonificación'),
  legenda('el-paso-leyenda-bosques', '6. Bosques y áreas de conservación', 'bosqueAreaExtracion.svg', 50, 'Zonificación'),
  legenda('el-paso-leyenda-transicion', 'Zonas en transición', 'zonaTransicion.svg', 60, 'Zonificación'),
  legenda('el-paso-leyenda-pastoreo', '8. Pastoreo', 'pastoreo.svg', 70, 'Zonificación'),
  legenda('el-paso-leyenda-mineria', 'Minería', 'mineria.svg', 80, 'Zonificación'),
  legenda('el-paso-leyenda-cuerpos-agua', 'Cuerpos de agua', 'cuerposAgua.svg', 90, 'Zonificación'),
]
