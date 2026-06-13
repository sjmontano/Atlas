import { beforeEach, vi } from "vitest";

// MapLibre inicializa workers al importar el módulo y requiere
// URL.createObjectURL disponible desde el arranque del entorno de test.
if (typeof window.URL.createObjectURL !== "function") {
  const createObjectURLMock = vi.fn(() => "blob:mock-maplibre-worker");
  Object.defineProperty(window.URL, "createObjectURL", {
    value: createObjectURLMock,
    writable: true,
    configurable: true,
  });
}

beforeEach(() => {
  window.localStorage.clear();
});
