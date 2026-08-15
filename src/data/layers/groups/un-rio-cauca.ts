import type { LayerGroup } from '../../../types/layer.ts'

const g = (id: string, name: string, order: number): LayerGroup => ({ id, name, order })

export const URIOCAUCA_GROUPS: LayerGroup[] = [
  g('urc-1', 'Parteaguas, estrellas fluviales, macizos y cordilleras', 1),
  g('urc-2', 'Planicies', 2),
  g('urc-3', 'Aguas superficiales', 3),
  g('urc-4', 'Páramos, nivales y volcanes', 4),
  g('urc-5', 'Alto, Medio y Bajo Cauca', 5),
  g('urc-6', 'Vías principales, proyectadas y caminos alternos', 6),
  g('urc-7', 'Áreas metropolitanas', 7),
]
