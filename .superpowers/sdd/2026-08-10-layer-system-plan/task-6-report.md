# Task 6: LayerMenu — Report

**Status:** Done

## Summary

Created the `LayerMenu` component — a floating collapsible panel that displays map layers in a tree grouped by layer groups, with tri-state checkboxes and calibration mode support.

## Files Created

| File | Description |
|------|-------------|
| `src/components/map/LayerMenu.tsx` | Main component with groups, tri-state toggles, calibration mode, opacity sliders |
| `src/components/map/LayerMenu.module.css` | Dark theme styles, floating panel top-right, z-index 100 |
| `tests/components/LayerMenu.test.tsx` | 4 tests covering rendering, visibility toggle, empty state, group expansion |

## Component Architecture

- **Props:** `mapId: string`, `onCalibrate: () => void`
- **Consumes:** `useLayerStore` (Task 2), `getMapLayers`/`getLayerGroups` (Task 3), `Layer`/`LayerGroup` types (Task 1)
- **Sub-component:** `LayerRow` — individual layer row with checkbox, swatch, name, opacity slider
- **Key behaviors:**
  - Tri-state checkboxes for groups (all/none/some visible)
  - Master "Todas" toggle for all layers
  - Collapsible panel header
  - Calibration mode with layer selection and "Calibrar selección" button
  - Group expansion/collapse with animated arrow
  - Returns `null` when map has no layers

## Test Results

```
 ✓ renders group and layer names
 ✓ toggles layer visibility on checkbox click
 ✓ renders nothing when map has no layers
 ✓ toggles group expansion on click

 Tests: 4 passed
```

## Deviations from Brief

- Test matchers changed from exact string (`'Group 1'`) to regex (`/Group 1/`) because the component renders the group count in the same span element (e.g., `Group 1 (2)`). This is the standard testing-library approach for partial text matching.

## CSS

- Dark theme: `rgba(10, 10, 30, 0.92)` background, `#2a2a4e` border
- Position: absolute top-right, `z-index: 100`
- `max-height: calc(100vh - 140px)` with scrollable body
- `backdrop-filter: blur(8px)` for frosted glass effect
