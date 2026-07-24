import { useRef } from 'react'
import { useMap } from '@hooks/useMap'
import { useMapStore } from '@stores/mapStore'
import styles from './AtlasMap.module.css'

export interface AtlasMapProps {
  mapId: string
}

export function AtlasMap({ mapId }: AtlasMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { error } = useMap({ mapId, containerRef })
  const loading = useMapStore((s) => s.loading)

  return (
    <div className={styles.wrapper}>
      <div ref={containerRef} className={styles.mapContainer} />

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
