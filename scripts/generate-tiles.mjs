// ─────────────────────────────────────────────────────────────────────────────
// GENERADOR DE TILES XYZ (WebP) PARA MAPAS DEL ATLAS
// ==================================================
//
// Genera tiles XYZ de alta resolución para un mapa usando los binarios CLI de
// GDAL (gdal_translate + gdalwarp). El footprint geográfico se deriva de
// geo.js replicando la lógica de BoundsCalculator.processBounds, de modo que
// los tiles quedan alineados exactamente con la capa base ImageSource.
//
// Requisitos:
//   - GDAL con driver WEBP (Windows: C:\Program Files\GDAL, o GDAL_BIN=<dir>)
//   - La imagen "full" del mapa debe estar disponible en images.js (Cloudinary)
//
// Uso:
//   node scripts/generate-tiles.mjs               # mapas con config en tiles.js
//   node scripts/generate-tiles.mjs chapter1-ecosistemas
//   node scripts/generate-tiles.mjs chapter1-ecosistemas --force
//
// Salida:
//   public/assets/maps/tiles/mapas/{mapId}/{z}/{x}/{y}.webp   (mapas base)
//   public/assets/maps/tiles/capas/{layerId}/{z}/{x}/{y}.webp (capas futuras)
//   (NO versionar en git — regenerar con `pnpm tiles`)
// ─────────────────────────────────────────────────────────────────────────────

import { mkdirSync, existsSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { MAP_GEO } from '../src/data/maps/geo.js'
import { MAP_IMAGES } from '../src/data/maps/images.js'
import { MAP_CONFIGS } from '../src/data/maps/configs.js'
import { MAP_TILES } from '../src/data/maps/tiles.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_ROOT = join(ROOT, 'public', 'assets', 'maps', 'tiles', 'mapas')
const TMP_ROOT = join(ROOT, '.tmp-tiles')

// ── Entorno GDAL ────────────────────────────────────────────────────────────
const GDAL_BIN = process.env.GDAL_BIN || 'C:\\Program Files\\GDAL'
const PATH_SEP = process.platform === 'win32' ? ';' : ':'
const gdalEnv = {
  ...process.env,
  PATH: GDAL_BIN + PATH_SEP + (process.env.PATH ?? ''),
  GDAL_DATA: process.env.GDAL_DATA || join(GDAL_BIN, 'gdal-data'),
  PROJ_LIB: process.env.PROJ_LIB || join(GDAL_BIN, 'projlib'),
}

function gdal(bin, args, label) {
  const res = spawnSync(bin, args, { env: gdalEnv, encoding: 'utf8', windowsHide: true })
  if (res.status !== 0) {
    throw new Error(
      `${label} falló (${bin})\n  stderr: ${(res.stderr || '').trim().split('\n').slice(-4).join('\n  ')}`,
    )
  }
}

// ── Georreferenciación (replica BoundsCalculator) ───────────────────────────
const EPS = 1e-10

function isRotatedPGW(a, e, b, d) {
  return Math.abs(a) < EPS && Math.abs(e) < EPS && Math.abs(b) > EPS && Math.abs(d) > EPS
}

function convertRotatedPGW(pgw, height) {
  const [, d, b, , c, f] = pgw
  return [d, 0, 0, -b, c, f + b * height]
}

function calculateImageCoordinates(pgw, width, height) {
  const [a, d, b, e, c, f] = pgw
  const x0 = c - 0.5 * a - 0.5 * b
  const y0 = f - 0.5 * d - 0.5 * e
  const topLeft = [x0, y0]
  const topRight = [x0 + a * width, y0 + d * width]
  const bottomRight = [x0 + a * width + b * height, y0 + d * width + e * height]
  const bottomLeft = [x0 + b * height, y0 + e * height]
  return [topLeft, topRight, bottomRight, bottomLeft]
}

function processBounds(pgw, width, height) {
  const [a, d, b, e] = pgw
  const effective = isRotatedPGW(a, e, b, d) ? convertRotatedPGW(pgw, height) : pgw
  const coords = calculateImageCoordinates(effective, width, height)
  const lngs = coords.map((c) => c[0])
  const lats = coords.map((c) => c[1])
  return [Math.min(...lngs), Math.min(...lats), Math.max(...lngs), Math.max(...lats)]
}

// ── Web Mercator (EPSG:3857) ────────────────────────────────────────────────
const R = 6378137
const WORLD = 20037508.342789244
const lonToX = (lon) => (R * lon * Math.PI) / 180
const latToY = (lat) => R * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))

async function download(url, dest) {
  if (existsSync(dest)) return
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} descargando ${url}`)
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()))
}

async function generateMap(mapId, { force = false } = {}) {
  const geo = MAP_GEO[mapId]
  const images = MAP_IMAGES[mapId]
  const config = MAP_CONFIGS[mapId]
  const tiles = MAP_TILES[mapId]

  if (!geo || !images || !config || !tiles) {
    console.log(`⏭️  ${mapId}: sin config de tiles (geo/images/config/tiles)`)
    return
  }
  if (!images.full) {
    console.log(`⏭️  ${mapId}: sin imagen full`)
    return
  }

  const [west, south, east, north] = processBounds(geo.pgw, geo.width, geo.height)

  // Rango de zoom desde la config de tiles (fuente de verdad de hasta dónde
  // se generan tiles). El config.maxZoom controla el zoom máximo de vista.
  const zFrom = tiles.minZoom
  const zTo = tiles.maxZoom

  const tmpDir = join(TMP_ROOT, mapId)
  const srcFile = join(tmpDir, 'source.webp')
  const tif4326 = join(tmpDir, '4326.tif')
  const tif3857 = join(tmpDir, '3857.tif')
  const outDir = join(OUT_ROOT, mapId)

  mkdirSync(tmpDir, { recursive: true })

  console.log(`\n🗺️  ${mapId}`)
  console.log(`   bounds: [${[west, south, east, north].map((v) => v.toFixed(5)).join(', ')}]`)
  console.log(`   zoom: ${zFrom}..${zTo}`)

  // 1. Descargar imagen full
  console.log('   ↓ descargando imagen full…')
  await download(images.full, srcFile)

  // 2. Georreferenciar a EPSG:4326 (mismo footprint que la capa base)
  console.log('   → georreferenciando 4326…')
  gdal(
    'gdal_translate',
    ['-q', '-of', 'GTiff', '-a_srs', 'EPSG:4326', '-a_ullr', String(west), String(north), String(east), String(south), srcFile, tif4326],
    'gdal_translate 4326',
  )

  // 3. Warp a Web Mercator (proyección de los tiles XYZ)
  console.log('   → warp 3857…')
  gdal(
    'gdalwarp',
    ['-q', '-overwrite', '-t_srs', 'EPSG:3857', '-r', 'lanczos', '-dstalpha', '-of', 'GTiff', tif4326, tif3857],
    'gdalwarp 3857',
  )

  // 4. Extraer tiles XYZ (esquema xyz estándar)
  const xMin = lonToX(west)
  const xMax = lonToX(east)
  const yMin = latToY(south)
  const yMax = latToY(north)

  let total = 0
  for (let z = zFrom; z <= zTo; z++) {
    const T = (2 * WORLD) / 2 ** z
    const xt0 = Math.floor((xMin + WORLD) / T)
    const xt1 = Math.floor((xMax + WORLD) / T)
    const yt0 = Math.floor((WORLD - yMax) / T)
    const yt1 = Math.floor((WORLD - yMin) / T)

    for (let xt = xt0; xt <= xt1; xt++) {
      const dir = join(outDir, String(z), String(xt))
      mkdirSync(dir, { recursive: true })
      const west2 = xt * T - WORLD
      const east2 = (xt + 1) * T - WORLD
      for (let yt = yt0; yt <= yt1; yt++) {
        const out = join(dir, `${yt}.webp`)
        if (!force && existsSync(out)) continue
        const north2 = WORLD - yt * T
        const south2 = WORLD - (yt + 1) * T
        gdal(
          'gdal_translate',
          [
            '-q', '-of', 'WEBP', '-co', 'QUALITY=95',
            '-projwin', String(west2), String(north2), String(east2), String(south2),
            '-outsize', '256', '256',
            tif3857, out,
          ],
          `tile z${z}/${xt}/${yt}`,
        )
        total++
      }
    }
    console.log(`   ✔ z${z}: cuadrícula ${xt0}-${xt1}/${yt0}-${yt1} (${(xt1 - xt0 + 1) * (yt1 - yt0 + 1)})`)
  }

  console.log(`   ✅ ${mapId}: ${total} tiles generados → ${outDir}`)
}

async function main() {
  const args = process.argv.slice(2)
  const force = args.includes('--force')
  const targets = args.filter((a) => !a.startsWith('-'))

  const maps = targets.length > 0 ? targets : Object.keys(MAP_TILES)

  for (const mapId of maps) {
    try {
      await generateMap(mapId, { force })
    } catch (err) {
      console.error(`❌ ${mapId}: ${err.message}`)
    }
  }
  console.log('\nListo.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
