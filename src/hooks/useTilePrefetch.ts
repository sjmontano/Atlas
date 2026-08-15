import { useEffect, useRef } from 'react'
import { getMapContent } from '@content'
import { processBounds } from '@services/BoundsCalculator'
import { useConnectionStore } from '@stores/connectionStore'
import { prefetchRegionTiles, resolveAdaptivePrefetchMaxZoom } from '@services/TilePrefetcher'
import { logger } from '@services/MapLogger'

const CATEGORY = 'useTilePrefetch'

/**
 * Precarga los tiles z6-z8 del mapa actual durante el tiempo inactivo
 * del navegador. Solo se activa si el mapa tiene tiles configurados y
 * la conexión lo permite (no se ejecuta en 2G/offline).
 *
 * Delay de 2s para no competir con la carga de la imagen base + tiles
 * que MapLibre ya está pidiendo.
 */
export function useTilePrefetch(mapId: string) {
  const isOnline = useConnectionStore((s) => s.isOnline)
  const isSlow = useConnectionStore((s) => s.isSlow)
  const cancelRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!isOnline || isSlow) return

    const entry = getMapContent(mapId)
    if (!entry?.tiles) return

    const { bounds } = processBounds(entry.geo.pgw, entry.geo.width, entry.geo.height)
    if (!bounds) return

    const adaptiveMaxZoom = resolveAdaptivePrefetchMaxZoom(entry.tiles.maxZoom)
    if (adaptiveMaxZoom === null) return

    const config = {
      urlTemplate: entry.tiles.urlTemplate,
      bounds: [bounds[0], bounds[1], bounds[2], bounds[3]] as [number, number, number, number],
      minZoom: entry.tiles.minZoom,
      maxZoom: Math.min(adaptiveMaxZoom, 8),
      excludeZoom: entry.tiles.minZoom + 1,
    }

    logger.debug(CATEGORY, `Prefetch tiles: ${mapId}`, {
      zoom: `${config.minZoom}-${config.maxZoom}`,
    })

    cancelRef.current = prefetchRegionTiles(config, 2000)

    return () => {
      cancelRef.current?.()
      cancelRef.current = null
    }
  }, [mapId, isOnline, isSlow])
}
