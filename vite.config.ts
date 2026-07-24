import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { defineConfig } from "vite";

const TILE_WEBP_PATH = /\/assets\/maps\/tiles\/.*\.webp(?:\?.*)?$/i;
const PUBLIC_ROOT = path.resolve(__dirname, "public");

const resolveRequestedTilePath = (requestUrl: string): string | null => {
  const cleanPath = requestUrl.split("?")[0]?.split("#")[0] ?? "";
  if (!TILE_WEBP_PATH.test(cleanPath)) {
    return null;
  }

  const relativePath = decodeURIComponent(cleanPath).replace(/^\/+/, "");
  const absolutePath = path.resolve(PUBLIC_ROOT, relativePath);

  if (!absolutePath.startsWith(PUBLIC_ROOT)) {
    return null;
  }

  return absolutePath;
};

const tileCacheHeadersPlugin = {
  name: "atlas-tile-cache-headers",
  configureServer(server: { middlewares: { use: (fn: (req: { url?: string }, res: { statusCode?: number; setHeader: (name: string, value: string) => void; end: (data: string) => void }, next: () => void) => void) => void } }) {
    server.middlewares.use((req, res, next) => {
      const tilePath = req.url ? resolveRequestedTilePath(req.url) : null;
      if (tilePath) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

        // Evita que Vite dev devuelva index.html (200 text/html) en tiles faltantes.
        if (!fs.existsSync(tilePath)) {
          res.statusCode = 404;
          res.end("Not Found");
          return;
        }
      }
      next();
    });
  },
  configurePreviewServer(server: { middlewares: { use: (fn: (req: { url?: string }, res: { statusCode?: number; setHeader: (name: string, value: string) => void; end: (data: string) => void }, next: () => void) => void) => void } }) {
    server.middlewares.use((req, res, next) => {
      if (req.url && TILE_WEBP_PATH.test(req.url)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
      next();
    });
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tileCacheHeadersPlugin],
  resolve: {
    alias: {
      "@map": path.resolve(__dirname, "src/domains/map"),
      "@layers": path.resolve(__dirname, "src/domains/layers"),
      "@chapters": path.resolve(__dirname, "src/domains/chapters"),
      "@media": path.resolve(__dirname, "src/domains/media"),
      "@spatial": path.resolve(__dirname, "src/domains/spatial"),
      "@state": path.resolve(__dirname, "src/state"),
      "@ui": path.resolve(__dirname, "src/ui"),
      "@lib": path.resolve(__dirname, "src/lib"),
      "@shared": path.resolve(__dirname, "src/shared"),
    },
  },
  build: {
    // MapLibre GL genera un chunk grande por diseño; elevamos el umbral
    // para que el warning refleje solo regresiones reales de tamaño.
    chunkSizeWarningLimit: 1100,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor: React
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom")
          ) {
            return "vendor-react";
          }
          // Vendor: MapLibre GL
          if (id.includes("node_modules/maplibre-gl")) {
            return "vendor-maplibre";
          }
          // Vendor: Zustand
          if (id.includes("node_modules/zustand")) {
            return "vendor-zustand";
          }
          // Dominio mapa
          if (
            id.includes("/src/domains/map/") ||
            id.includes("/src/lib/maplibre/")
          ) {
            return "domain-map";
          }
          // Dominio capas (sólo metadata, sin geometría)
          if (id.includes("/src/domains/layers/")) {
            return "domain-layers";
          }
        },
      },
    },
  },
});
