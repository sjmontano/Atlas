import type { LayerGroup } from '../../../types/layer.ts'

const g = (id: string, name: string, order: number): LayerGroup => ({ id, name, order })

export const WATER_GROUPS: LayerGroup[] = [
  g('mda-agua', 'El agua de arriba a abajo', 1),
  g('mda-acuiferos', 'Acuíferos', 2),
  g('mda-flujos', 'Flujos y zonas del acuífero', 3),
]
