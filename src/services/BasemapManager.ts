import type * as maplibregl from 'maplibre-gl'
import { logger } from './MapLogger'

export type BasemapStyle = 'light' | 'streets' | 'satellite'

const CATEGORY = 'BasemapManager'

const BASEMAP_SOURCE_ID = 'basemap-devtool'
const BASEMAP_LAYER_ID = 'basemap-devtool-layer'

const BASEMAP_TILES: Record<BasemapStyle, string> = {
  streets: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  light: 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
}

export function addBasemap(map: maplibregl.Map, style: BasemapStyle): void {
  try {
    if (map.getSource(BASEMAP_SOURCE_ID)) {
      logger.warn(CATEGORY, 'Basemap source already exists — updating')
      removeBasemap(map)
    }

    const tiles = BASEMAP_TILES[style]
    if (!tiles) {
      logger.error(CATEGORY, `Unknown basemap style: ${style}`)
      return
    }

    map.addSource(BASEMAP_SOURCE_ID, {
      type: 'raster',
      tiles: [tiles],
      tileSize: 256,
      attribution:
        style === 'streets'
          ? '© OpenStreetMap contributors'
          : style === 'light'
            ? '© CARTO'
            : '© ESRI',
    })

    map.addLayer(
      {
        id: BASEMAP_LAYER_ID,
        type: 'raster',
        source: BASEMAP_SOURCE_ID,
        paint: { 'raster-fade-duration': 0 },
      },
      'atlas-base-image-layer',
    )

    logger.info(CATEGORY, `Basemap added: ${style}`)
  } catch (e) {
    logger.warn(CATEGORY, 'Error adding basemap', e)
  }
}

export function removeBasemap(map: maplibregl.Map): void {
  try {
    if (map.getLayer(BASEMAP_LAYER_ID)) {
      map.removeLayer(BASEMAP_LAYER_ID)
    }
    if (map.getSource(BASEMAP_SOURCE_ID)) {
      map.removeSource(BASEMAP_SOURCE_ID)
    }
    logger.info(CATEGORY, 'Basemap removed')
  } catch (e) {
    logger.warn(CATEGORY, 'Error removing basemap', e)
  }
}

const IMAGE_LAYER_ID = 'atlas-base-image-layer'

export function setImageOpacity(map: maplibregl.Map, opacity: number): void {
  const clamped = Math.max(0, Math.min(1, opacity))
  try {
    if (map.getLayer(IMAGE_LAYER_ID)) {
      map.setPaintProperty(IMAGE_LAYER_ID, 'raster-opacity', clamped)
    }
  } catch (e) {
    logger.warn(CATEGORY, 'Error setting image opacity', e)
  }
}
