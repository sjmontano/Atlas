import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { useMap } from '@hooks/useMap'
import { useAutoLowPower } from '@hooks/useAutoLowPower'
import { usePrefetchAdjacent } from '@hooks/usePrefetchAdjacent'
import { useMapStore } from '@stores/mapStore'
import { useUIStore } from '@stores/uiStore'
import { useConnectionStore } from '@stores/connectionStore'
import { addBasemap, removeBasemap, setImageOpacity } from '@services/BasemapManager'
import type { MapController } from '@services/MapRenderer'
import { MapControls } from './MapControls'
import { OfflineBanner } from './OfflineBanner'
import styles from './AtlasMap.module.css'

const ENABLE_DEV_TOOLS = import.meta.env.VITE_DEV_TOOLS === 'true'

export interface AtlasMapProps {
  mapId: string
  controllerRef?: RefObject<MapController | null>
}

export function AtlasMap({ mapId, controllerRef }: AtlasMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { mapRef, error } = useMap({ mapId, containerRef, controllerRef })
  const loading = useMapStore((s) => s.loading)
  const tilesStatus = useMapStore((s) => s.tilesStatus)
  const initConnection = useConnectionStore((s) => s.init)

  const basemapVisible = useUIStore((s) => s.basemapVisible)
  const basemapStyle = useUIStore((s) => s.basemapStyle)
  const imageOpacity = useUIStore((s) => s.imageOpacity)

  useAutoLowPower()
  usePrefetchAdjacent(mapId)

  useEffect(() => {
    initConnection()
  }, [initConnection])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (basemapVisible) {
      addBasemap(map, basemapStyle)
    } else {
      removeBasemap(map)
    }
    return () => {
      removeBasemap(map)
    }
  }, [basemapVisible, basemapStyle, mapRef])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    setImageOpacity(map, imageOpacity)
  }, [imageOpacity, mapRef])

  return (
    <div className={styles.wrapper}>
      <div ref={containerRef} className={styles.mapContainer} />
      <OfflineBanner />

      {!loading && tilesStatus === 'degraded' && (
        <div className={styles.degradedBanner}>
          <span>Modo básico: el mapa es navegable sin alta resolución por conexión lenta.</span>
        </div>
      )}

      {ENABLE_DEV_TOOLS && !loading && !error && (
        <MapControls />
      )}

      {loading && (
        <div className={styles.overlay}>
          <div className={styles.spinner} aria-label="Cargando mapa" />
        </div>
      )}

      {error && (
        <div className={styles.overlay}>
          <p className={styles.errorText}>{error}</p>
        </div>
      )}
    </div>
  )
}
