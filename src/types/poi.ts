export interface Poi {
  id: string
  numero?: number
  name: string
  coords: [number, number]
  capa?: string
  popup: {
    title: string
    body?: string
    image?: string
    audio?: string
  }
  angle?: number
  icon?: string
}
