import type { PGWData } from '@services/BoundsCalculator'
import type { Layer } from '../../../types/layer'

const WATER_BASE = '/assets/maps/capas/mosaicos-del-agua'
const WATER_PGW: PGWData = [0, 0.000166382730, 0.000166392514, 0, -76.968456199726, 2.161908918459]
const WATER_W = 5846
const WATER_H = 10394

const waterLayer = (id: string, name: string, group: string, order: number, swatch: string, opacity: number = 0.8): Layer => ({
  id: `mda-${id}`,
  name,
  category: 'ecosystems',
  type: 'raster-pgw',
  image: `${WATER_BASE}/${id}.webp`,
  pgw: WATER_PGW,
  width: WATER_W,
  height: WATER_H,
  opacity,
  visibleByDefault: true,
  order,
  group,
  legend: { swatch, description: name },
})

export const LAYERS: Layer[] = [
  waterLayer('nubosidad', 'Nubosidad', 'mda-agua', 100, '#B1B2AE', 1),
  waterLayer('acuifero1', 'Acuífero del Valle del Cauca', 'mda-acuiferos', 200, '#7CB3B3'),
  waterLayer('acuifero2', 'Acuífero del Cauca', 'mda-acuiferos', 300, '#829D9D'),
  waterLayer('zonaDescarga', 'Descarga', 'mda-flujos', 400, '#6697B2'),
  waterLayer('zonaEquilibrio', 'Equilibrio', 'mda-flujos', 500, '#3DF4E8'),
  waterLayer('zonaRecarga', 'Recarga', 'mda-flujos', 600, '#8AF1CD'),
  waterLayer('zonaAcuifero', 'Zona con acuífero potencial sin estudio', 'mda-flujos', 700, '#9BD1C3'),
]
