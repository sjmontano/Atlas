// Composición de íconos para markers de POI (variante "arrow"): un círculo con
// punta de flecha que apunta hacia la coordenada y una imagen circular adentro,
// replicando el SVG de `ImageCircle` (circuloConDireccion.jsx) de la fuente.

export const ARROW_SIZE = 256
export const ARROW_SCALE = 1.7
export const ARROW_COLOR = '#03103a'

// Centro del círculo en el sistema de coordenadas del viewBox 0 0 129 107.
const CIRCLE_CX = 53.95
const CIRCLE_CY = 53.95

export function traceArrow(ctx: CanvasRenderingContext2D): void {
  ctx.beginPath()
  ctx.moveTo(91.4298, 91.4296)
  ctx.bezierCurveTo(70.732, 112.127, 37.1743, 112.127, 16.4765, 91.4296)
  ctx.bezierCurveTo(-4.22132, 70.7318, -4.22132, 37.1741, 16.4765, 16.4763)
  ctx.bezierCurveTo(37.1742, -4.2215, 70.732, -4.22151, 91.4298, 16.4763)
  ctx.lineTo(128.906, 53.9529)
  ctx.lineTo(91.4298, 91.4296)
  ctx.closePath()
  ctx.fill()
}

export interface ArrowIcon {
  width: number
  height: number
  data: Uint8ClampedArray
}

export type CanvasFactory = () => HTMLCanvasElement

const defaultCanvasFactory: CanvasFactory = () => document.createElement('canvas')

// Rasteriza la gota a un tamaño controlado (alto en px). Devuelve la imagen RGBA
// lista para `addImage`; el ancho se deriva de la proporción de la gota.
export function composeGotaIcon(
  image: HTMLImageElement | HTMLCanvasElement | ImageBitmap,
  targetHeight: number,
  factory: CanvasFactory = defaultCanvasFactory,
): ArrowIcon {
  const aspect = image.width / image.height
  const width = Math.max(1, Math.round(targetHeight * aspect))
  const canvas = factory()
  canvas.width = width
  canvas.height = targetHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No 2d context available')

  ctx.drawImage(image, 0, 0, width, targetHeight)
  const { data } = ctx.getImageData(0, 0, width, targetHeight)
  return { width, height: targetHeight, data }
}

export function composeArrowIcon(
  image: HTMLImageElement | HTMLCanvasElement | ImageBitmap,
  angle: number,
  color: string = ARROW_COLOR,
  factory: CanvasFactory = defaultCanvasFactory,
): ArrowIcon {
  const canvas = factory()
  canvas.width = ARROW_SIZE
  canvas.height = ARROW_SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No 2d context available')

  // 1. Flecha: rotar el contenedor por `angle` (la punta apunta al lugar).
  ctx.save()
  ctx.translate(ARROW_SIZE / 2, ARROW_SIZE / 2)
  ctx.rotate((angle * Math.PI) / 180)
  ctx.scale(ARROW_SCALE, ARROW_SCALE)
  ctx.translate(-CIRCLE_CX, -CIRCLE_CY)
  ctx.fillStyle = color
  traceArrow(ctx)
  ctx.restore()

  // 2. Imagen circular adentro, contrarrotada para quedar derecha.
  const r = (90 * ARROW_SCALE) / 2
  ctx.save()
  ctx.beginPath()
  ctx.arc(ARROW_SIZE / 2, ARROW_SIZE / 2, r, 0, Math.PI * 2)
  ctx.clip()
  ctx.drawImage(image, ARROW_SIZE / 2 - r, ARROW_SIZE / 2 - r, r * 2, r * 2)
  ctx.restore()

  const { data } = ctx.getImageData(0, 0, ARROW_SIZE, ARROW_SIZE)
  return { width: ARROW_SIZE, height: ARROW_SIZE, data }
}
