import type { Poi } from '@types/poi'
export const POIS: Record<string, Poi[]>
export function getPois(mapId: string): Poi[] | null
