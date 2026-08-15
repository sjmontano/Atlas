import type { LayerGroup } from '../../../types/layer'

const g = (id: string, name: string, order: number): LayerGroup => ({ id, name, order })

export const GROUPS: LayerGroup[] = [
  g('eco-1.1', '1.1 Litoral y aguas poco profundas', 1),
  g('eco-1.2', '1.2 Vegetación de baja altura', 2),
  g('eco-1.3', '1.3 Bosques', 3),
  g('eco-1.4', '1.4 Altas cumbres', 4),
  g('eco-2.1', '2.1 Intervenciones moderadas', 5),
  g('eco-2.2', '2.2 Agricultura y ganadería', 6),
  g('eco-2.3', '2.3 Intervenciones severas', 7),
  g('eco-3', '3 Sin información', 8),
]
