/**
 * 📐 TIPO PGW — World File con campos nombrados
 * ===============================================
 * Reemplaza la tupla `[number,number,number,number,number,number]`
 * ilegible por un objeto con nombres semánticos según estándar ESRI.
 *
 * Orden de la tupla original: [A, D, B, E, C, F]
 */

/** Parámetros de transformación afín del World File (ESRI PGW) */
export interface PgwData {
  /** Tamaño de pixel en X — longitud por columna. Positivo = este */
  readonly A: number;
  /** Rotación (normalmente 0 en mapas sin skew) */
  readonly D: number;
  /** Rotación (normalmente 0 en mapas sin skew) */
  readonly B: number;
  /** Tamaño de pixel en Y — latitud por fila. Negativo = sur */
  readonly E: number;
  /** Longitud de la esquina superior-izquierda (oeste) */
  readonly C: number;
  /** Latitud de la esquina superior-izquierda (norte) */
  readonly F: number;
}

/** Tupla numérica en orden ESRI [A, D, B, E, C, F] — para APIs legacy */
export type PgwTuple = readonly [
  number,
  number,
  number,
  number,
  number,
  number,
];

/**
 * Crea un PgwData validado. Lanza si algún valor no es finito.
 * Usar para mapas con georreferenciación real.
 */
export function createPgw(params: PgwData): PgwData {
  const values = [params.A, params.D, params.B, params.E, params.C, params.F];
  for (const v of values) {
    if (!Number.isFinite(v)) {
      throw new Error(`PGW contiene valor no finito: ${v}`);
    }
  }
  return Object.freeze({ ...params });
}

/**
 * PGW vacío para mapas aún sin georreferenciación real.
 * Marcado explícitamente como "sin configurar" — visible en el tipo.
 */
export const EMPTY_PGW: PgwData = Object.freeze({
  A: 0,
  D: 0,
  B: 0,
  E: 0,
  C: 0,
  F: 0,
});

/** Devuelve true si el PGW tiene datos de georreferenciación reales */
export function isPgwConfigured(pgw: PgwData): boolean {
  return pgw.A !== 0 || pgw.E !== 0;
}

/** Convierte PgwData a tupla para APIs que la requieren */
export function pgwToTuple(pgw: PgwData): PgwTuple {
  return [pgw.A, pgw.D, pgw.B, pgw.E, pgw.C, pgw.F] as const;
}

/** Convierte tupla ESRI [A,D,B,E,C,F] a PgwData */
export function tupleToPgw(tuple: PgwTuple): PgwData {
  return Object.freeze({
    A: tuple[0],
    D: tuple[1],
    B: tuple[2],
    E: tuple[3],
    C: tuple[4],
    F: tuple[5],
  });
}
