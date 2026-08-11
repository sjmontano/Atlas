import { describe, it, expect } from 'vitest'
import { rewriteLayerCalibration } from '@services/rewriteLayerCalibration'

const SRC = [
  'export const LAYER_CALIBRATIONS = {',
  "  'layer-a': {",
  '    pgw: [0, 1, 2, 0, -77, 2],',
  '    width: 100,',
  '    height: 200,',
  '  },',
  '}',
].join('\r\n')

describe('rewriteLayerCalibration', () => {
  it('replaces an existing entry', () => {
    const out = rewriteLayerCalibration(SRC, 'layer-a', {
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
    const out = rewriteLayerCalibration(SRC, 'layer-b', {
      pgw: [0, 0.001, 0.001, 0, -77, 1],
      width: 500,
      height: 600,
    })
    expect(out).toContain("'layer-b':")
    expect(out).toContain("'layer-a':")
  })

  it('throws on invalid layerId', () => {
    expect(() =>
      rewriteLayerCalibration(SRC, 'invalid id!', {
        pgw: [0, 0, 0, 0, 0, 0],
        width: 1,
        height: 1,
      }),
    ).toThrow('layerId inválido')
  })

  it('preserves the rest of the file', () => {
    const out = rewriteLayerCalibration(SRC, 'layer-a', {
      pgw: [0, 1, 2, 0, -77, 2],
      width: 111,
      height: 222,
    })
    expect(out).toContain('export const LAYER_CALIBRATIONS')
  })

  it('handles CRLF line endings', () => {
    const crlf = SRC
    const out = rewriteLayerCalibration(crlf, 'layer-a', {
      pgw: [9, 9, 9, 9, 9, 9],
      width: 1,
      height: 1,
    })
    expect(out).toContain('\r\n')
  })
})
