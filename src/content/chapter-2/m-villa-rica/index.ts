import type { MapContent } from '../../../types/content'
import { LAYERS } from './layers'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1759612261/geoImages/pabcndrbg0gjx29iuccg.webp'

export default {
  mapId: 'chapter2-m-villa-rica',
  geo: {
    pgw: [0, 0.000036518263, 0.000036520866, 0, -76.53721204001468, 2.9674982215900085] as const,
    width: 7015,
    height: 12472,
  },
  images: {
    base,
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1767891949/geoImages/knk721fgkqtvdxnppxzr.webp',
    placeholder: ph(base),
  },
  config: {
    initialZoom: 8.5,
    minZoom: 9,
    maxZoom: 14,
    initialBearing: -90,
    useTransformConstrain: true,
    viewportMaxBounds: null,
    dragPan: true,
    scrollZoom: true,
  },
  layers: LAYERS,
} satisfies MapContent
