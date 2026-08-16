import type { RasterPgwLayer } from '../../../types/layer'
import { rasterLayer, CLOUD } from '../shared'
import { SWATCH } from '../../theme/swatches'

const PGW: readonly [number, number, number, number, number, number] = [
  0, 0.000065247158, 0.000065249271, 0, -76.744923302940, 3.108582581431,
]

export const LAYERS: RasterPgwLayer[] = [
  rasterLayer(
    'cali1937-cuerpos-de-agua',
    'Cuerpos de agua',
    `${CLOUD}/v1764432532/geoImages/njp7ngydvrkqtcrkg8pm.webp`,
    PGW,
    4960,
    8822,
    SWATCH.rio,
    10,
    { group: 'cali-1937' },
  ),
  rasterLayer(
    'cali1937-area-urbana',
    'Área urbana',
    `${CLOUD}/v1764430100/geoImages/gfi90kqtutbhqgo1zc2m.png`,
    PGW,
    4960,
    8822,
    SWATCH.zonaUrbana,
    20,
    { group: 'cali-1937' },
  ),
]
