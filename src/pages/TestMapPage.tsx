import { useParams, Link } from 'react-router-dom'
import { useRef, useState } from 'react'
import { getAllMaps } from '@data/chapters/chapters.js'
import { AtlasMap } from '@components/map/AtlasMap.tsx'
import { CalibrationPanel } from '@components/calibration/CalibrationPanel.tsx'
import type { MapController } from '@services/MapRenderer'
import styles from './TestMapPage.module.css'

const ENABLE_DEV_TOOLS = import.meta.env.VITE_DEV_TOOLS === 'true'

export function TestMapPage() {
  const { mapId } = useParams<{ mapId: string }>()
  const allMaps = getAllMaps()
  const currentIndex = allMaps.findIndex((m) => m.mapId === mapId)
  const currentMap = allMaps[currentIndex]
  const prevMap = currentIndex > 0 ? allMaps[currentIndex - 1] : null
  const nextMap = currentIndex < allMaps.length - 1 ? allMaps[currentIndex + 1] : null

  const controllerRef = useRef<MapController | null>(null)
  const [rebuildKey, setRebuildKey] = useState(0)

  if (!currentMap) {
    return (
      <div className={styles.container}>
        <h1>Mapa no encontrado: {mapId}</h1>
        <Link to="/dev" className={styles.backLink}>← Volver al menú</Link>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/dev" className={styles.backLink}>← Dev Menu</Link>
        <div className={styles.info}>
          <span className={styles.id}>{currentMap.mapId}</span>
          <h1 className={styles.title}>{currentMap.title}</h1>
        </div>
      </header>

      <div className={styles.mapArea}>
        <AtlasMap key={`${currentMap.mapId}-${rebuildKey}`} mapId={currentMap.mapId} controllerRef={controllerRef} />

        {ENABLE_DEV_TOOLS && (
          <CalibrationPanel
            key={currentMap.mapId}
            mapId={currentMap.mapId}
            controllerRef={controllerRef}
            onRebuild={() => setRebuildKey((k) => k + 1)}
          />
        )}
      </div>

      <nav className={styles.pagination}>
        {prevMap ? (
          <Link to={`/test/${prevMap.mapId}`} className={styles.navBtn}>
            ← {prevMap.title}
          </Link>
        ) : (
          <span />
        )}
        <span className={styles.counter}>
          {currentIndex + 1} / {allMaps.length}
        </span>
        {nextMap ? (
          <Link to={`/test/${nextMap.mapId}`} className={styles.navBtn}>
            {nextMap.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  )
}
