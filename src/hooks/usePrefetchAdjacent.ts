import { useEffect } from 'react'
import { getAllMaps } from '@data/chapters/chapters.js'
import { getMapEntry } from '@data/maps'
import { useConnectionStore } from '@stores/connectionStore.js'

function preloadImage(url: string): void {
  if (!url) return
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.src = url
}

export function usePrefetchAdjacent(mapId: string) {
  const isOnline = useConnectionStore((s) => s.isOnline)
  const isSlow = useConnectionStore((s) => s.isSlow)

  useEffect(() => {
    if (!mapId || !isOnline || isSlow) return

    const allMaps = getAllMaps()
    const idx = allMaps.findIndex((m) => m.mapId === mapId)
    if (idx < 0) return

    const timer = setTimeout(() => {
      const adjacentIds = [allMaps[idx - 1]?.mapId, allMaps[idx + 1]?.mapId].filter(Boolean)

      for (const adjId of adjacentIds) {
        const entry = getMapEntry(adjId!)
        if (entry?.images?.full) {
          preloadImage(entry.images.full)
        }
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [mapId, isOnline, isSlow])
}
