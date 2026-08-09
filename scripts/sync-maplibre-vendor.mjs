import { copyFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const vendorDir = resolve(__dirname, '..', 'public', 'vendor', 'maplibre')
const distDir = resolve(__dirname, '..', 'node_modules', 'maplibre-gl', 'dist')

const files = ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs']

mkdirSync(vendorDir, { recursive: true })

for (const f of files) {
  const src = resolve(distDir, f)
  const dst = resolve(vendorDir, f)
  copyFileSync(src, dst)
  console.log(`copiado: ${f} → public/vendor/maplibre/${f}`)
}

console.log('sync:maplibre completado')
