## Task 4: LayerManager — Complete

### Status: ✅ Done

- **Created**: `src/services/LayerManager.ts` (175 lines)
- **Created**: `tests/services/LayerManager.test.ts` (165 lines)
- **Commit**: `3a00e11` — `feat: add LayerManager service with sync, addLayer, updateLayerPGW`

### Test Results: 8/8 passing

| Suite | Tests | Status |
|-------|-------|--------|
| addLayer (raster-pgw) | 3 | ✅ |
| removeLayer | 1 | ✅ |
| removeAll | 1 | ✅ |
| sync | 1 | ✅ |
| updateLayerPGW | 2 | ✅ |

### Exports

- `addLayer(map, layer, store, allLayers?)` — adds image source + raster layer with PGW bounds, respects visibility/opacity from store
- `removeLayer(map, layerId)` — removes both layer and source
- `removeAll(map)` — removes all `atlas-layer-*` prefixed layers/sources
- `updateLayerPGW(map, layerId, pgw, width, height)` — calls `setCoordinates` on an existing ImageSource
- `sync(map, mapId, layers, groups, store)` — reconciles current map layers with desired state (adds missing, removes stale, updates visibility/opacity)
