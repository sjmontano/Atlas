import type { MapContent } from '../../../types/content'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/drkxyppqvzpngqura5qg.png'

export default {
  mapId: 'chapter4-centro-agropecuario',
  geo: {
    pgw: [0, 5.15928e-7, 5.15965e-7, 0, -76.43109465694656, 3.183850151162395] as const,
    width: 6904,
    height: 12163,
  },
  images: {
    base,
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765993765/geoImages/gecszuuozkmhyng5w6y7.png',
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
