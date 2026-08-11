# Task 1: Types — Extend layer.ts + Create poi.ts

**Files:**
- Modify: `src/types/layer.ts`
- Create: `src/types/poi.ts`

**Goal:** Define the complete layer and POI type system that all downstream tasks depend on.

**Consumes:** (none — this is the foundation task)

**Produces:**
- `LayerType`, `LayerBase`, `RasterPgwLayer`, `RasterTilesLayer`, `GeojsonLayer`, `LayerGroup`, `Layer` (union)
- `Poi`

## Step 1: Rewrite `src/types/layer.ts`

```ts
import type { PGWData } from '@services/BoundsCalculator'

export type LayerCategory = 'rivers' | 'ecosystems' | 'boundaries' | 'nodes' | 'conflicts' | 'other'

export interface LayerMetadata {
  id: string
  name: string
  slug: string
  category: LayerCategory
  geometryType: string
  featureCount: number
  description: string
}

export type LayerType = 'raster-pgw' | 'raster-tiles' | 'geojson'

export interface LayerBase {
  id: string
  name: string
  category: LayerCategory
  group?: string
  visibleByDefault?: boolean
  opacity?: number
  order: number
  legend?: {
    swatch?: string
    description?: string
    longText?: string
  }
}

export interface RasterPgwLayer extends LayerBase {
  type: 'raster-pgw'
  image: string
  pgw: PGWData
  width: number
  height: number
}

export interface RasterTilesLayer extends LayerBase {
  type: 'raster-tiles'
  urlTemplate: string
  tileSize: number
  minZoom: number
  maxZoom: number
  fadeDuration?: number
}

export interface GeojsonLayer extends LayerBase {
  type: 'geojson'
  url: string
  geometry: 'fill' | 'line' | 'symbol' | 'circle'
  paint: Record<string, unknown>
}

export type Layer = RasterPgwLayer | RasterTilesLayer | GeojsonLayer

export interface LayerGroup {
  id: string
  name: string
  parent?: string
  order: number
}
```

Important: The existing `LayerCategory` type and `LayerMetadata` interface must be preserved at the top. The new types are appended below them.

## Step 2: Create `src/types/poi.ts`

```ts
export interface Poi {
  id: string
  numero?: number
  name: string
  coords: [number, number]
  capa?: string
  popup: {
    title: string
    body?: string
    image?: string
    audio?: string
  }
  angle?: number
  icon?: string
}
```

## Step 3: Run typecheck

```bash
pnpm typecheck
```

Expected: passes (no consumers yet, but types must compile).

## Step 4: Commit

```bash
git add src/types/layer.ts src/types/poi.ts
git commit -m "feat: extend layer types and add Poi type"
```
