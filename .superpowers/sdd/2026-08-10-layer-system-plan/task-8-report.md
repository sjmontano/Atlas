# Task 8 Report — Layer Calibration Save Infrastructure

**Date:** 2026-08-10

## Summary

Created `rewriteLayerCalibration` service, wrote tests, and extended the Vite calibration plugin to handle layer calibration saves alongside existing map calibration saves.

## Files Created / Modified

| File | Action | Status |
|------|--------|--------|
| `src/services/rewriteLayerCalibration.ts` | Created | Done |
| `tests/services/rewriteLayerCalibration.test.ts` | Created | Done |
| `vite.config.ts` | Modified | Done |

## Test Results

```
Test Files  10 passed (10)
     Tests  78 passed (78)
```

All existing tests continue to pass. New tests (5):

- Replaces an existing entry
- Appends a new entry when id does not exist
- Throws on invalid layerId
- Preserves the rest of the file
- Handles CRLF line endings

## Vite Plugin Changes

- Added `import { rewriteLayerCalibration }` at top
- Added `calibrationPath` pointing to `src/data/layers/calibration.js`
- Extended POST payload type to include `target`, `layerIds`, `entries`
- Added `target === 'layers'` branch that validates layer entries, calls `rewriteLayerCalibration`, writes calibration.js, and returns early
- Existing map save logic remains unchanged

## Implementation Notes

- `rewriteLayerCalibration` differs from `rewriteGeoEntry` in one key way: when an entry is not found, it **appends** (rather than throwing). This supports adding new layers.
- The Vite plugin now supports two targets: `map` (default, existing) and `layers` (new).
