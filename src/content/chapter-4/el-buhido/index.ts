import type { MapContent } from '../../../types/content'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765986412/geoImages/l5qj5qxh5onul1b26e71.png'

export default {
  mapId: 'chapter4-el-buhido',
  geo: {
    pgw: [0, 0.000000316606, 0.000000316628, 0, -76.683480669945, 2.941142661121] as const,
    width: 7015,
    height: 12472,
  },
  images: {
    base,
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765988704/geoImages/p9hryf14z42ilaw0iiez.png',
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
} satisfies MapContent
