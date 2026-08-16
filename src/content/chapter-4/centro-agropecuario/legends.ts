import type { LegendItem } from '../../../types/layer'
import { legenda } from '../shared'

export const LEGENDS: LegendItem[] = [
  legenda('centro-agropecuario-leyenda-aljibe', 'Cuerpos de agua - Aljibe', 'aljibe2.svg', 10, 'Zonificación'),
  legenda('centro-agropecuario-leyenda-hormiga', 'Nido de hormiga arriera', 'nidoHormiga.svg', 20, 'Zonificación'),
  legenda('centro-agropecuario-leyenda-vivienda', 'Vivienda y espacios asociados', 'viviendaEspaciosAsociados.svg', 30, 'Zonificación'),
  legenda('centro-agropecuario-leyenda-animales', 'Cría de animales', 'criaAnimales.svg', 40, 'Zonificación'),
  legenda('centro-agropecuario-leyenda-bosques', 'Bosques y áreas de conservación', 'bosqueAreaExtracion.svg', 50, 'Zonificación'),
  legenda('centro-agropecuario-leyenda-transicion', 'Zonas de transición', 'zonaTransicion.svg', 60, 'Zonificación'),
  legenda('centro-agropecuario-leyenda-cultivos', 'Cultivos diversos', 'cultivoDiverso.svg', 70, 'Zonificación'),
  legenda('centro-agropecuario-leyenda-productivas', 'Productivas especiales', 'productivasEspeciales.svg', 80, 'Zonificación'),
  legenda('centro-agropecuario-leyenda-delimitacion', 'Delimitación', 'delimitacion.svg', 90, 'Zonificación'),
  legenda('centro-agropecuario-leyenda-trocha', 'Trocha', 'trocha.svg', 100, 'Zonificación'),
]
