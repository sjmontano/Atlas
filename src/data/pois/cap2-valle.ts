import type { Poi } from '../../types/poi.ts'

const node = (id: string, name: string, coords: [number, number]): Poi => ({
  id,
  name,
  coords,
  capa: `Nodo ${name}`,
  variant: 'icon',
  popup: { title: name },
})

export const CAP2_VALLE_POIS: Poi[] = [
  node('poi-cap2-valle-suarez', 'Suárez', [-76.675597, 2.966693]),
  node('poi-cap2-valle-villa-rica', 'Villa Rica', [-76.464137, 3.179754]),
  node('poi-cap2-valle-cali', 'Oriente de Cali', [-76.464254, 3.441679]),
]
