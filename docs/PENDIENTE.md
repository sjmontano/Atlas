# Tareas Pendientes — Atlas 2.0

Estado al 4 de marzo de 2026. Las fases 1–4 están completas.

---

## Fase 5 — Modales

### 5.1 `TerritoryInfoModal`

- Componente `src/ui/components/modals/TerritoryInfoModal.tsx`
- Se abre con `useUIStore().openModal("territory-info", { territoryId })`
- Muestra: nombre del territorio, descripción, mapas disponibles, galería de imágenes
- Fuente de datos: `chaptersData.ts` (territories)

### 5.2 `LayerInfoModal`

- Componente `src/ui/components/modals/LayerInfoModal.tsx`
- Se abre desde `LayerControl` al hacer clic en el ícono de info de una capa
- Muestra: nombre de la capa GeoJSON, descripción, metadatos, estadísticas básicas (nº de features)

### 5.3 `MediaGalleryModal`

- Componente `src/ui/components/modals/MediaGalleryModal.tsx`
- Se abre con `openModal("media-gallery", { images: CloudinaryImage[] })`
- Galería con swipe, zoom, descripción
- Consume imágenes desde `useGeoImages` (dominio media)

### 5.4 `ModalShell`

- Componente `src/ui/components/modals/ModalShell.tsx`
- Render condicional según `useUIStore().activeModal`
- Backdrop, cierre con Escape, foco trampa (a11y)
- Montar en `Atlas.tsx` fuera del flujo del mapa

---

## Fase 6 — Multimedia y Control Espacial

### 6.1 Integración real de imágenes Cloudinary

- `useGeoImages` ya carga el índice; falta conectarlo al mapa
- Cuando se activa un nodo territorial, mostrar su imagen en popup MapLibre
- Crear `src/domains/media/hooks/useNodeImages.ts`

### 6.2 Popups MapLibre con datos de capas

- En `useMapLayers`, añadir handler `click` por capa que llame `openModal("layer-info", feature)`
- Ver patrón: `map.on("click", "${layerId}-fill", handler)`

### 6.3 Control espacial (Bounding-box query)

- Dominio `src/domains/spatial/` (pendiente de crear)
- `useRectangleSelect.ts` — dibuja rectángulo sobre el mapa y devuelve features intersectadas
- `useSpatialFilter.ts` — filtra las capas visibles por área seleccionada
- Conecta al `layersStore.activeCategories`

### 6.4 Panel de búsqueda en Sidebar

- Tab "Buscar" en Sidebar actualmente muestra placeholder
- `src/ui/components/sidebar/SearchPanel.tsx`
- Búsqueda por nombre en capas cargadas (`useGeoLayers().searchLayers()` ya existe)
- Resultados: lista de features con botón "Ir a" → `map.flyTo({ center: feature.geometry.coordinates })`

---

## Fase 7 — Navegación multi-capítulo completa

### 7.1 Capítulo 2 y siguiente

- `chaptersData.ts` tiene entradas placeholder para capítulo 2
- Agregar mapas reales: tiles, PGW, dimensiones en `atlasMapData.ts` y `mapSettings.ts`
- `chaptersStore.CHAPTER_MAPS` debe sincronizarse con `chaptersData.ts` (actualmente duplicado)

### 7.2 Sincronizar `chaptersStore.CHAPTER_MAPS` con `chaptersData.ts`

- Eliminar el literal `CHAPTER_MAPS` en `chaptersStore.ts`
- Importar `getChapterMapIds` desde `@chapters/data/chaptersData`
- Reemplazar en `goToChapter`: `const maps = getChapterMapIds(chapter)`

### 7.3 Selector de territorio dentro del capítulo

- `ChapterNav` muestra sólo mapas; añadir sub-sección de territorios cuando `chapter.territories` no esté vacío
- Conectar a `chaptersStore.goToTerritory()` + filtrar capas por territorio activo

---

## Fase 8 — Calidad y producción

### 8.1 Code splitting

- Bundle principal > 1 MB; aplicar `dynamic import()` en:
  - `MapLibreAdapter` + `maplibre-gl` → chunk separado
  - Datos GeoJSON (31 archivos) → lazy por categoría
  - `geo-images/index.ts` (3945 líneas) → import dinámico al abrir MediaGallery

### 8.2 Tests

- Setup Vitest + Testing Library
- Tests unitarios: `chaptersData.ts`, `mapConfigProvider.ts`, `zoomCalculator.ts`
- Tests de integración: `useChapter` hook, `chaptersStore.goToChapter()`

### 8.3 Accesibilidad

- `ChapterNav`: roles `navigation`, `listbox`, `option`; keyboard navigation
- `Sidebar`: focus trap cuando está abierto; `aria-expanded`
- `ModalShell`: focus trap, `role="dialog"`, `aria-modal`

### 8.4 Framer Motion (ya instalado, no usado)

- Animaciones de entrada del Sidebar (slide + fade)
- Transición entre mapas (crossfade del loader)
- Animaciones de modales

---

## Deuda técnica

| Ítem                      | Ubicación          | Descripción                                                               |
| ------------------------- | ------------------ | ------------------------------------------------------------------------- |
| `CHAPTER_MAPS` duplicado  | `chaptersStore.ts` | Redundante con `chaptersData.ts`                                          |
| `mapConfig.chapter` field | `atlasMapData.ts`  | Referenciado en AtlasMapBuilder pero el campo no existe en el tipo actual |
| Chunk size warning        | vite build         | `index.js` > 500 kB — pendiente code splitting                            |
| `MapTestPage`             | pages/             | Ruta de testing; puede retirarse cuando Atlas visor esté estable          |

---

## Fase 9 — Deploy (hacer al final, cuando el proyecto esté listo)

### 9.1 Crear subdominio en cPanel

1. cPanel → **Dominios → Subdominios**
   - Subdominio: `atlas`
   - Dominio: `unriocauca.com`
   - Raíz del documento: `/public_html/atlas` (cPanel la crea automáticamente)

2. cPanel → **SSL/TLS → Let's Encrypt / AutoSSL**
   - Emitir certificado para `atlas.unriocauca.com`
   - Esperar ~5 minutos — el hosting lo emite automáticamente

### 9.2 Build final y subida

```bash
npm run build
```

Subir **todo el contenido de `dist/`** a `/public_html/atlas/`:

```
dist/
  index.html          → /public_html/atlas/index.html
  .htaccess           → /public_html/atlas/.htaccess   ← crítico, no omitir
  assets/             → /public_html/atlas/assets/
    maps/tiles/       → tiles WebP (~6 MB)
    geo-layers/       → JSON de capas (~3.5 MB)
    maps/base-images/ → imágenes base WebP
```

### 9.3 Verificación post-deploy

En DevTools → Network, abrir un tile cualquiera y confirmar:

```
Cache-Control: public, max-age=31536000, immutable   ✅
Content-Type:  image/webp                            ✅
Access-Control-Allow-Origin: *                       ✅
```

En DevTools → Network → `index.html`:

```
Cache-Control: no-cache, no-store, must-revalidate   ✅
```

### 9.4 Notas del servidor

- **Hosting**: latinoamericahosting.com.co — Plan M2
- **Servidor**: LiteSpeed (lee `.htaccess` en modo compatibilidad Apache)
- **IP**: 15.235.86.58 (compartida)
- **SSL**: Let's Encrypt (vence cada 90 días — AutoSSL lo renueva solo)
- **Inodes disponibles**: ~221,000 libres de 250,000 — suficiente para todos los mapas futuros
