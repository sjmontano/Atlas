import type { MapContent } from '../../../types/content'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/uda3sxgw61nf5tt6mtfp.png'

export default {
  mapId: 'chapter4-las-mercedes',
  geo: {
    pgw: [0, 2.37423e-7, 2.3744e-7, 0, -76.68619953199119, 2.930137907002091] as const,
    width: 7015,
    height: 12472,
  },
  images: {
    base,
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765992502/geoImages/xndkrm7tpgdbw881co0v.png',
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
