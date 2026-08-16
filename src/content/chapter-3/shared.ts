import type { LegendItem, RasterPgwLayer } from '../../types/layer'
import type { PGWData } from '@services/BoundsCalculator'
import { SWATCH } from '../theme/swatches'

export const CLOUD = 'https://res.cloudinary.com/dvluvxfvn/image/upload'

export const rasterLayer = (
  id: string,
  name: string,
  image: string,
  pgw: PGWData,
  width: number,
  height: number,
  swatch: string,
  order: number,
  opts?: { group?: string; opacity?: number; visibleByDefault?: boolean },
): RasterPgwLayer => ({
  id,
  name,
  category: 'other',
  type: 'raster-pgw',
  image,
  pgw,
  width,
  height,
  opacity: opts?.opacity ?? 0.8,
  visibleByDefault: opts?.visibleByDefault ?? false,
  order,
  group: opts?.group,
  legend: { swatch, description: name },
})

// Textos confirmados desde fuentes del proyecto (v17 lugares.js / modalsData).
// Solo se usa longText donde existe fuente; el resto de leyendas no lleva tooltip.
export const TEXTO_RIO_CAUCA =
  'Broto del Macizo Colombiano en el Páramo de Paletará. A mi cauce llegan aguas de las cordilleras Central y Occidental y viajamos juntas hasta la Depresión Mompoxina.'
export const TEXTO_SALVAJINA =
  'Me construyeron en el punto donde empieza a formarse el valle del río Cauca en su cuenca alta. Mi muro se alza frente a Suárez y desde ahí gobierno las aguas del Cauca.'
export const TEXTO_HUMEDALES =
  'Soy una sobreviviente de los tantísimos humedales que desecaron en el valle alto del río Cauca. Respiro agua para los días de sequía y contengo las inundaciones.'
export const TEXTO_CUERPOS_DE_AGUA =
  'Originalmente, Cali estaba rodeada por una gran cantidad de humedales y lagunas que formaban un sistema hídrico complejo y vital.'
export const TEXTO_MONOCULTIVO =
  'Se aprecia una ocupación significativa de la zona plana por monocultivos de caña de azúcar: una baja biodiversidad paisajística y la homogeneización de un solo cultivo.'

export const LEG_RIO_CAUCA = (id: string, order: number): LegendItem => ({
  id,
  name: 'Río Cauca',
  swatch: SWATCH.rio,
  order,
  longText: TEXTO_RIO_CAUCA,
})
