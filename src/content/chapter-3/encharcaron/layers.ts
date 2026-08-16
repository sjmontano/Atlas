import type { RasterPgwLayer } from '../../../types/layer'
import { rasterLayer, CLOUD } from '../shared'
import { SWATCH } from '../../theme/swatches'

const PGW: readonly [number, number, number, number, number, number] = [
  0, 0.000035559180, 0.000035560332, 0, -76.801058760121, 2.743972429392,
]

export const LAYERS: RasterPgwLayer[] = [
  rasterLayer(
    'suarez1970',
    '1970',
    `${CLOUD}/v1764428583/geoImages/nq4xkltmzu1obibxz6sw.webp`,
    PGW,
    4960,
    8822,
    SWATCH.historico,
    10,
  ),
]
