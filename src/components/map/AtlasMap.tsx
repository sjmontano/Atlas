import { useEffect, useRef } from 'react'
import { useMap } from '@hooks/useMap'
import { useMapStore } from '@stores/mapStore'
import { useUIStore } from '@stores/uiStore'
import { addBasemap, removeBasemap, setImageOpacity } from '@services/BasemapManager'
import { MapControls } from './MapControls'
import styles from './AtlasMap.module.css'

const ENABLE_DEV_TOOLS = import.meta.env.VITE_DEV_TOOLS === 'true'

export interface AtlasMapProps {
  mapId: string
}

export function AtlasMap({ mapId }: AtlasMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { mapRef, error } = useMap({ mapId, containerRef })
  const loading = useMapStore((s) => s.loading)

  const basemapVisible = useUIStore((s) => s.basemapVisible)
  const basemapStyle = useUIStore((s) => s.basemapStyle)
  const imageOpacity = useUIStore((s) => s.imageOpacity)

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (basemapVisible) {
      addBasemap(map, basemapStyle)
    } else {
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
