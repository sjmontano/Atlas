import type { MapContent } from '../../../types/content'
import { POIS } from './pois'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752359002/geoImages/ki1nmtf1bry5hwfzpauv.webp'

export default {
  mapId: 'chapter1-formas-paisaje',
  geo: {
    pgw: [0, 0.002101779729, 0.002098102561, 0, -79.131272642526, -0.005834616506] as const,
    width: 3382,
    height: 6023,
  },
  images: {
    base,
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752359777/geoImages/xyrkeumf4kv6eixtzuoz.webp',
    placeholder: ph(base),
  },
  config: {
    initialZoom: 6,
    minZoom: 6,
    maxZoom: 9.5,
    initialBearing: -90,
    useTransformConstrain: true,
    viewportMaxBounds: null,
    dragPan: true,
    scrollZoom: true,
  },
  pois: POIS,
} satisfies MapContent
