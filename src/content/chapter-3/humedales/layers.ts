import type { RasterPgwLayer } from '../../../types/layer'
import { rasterLayer, CLOUD } from '../shared'
import { SWATCH } from '../../theme/swatches'

// PGW mixto (rotación residual) tal como viene de v17 pgwData.js
const PGW: readonly [number, number, number, number, number, number] = [
  0.000045062232, 0.000247614932, 0.000247615558, -0.000045062346, -77.374311108763, 2.939066887422,
]

export const LAYERS: RasterPgwLayer[] = [
  rasterLayer(
    'humedalesCapa1970',
    '1970',
    `${CLOUD}/v1763849225/geoImages/lbbcrnrecpdfu5kqf1vp.webp`,
    PGW,
    5118,
    9114,
    SWATCH.historico,
    10,
  ),
]
