import type { MapContent } from '../../../types/content'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/smdehdeaewwwasco6wt5.png'

export default {
  mapId: 'chapter4-la-virginia',
  geo: {
    pgw: [0, 2.38227e-7, 2.38244e-7, 0, -76.2901666061832, 3.2244952203163693] as const,
    width: 7015,
    height: 12472,
  },
  images: {
    base,
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765993236/geoImages/gikolsdb7i25mvhakxds.png',
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
