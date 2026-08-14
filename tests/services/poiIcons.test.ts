import { describe, it, expect, vi } from 'vitest'
import { composeArrowIcon, traceArrow, ARROW_SIZE, ARROW_SCALE } from '@services/poiIcons'

function fakeCtx() {
  return {
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    scale: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    bezierCurveTo: vi.fn(),
    closePath: vi.fn(),
    fill: vi.fn(),
    arc: vi.fn(),
    clip: vi.fn(),
    drawImage: vi.fn(),
    fillStyle: '',
    getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(ARROW_SIZE * ARROW_SIZE * 4) })),
  }
}

function makeFactory() {
  const ctx = fakeCtx()
  const canvas = { width: 0, height: 0, getContext: () => ctx }
  return { ctx, factory: () => canvas as unknown as HTMLCanvasElement }
}

describe('poiIcons', () => {
  it('traceArrow dibuja el trazo del círculo con punta (3 curvas + 2 líneas + cierre)', () => {
    const ctx = fakeCtx()
    traceArrow(ctx as unknown as CanvasRenderingContext2D)
    expect(ctx.beginPath).toHaveBeenCalled()
    expect(ctx.moveTo).toHaveBeenCalledWith(expect.any(Number), expect.any(Number))
    expect(ctx.bezierCurveTo).toHaveBeenCalledTimes(3)
    expect(ctx.lineTo).toHaveBeenCalledTimes(2)
    expect(ctx.closePath).toHaveBeenCalled()
    expect(ctx.fill).toHaveBeenCalled()
  })

  it('composeArrowIcon devuelve una imagen RGBA cuadrada del tamaño esperado', () => {
    const { factory, ctx } = makeFactory()
    const fakeImage = {} as HTMLImageElement
    const result = composeArrowIcon(fakeImage, 140, '#03103a', factory)
    expect(result.width).toBe(ARROW_SIZE)
    expect(result.height).toBe(ARROW_SIZE)
    expect(result.data).toHaveLength(ARROW_SIZE * ARROW_SIZE * 4)
    expect(ctx.rotate).toHaveBeenCalledWith((140 * Math.PI) / 180)
    expect(ctx.scale).toHaveBeenCalledWith(ARROW_SCALE, ARROW_SCALE)
    expect(ctx.drawImage).toHaveBeenCalledWith(fakeImage, expect.any(Number), expect.any(Number), expect.any(Number), expect.any(Number))
    expect(ctx.fill).toHaveBeenCalled()
  })

  it('composeArrowIcon usa el color por defecto azul oscuro', () => {
    const { factory, ctx } = makeFactory()
    composeArrowIcon({} as HTMLImageElement, 0, undefined, factory)
    expect(ctx.fillStyle).toBe('#03103a')
  })

  it('composeArrowIcon lanza si no hay contexto 2d', () => {
    const factory = () => ({ width: 0, height: 0, getContext: () => null }) as unknown as HTMLCanvasElement
    expect(() => composeArrowIcon({} as HTMLImageElement, 0, '#03103a', factory)).toThrow()
  })
})
