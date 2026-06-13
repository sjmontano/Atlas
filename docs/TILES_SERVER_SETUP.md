# 🚀 Servidor de Tiles - Configuración

## 🎯 Desarrollo Local (Ya Configurado ✅)

**¡Buenas noticias!** El servidor de tiles ya está configurado automáticamente gracias a **Vite**.

### Cómo Funciona

```
📁 public/assets/maps/tiles/encuadres/
    └── 0/
        └── 0/
            └── 0.png

        ↓ Vite automáticamente sirve estos archivos

http://localhost:5173/assets/maps/tiles/encuadres/0/0/0.png
```

### Verificar que Funciona

1. **Iniciar servidor de desarrollo:**

```powershell
npm run dev
```

2. **Probar en navegador:**

```
http://localhost:5173/assets/maps/tiles/encuadres/0/0/0.png
```

Si ves una imagen PNG, ¡está funcionando! ✅

---

## 📦 Preparación para Producción

### Opción 1: Servir desde CDN (Recomendado)

**Cloudinary (ya configurado en el proyecto):**

```typescript
// En mapSettings.ts
tilesConfig: {
  urlTemplate: "https://res.cloudinary.com/tu-cloud/image/upload/tiles/encuadres/{z}_{x}_{y}.png",
  // ...
}
```

**Ventajas:**

- ✅ CDN global (baja latencia)
- ✅ Compresión automática
- ✅ Caché optimizado
- ✅ Escalado automático

**Pasos:**

1. Subir tiles a Cloudinary
2. Actualizar `urlTemplate` en producción
3. Done 🎉

---

### Opción 2: Servir desde tu Backend

**Nginx (Producción):**

```nginx
# /etc/nginx/sites-available/atlas
server {
    listen 80;
    server_name atlas.example.com;

    # Servir tiles estáticos con cache agresivo
    location /assets/maps/tiles/ {
        root /var/www/atlas/public;
        expires 30d;
        add_header Cache-Control "public, immutable";

        # Compresión
        gzip on;
        gzip_types image/png;

        # CORS (si frontend está en otro dominio)
        add_header Access-Control-Allow-Origin "*";
    }

    # Resto de la aplicación
    location / {
        root /var/www/atlas/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

**Apache (Alternativa):**

```apache
<Directory "/var/www/atlas/public/assets/maps/tiles">
    # Cache de 30 días
    ExpiresActive On
    ExpiresDefault "access plus 30 days"

    # CORS
    Header set Access-Control-Allow-Origin "*"

    # Compresión
    AddOutputFilterByType DEFLATE image/png
</Directory>
```

---

### Opción 3: Tile Server Dedicado (Avanzado)

**TileServer GL** (si necesitas más control):

```bash
# Instalar
npm install -g tileserver-gl

# Crear configuración
cat > tileserver-config.json << EOF
{
  "options": {
    "paths": {
      "root": "/path/to/atlas/public/assets/maps/tiles"
    },
    "domains": ["localhost:8080"],
    "formatQuality": {
      "png": 90
    }
  },
  "data": {
    "encuadres": {
      "mbtiles": "encuadres.mbtiles"
    }
  }
}
EOF

# Iniciar servidor
tileserver-gl --config tileserver-config.json
```

**Ventajas:**

- ✅ Optimizaciones específicas para tiles
- ✅ Formatos avanzados (MBTiles, PMTiles)
- ✅ Reprojección on-the-fly

---

## 🔧 Variables de Entorno

Para cambiar URL base según entorno:

**`.env.development`:**

```env
VITE_TILES_BASE_URL=/assets/maps/tiles
```

**`.env.production`:**

```env
VITE_TILES_BASE_URL=https://cdn.example.com/tiles
```

**En `mapSettings.ts`:**

```typescript
const tilesBaseUrl = import.meta.env.VITE_TILES_BASE_URL || '/assets/maps/tiles';

tilesConfig: {
  urlTemplate: `${tilesBaseUrl}/encuadres/{z}/{x}/{y}.png`,
  // ...
}
```

---

## 📊 Monitoreo y Debug

### Ver Requests de Tiles en DevTools

1. Abrir **Network** tab en DevTools
2. Filtrar por `tiles/`
3. Verificar:
   - ✅ Status 200 (tiles cargando correctamente)
   - ⚠️ Status 404 (tile faltante - normal en bordes del mapa)
   - ❌ Status 500 (error del servidor)

### Logs de MapLibre

```typescript
// En console del navegador
map.showTileBoundaries = true; // Ver bordes de tiles
map.showCollisionBoxes = true; // Ver colisiones
```

### Inspeccionar Tile Source

```typescript
// En console
const source = map.getSource("chapter1-encuadres-tiles");
console.log(source);
```

---

## 🎯 Checklist de Despliegue

### Pre-Deploy

- [ ] Tiles generados con GDAL
- [ ] Tiles verificados localmente (localhost:5173)
- [ ] Tamaño total de tiles aceptable
- [ ] URL template configurada para producción

### Deploy a CDN (Opción 1)

- [ ] Tiles subidos a Cloudinary/S3/etc
- [ ] URL template actualizada en `.env.production`
- [ ] Cache headers configurados
- [ ] CORS habilitado si es necesario

### Deploy a Servidor Propio (Opción 2)

- [ ] Tiles copiados a servidor (`/var/www/atlas/public/assets/maps/tiles/`)
- [ ] Nginx/Apache configurado con cache
- [ ] Permisos de archivos correctos (`chmod 644`)
- [ ] Compresión habilitada

### Testing Post-Deploy

- [ ] Tile base (0/0/0.png) carga correctamente
- [ ] Tiles de diferentes zooms cargan
- [ ] Requests tienen headers de cache correctos
- [ ] Tiempo de carga aceptable (< 500ms)
- [ ] Fallback a imagen base funciona si tiles fallan

---

## 🐛 Troubleshooting

### ❌ Tiles no cargan (404)

**Causa:** Ruta incorrecta o tiles no generados

**Solución:**

```powershell
# Verificar que existen
Test-Path "public\assets\maps\tiles\encuadres\0\0\0.png"

# Regenerar si es necesario
.\scripts\generate-tiles.ps1 -MapName "encuadres"
```

### ❌ CORS Error

**Causa:** Frontend y tiles en dominios diferentes

**Solución en Nginx:**

```nginx
add_header Access-Control-Allow-Origin "*";
```

### ❌ Tiles cargan lento

**Causa:** Sin compresión o cache

**Solución:**

1. Habilitar gzip en servidor
2. Configurar cache headers (30 días)
3. Considerar formato WebP en lugar de PNG

### ❌ Imagen base no se ve

**Causa:** Tiles cubren completamente la imagen base

**Solución:** Esto es normal. La imagen base solo es visible:

- Mientras tiles se están cargando (efecto fade-in)
- Si tiles fallan al cargar (fallback)
- En zoom levels sin tiles generados

---

## 📚 Referencias

- [Vite Static Assets](https://vitejs.dev/guide/assets.html#the-public-directory)
- [MapLibre Raster Sources](https://maplibre.org/maplibre-gl-js-docs/style-spec/sources/#raster)
- [TileServer GL](https://tileserver.readthedocs.io/)
- [Nginx Caching Guide](https://www.nginx.com/blog/nginx-caching-guide/)

---

## ✅ Resumen

| Entorno        | Configuración              | Status                    |
| -------------- | -------------------------- | ------------------------- |
| **Desarrollo** | Vite sirve automáticamente | ✅ Ya configurado         |
| **Producción** | CDN / Nginx / TileServer   | ⏭️ Configurar al deployar |

**Para desarrollo local:** ¡No hay nada que configurar! Vite ya sirve tus tiles automáticamente desde `/public/`. 🎉
