import type { MapContent } from '../../../types/content'
import { GROUPS } from './groups'
import { LAYERS } from './layers'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752350981/geoImages/g9xrqxop5nmfciklng1b.webp'

export default {
  mapId: 'chapter1-ecosistemas',
  geo: {
    pgw: [0, 0.0004706619148, 0.0004706895898, 0, -77.717574036785, 1.505615411172] as const,
    width: 5729,
    height: 10186,
  },
  images: {
    base,
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752350945/geoImages/keozbw51ancathhw6cwk.webp',
    placeholder: ph(base),
  },
  config: {
    initialZoom: 6.4,
    minZoom: 2,
    maxZoom: 9.5,
    initialBearing: -90,
    useTransformConstrain: true,
    viewportMaxBounds: null,
    dragPan: true,
    scrollZoom: true,
  },
  tiles: {
    urlTemplate: '/assets/maps/tiles/mapas/chapter1-ecosistemas/{z}/{x}/{y}.webp',
    tileSize: 256,
    minZoom: 6,
    maxZoom: 12,
    fadeDuration: 300,
  },
  layers: LAYERS,
  groups: GROUPS,
} satisfies MapContent
