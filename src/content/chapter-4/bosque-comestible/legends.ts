import type { LegendItem } from '../../../types/layer'
import { legenda } from '../shared'

export const LEGENDS: LegendItem[] = [
  legenda('bosque-comestible-leyenda-botadero-colchones', 'Botadero de colchones y escombros', 'botaderoColchon.svg', 10, 'Zonificación'),
  legenda('bosque-comestible-leyenda-botadero-escombros', 'Botadero de escombros y basura', 'botaderoEscombro.svg', 20, 'Zonificación'),
  legenda('bosque-comestible-leyenda-vertedero', 'Compuerta de vertimiento de aguas residuales', 'compuertaVertedero.svg', 30, 'Zonificación'),
  legenda('bosque-comestible-leyenda-quema', 'Quema de basuras', 'zonaBasura.svg', 40, 'Zonificación'),
  legenda('bosque-comestible-leyenda-cuerpo-agua', 'Cuerpo de agua', 'cuerpoAgua2.svg', 50, 'Zonificación'),
  legenda('bosque-comestible-leyenda-colmatada', 'Zona colmatada', 'zonaColmatada.svg', 60, 'Zonificación'),
]
