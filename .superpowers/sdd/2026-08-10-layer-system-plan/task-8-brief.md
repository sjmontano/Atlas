### Task 8: Save infra — rewriteLayerCalibration + Vite plugin + test

**Files:**
- Create: `src/services/rewriteLayerCalibration.ts`
- Modify: `vite.config.ts`
- Create: `tests/services/rewriteLayerCalibration.test.ts`

**Interfaces:**
- Consumes: `SaveCalibrationPayload` (Task 7), `rewriteGeoEntry` pattern from `geoRewrite.ts`
- Produces: `rewriteLayerCalibration(src, layerId, data): string`, Vite plugin handles `target: 'layers'`

- [ ] **Step 1: Create `src/services/rewriteLayerCalibration.ts`**

```ts
export interface LayerCalibrationEntry {
  readonly pgw: readonly [number, number, number, number, number, number]
  readonly width: number
  readonly height: number
}

export function rewriteLayerCalibration(
  src: string,
  layerId: string,
  data: LayerCalibrationEntry,
): string {
  const valid = /^[A-Za-z0-9_-]+$/.test(layerId)
  if (!valid) throw new Error(`layerId inválido: "${layerId}"`)
  const [a, d, b, e, c, f] = data.pgw
  const block = [
    `  '${layerId}': {`,
    `    pgw: [${a}, ${d}, ${b}, ${e}, ${c}, ${f}],`,
    `    width: ${Math.round(data.width)},`,
    `    height: ${Math.round(data.height)},`,
    `  },`,
  ].join('\n')

  const re = new RegExp(`^  '${escapeRegex(layerId)}': \\{[\\s\\S]*?\\r?\\n  \\},`, 'm')
  if (re.test(src)) {
    return src.replace(re, block)
  }

  const closingBraceIdx = src.lastIndexOf('}')
  if (closingBraceIdx === -1) throw new Error('Formato inválido: calibration.js')
  return src.slice(0, closingBraceIdx) + '\n' + block + '\n' + src.slice(closingBraceIdx)
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
```

- [ ] **Step 2: Write the failing rewrite test**

Create `tests/services/rewriteLayerCalibration.test.ts`:

```ts
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
```

- [ ] **Step 3: Run test to verify it fails**

```bash
pnpm test -- tests/services/rewriteLayerCalibration.test.ts
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm test -- tests/services/rewriteLayerCalibration.test.ts
```

- [ ] **Step 5: Extend `vite.config.ts`**

After the existing `calibrationSavePlugin` function, add layer save handling inside the POST handler. Find the route handler block and extend the validation + save logic:

Add import at top:

```ts
import { rewriteLayerCalibration } from './src/services/rewriteLayerCalibration.ts'
```

Inside `calibrationSavePlugin`, add `calibrationPath`:

```ts
const calibrationPath = resolve(__dirname, 'src/data/layers/calibration.js')
```

Inside the POST handler, after the existing validation, add branching:

```ts
const target = typeof payload.target === 'string' ? payload.target : 'map'

if (target === 'layers') {
  const layerIds = Array.isArray(payload.layerIds) ? payload.layerIds : []
  const entries = Array.isArray(payload.entries) ? payload.entries : []

  if (layerIds.length === 0 || entries.length === 0) {
    throw new Error('layerIds y entries requeridos para target=layers')
  }

  let src = existsSync(calibrationPath) ? readFileSync(calibrationPath, 'utf8') : 'export const LAYER_CALIBRATIONS = {\n}'
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
  res.end(JSON.stringify({ ok: true, mapId, target: 'layers' }))
  return
}

// existing map target logic below...
```

- [ ] **Step 6: Run full test suite**

```bash
pnpm test
```

Expected: all tests pass (existing + new).

- [ ] **Step 7: Commit**

```bash
git add src/services/rewriteLayerCalibration.ts vite.config.ts tests/services/rewriteLayerCalibration.test.ts
git commit -m "feat: add rewriteLayerCalibration and extend Vite plugin for layer save"
```

---


