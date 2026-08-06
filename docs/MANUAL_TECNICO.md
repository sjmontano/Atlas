# MANUAL TÉCNICO — Atlas Pluriversal

> Documento vivo de arquitectura, terminología y funcionamiento interno.
> Aquí se anota todo lo que vamos descubriendo para tener una fuente única de verdad técnica.

---

## 0. ÍNDICE DE CONTENIDO

1. [Arquitectura General](#1-arquitectura-general)
2. [Terminología Técnica Formal](#2-terminología-técnica-formal)
3. [Stack de Renderizado (3 Capas)](#3-stack-de-renderizado-3-capas)
4. [MapLibre GL JS — El Motor](#4-maplibre-gl-js--el-motor)
5. [PGW Data — Georreferenciación](#5-pgw-data--georreferenciación)
6. [Imagen Atlas — ImageSource](#6-imagen-atlas--imagesource)
7. [Basemap — Raster Tile Source](#7-basemap--raster-tile-source)
8. [Capas Vectoriales — GeoJSON](#8-capas-vectoriales--geojson)
9. [Bearing y Rotación](#9-bearing-y-rotación)
10. [Notas Vivas](#10-notas-vivas)

---

## 1. ARQUITECTURA GENERAL

### Frontend monolítico (sin backend)

```
atlas/                   ← Proyecto activo. Único que se modifica.
├── src/
│   ├── main.tsx         Entry point de la app
│   ├── App.tsx          Router principal
│   ├── data/            Datos estáticos JS (PGW, imágenes, configs, capítulos)
│   ├── services/        Lógica pura TS (sin React, sin JSX)
│   ├── stores/          Estado global Zustand (4 stores)
│   ├── hooks/           Custom hooks React
│   ├── components/      Componentes React TSX + CSS Modules
│   ├── types/           Tipos globales TS
│   └── styles/          Variables CSS, tokens, animaciones globales
├── public/assets/       Archivos estáticos (imágenes, SVGs, audio, GeoJSON)
├── .env.development     Variables entorno desarrollo
└── .env.production      Variables entorno producción
```

### Stack

| Capa | Tecnología | Rol |
|------|-----------|-----|
| Motor de mapas | MapLibre GL JS 6 | Renderiza canvas con WebGL. No trae datos propios. |
| Lenguaje | TypeScript strict | Tipado en servicios, hooks, componentes. |
| Estado | Zustand 5 | 4 stores globales sin boilerplate. |
| UI | React 19 + CSS Modules | Componentes con estilos encapsulados. |
| Router | React Router 7 | SPA con lazy loading. |

---

## 2. TERMINOLOGÍA TÉCNICA FORMAL

### Términos fundamentales

| Término técnico | Definición |
|-----------------|-----------|
| **MapLibre GL JS** | Librería open-source de renderizado cartográfico WebGL. Es el **motor de dibujo**: recibe fuentes geográficas y las rasteriza en un canvas. No contiene ningún mapa por defecto. Equivalente a un "motor de videojuegos para mapas". |
| **Source** (fuente) | Objeto registrado en MapLibre que contiene los datos geográficos brutos. Tipos: `image`, `raster`, `geojson`, `vector`. Una fuente se consume por una o más **layers**. |
| **Layer** (capa de render) | Objeto en MapLibre que define **cómo** se visualiza una source: color, opacidad, visibilidad, filtros. Una source puede tener múltiples layers. |
| **Basemap** | Capa de fondo compuesta por tiles raster genéricos (calles, relieve, satélite). Se sitúa en la posición z más baja. Solo visible en modo dev para verificar georreferenciación. |
| **Imagen atlas** | Imagen artística del proyecto (el mapa visual del Atlas). Georreferenciada mediante PGW. Es la capa principal del visor. |
| **MapEntry** | Tripleta de datos `{ geo, images, config }` que define completamente un mapa. |
| **mapId** | Identificador único de mapa. Sigue el patrón `chapterN-slug`. Ej: `chapter1-ecosistemas`, `chapter2-cali`, `chapter4-asoyoge`. |

### Tipos de source en MapLibre

| Source type | Cuándo usarlo | Ejemplo en el proyecto |
|-------------|---------------|----------------------|
| `image` | Una sola imagen raster que se estira sobre coordenadas geográficas | La **imagen atlas** (artwork del Atlas) |
| `raster` | Mosaicos (tiles) de 256×256px descargados por URL | El **basemap** (OSM, CartoDB, ESRI) y los **tiles** del Atlas |
| `geojson` | Datos vectoriales (puntos, líneas, polígonos) en formato GeoJSON | Capas de **ríos, ecosistemas, límites, nodos** |

### Stores (Zustand)

| Store | Responsabilidad | Campos clave |
|-------|----------------|--------------|
| **mapStore** | Estado del mapa activo | `activeMapId`, `mapBuilt`, `loading`, `error` |
| **chapterStore** | Navegación narrativa | `activeChapter`, `activeTerritory`, `chapterMaps` |
| **layerStore** | Visibilidad de capas | `visibleLayers`, `opacities`, `activeCategories` |
| **uiStore** | Estado de la interfaz | `activeModal`, `sidebarOpen`, `basemapVisible`, `basemapStyle`, `imageOpacity` |

### Servicios (TS puro)

| Servicio | Función |
|----------|---------|
| **BoundsCalculator** | PGW → coordenadas geográficas + bounds + centro |
| **MapRenderer** | Construye el mapa MapLibre completo con ImageSource georreferenciado |
| **TransformConstrain** | Restringe la cámara considerando el bearing (-90) |
| **BasemapManager** | Añade/remueve basemaps y controla opacidad de la imagen atlas |
| **MapLogger** | Logger por entorno (debug/info/warn/error) |

---

## 3. STACK DE RENDERIZADO (3 CAPAS)

El visor del Atlas apila 3 niveles de datos geográficos, renderizados por MapLibre en un solo canvas WebGL:

```
Orden z (de abajo arriba):
────────────────────────────────────────────────
  Capa 3: GeoJSON layers         ← vectorial
────────────────────────────────────────────────
  Capa 2: Image Source           ← imagen atlas (artwork)
────────────────────────────────────────────────
  Capa 1: Raster Tile Source     ← basemap (dev only)
────────────────────────────────────────────────
  Canvas WebGL (MapLibre)
```

### Capa 1 — Basemap (raster tile source)

- **Visible solo en desarrollo** (`VITE_DEV_TOOLS=true`)
- Tiles de 256×256px descargados de un proveedor externo
- Se inserta **debajo** de la imagen atlas usando el parámetro `before` en `addLayer`
- **Sin opacidad regulable** (siempre opaca)
- Proveedores disponibles:

| Nombre | URL de tiles | Uso |
|--------|-------------|-----|
| OpenStreetMap | `tile.openstreetmap.org` | Calles + labels para referencia visual completa |
| CartoDB Positron | `basemaps.cartocdn.com/light_all` | Minimalista, sin etiquetas. No distrae visualmente. |
| ESRI World Imagery | `server.arcgisonline.com` | Satelital puro. Útil para verificar contra terreno real. |

### Capa 2 — Imagen Atlas (image source)

- **Única capa siempre visible** del proyecto
- Una sola imagen raster (el mapa artístico) estirada sobre coordenadas geográficas definidas por PGW
- La imagen se carga en 2 fases: placeholder (baja resolución, carga instantánea) → upgrade a full (alta resolución)
- **Opacidad regulable** en modo dev: `setImageOpacity()` permite ver a través de ella y verificar que el PGW está correcto contra el basemap
- Se agrega con `map.addSource('atlas-base-image', { type: 'image', url, coordinates })`

### Capa 3 — Capas Vectoriales (GeoJSON sources)

- Múltiples fuentes independientes (ríos, ecosistemas, nodos, límites, conflictos, etc.)
- Se cargan desde archivos `.json` estáticos
- Capa de render tipo `fill`, `line` o `circle` sobre source `geojson`
- Visibilidad y opacidad controladas por `LayerManager` + `layerStore`

---

## 4. MAPLIBRE GL JS — EL MOTOR

### ¿Qué es y qué no es?

MapLibre GL JS es **solo el motor de dibujo**. No es un proveedor de datos.

| Sí | No |
|----|----|
| Renderiza tiles, imágenes y vectores en WebGL | No viene con mapas precargados |
| Maneja zoom, pan, bearing, pitch | No incluye tiles propios |
| Gestiona fuentes y capas | No es OSM (OSM es un proveedor de tiles) |
| Responde a eventos del usuario | No es un SDK de mapas comerciales |

### Inicialización en el proyecto

```typescript
// MapRenderer.ts
const map = new maplibregl.Map({
  container,              // <div> donde se monta el canvas
  style: BLANK_STYLE,     // { version: 8, sources: {}, layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#03091e' } }] }
  center,                 // [lng, lat] calculado desde PGW
  zoom: config.initialZoom,
  bearing: config.initialBearing,  // Siempre -90 (retrato)
  dragRotate: false,      // Usuario no puede rotar
  touchZoomRotate: false, // Rotación táctil desactivada
  transformConstrain: ...,// Función custom bearing-aware (reemplaza a setMaxBounds)
})
```

### Cómo funciona el renderizado (simplificado)

```
1. Cargar datos → getMapEntry(mapId) → { geo, images, config }
2. Calcular bounds → processBounds(pgw, width, height) → bounds + coordinates + center
3. Crear MapLibre → new MapLibre.Map({ container, style, center, zoom, bearing })
4. Esperar evento 'load'
5. Añadir ImageSource → map.addSource('atlas-base-image', { type: 'image', url, coordinates })
6. Añadir layer → map.addLayer({ id:'atlas-base-image-layer', type:'raster', source:'atlas-base-image' })
7. Upgrade a full image → preload en background, source.updateImage()
8. (opcional) Añadir basemap → BasemapManager.addBasemap(map, style)
9. (opcional) Ajustar opacidad → setPaintProperty('raster-opacity', value)
```

---

## 5. PGW DATA — GEORREFERENCIACIÓN

### ¿Qué es PGW?

PGW (**P**l**a**n**e**r **W**orld file) es un formato de archivo de 6 líneas que define una **transformación afín** entre coordenadas de píxel de una imagen y coordenadas geográficas (longitud, latitud).

### Estructura

```
PGW = [A, D, B, E, C, F]

A = tamaño de píxel en X (unidades de mapa por píxel en dirección X)
D = rotación sobre el eje Y (típicamente 0)
B = rotación sobre el eje X (típicamente 0)
E = tamaño de píxel en Y (negativo, unidades de mapa por píxel)
C = coordenada X del centro del píxel superior-izquierdo
F = coordenada Y del centro del píxel superior-izquierdo
```

### Fórmula de transformación

Para cualquier píxel en la posición `(col, row)`:

```
lng = A · col + B · row + C
lat = D · col + E · row + F
```

### Los dos formatos en el proyecto

#### Formato rotado (nativo, en `atlas/src/data/maps/geo.js`)

```
A = 0
E = 0
D ≠ 0
B ≠ 0
```

La imagen original está "de lado" (norte geográfico apunta a la derecha). Se usa `bearing: -90` en MapLibre para mostrarla derecha.

#### Formato estándar (convertido, en `atlas_3.0/src/domains/map/data/atlasMapData.ts`)

```
A ≠ 0
E < 0
D = 0
B = 0
```

Imagen no rotada. Bearing aplicado en MapLibre. Fue el resultado de migrar los PGW rotados a través de GDAL.

### Half-pixel correction

C y F marcan el **centro** del píxel (0,0). Para obtener la **esquina** superior-izquierda real (lo que necesita MapLibre), se resta medio píxel:

```
x0 = C − ½·A − ½·B
y0 = F − ½·D − ½·E
```

### Cálculo de las 4 esquinas

Dada una imagen de `width × height` píxeles:

```
Top-Left:     (col=0,     row=0)      → [x0, y0]
Top-Right:    (col=width, row=0)      → [x0 + A·width, y0 + D·width]
Bottom-Right: (col=width, row=height) → [x0 + A·width + B·height, y0 + D·width + E·height]
Bottom-Left:  (col=0,     row=height) → [x0 + B·height, y0 + E·height]
```

### Ejemplo resuelto: `chapter1-encuadres`

```js
PGW: [0, 0.002291904891, 0.002292263474, 0, -79.441458743296, -1.354624163443]
     A  D                 B                E  C                  F

width:  3389
height: 6684
```

**Paso 1 — Half-pixel correction**:

```
x0 = C − ½·A − ½·B
   = -79.441458743296 − 0 − 0.001146131737
   = -79.442604875033

y0 = F − ½·D − ½·E
   = -1.354624163443 − 0.001145952446 − 0
   = -1.355770115889
```

**Paso 2 — 4 esquinas**:

| Esquina | col | row | Operación | Resultado [lng, lat] |
|---------|-----|-----|-----------|---------------------|
| Top-Left | 0 | 0 | lng = x0, lat = y0 | **[-79.4426, -1.3558]** |
| Top-Right | 3389 | 0 | lng = x0, lat = y0 + D·width | **[-79.4426, 6.4125]** |
| Bottom-Right | 3389 | 6684 | lng = x0 + B·height, lat = y0 + D·width | **[-64.1208, 6.4125]** |
| Bottom-Left | 0 | 6684 | lng = x0 + B·height, lat = y0 | **[-64.1208, -1.3558]** |

Donde:
```
D·width   = 0.002291904891 × 3389 = 7.7683   (span de latitud)
B·height  = 0.002292263474 × 6684 = 15.3215  (span de longitud)
```

**Paso 3 — ImageSource**:

```typescript
map.addSource('atlas-base-image', {
  type: 'image',
  url: 'https://.../encuadres.webp',
  coordinates: [
    [-79.4426, -1.3558],   // TL
    [-79.4426,  6.4125],   // TR
    [-64.1208,  6.4125],   // BR
    [-64.1208, -1.3558],   // BL
  ],
})
```

**Paso 4 — Bounds geográficos** (axis-aligned):

```
west:  -79.4426   (mínimo de todas las longitudes)
south:  -1.3558   (mínimo de todas las latitudes)
east:  -64.1208   (máximo de todas las longitudes)
north:   6.4125   (máximo de todas las latitudes)
```

### Interpretación visual

Con el PGW rotado (A=0, E=0), la imagen se interpreta así:

```
Ancho de la imagen (3389px →) = latitud    (7.77°, eje vertical en mapa)
Alto de la imagen  (6684px ↓) = longitud   (15.32°, eje horizontal en mapa)
```

Los ejes están **cruzados** respecto a un mapa con norte arriba. MapLibre con `bearing: -90` rota el viewport 90° para alinearlos visualmente.

### Notación profesional para referirse a PGW

| Término profesional | Significado |
|--------------------|-------------|
| "Transformación afín de georreferenciación" | La fórmula matemática que relaciona píxeles con coordenadas geográficas |
| "World file" | El archivo de 6 parámetros (PGW) |
| "Parámetros de rotación no nulos" | PGW donde D≠0 o B≠0 ("rotado") |
| "Parámetros de rotación nulos" | PGW donde D=B=0 ("estándar") |
| "Corrección half-pixel" | Ajuste de C/F para que apunten a la esquina del píxel, no al centro |
| "Span longitudinal" | Diferencia entre la longitud máxima y mínima (este − oeste) |
| "Span latitudinal" | Diferencia entre la latitud máxima y mínima (norte − sur) |

---

## 6. IMAGEN ATLAS — IMAGESOURCE

### Flujo de carga

```
1. placeholder (5-15KB, calidad 30%, 512px) → se carga vía map.addSource()
2. Imagen full se precarga en background via new Image()
3. Cuando la full está lista → source.updateImage({ url, coordinates })
   - La transición es instantánea porque MapLibre mantiene el mismo sourceId
   - Si falla la full, se queda con el placeholder (graceful degradation)
```

### Código relevante

```typescript
// MapRenderer.ts
const IMAGE_SOURCE_ID = 'atlas-base-image'
const IMAGE_LAYER_ID = 'atlas-base-image-layer'

// Añadir source con placeholder
map.addSource(IMAGE_SOURCE_ID, {
  type: 'image',
  url: images.placeholder,    // carga instantánea
  coordinates,
})

// Añadir layer raster que visualiza la source
map.addLayer({
  id: IMAGE_LAYER_ID,
  type: 'raster',
  source: IMAGE_SOURCE_ID,
  paint: { 'raster-fade-duration': 300 },
})

// Upgrade a imagen completa
if (images.full !== images.placeholder) {
  preloadImage(images.full).then(() => {
    const source = map.getSource(IMAGE_SOURCE_ID) as maplibregl.ImageSource
    source.updateImage({ url: images.full, coordinates })
  })
}
```

### Opacidad

```typescript
// BasemapManager.ts
map.setPaintProperty('atlas-base-image-layer', 'raster-opacity', 0.5)
// 0 = transparente (se ve solo basemap)
// 1 = opaco (se ve solo imagen atlas)
```

---

## 7. BASEMAP — RASTER TILE SOURCE

### Implementación

```typescript
// BasemapManager.ts
const BASEMAP_TILES = {
  streets:   'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  light:     'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
}

map.addSource('basemap-devtool', {
  type: 'raster',
  tiles: [BASEMAP_TILES[style]],
  tileSize: 256,
  attribution: '...',
})

// Insertar DEBAJO de la imagen atlas (before: 'atlas-base-image-layer')
map.addLayer({
  id: 'basemap-devtool-layer',
  type: 'raster',
  source: 'basemap-devtool',
}, 'atlas-base-image-layer')   // ← así se pone debajo
```

### Regla importante

El basemap se inserta con `before: IMAGE_LAYER_ID` para que quede **debajo** de la imagen atlas. Esto permite que la imagen atlas esté encima y su opacidad regule cuánto se ve el basemap a través de ella.

---

## 8. CAPAS VECTORIALES — GEOJSON

### Estructura

```typescript
{
  sourceId: 'rio-cauca',
  type: 'geojson',
  data: {                // FeatureCollection de puntos, líneas o polígonos
    type: 'FeatureCollection',
    features: [...],
  },
}

// Capa de render asociada
{
  id: 'rio-cauca-layer',
  type: 'line',           // line, fill, circle, symbol
  source: 'rio-cauca',
  paint: {
    'line-color': '#4fc3f7',
    'line-width': 2,
  },
}
```

### Gestión

`LayerManager.ts`:
- `setLayerVisibility(map, layerId, visible)`
- `setLayerOpacity(map, layerId, opacity)`
- `toggleCategory(map, category)` — activa/desactiva todas las capas de una categoría

`layerStore.ts`:
- `visibleLayers: Set<string>` — IDs de capas visibles
- `opacities: Record<string, number>` — opacidad por capa
- `activeCategories: Set<string>` — categorías activas

---

## 9. BEARING Y ROTACIÓN

### ¿Por qué -90?

Todas las imágenes del Atlas son **portrait** (alto > ancho en píxeles), pero el área geográfica que cubren es más ancha que alta. Sin rotación, la imagen se vería "de lado" (el norte apuntando a la derecha). `bearing: -90` en MapLibre rota el viewport 90° antihorario para que el norte apunte hacia arriba visualmente.

### Efecto

```
Sin bearing:             Con bearing: -90:
┌──────┐                 ┌──────────────┐
│      │  imagen se ve   │              │
│      │  "de lado",     │   imagen se  │
│  ↑   │  el alto de la  │   ve derecha │
│ alto │  imagen se       │   (norte ↑)  │
│      │  renderiza como  │              │
│      │  horizontal      │              │
└──────┘                 └──────────────┘
```

### Las 3 implementaciones: atlas_3.0, v17, y atlas/

Los tres proyectos implementan la **misma estrategia general** —bearing -90 nativo + `setTransformConstrain` personalizado— pero con diferencias críticas en el formato PGW y detalles de implementación.

---

### 9.1 Tabla comparativa

| Aspecto | atlas_3.0 (dominios) | atlas_frontend_v17 | atlas/ (actual) |
|---------|---------------------|--------------------|-----------------|
| **PGW** | Convertido estándar (A≠0, E≠0, B=0, D=0) | Convertido estándar (A≠0, E≠0, B=0, D=0) | **Rotado original** (A=0, E=0, B≠0, D≠0) |
| **Bearing** | -90 | -90 | -90 |
| **TransformConstrain** | `createBearingAwareConstrain()` (useAtlasMap.ts:100-183) | `createBearingAwareConstrain()` (useMap.js:15-86) | `createBearingAwareConstrain()` (TransformConstrain.ts:34-117) |
| **Coordenadas imagen** | Rotadas por `rotateImageCoordinates()` (porque PGW es estándar → necesita rotación runtime para alinearse con bearing) | Sin rotar (PGW estándar → coordenadas north-up; bearing provee rotación visual) | Sin rotar (PGW rotado → coordenadas ya en ejes cruzados; bearing alinea visualmente) |
| **setMaxBounds** | Fallback en ~3 mapas sin `useTransformConstrain` | Red de seguridad con `boundsPadding` (top=east, bottom=west, left=north, right=south) | **No se usa** |
| **Encuadre inicial** | `cameraForBounds()` (preserva bearing) | `fitBounds()` con bearing preservado | `jumpTo()` (center + zoom + bearing) |
| **Zoom** | `calculateAutoZoom()` bearing-aware (zoomCalculator.ts) | `calculateDynamicMinZoom()` a mano | `initialZoom` fijo en config |
| **Turf.js** | No usado | No usado | No usado |
| **Drag rotate** | Deshabilitado | Deshabilitado | Deshabilitado |
| **Rotación táctil** | Deshabilitada | Deshabilitada | Deshabilitada |

---

### 9.2 PGW: la diferencia fundamental

El punto de divergencia más importante entre las 3 implementaciones es el **formato de los PGW almacenados**.

#### atlas_3.0 y v17: PGW convertido a estándar

En ambos proyectos los PGW pasaron por una **conversión 90° horaria** desde el rotado original:

```
A_new = D_old    (antes 0, ahora ≠0)
E_new = -B_old   (antes 0, ahora negativo)
B = 0, D = 0     (parámetros de rotación puestos a cero)
C_new = C_old
F_new = F_old + B_old × W_portrait
```

El resultado es un PGW "north-up": las columnas de la imagen apuntan al este y las filas al norte. La imagen se renderiza derecha en MapLibre incluso sin bearing. El bearing -90 es puramente visual (el artwork se ve en portrait).

**Consecuencia**: Las coordenadas de `ImageSource` son un rectángulo axis-aligned sin rotación interna. Para que coincidan con el bearing -90 del viewport, atlas_3.0 aplica además `rotateImageCoordinates()` que rota las 4 esquinas alrededor del centro geográfico. v17 no lo hace —las coordenadas se pasan tal cual y bearing -90 provee la rotación visual.

#### atlas/ (actual): PGW rotado original

En el proyecto actual los PGW están en su **formato nativo rotado** (tal como salieron del GeoTIFF original):

```
A = 0, E = 0     (escala cero en ejes directos)
B ≠ 0, D ≠ 0     (rotación activa en ambos ejes)
C, F             (origen)
```

Esto significa que la **transformación afín ya produce coordenadas con los ejes cruzados**:
- El ancho de la imagen (columnas) codifica **latitud**
- El alto de la imagen (filas) codifica **longitud**

Con bearing -90, MapLibre intercambia los ejes visuales del viewport, y la imagen se ve derecha sin necesidad de rotar coordenadas adicionalmente. **No se aplica `rotateImageCoordinates()` en ningún punto del pipeline.**

**Ventaja**: Datos más fieles al original, sin pérdida por doble conversión. El PGW refleja exactamente lo que el generador de world files produjo.

**Desventaja**: Menos intuitivo para depuración —las coordenadas no forman un rectángulo north-up; son un paralelogramo rotado.

---

### 9.3 TransformConstrain: misma lógica en los 3 proyectos

Los tres proyectos implementan `createBearingAwareConstrain()` con la misma lógica:

```
Paso A — minZoom bearing-aware
  dpp(z) = 360 / (512 × 2^z)   (degrees per pixel al zoom z)
  bearing ±90°:
    minZoom = max(log2(W × 360 / (512 × latSpan)),
                  log2(H × 360 / (512 × lonSpan)))
    // W (ancho canvas) usado para latitud
    // H (alto canvas) usado para longitud
  bearing 0/180°:
    minZoom = max(log2(W × 360 / (512 × lonSpan)),
                  log2(H × 360 / (512 × latSpan)))
    // W usado para longitud, H para latitud

Paso B — clamp zoom
  clampedZoom = max(minZoom, zoom)

Paso C — clamp centro
  dpp = dpp(clampedZoom)
  bearing ±90°:
    halfLat = (W / 2) × dpp       // ancho canvas → latitud
    halfLon = (H / 2) × dpp       // alto canvas → longitud
  bearing 0/180°:
    halfLon = (W / 2) × dpp
    halfLat = (H / 2) × dpp
  lng = clamp(lng, west + halfLon, east - halfLon)
  lat = clamp(lat, south + halfLat, north - halfLat)

  Guardrail: lat ∈ [-89.9, 89.9], lng ∈ [-179.9, 179.9]
```

La función reemplaza a `setMaxBounds` porque este último es **bearing-blind**: internamente MapLibre clampea LON con viewport WIDTH y LAT con viewport HEIGHT sin importar el bearing. Con ±90° los ejes están intercambiados, por lo que el clamp es incorrecto.

**Ubicación por proyecto:**
- atlas_3.0: `src/domains/map/hooks/useAtlasMap.ts:100-183`
- v17: `src/Hooks/useMap.js:15-86`
- atlas/: `src/services/TransformConstrain.ts:34-117`

---

### 9.4 setMaxBounds: solo en 2 de 3 proyectos

| Proyecto | Usa setMaxBounds | Detalle |
|----------|-----------------|---------|
| atlas_3.0 | Sí, como fallback | Solo en ~3 mapas con `useTransformConstrain=false`. En los demás no se usa. |
| v17 | Sí, como red de seguridad | Se ejecuta SIEMPRE junto con `useTransformConstrain=true`. Expande bounds con `boundsPadding` para evitar que el constrain recorte la imagen. Comentario: "red de seguridad". |
| atlas/ | **No** | `setMaxBounds` no se usa en ningún punto del pipeline. `transformConstrain` es la única restricción de cámara. |

**boundsPadding (solo v17):**

Con bearing -90, los ejes de pantalla se intercambian:
```
top    ↔ east     (arriba del viewport = este geográfico)
bottom ↔ west     (abajo del viewport = oeste geográfico)
left   ↔ north    (izquierda del viewport = norte geográfico)
right  ↔ south    (derecha del viewport = sur geográfico)
```

Ejemplo típico: `boundsPadding: { top: -0.25, bottom: -0.25, left: 0.35, right: 0.35 }`

- `left: 0.35` expande el bound un 35% del span hacia el **norte** (izquierda visual)
- `right: 0.35` expande el bound un 35% del span hacia el **sur** (derecha visual)
- `top: -0.25` contrae el bound un 25% del span hacia el **oeste** (arriba visual)
- `bottom: -0.25` contrae el bound un 25% del span hacia el **este** (abajo visual)

Este sistema es frágil (requiere calibración manual por mapa) y fue eliminado en el proyecto actual.

---

### 9.5 Restricciones comunes

Los 3 proyectos comparten estas restricciones para evitar que el usuario desalinee la rotación:

```
dragRotate: false       // No rotar arrastrando con mouse
touchZoomRotate: false  // No rotar con gestos táctiles
keyboard: false         // No rotar con teclado (solo en atlas/)
```

---

### 9.6 Resumen: la estrategia de rotación del proyecto

El proyecto actual **atlas/** usa esta estrategia:

1. **PGW rotado original** en `geo.js` (A=0, E=0, B≠0, D≠0) — sin conversión
2. **BoundsCalculator** interpreta el PGW rotado con la fórmula afín genérica (capaz de manejar B≠0, D≠0 sin problemas). Las coordenadas resultantes tienen ejes cruzados (ancho=latitud, alto=longitud)
3. **MapLibre** se instancia con `bearing: -90`, `dragRotate: false`, `touchZoomRotate: false`
4. **ImageSource** usa las coordenadas sin rotación adicional —el PGW rotado ya produce la geometría correcta para el bearing -90
5. **TransformConstrain** (`createBearingAwareConstrain()`) reemplaza a `setMaxBounds` con una función que entiende que los ejes están intercambiados
6. **No se usa `setMaxBounds`** en ningún momento
7. **No se usa Turf.js** para nada relacionado con rotación

---

### 9.7 Caso especial: rotación NO ortogonal — `chapter4-problematicas` (−30°)

La mayoría de los mapas tienen rotación ortogonal pura (A=0, E=0) resuelta con `bearing: -90`.
**`chapter4-problematicas` es distinto**: su PGW trae una rotación real **no ortogonal** (≈ **−30°**, ni 0 ni ±90 ni ±180) embebida en los coeficientes:

| Coeficiente | Valor | Rol en la transformada afín |
|-------------|-------|------------------------------|
| A | `1.194087e-6` | columna → longitud (coseno de rotación) |
| D | `-2.068220e-6` | columna → latitud |
| B | `-2.068153e-6` | fila → longitud |
| E | `-1.194048e-6` | fila → latitud |
| C | `-76.485574` | origen lng (centro del píxel 0,0) |
| F | `3.436552` | origen lat (centro del píxel 0,0) |

**Solución de datos (sin tocar código de render):**
- `configs.js` → `initialBearing: -30` (no 0 ni −90; se conservan zoom 10/10/13).
- `geo.js` → PGW con A≠0, B≠0, D≠0, E≠0. El determinante de la matriz afín es negativo (orientación espejada respecto a la ortogonal), lo que la transformada afín general de `BoundsCalculator` (`calculateImageCoordinates`) maneja directamente.

**Regla crítica:** el PGW de este mapa NO debe quedar en formato retrato puro (A≈0 y E≈0), porque `processBounds` lo detectaría con `isRotatedPGW()` y lo auto-convertiría (`convertRotatedPGW`, rotación rígida de 90°) a norte-arriba, **deshaciendo la rotación de −30°**. Con A≠0/E≠0 se usa la rama afín general y la imagen se renderiza ya rotada.

**Panel de calibración (dev-tools, `VITE_DEV_TOOLS=true`)** — ahora compatible con rotación real (TAREA 10):
- `CalibrationState` incluye `a`/`e` → round-trip completo (`pgwToState`/`stateToPGW`) que preserva la rotación al montar, arrastrar, nudge, reset y aplicar.
- `clampScale()` preserva el signo → los coeficientes negativos (`D=-2.068e-6`) ya no se clobberan a `1e-12`.
- Guard `isNonDegenerate` en `updateBounds`: si el span Mercator de las 4 esquinas < 2⁻²⁵, omite `setCoordinates` (evita el crash `z=35`).
- `destroy()` remueve primero las layers y después las sources.

**Crash `z=35` (MapLibre v6):** `ImageSource.setCoordinates` → `getCoordinatesCenterTileID` calcula `zoom = floor(−log2(span Mercator de las esquinas))`; un polígono degenerado (p. ej. escalas llevadas a ~1e-12 o width/height = 1) eleva el zoom por encima de 25 y `CanonicalTileID` lanza `"outside of bounds"`. El guard del renderer lo previene en runtime.

---

## 10. NOTAS VIVAS

> Esta sección se va llenando a medida que hacemos preguntas y descubrimos cosas.
> Cada entrada lleva fecha y contexto.

### 2026-07-30 — PGW rotado vs estándar

**Pregunta**: ¿Por qué en `geo.js` los PGW tienen A=0 y E=0?

**Respuesta**: Son PGW en formato "rotado". La imagen original está físicamente rotada 90° (es más alta que ancha pero el área geográfica es más ancha que alta). En lugar de enderezar la imagen con GDAL (que introduce error de interpolación), dejamos la imagen rotada y MapLibre aplica `bearing: -90` para que se vea derecha. La fórmula de transformación afín funciona igual: con A=0 y E=0, la posición de columna determina latitud y la de fila determina longitud.

### 2026-07-30 — ¿OSM es el mapa de MapLibre?

**Pregunta**: ¿OSM es el mapa base de MapLibre? ¿Cómo se llama correctamente?

**Respuesta**: No. MapLibre es solo un motor de renderizado WebGL — no trae ningún mapa incorporado. OSM es un **proveedor de tiles** gratuito. Los tiles de OSM, CartoDB Positron y ESRI World Imagery son todos "basemaps" (mapas base de referencia). En el proyecto los llamamos **basemap** y se gestionan desde `BasemapManager.ts` con tres estilos: `'streets'` (OSM), `'light'` (CartoDB) y `'satellite'` (ESRI).

### 2026-07-30 — Bearing -90 explicado

**Pregunta**: ¿Por qué los mapas se ven rotados sin bearing?

**Respuesta**: El PGW rotado tiene A=0, E=0, lo que significa que el ancho de la imagen (horizontal) codifica **latitud** (que en un mapa normal es vertical) y el alto (vertical) codifica **longitud** (que en un mapa normal es horizontal). Los ejes están cruzados. `bearing: -90` en MapLibre rota el viewport 90° antihorario, recomponiendo la correspondencia: ahora la latitud se ve vertical y la longitud horizontal. La imagen se ve derecha.

### 2026-07-30 — ¿Qué es "imagen atlas" y qué es "basemap"?

**Pregunta**: ¿Cómo diferenciar la imagen del Atlas del mapa de fondo?

**Respuesta**: La **imagen atlas** es el artwork del proyecto — los mapas dibujados por el equipo de contenido. Se carga como un `ImageSource` único (una imagen grande estirada sobre coordenadas). El **basemap** son tiles genéricos de internet (calles, satélite) que sirven de referencia visual para verificar que la imagen atlas está bien posicionada. El basemap solo se muestra en modo dev y siempre está **debajo** de la imagen atlas.

### 2026-07-30 — ¿Qué diferencia hay entre "source" y "layer" en MapLibre?

**Pregunta**: En MapRenderer.ts veo `addSource` y `addLayer`. ¿No es lo mismo?

**Respuesta**: No. **Source** es el dato geográfico bruto (la imagen, los tiles, el GeoJSON). **Layer** es cómo se visualiza ese dato: color, opacidad, visibilidad, orden z. Una source puede tener múltiples layers. Por ejemplo, una source `geojson` de ríos puede tener una layer `line` para el río principal y otra layer `line` con estilo punteado para afluentes, ambas leyendo de la misma source.

### 2026-08-04 — Fix 404 de `chapter2-m-villa-rica` (public_ids de Cloudinary)

**Síntoma**: el mapa `chapter2-m-villa-rica` aparecía en blanco; las URLs de `images.js` devolvían 404 en todos los formatos y sin versión → el asset nunca existió con esos public_ids (introducidos en `a88a45f`, nunca verificados).

**Solución (solo datos)**: reemplazar los public_ids en `images.js` por los correctos — base `pabcndrbg0gjx29iuccg` (v1759612261), full `knk721fgkqtvdxnppxzr` (v1767891949), placeholder = `ph(base)`. Verificación: sweep completo 53/53 URLs → 200. Commit `c060693`. El asset `medium` (`eljwekp0priwrtqsdhqv`) queda disponible sin usar. Rutina útil: `curl -s -o NUL -w "%{http_code}" <url>` sobre todas las URLs de `images.js` (solo `chapter2-m-villa-rica` fallaba).

### 2026-08-04 — Rotación no ortogonal: la imagen atlas se rota con su PGW, no con bearing

**Pregunta**: ¿Por qué `chapter4-problematicas` no se veía bien con bearing 0 ni con bearing −90?

**Respuesta**: Ese mapa no tiene rotación ortogonal: su imagen atlas trae una rotación real de ≈ **−30°** embebida en el PGW (A≠0, B≠0, D≠0, E≠0). La solución fue rotar la **imagen atlas** (no el basemap) dejando `initialBearing: -30` y un PGW con los 4 coeficientes de escala no nulos. Regla: si el PGW queda en formato retrato puro (A≈0, E≈0), `processBounds` lo auto-convierte y borra la rotación. Hallazgo asociado: el panel de calibración ahora preserva A/E y un clamp con signo, y `MapRenderer` ignora polígonos degenerados para evitar el crash `z=35` de MapLibre v6 (ver TAREAS.md 9-10).

[→ Siguiente nota en blanco para futuras preguntas]

---

## APÉNDICE: UBICACIÓN DE ARCHIVOS CLAVE

| Archivo | Propósito |
|---------|-----------|
| `atlas/src/data/maps/geo.js` | PGW por mapa: rotados puros (A=0, E=0) y mixtos con rotación real (A≠0, E≠0) — fuente única de verdad |
| `atlas/src/data/maps/images.js` | URLs de imágenes (Cloudinary + locales) por mapa |
| `atlas/src/data/maps/configs.js` | Config por mapa (zoom, bearing, interacciones) |
| `atlas/src/services/BoundsCalculator.ts` | PGW → coordenadas + bounds + centro |
| `atlas/src/services/MapRenderer.ts` | Construcción de mapa MapLibre completo + guard anti-degenerado |
| `atlas/src/services/TransformConstrain.ts` | Cámara bearing-aware para -90 |
| `atlas/src/services/BasemapManager.ts` | Gestión de basemap y opacidad |
| `atlas/src/services/MapCalibration.ts` | Estado del panel: round-trip de 6 coeficientes PGW, clamp con signo |
| `atlas/src/stores/uiStore.js` | Estado de UI + basemap + opacidad |
| `atlas/src/components/map/AtlasMap.tsx` | Componente visor del mapa |
| `atlas/src/components/map/MapControls.tsx` | Toolbar dev (toggle basemap, selector estilo, slider opacidad) |
| `atlas/src/hooks/useMap.ts` | Hook principal: datos → build → ready |
| `atlas_front/atlas_frontend_v17/src/` | v17 — fuente de contenido (NO modificar) |
| `atlas_front/atlas_3.0/src/` | 3.0 — referencia de mapas (NO modificar) |
