import type { Poi } from '../../../types/poi'

const ICONS = '/assets/iconsCap4'

const nodo = (id: string, name: string, capa: string, coords: [number, number], icon: string, angle: number): Poi => ({
  id,
  name,
  coords,
  capa,
  variant: 'arrow',
  icon: `${ICONS}/${icon}`,
  angle,
  popup: { title: name, image: `${ICONS}/${icon}` },
})

export const POIS: Poi[] = [
  nodo('poi-cap4-intro-asoyoge', 'ASOYOGE', 'Nodo Suárez', [-76.669, 2.928], 'asoyoge.png', 5),
  nodo('poi-cap4-intro-el-buhido', 'Finca El Buhido', 'Nodo Suárez', [-76.69, 2.96], 'el-buhido.png', 90),
  nodo('poi-cap4-intro-bosque-comestible', 'Bosque comestible del oriente de Cali', 'Nodo Oriente de Cali', [-76.54, 3.448], 'oriente-cali.png', 0),
  nodo('poi-cap4-intro-los-bajios', 'Finca Los Bajios', 'Nodo Villa Rica', [-76.434, 3.238], 'los-bajios.png', 260),
  nodo('poi-cap4-intro-el-paso', 'Finca El Paso', 'Nodo Suárez', [-76.65, 3.0], 'el-paso.webp', 210),
  nodo('poi-cap4-intro-las-mercedes', 'Finca Las Mercedes', 'Nodo Suárez', [-76.645, 2.953], 'las-mercedes.webp', 280),
  nodo('poi-cap4-intro-la-virginia', 'Finca La Virginia', 'Nodo Villa Rica', [-76.344, 3.284], 'la-virginia.png', 90),
  nodo('poi-cap4-intro-centro-agropecuario', 'Centro agropecuario de Villa Rica', 'Nodo Villa Rica', [-76.465, 3.214], 'centro-agropecuario.png', 0),
  nodo('poi-cap4-intro-la-caicedo', 'Finca La Caicedo', 'Nodo Villa Rica', [-76.48444, 3.25], 'la-caicedo.png', 150),
]
