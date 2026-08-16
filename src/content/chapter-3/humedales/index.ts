import type { MapContent } from '../../../types/content'
import { LAYERS } from './layers'
import { LEGENDS } from './legends'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1763847570/geoImages/n4gxlxxpeoqnfma5dylj.webp'

export default {
  mapId: 'chapter3-humedales',
  geo: {
    pgw: [0, 0.000247614932, 0.000247615558, 0, -77.374311108763, 2.939066887422] as const,
    width: 5118,
    height: 9114,
  },
  images: {
    base,
    full: base,
    placeholder: ph(base),
  },
  config: {
    initialZoom: 8,
    minZoom: 8,
    maxZoom: 11,
    initialBearing: -90,
    useTransformConstrain: true,
    viewportMaxBounds: null,
    dragPan: true,
    scrollZoom: true,
  },
  layers: LAYERS,
  legends: LEGENDS,
} satisfies MapContent
