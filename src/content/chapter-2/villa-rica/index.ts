import type { MapContent } from '../../../types/content'
import { POIS } from './pois'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1759512655/geoImages/pdxepthixmeebgei59yq.webp'

export default {
  mapId: 'chapter2-villa-rica',
  geo: {
    pgw: [0, 0.000055581180, 0.000055587544, 0, -76.549878031544, 2.974893043424] as const,
    width: 4960,
    height: 8818,
  },
  images: {
    base,
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1759512616/geoImages/sj5c6kcyz8oilmta1ra8.webp',
    placeholder: ph(base),
  },
  config: {
    initialZoom: 7.5,
    minZoom: 7.5,
    maxZoom: 11,
    initialBearing: -90,
    useTransformConstrain: true,
    viewportMaxBounds: null,
    dragPan: true,
    scrollZoom: true,
  },
  pois: POIS,
} satisfies MapContent
