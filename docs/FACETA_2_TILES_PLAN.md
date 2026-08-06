# FACETA 2 — TILES XYZ DE ALTA RESOLUCIÓN

> Plan completo de implementación, optimización, despliegue y contingencias.
> **Principio rector:** todo debe estar documentado con alternativas explícitas
> para que ninguna decisión futura se tome por desconocimiento.

---

## 1. ESTÉTICA VISUAL Y FADE-IN

### 1.1 Pipeline de renderizado actual

```
background (#03091e)                    ← idx 0, color sólido
atlas-base-image-layer (placeholder)    ← idx 1, ImageSource Cloudinary
                                         raster-fade-duration: 300ms (hardcode)
  ↓ upgrade async (preloadImage → source.updateImage)
atlas-base-image-layer (full)           ← idx 1, misma capa, fuente actualizada
atlas-tiles-layer                       ← idx 2, raster source XYZ tiles
                                         raster-fade-duration: 300ms (config)
                                         minZoom:6, maxZoom:11
```

### 1.2 Qué hace `raster-fade-duration`

En MapLibre, `raster-fade-duration` controla **el crossfade entre tiles padre e
hijo al cambiar de zoom**. No es un fade-in/out de la capa entera: es el tiempo
en ms que tarda en disolverse el tile de zoom N mientras aparece el tile de
zoom N+1.

- `0ms` → salto seco (el tile anterior se reemplaza instantáneamente por el nuevo).
- `300ms` (default) → transición suave pero el mapa se ve "borroso" 300ms.
- `1000ms` → muy suave pero el usuario ve ghosting/doble exposición durante 1s.

### 1.3 Problemas visuales identificados

#### 1.3.1 Doble-fade / blink al hacer zoom

**Causa:** La capa base (`atlas-base-image-layer`) y la capa de tiles
(`atlas-tiles-layer`) ambas tienen `raster-fade-duration: 300`. Al hacer zoom,
**se disparan dos crossfades simultáneos**: la imagen base hace fade entre su
placeholder/full en distintos zooms, y los tiles hacen fade entre zN y zN+1.
El efecto combinado puede verse como un micro-parpadeo (blink) en cada cambio
de zoom.

**Soluciones (ordenadas por preferencia):**

| # | Solución | Efecto | Costo |
|---|----------|--------|-------|
| A | Poner `raster-fade-duration: 0` en la capa base, mantener 300 en tiles | Elimina el doble-fade manteniendo transición suave solo en los tiles | 1 línea en MapRenderer.ts:170 |
| B | Poner 0 en la capa base + 0 en los tiles | Sin fade en ningún lado. La imagen y tiles aparecen instantáneamente. Sharp pero seco. | 1 línea adicional en tiles.js |
| C | Poner `raster-fade-duration: 0` en ambas + overlay CSS `transition: opacity` en el contenedor | Control CSS sobre el fade (más portable, independiente de WebGL). Overlay CSS solo aplica a toda la capa, no por tile. | Moderado |
| D | Dejar ambas en 300 y agregar `requestAnimationFrame` throttle | No resuelve el problema raíz, solo suaviza frames | Alto, no recomendado |

**Recomendación:** **Solución A** (fade 0 en base, fade 300 en tiles). Es la
más simple y la estándar en visores de mapas con tiles: la imagen base NO
necesita fade porque no cambia entre zooms (es una sola imagen estirada, no
tiene tiles hijo), mientras que los tiles SÍ se benefician del crossfade entre
niveles de zoom.

#### 1.3.2 "Pop" cuando carga la imagen full

**Causa:** En `buildGeoreferencedMap`, la imagen base se inicia con el
placeholder (Cloudinary `w_512,q_30`) y se actualiza asincrónicamente a la
imagen full (`source.updateImage()`). Si la imagen full tarda en cargar (ej.
latencia a Cloudinary) y los tiles YA están visibles (el usuario ya está en
zoom alto), el swap de placeholder→full bajo los tiles no se ve. Pero si la
carga es muy rápida y el usuario aún está en zoom bajo (sin tiles), el "pop"
de baja a alta resolución es visible.

**Soluciones:**

| # | Solución | Efecto |
|---|----------|--------|
| A | Mantener el placeholder en baja resolución hasta que los tiles estén listos, luego hacer el upgrade suave | Reduce el pop porque la transición placeholder→tiles es más natural que placeholder→full→tiles |
| B | Hacer el upgrade de la imagen full ANTES de agregar los tiles | Los tiles siempre se agregan sobre la imagen full, sin pop | Re-ordenar pasos en buildGeoreferencedMap |
| C | Usar `raster-fade-duration: 0` en la capa base + `source.updateImage` con fade CSS | El "corte" seco es más honesto visualmente que el pop |

**Recomendación:** **Solución B** (cargar full antes de agregar tiles). El
usuario en zonas rurales con mala conectividad no verá un pop porque los tiles
tardarán: la imagen full terminará de cargar mucho antes que los tiles de zoom
alto. La secuencia sería:

```
placeholder (instantáneo) → await preloadImage(full) → source.updateImage(full)
    → solo entonces → addTilesLayer(map, entry, bounds)
```

Esto cambia `addTilesLayer` de sincrónico a esperar la precarga, pero
mantiene la experiencia correcta: cuando los tiles aparecen, la base ya
está en máxima calidad y no hay sorpresas visuales.

#### 1.3.3 Seams / bordes entre tiles (z10-z11)

**Causa potencial:**
1. Compresión WebP con pérdida: `QUALITY=90` es buena pero los bordes entre
   tiles de 256px pueden mostrar micro-artefactos de compresión en las uniones.
2. GDAL `gdalwarp -r lanczos` con `-dstalpha`: el canal alpha en los bordes
   puede tener valores < 255 si hay redondeo de coordenadas en warping.
3. Over-zoom (zoom > maxZoom 11): MapLibre estira los tiles de z11 sin
   interpolar entre tiles vecinos → seams visibles.

**Soluciones:**

| # | Solución | Efecto | Costo |
|---|----------|--------|-------|
| A | Subir QUALITY a 95 | Reduce artefactos de compresión en bordes | ~30% más peso por tile |
| B | Sin pérdida (`-of WEBP -co LOSSLESS=YES`) | Cero artefactos de compresión. Tiles 2-4x más grandes. | Alto en storage/transferencia |
| C | `gdalwarp -r cubic` en vez de `lanczos` | Menos ringing (artefactos de Lanczos) en bordes de alto contraste. Lanczos es mejor para texto/líneas finas. | Tiempo de generación similar |
| D | Agregar `gdal_translate -co QUALITY=95` + `-expand rgb` antes del warp | Padding de 1px alrededor de cada tile para evitar seams por redondeo | Complejo (requiere generar la pirámide completa en GeoTIFF intermedio) |
| E | Generar z12 (un zoom extra) | Elimina el over-zoom stretching de z11→z12. El costo extra de tiles es ~4x (z12 = z11×4). | Alto en disco + tiempo |

**Recomendación:** **Solución A** (QUALITY=95) + **verificar visualmente**.
Si hay seams visibles en bordes de alto contraste, probar **Solución D**
(padding 1px). La calidad 90 actual es aceptable, pero 95 es el estándar para
cartografía de alta calidad sin llegar al costo de lossless.

#### 1.3.4 Transición base→tiles en zoom intermedio

**Escenario:** En z6-z7, la imagen base (placeholder) se ve bien, y los tiles
aún no se han cargado o están en baja densidad. En z8-z9, los tiles empiezan a
dominar pero la transición entre "imagen base nítida para este zoom" y "tiles
apenas cargando" puede verse como un parpadeo de nitidez.

Este no es un bug de código sino de percepción. Se mitiga con:
1. Precarga de tiles del zoom actual tan pronto como el mapa carga (no esperar
   al zoom in).
2. `raster-fade-duration` adecuado (no 0, no >500).

**Recomendación:** Mantener 300ms en tiles, y precargar el nivel de zoom
inicial. La transición es inherente al diseño de tiles progresivos y no se
puede eliminar sin tiles infinitos.

### 1.4 Configuración final recomendada en `MapRenderer.ts`

```
Capa base (atlas-base-image-layer):
  paint: { 'raster-fade-duration': 0 }     ← sin fade (no tiene tiles)

Capa tiles (atlas-tiles-layer):
  paint: { 'raster-fade-duration': 300 }   ← crossfade suave entre zooms

Orden de inicialización:
  1. placeholder → preloadImage(full) → source.updateImage(full)
  2. await full cargada → addTilesLayer

tiles.js (todos los mapas):
  fadeInDuration: 300  (o 250 si se prefiere más rápido, 400 si se prefiere más suave)
```

---

## 2. RENDIMIENTO EN EQUIPOS DE BAJOS RECURSOS

### 2.1 Perfil de la máquina objetivo

- **CPU:** 2-4 núcleos, <2GHz (ej. Intel Celeron, AMD A4 de equipos rurales)
- **RAM:** 2-4 GB (Windows 10/11 consume ~1.5-2GB solo en idle)
- **GPU:** Integrada (Intel HD Graphics, sin memoria dedicada). WebGL
  disponible pero con límite de texturas (~8-16 texturas simultáneas máximo).
- **Navegador:** Chrome/Edge reciente (con WebGL 1.0/2.0), posiblemente Firefox.
- **Red:** 3G/4G rural, latencia 200-800ms, ancho de banda 0.5-5 Mbps.

### 2.2 Análisis de consumo actual

#### Bundle JavaScript

| Chunk | Tamaño aprox | Impacto |
|-------|-------------|---------|
| vendor-maplibre | ~1 MB | MapLibre completo (WebGL, fuentes, capas, eventos) |
| vendor-react | ~130 KB | React + ReactDOM + Router |
| vendor-zustand | ~15 KB | State management |
| app code | ~50-80 KB | Servicios, hooks, componentes, datos de mapas |

**Total en wire:** ~1.2-1.3 MB (gzip ~350-400 KB). Aceptable para 5Mbps.
**Tiempo hasta interactivo:** ~2-3s en 3G (bundle descargado, parseado,
ejecutado, MapLibre inicializado con WebGL).

#### Texturas en GPU durante navegación

En zoom z11 con 30 tiles visibles (viewport típico de 1920×1080 ≈ 8×4 tiles):
- 30 texturas WebP 256×256 RGBA = 30 × 256KB = ~7.5 MB en VRAM
- + textura de imagen base (placeholder ~15KB, full ~1-3MB RGBA)
- + textura de basemap (si está activo, ~10-20 tiles 256px)

**Total VRAM típica:** ~10-15 MB en GPU. Cómodo para cualquier GPU integrada.

#### Memoria RAM de JavaScript

- MapLibre: ~10-20 MB (estructuras de tiles, workers, eventos)
- React + Zustand: ~5-10 MB
- Imágenes en memoria (placeholder + full + tiles decodificados): ~10-20 MB

**Total RAM JS:** ~30-50 MB aceptable para 2GB de sistema.

#### CPU durante navegación

- WebGL compositing: baja carga en GPU, media en CPU por el driver de GPU
  integrada que hace software rendering parcial.
- MapLibre worker: decodifica tiles WebP en `maplibre-gl-worker.mjs`.
- React: solo re-renderiza en cambio de ruta (raro), sin coste continuo.
- **Picos de CPU:** al hacer zoom rápido (cambio de 2+ niveles),
  muchas peticiones de tiles disparadas, decodificación simultánea de 30+
  tiles en el worker → lag de 200-500ms en CPU débil.

### 2.3 Estrategias de optimización

#### 2.3.1 Limitar concurrencia de tiles de MapLibre

MapLibre por defecto dispara peticiones de tiles sin límite estricto de
paralelismo (usa `maxParallelImageRequests`, default=16 para raster).

```typescript
// En buildGeoreferencedMap, después de crear el mapa:
map.setMaxParallelImageRequests(4)  // default 16 → 4
```

Esto reduce:
- Peticiones HTTP simultáneas (menos uso de red en 3G)
- Decodificación concurrente de WebP (menos CPU en worker)
- Picos de GPU al cargar múltiples texturas a la vez

#### 2.3.2 Limitar el cache de tiles en GPU

MapLibre mantiene tiles en memoria GPU incluso fuera del viewport actual.

```typescript
// En la configuración del source raster:
map.addSource('atlas-tiles', {
  type: 'raster',
  tiles: [...],
  tileSize: 256,
  minzoom: 6,
  maxzoom: 11,
  scheme: 'xyz',
  bounds,
  // Limpiar texturas fuera del viewport actual:
  volatile: true,  // MapLibre descarga texturas cuando el tile sale del viewport
})
```

Pero `volatile: true` en fuente raster no está disponible en MapLibre GL JS
(solo en el protocolo de estilo). Alternativa: listeners de idle para limpiar
manualmente `map.triggerRepaint()` + el garbage collector de GPU de MapLibre.

#### 2.3.3 Desactivar animaciones y transiciones no esenciales

```typescript
// Al crear el mapa:
new Map({
  fadeDuration: 0,           // sin fade en etiquetas
  crossSourceCollisions: false,  // sin detección de colisiones entre fuentes
  // ... resto de opciones
})
```

#### 2.3.4 Code splitting y lazy loading

**Lazy load de capítulos** (React.lazy + Suspense): cada capítulo con sus
30+ mapas carga solo su JS cuando el usuario navega al capítulo.

```typescript
// Propuesto: rutas lazy cargadas
const Chapter1 = lazy(() => import('./pages/Chapter1'))
const Chapter2 = lazy(() => import('./pages/Chapter2'))
// ...
```

**Lazy load de MapLibre**: diferir la inicialización hasta que el usuario
entre a la vista de mapa (no cargar MapLibre en la landing/home).

#### 2.3.5 Degradación de opacidad de tiles

Si la GPU no soporta muchas texturas, MapLibre automáticamente prioriza
tiles del centro del viewport. No requiere configuración extra.

### 2.4 Modo "bajo consumo"

Propuesta: un flag `lowPowerMode: true` en `uiStore` que:

1. Desactiva el basemap (0 tiles extra en GPU).
2. `raster-fade-duration: 0` (sin animación de transparencia en GPU).
3. `maxParallelImageRequests: 2` (mínima concurrencia).
4. Reduce `maxZoom` de tiles a 1 nivel menos del máximo (z10 en vez de z11).

Este modo podría activarse automáticamente vía `navigator.hardwareConcurrency < 4`
o manualmente por el usuario.

---

## 3. CONECTIVIDAD MALA / ALTA LATENCIA

### 3.1 Perfil de red objetivo

| Parámetro | Valor típico en zona rural |
|-----------|---------------------------|
| Latencia (RTT) | 200-800ms |
| Ancho de banda | 0.5-5 Mbps |
| Pérdida de paquetes | 1-5% |
| Desconexiones intermitentes | Comunes (cambios de torre 3G→2G→sin señal) |

### 3.2 Estrategia de carga actual

```
ETAPA 1 (t=0ms):      Placeholder Cloudinary   <15KB, carga en <200ms en 3G
ETAPA 2 (t=200-800ms): Imagen full Cloudinary   ~300KB, carga en 1-3s en 3G
ETAPA 3 (t=500ms-5s):  Tiles WebP locales       256KB/tile, 10-30 tiles/zoom
```

### 3.3 Estrategias de cache

#### 3.3.1 Cache-Control inmutable (servidor)

Los tiles se sirven con `Cache-Control: public, max-age=31536000, immutable`.
Esto significa que **el navegador nunca revalida** un tile después de la
primera descarga — lo sirve del disco incluso sin conexión.

**Implementación actual (dev):** `vite.config.ts` tilesServePlugin.
**Implementación en producción:** Depende del servidor de despliegue (ver §5).

#### 3.3.2 Cache API / Service Worker

Un Service Worker puede precachear la pirámide completa de tiles en
`install` y servir tiles offline sin tocar la red.

```javascript
// sw.js (propuesto)
const TILES_CACHE = 'atlas-tiles-v1'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(TILES_CACHE).then((cache) => {
      // Precachear tiles críticos (z6-z8 completos, ~20 tiles)
      return cache.addAll([
        '/assets/maps/tiles/mapas/chapter1-ecosistemas/6/18/31.webp',
        '/assets/maps/tiles/mapas/chapter1-ecosistemas/6/18/32.webp',
        // ... lista completa de tiles de zoom bajo
      ])
    })
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/assets/maps/tiles/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        // Cache-first: si está en cache, servirlo
        // si no, fetch de red + guardar en cache
        const networkFetch = fetch(event.request).then((response) => {
          const clone = response.clone()
          caches.open(TILES_CACHE).then((cache) => cache.put(event.request, clone))
          return response
        })
        return cached || networkFetch
      })
    )
  }
})
```

**Pros:**
- Tiles disponibles offline después de la primera visita
- Sin latencia de red para tiles ya vistos
- Transparente para MapLibre (usa fetch normal, el SW lo intercepta)

**Contras:**
- Aumenta el peso de la primera carga (precache de tiles)
- ~8MB de storage local para la pirámide de un solo mapa (z6-z11)
- Storage del navegador limitado (~50-100MB en navegadores móviles)

**Recomendación:** Precachear z6-z8 (~20 tiles, ~200-500KB) en el SW para
que el mapa se vea bien incluso con conectividad intermitente. Los tiles de
zoom alto (z9-z11, ~600 tiles, ~8MB) se cachean lazy bajo demanda según el
usuario navega.

#### 3.3.3 Timeout y retry en peticiones de tiles

MapLibre no tiene timeout ni retry nativo en peticiones de tiles. Si un tile
tarda >30s, queda en blanco. Estrategia:

```typescript
// TransformRequest hook en MapLibre
new Map({
  transformRequest: (url, resourceType) => {
    if (resourceType === 'Tile' && url.includes('/assets/maps/tiles/')) {
      return {
        url,
        // El navegador maneja timeout vía AbortController
        // MapLibre cancelará la request si el tile ya no es necesario
      }
    }
  }
})
```

Para retry, configurar el source con `tiles` array de URLs redundantes:

```typescript
map.addSource('atlas-tiles', {
  type: 'raster',
  tiles: [
    '/assets/maps/tiles/mapas/chapter1-ecosistemas/{z}/{x}/{y}.webp',  // local
    'https://backup-cdn.example.com/tiles/mapas/chapter1-ecosistemas/{z}/{x}/{y}.webp',  // CDN fallback
  ],
  // ...
})
```

MapLibre probará la segunda URL si la primera falla (timeout o error HTTP).

### 3.4 Prefetching inteligente

Prefetch de tiles del mapa siguiente en el capítulo:

```typescript
// En useMap o un hook separado (usePrefetchTiles)
function prefetchAdjacentMap(mapId: string): void {
  const entry = getMapEntry(mapId)
  if (!entry?.tiles) return

  // Solo precargar z6-z8 (menos tiles, cobertura completa)
  const urlBase = entry.tiles.urlTemplate
  for (let z = 6; z <= 8; z++) {
    const T = (2 * 6378137 * Math.PI) / (2 ** z)  // tamaño de tile en metros
    // Calcular rango x/y desde los bounds...
    // fetch con priority: 'low' y no esperar respuesta
  }
}
```

---

## 4. CDN / DESPLIEGUE DE TILES — ANÁLISIS COMPLETO

### 4.1 Opciones evaluadas

#### OPCIÓN A: Servir desde el mismo servidor (cPanel LiteSpeed)

**Descripción:** Los tiles se almacenan en el mismo hosting que la app.
LiteSpeed tiene cache de archivos estáticos built-in (LSCache).
El despliegue actual planeado es `atlas.unriocauca.com` en LatinAmericaHosting.

**Pros:**
- Sin costo adicional (incluido en el hosting)
- Sin configuración extra (los archivos en `public/` se sirven automáticamente)
- Misma latencia que el HTML/JS (co-localizado)
- LiteSpeed sirve archivos estáticos muy rápido (comparable a nginx)
- Headers de cache configurables desde `.htaccess` o panel de control

**Contras:**
- Latencia limitada por la ubicación del servidor
- Sin distribución geográfica (CDN)
- Si el servidor cae, los tiles no están disponibles (single point of failure)
- Ancho de banda del hosting limitado (típico 100-500 GB/mes en plan M2)

**Configuración LiteSpeed (.htaccess):**
```apache
# Cache tiles 1 año (inmutables porque nunca cambian)
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp "access plus 1 year"
</IfModule>

<IfModule mod_headers.c>
  <FilesMatch "\.webp$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
</IfModule>
```

#### OPCIÓN B: Cloudinary como CDN (subir tiles)

**Descripción:** Los tiles se suben a Cloudinary como imágenes individuales.
Cloudinary ya se usa para las imágenes base y tiene distribución CDN global
(Akamai/CloudFront).

**Pros:**
- Mismo proveedor que las imágenes base (integración simple)
- CDN global con puntos de presencia en Latinoamérica
- Transformaciones on-the-fly (cambio de formato, calidad, redimension)
- Ya hay cuenta configurada (`dvluvxfvn`)
- Buen rendimiento en Colombia (POP en Bogotá y São Paulo)

**Contras:**
- **NO diseñado para tiles XYZ**: Cloudinary espera imágenes con nombres
  planos, no estructura `{z}/{x}/{y}.webp`. Subir 657 archivos a carpetas
  anidadas es posible pero no idiomático.
- **Costo**: Plan gratuito 25 GB storage + 25 GB bandwidth. 657 tiles × ~13KB
  c/u = ~8.5MB por mapa. Con 31 mapas: ~260MB storage. Pero el bandwidth:
  cada visita descarga 50-150 tiles = ~1-2MB por sesión. Con 1000 visitas/mes:
  ~2 GB bandwidth → dentro del plan gratuito.
- **Límite de transformaciones**: 25 transformaciones por segundo en plan
  gratuito. Si los tiles se sirven sin transformación, no aplica.
- **Latencia adicional**: +50-100ms vs servir local.

**Configuración:**
```javascript
// tiles.js con Cloudinary
{
  urlTemplate: 'https://res.cloudinary.com/dvluvxfvn/image/upload/tiles/mapas/chapter1-ecosistemas/{z}/{x}/{y}.webp'
}
```

**Script de subida (propuesto):**
```bash
# Subir una pirámide completa a Cloudinary
# cloudinary-cli o API upload con preset
for file in public/assets/maps/tiles/mapas/chapter1-ecosistemas/**/*.webp; do
  cld upload "$file" --folder "$(dirname "$file")" --use-filename
done
```

#### OPCIÓN C: Cloudflare R2 o BunnyCDN (object storage + CDN)

**Descripción:** Almacenar los tiles en object storage (R2, Bunny Storage,
Wasabi, Backblaze B2) y servirlos a través de su CDN integrado.

##### C.1 Cloudflare R2

**Pros:**
- Sin costos de egress (ancho de banda de salida gratuito)
- CDN de Cloudflare (280+ puntos de presencia, excelente cobertura en LATAM)
- $0.015/GB/mes de storage (~$0.004/mes para 260MB)
- Compatible con S3 API (subida con aws-cli o rclone)
- Cache en edge automático con Workers
- Headers de cache configurables vía transform rules
- TLS/SSL gratuito con certificado de Cloudflare

**Contras:**
- Requiere dominio con DNS en Cloudflare (cambiar nameservers si no están)
- Configuración inicial más compleja (crear bucket, token, subir archivos)
- Si no se usa Cloudflare DNS para el dominio principal, se necesita subdominio

**Configuración estimada:**
```javascript
// tiles.js con R2
{
  urlTemplate: 'https://tiles.atlas.unriocauca.com/mapas/chapter1-ecosistemas/{z}/{x}/{y}.webp'
}
```

##### C.2 BunnyCDN

**Pros:**
- Almacenamiento georreplicado en 6 regiones (incluye São Paulo)
- CDN con 114+ PoPs (buena cobertura en LATAM)
- $0.01/GB storage + $0.005/GB bandwith (muy barato: ~$0.03/mes para el tráfico estimado)
- Panel de control simple (sin CLI necesaria)
- PermPath cache con purge instantáneo
- Edge Rules para headers personalizados

**Contras:**
- Menor cantidad de PoPs que Cloudflare en Colombia específicamente
- Costo de egress (aunque mínimo para este volumen)

#### OPCIÓN D: GitHub Releases / GitHub Pages como CDN

**Descripción:** Comprimir la pirámide de tiles en un ZIP, publicarla en GitHub
Releases, y descomprimirla en CI/CD o servirla directamente con raw URLs.

**Pros:**
- Gratuito ilimitado (storage + bandwidth en GitHub)
- Ya se usa git para el código fuente
- Versionado natural (cada release de tiles es una versión)
- urls raw.githubusercontent.com sirven como CDN improvisado

**Contras:**
- GitHub Pages/Raw NO es un CDN (sin edge caching real)
- Latencia alta desde Latinoamérica (servidores de GitHub en US)
- Límite de tamaño de release: 2 GB por archivo (OK para tiles comprimidos)
- No recomendado para producción

#### OPCIÓN E: Vercel (integrado en el deploy actual de dev)

**Descripción:** Los tiles se incluyen en el build de Vercel como assets
estáticos. Vercel los sirve desde su CDN global (Edge Network).

**Pros:**
- Ya integrado en el flujo de dev (Vite dev server con tilesServePlugin)
- CDN global con buena cobertura en LATAM (PoPs en São Paulo, Bogotá)
- Configuración con `vercel.json`: headers de cache por ruta
- Sin costo adicional (el plan hobby incluye 100 GB bandwidth)
- TLS/SSL automático
- Misma plataforma que el frontend (simplicidad)

**Contras:**
- Los tiles NO se versionan en git (`.gitignore`), hay que generarlos en CI
- El plan hobby tiene límite de 100 GB bandwidth/mes (~50K visitas de mapa)
- Sin cache persistente entre deploys (cada deploy re-sirve los tiles)
- En Vercel Pro (si se necesita >100GB bandwidth), $20/mes

**Configuración vercel.json propuesta:**
```json
{
  "headers": [
    {
      "source": "/assets/maps/tiles/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ],
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

#### OPCIÓN F: AWS S3 + CloudFront

**Descripción:** Bucket S3 con CloudFront CDN para distribución global.

**Pros:**
- Escalabilidad ilimitada
- CloudFront tiene edge locations en Colombia (Bogotá)
- IAM granular para control de acceso

**Contras:**
- Costos variables y complejos (storage, requests, egress)
- Configuración AWS inicial compleja (bucket policy, IAM, CloudFront distribution)
- Latencia de invalidación de cache (15-30 min en CloudFront)
- Overkill para 260MB de tiles

#### OPCIÓN G: Tile server dedicado (TileServer GL, Martin)

**Descripción:** Servidor que genera tiles on-the-fly desde un solo archivo
MBTiles (SQLite con la pirámide completa).

**Pros:**
- Una sola descarga inicial (~8 MB para el archivo MBTiles)
- Sin tiles individuales que almacenar/servir
- TileServer GL: lightweight (Go binary de 8MB), sirve tiles + style JSON + sprites
- Martin: Rust, generación de tiles ultra-rápida con PostGIS/MBTiles/PMTiles
- PMTiles: archivo único con la pirámide, servible sin servidor (HTTP range requests)

**Contras:**
- Requiere un servidor VPS o contenedor (costo mensual)
- Complejidad operacional (mantener servidor, actualizarlo, monitorearlo)
- Latencia adicional vs archivos estáticos (generación on-the-fly)
- Overkill para datos estáticos que no cambian

**Recomendación PMTiles específica:**
PMTiles es un formato de archivo único que contiene toda la pirámide. Se
puede servir desde cualquier servidor HTTP con soporte de range requests
(incluido LiteSpeed, Cloudflare R2, S3). MapLibre tiene soporte nativo con
el plugin `pmtiles`.

```javascript
// Con maplibre-gl + pmtiles protocol
import { Protocol } from 'pmtiles'

const protocol = new Protocol()
maplibregl.addProtocol('pmtiles', protocol.tile)

map.addSource('atlas-tiles', {
  type: 'raster',
  url: 'pmtiles://https://example.com/tiles/mapas/chapter1-ecosistemas.pmtiles',
  tileSize: 256,
})
```

### 4.2 Tabla comparativa

| Opción | Costo mensual | Latencia LATAM | Setup | Mantenimiento | ¿Recomendado? |
|--------|--------------|----------------|-------|---------------|------|
| A: cPanel LiteSpeed | $0 (incluido) | Media | Bajo | Bajo | **SÍ (recomendado)** |
| B: Cloudinary | $0 (<25GB) | Baja | Medio | Bajo | Alternativa |
| C1: Cloudflare R2 | ~$0.004 | Muy baja | Medio | Bajo | **SÍ (ideal)** |
| C2: BunnyCDN | ~$0.03 | Baja | Bajo | Bajo | Alternativa sólida |
| D: GitHub | $0 | Alta | Bajo | Bajo | NO (solo dev) |
| E: Vercel | $0 (<100GB) | Baja | Bajo | Bajo | **SÍ (dev/transición)** |
| F: S3+CloudFront | ~$1-5 | Muy baja | Alto | Medio | Overkill |
| G: TileServer/PMTiles | ~$5-20 (VPS) | Variable | Alto | Alto | Overkill |

### 4.3 Recomendación para despliegue rural

**Estrategia combinada en capas:**

| Capa | Tecnología | Rol | Prioridad |
|------|------------|-----|-----------|
| **CDN principal** | Cloudflare R2 | Distribución global con edge en Bogotá, sin costo de egress | Fase 2 |
| **Servidor local** | cPanel LiteSpeed | Fallback si el CDN no responde (misma URL pero con dominio local) | Fase 1 |
| **Cache local** | Service Worker | Offline después de la primera visita, latencia 0 en visitas repetidas | Fase 1 |
| **Cache navegador** | Cache-Control: immutable | Sin revalidaciones, instantáneo en visitas repetidas | Fase 1 |

La **fase 1 (inmediata)** usa cPanel LiteSpeed con headers de cache + Service
Worker para precachear z6-z8.

La **fase 2 (cuando el tráfico crezca)** migra a Cloudflare R2 por su CDN
en LATAM + egress gratuito + configuración simple.

**URL template final (multi-fuente con fallback):**
```javascript
{
  urlTemplate: [
    'https://tiles-cdn.atlas.unriocauca.com/mapas/{mapId}/{z}/{x}/{y}.webp',  // CDN
    '/assets/maps/tiles/mapas/{mapId}/{z}/{x}/{y}.webp',  // fallback local
  ]
}
```

---

## 5. PLAN DE CONTINGENCIAS

### 5.1 Si los tiles tardan en cargar (>5s)

| Escenario | Qué ve el usuario | Acción |
|-----------|------------------|--------|
| Tile individual lento | Área en blanco en un sector del mapa | MapLibre muestra el tile padre (zoom N-1 estirado). No requiere acción. |
| Todos los tiles lentos | Solo se ve la imagen base (placeholder → full) | La imagen base cubre todo el mapa. El usuario puede navegar sin tiles. No es un fallo crítico. |
| Tiles + imagen base lentos | Solo color de fondo (#03091e) | Mostrar spinner y mensaje: "Cargando mapa... Si tarda mucho, recargue la página" |

### 5.2 Si el CDN no responde (caído, DNS, bloqueo)

1. MapLibre intenta la URL del CDN primero (porque está primera en el array `tiles`)
2. Si falla (timeout ~10s), intenta la URL local (`/assets/maps/tiles/...`)
3. Si ambas fallan, MapLibre no muestra tiles y solo se ve la imagen base
4. El mapa sigue siendo navegable (sin alta resolución, pero usable)

**No se necesita código adicional**: MapLibre ya soporta múltiples URLs en
el array `tiles` de la fuente raster y las prueba en orden.

### 5.3 Si el navegador no soporta WebGL

- MapLibre GL JS requiere WebGL. En navegadores sin WebGL (~5% del tráfico
  global, típicamente dispositivos muy antiguos o entornos restringidos):
  - Mostrar mensaje: "Tu navegador no soporta mapas interactivos. Usa Chrome, Firefox o Edge."
  - Alternativa: imagen estática del mapa (PNG full) con zoom CSS y sin interacción.

### 5.4 Si la GPU integrada se sobrecalienta o crashea WebGL

- MapLibre detecta el evento `webglcontextlost` y pausa el renderizado
- Si se recupera (`webglcontextrestored`), reanuda
- Si no, el canvas queda congelado → el usuario debe recargar la página
- Mitigación: `maxParallelImageRequests: 2` reduce la presión en GPU

### 5.5 Si los tiles tienen errores de contenido (desalineados, mala calidad)

| Problema | Causa probable | Fix |
|----------|---------------|-----|
| Tiles desplazados respecto a la imagen base | Bounds del source no coinciden con processBounds | Verificar que addTilesLayer recibe el mismo `bounds` que buildGeoreferencedMap |
| Tiles demasiado borrosos en z10-z11 | Imagen fuente de baja resolución o QUALITY muy baja | Subir QUALITY a 95, regenerar |
| Tiles con zonas transparentes/negras en los bordes del mapa | `-dstalpha` crea transparencia fuera del área cubierta | Normal — son los bordes del mapa donde no hay contenido |
| Tiles estirados/achatados | Relación de aspecto de la imagen fuente != geo.js dimensions | Verificar que la imagen full de Cloudinary tiene las mismas dimensiones que geo.js |

### 5.6 Si hay que regenerar tiles (plan de recuperación)

```bash
# 1. Limpiar tiles existentes
rm -rf public/assets/maps/tiles/mapas/*

# 2. Regenerar tiles (usa la imagen full de Cloudinary, no requiere archivos locales)
pnpm tiles

# 3. Verificar conteo y calidad
node -e "
const fs = require('fs');
const path = require('path');
function count(dir) {
  let n = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    n += e.isDirectory() ? count(path.join(dir, e.name)) : 1;
  }
  return n;
}
const base = 'public/assets/maps/tiles/mapas';
for (const d of fs.readdirSync(base)) {
  console.log(d + ': ' + count(path.join(base, d)) + ' tiles');
}
"
```

---

## 6. GUÍA DE REGENERACIÓN DE TILES

### 6.1 Pre-requisitos

- GDAL CLI 3.12+ con driver WEBP: `C:\Program Files\GDAL\`
- Variables de entorno: `GDAL_DATA`, `PROJ_LIB` (configuradas por el script)
- Conexión a internet (para descargar la imagen full de Cloudinary)
- ~200 MB de espacio temporal en `.tmp-tiles/`
- ~10-50 MB de espacio final en `public/assets/maps/tiles/mapas/{mapId}/`

### 6.2 Comandos

```bash
# Regenerar tiles de un mapa específico
pnpm tiles chapter1-ecosistemas

# Forzar regeneración (ignorar tiles existentes)
pnpm tiles chapter1-ecosistemas --force

# Regenerar TODOS los mapas con config de tiles
pnpm tiles

# Regenerar maps específicos con force
pnpm tiles chapter1-ecosistemas chapter1-bredunco --force
```

### 6.3 Pipeline GDAL (qué hace internamente)

```
1. Descargar imagen full de Cloudinary → .tmp-tiles/{mapId}/source.webp
2. gdal_translate -a_srs EPSG:4326 -a_ullr W N E S → .tmp-tiles/{mapId}/4326.tif
3. gdalwarp -t_srs EPSG:3857 -r lanczos -dstalpha → .tmp-tiles/{mapId}/3857.tif
4. Para cada z en [minZoom..maxZoom+1]:
   Para cada tile (x, y) en la cuadrícula del mapa:
     gdal_translate -of WEBP -co QUALITY=90 -projwin W N E S -outsize 256 256
       → public/assets/maps/tiles/mapas/{mapId}/{z}/{x}/{y}.webp
```

### 6.4 Tiempos estimados de generación

| Mapa | Tiles | Tiempo aprox (HDD) | Tiempo aprox (SSD) |
|------|-------|--------------------|--------------------|
| chapter1-ecosistemas | 657 | 2-3 min | 1-2 min |
| Mapa típico Cap 1 | 400-700 | 1-3 min | 1-2 min |
| 7 mapas Cap 1 | ~3000-4000 | 10-20 min | 5-10 min |
| 31 mapas completos | ~15000-20000 | 1-2 horas | 30-60 min |

### 6.5 Agregar un nuevo mapa a la generación de tiles

1. Asegurar que la imagen `full` en `images.js` esté disponible y correcta
2. Asegurar que el PGW en `geo.js` esté calibrado (width, height correctos)
3. Agregar entrada en `tiles.js`:
```javascript
'chapter2-m-oriente-cali': {
  urlTemplate: '/assets/maps/tiles/mapas/chapter2-m-oriente-cali/{z}/{x}/{y}.webp',
  tileSize: 256,
  minZoom: Math.floor(config.minZoom),
  maxZoom: Math.ceil(config.maxZoom) + 1,
  fadeInDuration: 300,
},
```
4. `pnpm tiles chapter2-m-oriente-cali`
5. Verificar visualmente en el navegador

---

## 7. ROADMAP DE IMPLEMENTACIÓN

### Fase 2a — Pulido visual (Día 1-2)
- [ ] Poner `raster-fade-duration: 0` en capa base
- [ ] Subir QUALITY a 95 en script de tiles
- [ ] Reordenar pipeline: full antes de addTilesLayer
- [ ] Validar visualmente (z6→z11, sin basemap, con basemap, pan rápido)
- [ ] Renombrar `fadeInDuration` → `fadeDuration` por claridad

### Fase 2b — Rendimiento bajo (Día 2-3)
- [ ] `maxParallelImageRequests: 4`
- [ ] Service Worker con precache de z6-z8
- [ ] Generar z12 para eliminar over-zoom
- [ ] `fadeDuration: 0` en animaciones de mapa no esenciales

### Fase 2c — CDN y despliegue (Día 3-4)
- [ ] `.htaccess` con Cache-Control immutable para webp
- [ ] `vercel.json` con headers para tiles
- [ ] URLs alternativas en `tiles` array del source
- [ ] Cloudflare R2 como CDN opcional
- [ ] Documentar setup de R2 en caso de necesitarlo

### Fase 2d — Producción rural (Día 4-5)
- [ ] `lowPowerMode` toggle en uiStore
- [ ] Detección de `navigator.hardwareConcurrency`
- [ ] Fallback sin tiles (solo imagen base) para conexiones muy lentas
- [ ] Lazy load de mapas adyacentes (prefetch de tiles)

---

## 8. DECISIONES DOCUMENTADAS (por qué descartamos alternativas)

| Alternativa descartada | Razón |
|------------------------|-------|
| gdal2tiles.py | Requiere bindings Python (`osgeo_utils`) no disponibles en Windows. El binario CLI de GDAL produce el mismo resultado sin dependencias Python. |
| TileServer GL / Martin | Overkill: sirve tiles on-the-fly desde MBTiles, pero los tiles son estáticos y nunca cambian. Un servidor adicional agrega costo, latencia y mantenimiento sin beneficio. |
| AWS S3 + CloudFront | Configuración excesivamente compleja para 260MB de datos. Cloudflare R2 ofrece lo mismo con egress gratuito y sin la complejidad de IAM. |
| GitHub como CDN | Latencia muy alta desde Colombia (servidores en US). Sin cache edge real. Solo útil para desarrollo. |
| PNG en vez de WebP | Tamaño 3-5x mayor por tile. WebP con QUALITY=90-95 es indistinguible visualmente de PNG a 256px. |
| 512px tiles | Menos peticiones HTTP por zoom, pero cada tile pesa 4x más y tarda 4x más en decodificar → peor para redes lentas. |
| Un solo archivo MBTiles | El navegador no puede leer SQLite nativamente. PMTiles resuelve esto con HTTP range requests, pero MapLibre necesita el plugin `pmtiles` y cada range request agrega latencia de round-trip. Archivos individuales son más cacheables y paralelizables. |

---

## Referencias internas

- `BITACORA.md` — Cronología de decisiones sobre tiles
- `TAREAS.md` — Implementación de tiles en fases
- `PLAN_ATLAS.md` — Arquitectura de carga progresiva fase 8
- `MANUAL_TECNICO.md` — Conceptos de MapLibre, raster sources, tile layers
- `GLOSARIO.md` — Definiciones de tiles, basemap, source, pixel-is-center
- `GLOSARIO_MAPAS.md` — Inventario de mapas, originales PNG, calibración
