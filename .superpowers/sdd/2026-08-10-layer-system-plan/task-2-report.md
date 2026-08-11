# Task 2 Report: layerStore Extension

**Status:** Complete

**Commit:** `489417a` — `feat: extend layerStore with calibration selection, groups, persistence`

**Test Summary:** Passed 17/17

**Summary:** Extended Zustand layer store with calibration selection (`selectedForCalibration`, `toggleCalibrationSelection`, `setCalibrationSelection`, `clearCalibrationSelection`), group management (`setLayerGroupVisible`, `expandedGroups`, `toggleGroupExpanded`), and per-map localStorage persistence (`resetAll` with subscribe-based auto-save). Created TypeScript declarations and comprehensive test suite.

**Concerns:** None. The brief mentions "12 tests" but the test code contains 17 `it` blocks — likely a counting error in the brief. All pass.
