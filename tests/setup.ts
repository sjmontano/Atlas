import '@testing-library/jest-dom/vitest'

// Polyfill para maplibre-gl en jsdom (lección bitácora: jsdom no implementa
// URL.createObjectURL y MapLibre lo requiere para workers/imágenes)
if (typeof URL !== 'undefined' && !URL.createObjectURL) {
  URL.createObjectURL = () => 'blob:mock'
  URL.revokeObjectURL = () => {}
}
