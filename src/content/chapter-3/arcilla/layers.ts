import type { RasterPgwLayer } from '../../../types/layer'
import { rasterLayer, CLOUD } from '../shared'
import { SWATCH } from '../../theme/swatches'

const PGW: readonly [number, number, number, number, number, number] = [
  0, 0.000010359711, 0.000010359732, 0, -76.462515214762, 3.159866654268,
]

export const LAYERS: RasterPgwLayer[] = [
  rasterLayer(
    'enExplotacion',
    'En explotación (abiertos)',
    `${CLOUD}/v1764944934/geoImages/qzloplawdce64nyoiedi.webp`,
    PGW,
    3937,
    7000,
    SWATCH.explotacion,
    10,
    { group: 'arcilla-lagos' },
  ),
  rasterLayer(
    'enReanatualizacion',
    'En proceso renaturalización',
    `${CLOUD}/v1764946045/geoImages/sspftyweahtwn6ibv3hx.webp`,
    PGW,
    3937,
    7000,
    SWATCH.renaturalizacion,
    20,
    { group: 'arcilla-lagos' },
  ),
  rasterLayer(
    'enRellenados',
    'Rellenados (cerrados)',
    `${CLOUD}/v1764946527/geoImages/mvyoglamwzd6uq5rfxig.webp`,
    PGW,
    3937,
    7000,
    SWATCH.relleno,
    30,
    { group: 'arcilla-lagos' },
  ),
]
