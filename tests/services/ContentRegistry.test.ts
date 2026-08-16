import { describe, it, expect } from 'vitest'

describe('getMapContent', () => {
  it('devuelve contenido para un mapa existente', async () => {
    const { getMapContent } = await import('@content')
    const content = getMapContent('chapter1-ecosistemas')
    expect(content).not.toBeNull()
    expect(content?.mapId).toBe('chapter1-ecosistemas')
    expect(content?.geo).toBeDefined()
    expect(content?.images).toBeDefined()
    expect(content?.config).toBeDefined()
    expect(content?.layers).toBeDefined()
    expect(content?.tiles).toBeDefined()
  })

  it('devuelve contenido para el mapa suelto intro', async () => {
    const { getMapContent } = await import('@content')
    const content = getMapContent('intro')
    expect(content).not.toBeNull()
    expect(content?.mapId).toBe('intro')
  })

  it('devuelve null para un mapa inexistente', async () => {
    const { getMapContent } = await import('@content')
    expect(getMapContent('no-existe')).toBeNull()
  })

  it('aplica el override de calibración de mapa', async () => {
    const { MAP_CALIBRATIONS } = await import('@content/calibration/map')
    MAP_CALIBRATIONS['chapter3-introduccion'] = {
      pgw: [0, 0.000239511553, 0.000239528625, 0, -77.387345555, 2.198599777],
      width: 1754,
      height: 3118,
    }
    const { getMapContent } = await import('@content')
    const content = getMapContent('chapter3-introduccion')
    expect(content?.geo.pgw).toEqual([0, 0.000239511553, 0.000239528625, 0, -77.387345555, 2.198599777])
    delete MAP_CALIBRATIONS['chapter3-introduccion']
  })

  it('aplica viewportMargin de calibración al config', async () => {
    const { MAP_CALIBRATIONS } = await import('@content/calibration/map')
    MAP_CALIBRATIONS['chapter3-introduccion'] = {
      pgw: [0, 0.000239511553, 0.000239528625, 0, -77.387345555, 2.198599777],
      width: 1754,
      height: 3118,
      viewportMargin: 0.2,
    }
    const { getMapContent } = await import('@content')
    const content = getMapContent('chapter3-introduccion')
    expect(content?.config.viewportMargin).toBe(0.2)
    delete MAP_CALIBRATIONS['chapter3-introduccion']
  })
})
