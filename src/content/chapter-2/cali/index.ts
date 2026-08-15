import type { MapContent } from '../../../types/content'
import { POIS } from './pois'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1759512015/geoImages/roog2p6gjo3dnnqpcfel.webp'

export default {
  mapId: 'chapter2-cali',
  geo: {
    pgw: [0, 0.000015918409, 0.000015918925, 0, -76.53676820822001, 3.348181582808] as const,
    width: 4960,
    height: 8822,
  },
  images: {
    base,
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1759511931/geoImages/ku7ikq6ottmty9pl91u0.webp',
    placeholder: ph(base),
  },
  config: {
    initialZoom: 7,
    minZoom: 7,
    maxZoom: 16,
    initialBearing: -90,
    useTransformConstrain: true,
    viewportMaxBounds: null,
    dragPan: true,
    scrollZoom: true,
  },
  pois: POIS,
} satisfies MapContent
