# Task 9 Report: AtlasMap Integration + Copy Composites

## Status: COMPLETED

## Files Modified

1. **`src/components/map/AtlasMap.tsx`** — Rewritten with full layer/POI/menu integration:
   - Added `useMemo` for `layers`, `groups`, `pois`
   - Added `useState` for `activePoi`
   - Added 3 new `useEffect`s:
     - Reset layers on mount via `useLayerStore.getState().resetAll(mapId)`
     - Sync layers via `syncLayers()` reacting to `visibleLayers`/`opacities` changes
     - Add POIs via `addPois()` with `setActivePoi` click handler
   - Added `<LayerMenu>` and `<PoiModal>` components to render tree
   - Preserved all existing hooks (`useAutoLowPower`, `usePrefetchAdjacent`, `useTilePrefetch`, basemap, imageOpacity), loading/error/degraded states, and `<MapControls>`

2. **`src/components/map/LayerMenu.tsx`** — Fixed type errors:
   - Changed `useLayerStore(selector)` pattern to single `const store = useLayerStore()` with destructuring
   - Changed `@types/layer` import to relative path

3. **`src/components/map/PoiModal.tsx`** — Fixed type error:
   - Changed `@types/poi` import to relative path

4. **`src/components/calibration/CalibrationPanel.tsx`** — Fixed type errors:
   - Removed unused imports (`updateLayerPGW`, `LAYER_COLORS`)
   - Changed `useLayerStore(selector)` to destructured `useLayerStore()` call
   - Changed `@types/layer` import to relative path
   - Fixed `noUncheckedIndexedAccess` issue with `layerIds[0]`
   - Prefixed unused `activeLayerIdx` with `_`

5. **`src/services/LayerManager.ts`** — Fixed type errors:
   - Removed unused imports (`GeographicBounds`, `RasterTilesLayer`)
   - Changed `@types/layer` import to relative path
   - Prefixed unused `mapId` parameter with `_`

6. **`src/services/PoiManager.ts`** — Fixed type errors:
   - Changed `@types/poi` import to relative path
   - Replaced `GeoJSON.Feature` with inline `GeoJSONFeature` interface (no `geojson` package available)

## Files Copied

- 7 composite `.webp` images from `tiles/ecosistemas/_composites/` to `public/assets/maps/capas/ecosistemas/`

## Verification

- `pnpm typecheck`: **PASS** (0 errors)
- `pnpm test`: **PASS** (10 files, 78 tests)
