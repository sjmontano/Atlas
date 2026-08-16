import { describe, it, expect } from 'vitest'
import { rewriteCalibrationEntry } from '@services/rewriteCalibration'

const SRC = [
  'export const CALIBRATIONS = {',
  "  'layer-a': {",
  '    pgw: [0, 1, 2, 0, -77, 2],',
  '    width: 100,',
  '    height: 200,',
  '  },',
  '}',
].join('\r\n')

describe('rewriteCalibrationEntry', () => {
  it('replaces an existing entry', () => {
    const out = rewriteCalibrationEntry(SRC, 'layer-a', {
      pgw: [0, 3, 4, 0, -78, 3],
      width: 300,
      height: 400,
    })
    expect(out).toContain('pgw: [0, 3, 4, 0, -78, 3]')
    expect(out).toContain('width: 300')
    expect(out).toContain('height: 400')
    expect(out).toContain("'layer-a':")
  })

  it('appends a new entry when id does not exist', () => {
    const out = rewriteCalibrationEntry(SRC, 'layer-b', {
      pgw: [0, 0.001, 0.001, 0, -77, 1],
      width: 500,
      height: 600,
    })
    expect(out).toContain("'layer-b':")
    expect(out).toContain("'layer-a':")
  })

  it('throws on invalid id', () => {
    expect(() =>
      rewriteCalibrationEntry(SRC, 'invalid id!', {
        pgw: [0, 0, 0, 0, 0, 0],
        width: 1,
        height: 1,
      }),
    ).toThrow('id inválido')
  })

  it('preserves the rest of the file', () => {
    const out = rewriteCalibrationEntry(SRC, 'layer-a', {
      pgw: [0, 1, 2, 0, -77, 2],
      width: 111,
      height: 222,
    })
    expect(out).toContain('export const CALIBRATIONS')
  })

  it('handles CRLF line endings', () => {
    const out = rewriteCalibrationEntry(SRC, 'layer-a', {
      pgw: [9, 9, 9, 9, 9, 9],
      width: 1,
      height: 1,
    })
    expect(out).toContain('\r\n')
  })

  it('rounds width and height to integers', () => {
    const out = rewriteCalibrationEntry(SRC, 'layer-a', {
      pgw: [0, 1, 2, 0, 3, 4],
      width: 100.7,
      height: 200.2,
    })
    expect(out).toContain('width: 101')
    expect(out).toContain('height: 200')
  })

  it('writes viewportMargin when provided', () => {
    const out = rewriteCalibrationEntry(SRC, 'layer-a', {
      pgw: [0, 1, 2, 0, -77, 2],
      width: 100,
      height: 200,
      viewportMargin: 0.2,
    })
    expect(out).toContain('viewportMargin: 0.2')
  })

  it('writes a negative viewportMargin (recorte dentro de la imagen)', () => {
    const out = rewriteCalibrationEntry(SRC, 'layer-a', {
      pgw: [0, 1, 2, 0, -77, 2],
      width: 100,
      height: 200,
      viewportMargin: -0.15,
    })
    expect(out).toContain('viewportMargin: -0.15')
  })

  it('omits viewportMargin when not provided', () => {
    const out = rewriteCalibrationEntry(SRC, 'layer-a', {
      pgw: [0, 1, 2, 0, -77, 2],
      width: 100,
      height: 200,
    })
    expect(out).not.toContain('viewportMargin')
  })
})
