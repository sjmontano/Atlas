import type { LegendItem } from '../../../types/layer'
import { legenda } from '../shared'

export const LEGENDS: LegendItem[] = [
  legenda('las-mercedes-leyenda-entrada', '1. Entrada a la finca', 'entradaPredio.svg', 10, 'Zonificación'),
  legenda('las-mercedes-leyenda-estanque', 'Estanque para peces que se dañó', 'estanque.svg', 20, 'Zonificación'),
  legenda('las-mercedes-leyenda-desechos', 'Zonas con desechos de plástico y botellas de alcohol', 'zonaDesecho.svg', 30, 'Zonificación'),
  legenda('las-mercedes-leyenda-vivienda', 'Vivienda y espacios asociados', 'viviendaEspaciosAsociados.svg', 40, 'Zonificación'),
  legenda('las-mercedes-leyenda-animales', 'Cría de animales', 'criaAnimales.svg', 50, 'Zonificación'),
  legenda('las-mercedes-leyenda-transicion', 'Zonas en transición', 'zonaTransicion.svg', 60, 'Zonificación'),
  legenda('las-mercedes-leyenda-cultivos', 'Cultivos diversos', 'cultivoDiverso2.svg', 70, 'Zonificación'),
  legenda('las-mercedes-leyenda-productivas', 'Productivas especiales', 'productivasEspeciales.svg', 80, 'Zonificación'),
  legenda('las-mercedes-leyenda-delimitacion', 'Finca Las Mercedes: límite', 'delimitacion.svg', 90, 'Zonificación'),
  legenda('las-mercedes-leyenda-trocha', 'Trocha', 'trocha.svg', 100, 'Zonificación'),
]
