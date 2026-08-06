# GLOSARIO TÉCNICO — Atlas Pluriversal

> Vocabulario común para hablar el mismo idioma durante el desarrollo.

---

## 0. ARQUITECTURA DEL RENDERIZADO

**MapLibre GL JS** es el motor de renderizado (WebGL). Recibe fuentes de datos, las procesa en la GPU y las dibuja en un `<canvas>`. No viene con ningún mapa incorporado — todo se le inyecta.

El visor del Atlas apila **3 fuentes de datos** en orden z (de abajo arriba):

```
───────────────────────────────────────────────
  Capa 3: GeoJSON sources        (vectorial)
  ─────────────────────────────────────────────
  Capa 2: Image source           (imagen atlas)
  ─────────────────────────────────────────────
  Capa 1: Raster tile source     (basemap)
───────────────────────────────────────────────
  WebGL canvas  (MapLibre)
```

| Capa | Tipo MapLibre | Contenido | Opacidad regulable |
|------|---------------|-----------|:---:|
| Basemap | `raster` tile source | Tiles OSM / CartoDB / ESRI | No |
| Imagen atlas | `image` source | El artwork del Atlas (PGW) | Sí — slider dev |
| Vectorial | `geojson` source | Ríos, ecosistemas, nodos | Sí — LayerPanel |

---

## 1. MOTOR Y MAPAS

| Término técnico | También llamado | Qué es |
|-----------------|---------------|--------|
| **MapLibre GL JS** | motor de mapas, renderer | Librería WebGL open-source que dibuja el canvas. No contiene datos geográficos por defecto. |
| **mapa base** / **basemap** | tile layer, fondo de referencia | Capa fuente `raster` con tiles genéricos (calles/satélite/relieve) para verificar posicionamiento. **Siempre debajo** de la imagen atlas. Solo en modo dev. |
| **imagen atlas** | image source, artwork, mapa en sí | Capa fuente `image`: una sola imagen artística georreferenciada mediante PGW. Es la capa principal del visor. |
| **fuente** / **source** | data source | Objeto registrado en MapLibre que contiene los datos. Tipos: `raster`, `image`, `geojson`, `vector`. |
| **capa** / **layer** | MapLibre layer | Cómo se renderiza una fuente: color, opacidad, visibilidad. Una fuente puede tener múltiples capas. |
| **AtlasMap** | visor, vista, componente | Componente React `<div>` contenedor del canvas MapLibre + overlays (loading, error, controles dev). |
| **entrada de mapa** / **map entry** | MapEntry | Tripleta `{ geo, images, config }` que define un mapa: PGW + dimensiones, URLs de imágenes, config de zoom/bearing/interacciones. |
| **mapId** | slug, identificador | Clave única: `intro`, `chapter1-ecosistemas`, `chapter2-valle`, `chapter2-cali`, `chapter3-humedales`, `chapter4-asoyoge`, etc. 31 total. |

### Proveedores de basemap

| Nombre técnico | URL de tiles | Perfil |
|----------------|-------------|--------|
| **OpenStreetMap (OSM)** | `tile.openstreetmap.org` | Calles, labels, edificios. Mapa completo. |
| **CartoDB Positron** | `basemaps.cartocdn.com` | Minimalista, claro, sin etiquetas. Bueno para no distraer. |
| **ESRI World Imagery** | `server.arcgisonline.com` | Satelital puro, sin etiquetas. Para ver el terreno real. |

> OSM es un proveedor de tiles, **no** "el mapa de MapLibre". MapLibre no tiene mapa propio. Cambiamos de proveedor según la necesidad.

---

## 2. GEORREFERENCIACIÓN

| Término | Sinónimos | Qué es |
|---------|-----------|--------|
| **PGW** | world file, geo | Array de 6 números `[A, D, B, E, C, F]` que mapean píxeles de la imagen a coordenadas geográficas. Ver §6 de MEMORIA_TECNICA.md. |
| **PGW rotado** | PGW original, formato v17 | Formato donde A=0, E=0, D≠0, B≠0. Es el almacenado en `atlas/src/data/maps/geo.js`. La imagen está rotada 90°; MapLibre con `bearing: -90` la muestra derecha. |
| **PGW estándar** | PGW convertido | Formato donde A≠0, E<0, D=0, B=0. Es el almacenado en `atlasMapData.ts` de 3.0. Imagen no rotada, bearing aplicado en MapLibre. |
| **bearing** | rotación, ángulo | Grados de rotación del viewport de MapLibre. Todos los mapas del Atlas usan `-90` (retrato/potrait). El usuario no puede cambiarlo (`dragRotate: false`). |
| **bounds** | límites geográficos, [W,S,E,N] | Rectángulo geográfico que ocupa la imagen atlas. Calculado desde PGW + dimensiones. Usado para `fitBounds` y `transformConstrain`. |
| **transformConstrain** | constrain, bearing-aware constrain | Función que reemplaza a `setMaxBounds` y limita la cámara considerando el bearing. Sin ella, con -90 los límites se clampa en ejes incorrectos. |
| **half-pixel correction** | — | Corrección aplicada en `BoundsCalculator`: resta medio píxel a C/F para obtener la esquina (no el centro) del píxel superior-izquierdo. |

---

## 3. CARGA PROGRESIVA

| Término | Sinónimos | Qué es |
|---------|-----------|--------|
| **placeholder** | thumbnail, baja resolución | Imagen de ~5-15KB que se carga instantáneamente (512px, calidad 30%). Evita pantalla en blanco. |
| **imagen full** | imagen completa, alta resolución | Imagen principal en resolución media~alta (100-500KB). Reemplaza al placeholder con fade. |
| **tiles** | XYZ tiles, pirámide de tiles | Sistema de mosaicos de alta resolución que cargan progresivamente por nivel de zoom. Solo generados para Cap 1. |
| **raster-fade-duration** | crossfade, fade de tiles | Tiempo en ms que MapLibre tarda en disolver un tile padre mientras aparece el hijo al cambiar de zoom. 300ms = transición suave; 0 = instantáneo. |
| **esquema xyz** | tile scheme | Sistema de coordenadas de tiles donde `y=0` es el borde superior (= norte). Usado por todos los tiles de este proyecto. |
| **over-zoom** | — | Cuando MapLibre muestra tiles de zoom N estirados en zoom N+1 (porque no hay tiles de nivel superior). Genera blur/artefactos. Se mitiga generando un nivel extra (z12). |

---

## 3b. CACHE Y DESPLIEGUE

| Término | Sinónimos | Qué es |
|---------|-----------|--------|
| **Cache-Control: immutable** | — | Header HTTP que indica al navegador que un recurso nunca cambia. Sin revalidación. Usado en todos los tiles (`max-age=31536000` = 1 año). |
| **Service Worker** | SW | Script del navegador que intercepta peticiones de red. Permite servir tiles offline desde Cache API después de la primera visita. |
| **precache** | precarga offline | Cargar tiles críticos (z6-z8, ~20 tiles) en el Service Worker durante la instalación para que funcionen sin conexión. |
| **Cloudflare R2** | object storage + CDN | Almacenamiento de objetos compatible con S3 API, con CDN de Cloudflare integrado y **egress gratuito**. 280+ puntos de presencia (incluye Bogotá). Opción recomendada como CDN fase 2. |
| **LiteSpeed** | LSCache | Servidor web del hosting cPanel. Cache de archivos estáticos built-in. Usado como servidor local (fase 1) con `.htaccess` para headers de cache. |
| **CDN** | Content Delivery Network | Red de servidores distribuidos geográficamente que sirven archivos desde el nodo más cercano al usuario. Reduce latencia. Cloudflare, BunnyCDN, Vercel Edge, Cloudinary. |
| **URL redundante / fallback** | multi-source tiles | Array de URLs en la fuente raster de MapLibre. Si la primera falla, prueba la segunda. Ej: CDN primero, local después. |
| **Cache API** | browser cache storage | API del navegador para almacenar respuestas HTTP completas (headers + body). Usada por el Service Worker para tiles offline. Más flexible que el cache HTTP normal. |

---

## 4. CAPAS VECTORIALES

| Término | Sinónimos | Qué es |
|---------|-----------|--------|
| **capa** / **layer** | GeoLayer, capa GeoJSON | FeatureCollection vectorial (ríos, ecosistemas, límites, nodos). Se carga desde archivos `.json` estáticos via `GeoLayerLoader`. |
| **LayerManager** | — | Servicio que gestiona visibilidad, opacidad y orden de las capas en MapLibre. |
| **categoría de capa** | — | Clasificación: `rivers`, `ecosystems`, `boundaries`, `nodes`, `conflicts`, `other`. |

---

## 5. ESTADO Y ARQUITECTURA

| Término | Sinónimos | Qué es |
|---------|-----------|--------|
| **store** | Zustand store | Módulo de estado global. Hay 4: `mapStore`, `chapterStore`, `layerStore`, `uiStore`. |
| **mapStore** | — | `activeMapId`, `mapBuilt`, `loading`, `error` |
| **chapterStore** | — | `activeChapter`, `activeTerritory`, `chapterMaps` |
| **layerStore** | — | `visibleLayers`, `opacities`, `activeCategories` |
| **uiStore** | — | `activeModal`, `sidebarOpen`, `activePanel`, `basemapVisible`, `basemapStyle`, `imageOpacity` |
| **orquestación** | — | Comunicación entre stores via `getState()`. Ej: `chapterStore.goToChapter(2)` llama a `mapStore.setActiveMap(...)` y `layerStore.applyChapterDefaults(...)`. |
| **servicio** | service | Función/clase pura sin React (TS). Ej: `BoundsCalculator`, `MapRenderer`, `BasemapManager`, `MapLogger`. |
| **hook** | custom hook | Función React que orquesta servicios y stores. Ej: `useMap`, `useChapter`, `useAudio`. |
| **componente** | component | Componente React (TSX). Ej: `AtlasMap`, `Sidebar`, `ChapterNav`, `AudioPlayer`. |
| **adaptador** | adapter | Wrapper de librería externa (MapLibre, Cloudinary). Aísla el proyecto de cambios en la librería. |

---

## 6. NAVEGACIÓN

| Término | Sinónimos | Qué es |
|---------|-----------|--------|
| **capítulo** | chapter | Unidad narrativa mayor. Hay 4: 1 (Cuenca), 2 (Valle), 3 (Humedales), 4 (Actores). |
| **territorio** | territory | Subdivisión dentro de un capítulo. Ej: Cap 2 → Suárez, Cali, Villa Rica. |
| **mapa** (en contexto narrativo) | — | Vista individual dentro de un capítulo/territorio. Ej: Cap 4 → 11 mapas. |
| **ruta** / **route** | URL | Ruta de React Router: `/`, `/atlas`, `/test/:mapId`. |

---

## 7. UI

| Término | Sinónimos | Qué es |
|---------|-----------|--------|
| **modal** | info modal, popup | Ventana emergente con contenido textual e imágenes. Extraído de v17 (`InfoModal` con layouts Luyaut1 y Luyaut2). |
| **sidebar** | panel lateral | Panel deslizable con tabs: Capítulos, Capas, Búsqueda. |
| **bottom sheet** | — | Versión mobile del sidebar (desde abajo, no lateral). |
| **audio player** | reproductor | Componente flotante para narraciones MP3. Cap 3 y 4. |
| **galería** | gallery, carrusel | Conjunto de imágenes navegable. Perfiles (3 SVG), Talleres (3 WebP), Cap 2 (Suárez, Cali, Villa Rica). |
| **entramados** | — | Vista de logos de organizaciones territoriales (30 logos). |
| **MapControls** | dev controls | Toolbar solo visible en dev (`VITE_DEV_TOOLS=true`). Toggle de basemap + selector de estilo + slider de opacidad. |

---

## 8. CÓDIGO FUENTE

| Término | Sinónimos | Qué es |
|---------|-----------|--------|
| **`atlas/`** | proyecto activo | Único directorio que modificamos. Nuestro rebuild. |
| **`atlas_front/atlas_frontend_v17/`** | v17, fuente de contenido | Proyecto funcional completo. NO modificar. Extraer de aquí: modales, galerías, audio, iconos, capas SVG, textos. |
| **`atlas_front/atlas_3.0/`** | 3.0 | Re-arquitectura en TypeScript (~12K líneas). NO modificar. Solo útil como referencia para subsistemas de mapas (31 configs, renderer, bounds, tiles). |
| **`atlas_backend/`** | backend, API | API REST con MongoDB + Cloudinary. NO modificar. Independiente del frontend. |
| **assets** | — | Archivos estáticos (imágenes, SVG, WebP, audio, GeoJSON). Se copian de v17 a `atlas/public/assets/`. |

---

## 9. FLUJO DE TRABAJO

```
Tú dices (coloquial):             Término técnico:
──────────────────────────────────────────────────
"la imagen del mapa"               → imagen atlas / ImageSource
"el mapa de fondo"                 → basemap / raster tile source
"el mapa callejero"                → basemap OSM
"ponle más transparencia al mapa"  → setImageOpacity() sobre imagen atlas
"activa el mapa de referencia"     → toggleBasemap() + basemapStyle
"los límites del mapa"             → bounds [W,S,E,N] / viewportMaxBounds
"el mapa está rotado"              → bearing = -90
"los datos de georeferencia"       → PGW / world file (array 6 números)
"el capítulo 2"                    → chapterStore.activeChapter = 2
"los tiles de alta resolución"     → pirámide XYZ / raster tile source del atlas
"el placeholder"                   → low-res image / thumbnail
"las stores"                       → Zustand stores (map, chapter, layer, ui)
"los servicios"                    → servicios TS puros (BoundsCalculator, etc.)
"los controles dev"                → MapControls (condicional VITE_DEV_TOOLS)
"el webGL / el canvas"             → MapLibre GL engine
```
