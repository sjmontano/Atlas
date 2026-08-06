export type PGWData = readonly [number, number, number, number, number, number]

export interface MapGeoEntry {
  /** PGW formato rotado [A, D, B, E, C, F] con A=0, E=0 */
  readonly pgw: PGWData
  /** Ancho de la imagen portrait original en píxeles */
  readonly width: number
  /** Alto de la imagen portrait original en píxeles */
  readonly height: number
}

export const MAP_GEO: Readonly<Record<string, MapGeoEntry>>
