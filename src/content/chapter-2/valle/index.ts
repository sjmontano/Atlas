import type { MapContent } from '../../../types/content'
import { LAYERS } from './layers'
import { POIS } from './pois'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1759285334/geoImages/kbg62bjm983wn9p6xexl.webp'

export default {
  mapId: 'chapter2-valle',
  geo: {
    pgw: [0, 0.000328128994, 0.000328152382, 0, -77.548017107743, 1.870309514817] as const,
    width: 7015,
    height: 12472,
  },
  images: {
    base,
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1759285229/geoImages/nhbnbpekarmsu7ernhcj.webp',
    placeholder: ph(base),
  },
  config: {
    initialZoom: 6,
    minZoom: 6,
    maxZoom: 11,
    initialBearing: -90,
    useTransformConstrain: true,
    viewportMaxBounds: null,
    dragPan: true,
    scrollZoom: true,
  },
  layers: LAYERS,
  pois: POIS,
} satisfies MapContent
