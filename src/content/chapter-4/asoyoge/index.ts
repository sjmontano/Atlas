import type { MapContent } from '../../../types/content'
import { LEGENDS } from './legends'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765986412/geoImages/u2dqe5dcdqzn1am0whlj.png'

export default {
  mapId: 'chapter4-asoyoge',
  geo: {
    pgw: [0, 5.06536e-7, 5.06572e-7, 0, -76.68490913590671, 2.9357762363425706] as const,
    width: 3578,
    height: 6361,
  },
  images: {
    base,
    full: base,
    placeholder: ph(base),
  },
  config: {
    initialZoom: 11,
    minZoom: 11,
    maxZoom: 14,
    initialBearing: -90,
    useTransformConstrain: true,
    viewportMaxBounds: null,
    dragPan: true,
    scrollZoom: true,
  },
  legends: LEGENDS,
} satisfies MapContent
