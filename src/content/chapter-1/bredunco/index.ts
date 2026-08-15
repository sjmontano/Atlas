import type { MapContent } from '../../../types/content'
import { POIS } from './pois'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360535/geoImages/kv5mawmj8cefhcqho8np.webp'
const full =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360577/geoImages/zvluewqlzmf9hw9fua6x.avif'

export default {
  mapId: 'chapter1-bredunco',
  geo: {
    pgw: [0, 0.001181998411, 0.001182047579, 0, -78.907953240108, -0.290036434033] as const,
    width: 5649,
    height: 11141,
  },
  images: { base, full, placeholder: ph(base) },
  config: {
    initialZoom: 6.4,
    minZoom: 6.4,
    maxZoom: 9.5,
    initialBearing: -90,
    useTransformConstrain: true,
    viewportMaxBounds: null,
    dragPan: true,
    scrollZoom: true,
  },
  pois: POIS,
} satisfies MapContent
