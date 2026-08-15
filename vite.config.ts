import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { readFileSync, writeFileSync, existsSync, createReadStream } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { rewriteGeoEntry } from './src/services/geoRewrite.ts'
import { rewriteLayerCalibration } from './src/services/rewriteLayerCalibration.ts'

function calibrationSavePlugin(): Plugin {
  const geoPath = resolve(__dirname, 'src/data/maps/geo.ts')
  const calibrationPath = resolve(__dirname, 'src/data/layers/calibration.ts')

  return {
    name: 'calibration-save',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__calibration/save', (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end(); return }

        let body = ''
        req.on('data', (chunk: string) => { body += chunk })
        req.on('end', () => {
          try {
            const payload = JSON.parse(body) as {
              mapId?: unknown
              pgw?: unknown
              width?: unknown
              height?: unknown
              target?: unknown
              layerIds?: unknown
              entries?: unknown
            }
            const target = typeof payload.target === 'string' ? payload.target : 'map'

            if (target === 'layers') {
              const layerIds = Array.isArray(payload.layerIds) ? payload.layerIds : []
              const entries = Array.isArray(payload.entries) ? payload.entries : []

              if (layerIds.length === 0 || entries.length === 0) {
                throw new Error('layerIds y entries requeridos para target=layers')
              }

              let src = existsSync(calibrationPath) ? readFileSync(calibrationPath, 'utf8') : 'import type { PGWData } from \'@services/BoundsCalculator\'\n\nexport interface CalibrationEntry {\n  pgw: PGWData\n  width: number\n  height: number\n}\n\nexport const LAYER_CALIBRATIONS: Record<string, CalibrationEntry> = {\n}'
              for (const entry of entries) {
                const id = String(entry.id ?? '')
                if (!/^[A-Za-z0-9_-]+$/.test(id)) throw new Error(`layerId inválido: "${id}"`)
                const pgw = entry.pgw
                if (!Array.isArray(pgw) || pgw.length !== 6 || !pgw.every((v) => typeof v === 'number' && Number.isFinite(v))) {
                  throw new Error('pgw inválido en entry')
                }
                const w = typeof entry.width === 'number' ? Math.round(entry.width) : NaN
                const h = typeof entry.height === 'number' ? Math.round(entry.height) : NaN
                if (!Number.isFinite(w) || !Number.isFinite(h) || w < 1 || h < 1) {
                  throw new Error('width/height inválidos en entry')
                }
                src = rewriteLayerCalibration(src, id, { pgw: pgw as [number,number,number,number,number,number], width: w, height: h })
              }
              writeFileSync(calibrationPath, src, 'utf8')
              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ ok: true, target: 'layers' }))
              return
            }

            const { mapId, pgw, width, height } = payload

            if (typeof mapId !== 'string' || !/^[A-Za-z0-9_-]+$/.test(mapId)) {
              throw new Error('mapId inválido')
            }

            if (
              !Array.isArray(pgw) ||
              pgw.length !== 6 ||
              !pgw.every((v) => typeof v === 'number' && Number.isFinite(v))
            ) {
              throw new Error('pgw inválido')
            }

            const w = typeof width === 'number' && Number.isFinite(width) ? Math.round(width) : NaN
            const h = typeof height === 'number' && Number.isFinite(height) ? Math.round(height) : NaN
            if (!Number.isFinite(w) || !Number.isFinite(h) || w < 1 || h < 1) {
              throw new Error('width/height inválidos')
            }

            const src = readFileSync(geoPath, 'utf8')
            const out = rewriteGeoEntry(src, mapId, {
              pgw: pgw as [number, number, number, number, number, number],
              width: w,
              height: h,
            })
            writeFileSync(geoPath, out, 'utf8')

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ ok: true, mapId }))
          } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ ok: false, error: String(err) }))
          }
        })
      })
    },
  }
}

/**
 * Sirve los tiles XYZ de /assets/maps/tiles/*.webp desde public/ con
 * cache inmutable y devuelve 404 REAL si el tile no existe (evita que el
 * fallback SPA de Vite dev responda index.html con 200, lo que rompería
 * MapLibre al intentar decodificar HTML como WebP).
 */
function tilesServePlugin(): Plugin {
  const tilesRoot = resolve(__dirname, 'public/assets/maps/tiles')

  return {
    name: 'atlas-tiles-serve',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url ?? '').split('?')[0]
        const TILES_PREFIX = '/assets/maps/tiles/'
        if (!url.startsWith(TILES_PREFIX) || !url.endsWith('.webp')) {
          return next()
        }

        const rel = url.slice(TILES_PREFIX.length)
        const filePath = resolve(tilesRoot, rel)
        if (filePath.startsWith(tilesRoot) && existsSync(filePath)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
          res.setHeader('Content-Type', 'image/webp')
          createReadStream(filePath).pipe(res)
        } else {
          res.statusCode = 404
          res.end('Not Found')
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), calibrationSavePlugin(), tilesServePlugin()],

  resolve: {
    alias: {
      '@data': resolve(__dirname, 'src/data'),
      '@services': resolve(__dirname, 'src/services'),
      '@stores': resolve(__dirname, 'src/stores'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@types': resolve(__dirname, 'src/types'),
      '@utils': resolve(__dirname, 'src/utils'),
    },
  },

  build: {
    modulePreload: {
      polyfill: false,
      resolveDependencies(_filename, deps) {
        return deps.filter((d) => !d.includes('vendor-maplibre'))
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/maplibre-gl')) return 'vendor-maplibre'
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) return 'vendor-react'
          if (id.includes('node_modules/zustand')) return 'vendor-zustand'
        },
      },
    },
    chunkSizeWarningLimit: 1100,
  },
})
