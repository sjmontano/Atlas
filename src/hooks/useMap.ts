/**
 * 🪝 USE MAP
 * ===========
 *
 * Hook principal del visor. Orquesta el ciclo de vida del mapa:
 *
 *   datos (getMapEntry) → buildGeoreferencedMap → mapBuilt
 *
 * Se ejecuta una vez por mapId. Al cambiar de mapa o desmontar,
 * destruye la instancia de MapLibre anterior.
 */

import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import type * as maplibregl from 'maplibre-gl'
import { getMapEntry } from '@data/maps'
import { buildGeoreferencedMap, type MapController } from '@services/MapRenderer'
import { logger } from '@services/MapLogger'
import { useMapStore } from '@stores/mapStore'

const CATEGORY = 'useMap'

export interface UseMapOptions {
  mapId: string
  containerRef: RefObject<HTMLDivElement | null>
  controllerRef?: RefObject<MapController | null>
}

export interface UseMapResult {
  /** Instancia de MapLibre (ref, null hasta que el mapa esté listo) */
  mapRef: RefObject<maplibregl.Map | null>
  /** Error de inicialización, null si todo OK */
  error: string | null
}

export function useMap({ mapId, containerRef, controllerRef }: UseMapOptions): UseMapResult {
  const mapRef = useRef<maplibregl.Map | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Acciones del store (referencias estables, no causan re-render)
  const setMapBuilt = useMapStore((s) => s.setMapBuilt)
  const setLoading = useMapStore((s) => s.setLoading)
  const setStoreError = useMapStore((s) => s.setError)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const entry = getMapEntry(mapId)
    if (!entry) {
      const msg = `Mapa no encontrado en los datos: ${mapId}`
      setError(msg)
      setStoreError(msg)
      logger.error(CATEGORY, msg)
      return
    }

    let cancelled = false
    let destroy: (() => void) | null = null

    setLoading(true)
    setError(null)

    buildGeoreferencedMap(container, mapId, entry)
      .then((result) => {
        if (cancelled) {
          result.destroy()
          return
        }
        mapRef.current = result.map
        destroy = result.destroy
        if (controllerRef) {
          controllerRef.current = result.controller
        }
        setMapBuilt(true)
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const msg = err instanceof Error ? err.message : String(err)
        setError(msg)
        setStoreError(msg)
        setLoading(false)
        logger.error(CATEGORY, `Error construyendo mapa: ${mapId}`, err)
      })

    return () => {
      cancelled = true
      destroy?.()
      mapRef.current = null
      if (controllerRef) {
        controllerRef.current = null
      }
      setMapBuilt(false)
    }
    // containerRef es estable (ref de React); mapId dispara el rebuild
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapId])

  return { mapRef, error }
}
