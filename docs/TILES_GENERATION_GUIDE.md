# 🗺️ Guía de Generación de Raster Tiles

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Preparación de Imagen](#preparación-de-imagen)
3. [Generación de Tiles](#generación-de-tiles)
4. [Configuración en MapSettings](#configuración-en-mapsettings)
5. [Testing y Troubleshooting](#testing-y-troubleshooting)

---

## 🔧 Requisitos Previos

### 1. Instalar GDAL

**Windows:**

1. Descargar desde: https://www.gisinternals.com/release.php
2. Buscar **"GDAL-X.X.X-win64.msi"** (última versión estable)
3. Instalar en: `C:\Program Files\GDAL`
4. Agregar a PATH del sistema:
   - `C:\Program Files\GDAL`
   - `C:\Program Files\GDAL\bin`

**Verificar instalación:**

```powershell
gdal2tiles.py --version
# Output esperado: GDAL 3.x.x, released 2024/XX/XX
```

---

## 🖼️ Preparación de Imagen

### Formato Requerido

La imagen debe estar en formato **GeoTIFF (.tif)** con georreferenciación embebida o archivo World File (.pgw).

### Estructura de Archivos

```
public/assets/maps/base-images/chapter1/
├── encuadres.tif          # Imagen original alta resolución
├── encuadres.pgw          # World file con coordenadas (si no está embebido)
└── encuadres-base.webp    # Imagen base baja resolución (30KB)
```

### Convertir WebP a GeoTIFF

Si solo tienes la imagen en WebP/PNG/JPG:

```powershell
# Convertir a TIF
gdal_translate -of GTiff encuadres.webp encuadres.tif

# Asignar georreferenciación desde archivo .pgw existente
gdal_translate -a_srs EPSG:4326 encuadres.tif encuadres_geo.tif
```

### Crear Archivo PGW Manualmente

Si no tienes archivo PGW, créalo con tus coordenadas:

**Formato del archivo `encuadres.pgw`:**

```
0.002292682926829268   # Tamaño de píxel en X
0.0                    # Rotación en X
0.0                    # Rotación en Y
-0.002292682926829268  # Tamaño de píxel en Y (negativo)
-79.441458743296       # Coordenada X del centro del píxel superior izquierdo
-1.354624163443        # Coordenada Y del centro del píxel superior izquierdo
```

---

## 🚀 Generación de Tiles

### Opción 1: Script PowerShell (Recomendado)

```powershell
# Navegar al proyecto
cd D:\Atlas\atlas_2.0

# Ejecutar script
.\scripts\generate-tiles.ps1 -MapName "encuadres" -MaxZoom 18
```

**Parámetros disponibles:**

- `-MapName`: Nombre del mapa (sin extensión)
- `-MaxZoom`: Zoom máximo (default: 18)
- `-MinZoom`: Zoom mínimo (default: 0)
- `-TileSize`: Tamaño del tile (default: 512)
- `-Resampling`: Algoritmo de resampling (default: "lanczos")

### Opción 2: Comando GDAL Manual

```bash
gdal2tiles.py \
  --zoom=0-18 \
  --processes=4 \
  --resampling=lanczos \
  --tilesize=512 \
  --webviewer=none \
  --xyz \
  "public/assets/maps/base-images/chapter1/encuadres.tif" \
  "public/assets/maps/tiles/encuadres/"
```

### Estimación de Tiempo y Espacio

| Zoom Levels | Tiles Aproximados | Tamaño en Disco | Tiempo Estimado |
| ----------- | ----------------- | --------------- | --------------- |
| 0-6         | ~200              | ~2 MB           | 30 segundos     |
| 0-12        | ~3,000            | ~30 MB          | 2-3 minutos     |
| 0-18        | ~50,000           | ~500 MB         | 10-15 minutos   |

---

## ⚙️ Configuración en MapSettings

### 1. Actualizar `mapSettings.ts`

```typescript
export const mapSettings: Record<string, MapSettings> = {
  "chapter1-encuadres": {
    // ... configuración existente ...

    // ✅ NUEVO: Configuración de tiles
    useTiles: true,
    tilesConfig: {
      urlTemplate: "/assets/maps/tiles/encuadres/{z}/{x}/{y}.png",
      tileSize: 512,
      minZoom: 0,
      maxZoom: 18,
      fadeInDuration: 300, // ms
    },
  },
};
```

### 2. Estructura Final de Directorios

```
public/assets/maps/
├── base-images/
│   └── chapter1/
│       ├── encuadres.tif          # Original para generar tiles
│       ├── encuadres.pgw          # Georreferenciación
│       └── encuadres-base.webp    # Base 30KB (siempre visible)
└── tiles/
    └── encuadres/
        ├── 0/
        │   └── 0/
        │       └── 0.png
        ├── 1/
        │   ├── 0/
        │   │   ├── 0.png
        │   │   └── 1.png
        │   └── 1/
        │       ├── 0.png
        │       └── 1.png
        └── ...
```

---

## 🧪 Testing y Troubleshooting

### Verificar Tiles Generados

```powershell
# Contar tiles
(Get-ChildItem -Path "public\assets\maps\tiles\encuadres" -Recurse -Filter "*.png").Count

# Ver tamaño total
(Get-ChildItem -Path "public\assets\maps\tiles\encuadres" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
```

### Probar Tile Individual

Abre en navegador:

```
http://localhost:5173/assets/maps/tiles/encuadres/0/0/0.png
```

Deberías ver un tile PNG válido.

### Problemas Comunes

#### ❌ "GDAL no encontrado"

- Verifica que GDAL esté en PATH
- Reinicia terminal después de instalar

#### ❌ "Imagen sin georreferenciación"

- Verifica que existe archivo .pgw
- O usa `gdalinfo encuadres.tif` para ver si tiene coordenadas embebidas

#### ❌ "Tiles corruptos o negros"

- Verifica el formato de entrada (debe ser GeoTIFF válido)
- Revisa que las coordenadas en .pgw sean correctas
- Intenta con otro algoritmo: `-Resampling "bilinear"`

#### ❌ "Coordenadas incorrectas en mapa"

- Las coordenadas en .pgw deben coincidir con las del código
- Verifica que el sistema de referencia sea EPSG:4326 (WGS84)

### Regenerar Tiles Específicos

Si solo quieres regenerar ciertos niveles de zoom:

```powershell
# Solo zooms 0-12 (rápido, baja resolución)
.\scripts\generate-tiles.ps1 -MapName "encuadres" -MaxZoom 12

# Solo zooms altos 13-18 (detalle máximo)
.\scripts\generate-tiles.ps1 -MapName "encuadres" -MinZoom 13 -MaxZoom 18
```

---

## 🎯 Optimizaciones Avanzadas

### TileSize: 256 vs 512

```typescript
// 256px (estándar tradicional)
tileSize: 256; // Más tiles, cargas más frecuentes

// 512px (recomendado para alta resolución)
tileSize: 512; // Menos tiles, mejor calidad, menos requests
```

### Resampling Algorithms

| Algoritmo  | Calidad | Velocidad | Uso Recomendado |
| ---------- | ------- | --------- | --------------- |
| `nearest`  | Baja    | Rápido    | Testing         |
| `bilinear` | Media   | Medio     | Mapas simples   |
| `lanczos`  | Alta    | Lento     | Producción      |

### Compression

Para reducir tamaño de tiles:

```bash
# Con pngquant (instalar separadamente)
pngquant --quality=65-85 --ext .png --force public/assets/maps/tiles/**/*.png
```

---

## 📚 Referencias

- [GDAL2Tiles Documentation](https://gdal.org/programs/gdal2tiles.html)
- [MapLibre Raster Tiles](https://maplibre.org/maplibre-gl-js-docs/style-spec/sources/#raster)
- [XYZ Tile Standard](https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames)

---

## ✅ Checklist de Implementación

- [ ] GDAL instalado y verificado
- [ ] Imagen convertida a GeoTIFF
- [ ] Archivo .pgw creado/verificado
- [ ] Tiles generados con script
- [ ] Tiles accesibles en navegador
- [ ] MapSettings configurado con `useTiles: true`
- [ ] MapRenderer actualizado con `addTilesLayer()`
- [ ] Testing en diferentes niveles de zoom
- [ ] Verificado fallback a imagen base
