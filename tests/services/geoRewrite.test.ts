import { describe, it, expect } from 'vitest'
import { rewriteGeoEntry } from '@services/geoRewrite'

const FIXTURE = `export const MAP_GEO = {
  intro: {
    pgw: [0, 0.001181998411, 0.001182047579, 0, -78.907953240108, -0.290036434033],
    width: 5649,
    height: 11141,
  },

  'chapter1-encuadres': {
    pgw: [0, 0.002291904891, 0.002292263474, 0, -79.441458743296, -1.354624163443],
    width: 3389,
    height: 6684,
  },

  'chapter3-humedales': {
    pgw: [0.000045062232, 0.000247614932, 0.000247615558, -0.000045062346, -77.374311108763, 2.939066887422],
    width: 2559,
    height: 4557,
  },
}
`

describe('rewriteGeoEntry', () => {
  it('replaces an existing entry with new values', () => {
    const result = rewriteGeoEntry(FIXTURE, 'chapter1-encuadres', {
      pgw: [0, 0.01, 0.02, 0, -80, -2],
      width: 1000,
      height: 2000,
    })

    expect(result).toContain("'chapter1-encuadres': {")
    expect(result).toContain('pgw: [0, 0.01, 0.02, 0, -80, -2]')
    expect(result).toContain('width: 1000')
    expect(result).toContain('height: 2000')

    // old values gone
    expect(result).not.toContain('0.002291904891')

    // other entries untouched
    expect(result).toContain('  intro: {')
    expect(result).toContain('0.001181998411')
    expect(result).toContain("  'chapter3-humedales': {")
    expect(result).toContain('0.000045062232')
  })

  it('replaces the last entry (before closing brace)', () => {
    const result = rewriteGeoEntry(FIXTURE, 'chapter3-humedales', {
      pgw: [1, 2, 3, 4, 5, 6],
      width: 99,
      height: 88,
    })

    expect(result).toContain('pgw: [1, 2, 3, 4, 5, 6]')
    expect(result).toContain('width: 99')
    expect(result).toContain('height: 88')
    expect(result).not.toContain('0.000045062232')
    expect(result).toContain('  intro: {')
    expect(result).toContain("  'chapter1-encuadres': {")
  })

  it('preserves trailing content after the entry', () => {
    const result = rewriteGeoEntry(FIXTURE, 'chapter1-encuadres', {
      pgw: [0, 0.01, 0.02, 0, -80, -2],
      width: 1000,
      height: 2000,
    })

    // chapter3-humedales should still follow
    expect(result).toContain("  'chapter3-humedales': {")
    // closing brace of MAP_GEO should still exist
    expect(result.trimEnd()).toMatch(/\n\}$/)
  })

  it('throws for a non-existent mapId', () => {
    expect(() =>
      rewriteGeoEntry(FIXTURE, 'chapter99-nonexistent', {
        pgw: [0, 1, 2, 0, 3, 4],
        width: 1,
        height: 1,
      }),
    ).toThrow(/no encontrada/)
  })

  it('throws for an invalid mapId', () => {
    expect(() =>
      rewriteGeoEntry(FIXTURE, 'evil/*.js', {
        pgw: [0, 1, 2, 0, 3, 4],
        width: 1,
        height: 1,
      }),
    ).toThrow(/inválido/)
  })

  it('works with CRLF line endings', () => {
    const crlf = FIXTURE.replace(/\n/g, '\r\n')
    const result = rewriteGeoEntry(crlf, 'chapter1-encuadres', {
      pgw: [9, 8, 7, 6, 5, 4],
      width: 42,
      height: 24,
    })
    expect(result).toContain('width: 42')
    expect(result).toContain('  intro: {')
  })

  it('rounds width and height to integers', () => {
    const result = rewriteGeoEntry(FIXTURE, 'chapter1-encuadres', {
      pgw: [0, 1, 2, 0, 3, 4],
      width: 100.7,
      height: 200.2,
    })
    expect(result).toContain('width: 101')
    expect(result).toContain('height: 200')
  })
})
