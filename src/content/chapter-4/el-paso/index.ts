import type { MapContent } from '../../../types/content'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/gqczkzh18jqhgatzwiht.png'

export default {
  mapId: 'chapter4-el-paso',
  geo: {
    pgw: [0, 4.90819e-7, 4.90854e-7, 0, -76.67269057988042, 2.953934089665147] as const,
    width: 7366,
    height: 13096,
  },
  images: {
    base,
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765992022/geoImages/tljpufqwb78r7nkqt27y.png',
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
