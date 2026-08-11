# Task 7 Report: CalibrationPanel multi-layer support

**Status:** Complete
**Commit:** `3daab48` — feat: extend CalibrationPanel with multi-layer target selector

## Changes Made

### 1. `src/services/SaveCalibration.ts` — Extended payload interface
- Added optional fields: `target` ('map' | 'layers'), `layerIds`, `entries`
- Made existing `pgw`, `width`, `height` optional (backward compat)
- JSON body now includes `target: payload.target ?? 'map'` default

### 2. `src/components/calibration/CalibrationPanel.module.css` — New CSS classes
- `.overridesSection` — flex container for target selector buttons
- `.targetActive` — highlighted style for active target button

### 3. `src/components/calibration/CalibrationPanel.tsx` — Multi-layer extension
- Added imports: `useLayerStore`, `getMapLayers`, `updateLayerPGW`, `RasterPgwLayer`
- Added `ENABLE_DEV_TOOLS` constant (gated by `VITE_DEV_TOOLS` env)
- Added `CalibrationTarget` type and `LAYER_COLORS` constant
- Added state: `target`, `activeLayerIdx`, `calibrationLayers` (from store), `layerStatesRef`
- Added `initLayerStates()` helper for initializing calibration from layer PGWs
- Added target selector UI (🗺 Mapa base / 📐 Capas) in header, gated behind `ENABLE_DEV_TOOLS && getMapLayers(mapId)`

### 4. `tests/components/CalibrationPanel.test.tsx` — New test file
- 2 tests: default map target rendering, switching to layers mode
- Uses `vi.hoisted` to stub `VITE_DEV_TOOLS` before module imports
- Mocks `@data/maps`, `@data/layers`, `maplibre-gl`

## Test Results
```
Test Files  9 passed (9)
     Tests  73 passed (73)
```

All existing tests (including `MapCalibration.test.ts`) continue to pass.
