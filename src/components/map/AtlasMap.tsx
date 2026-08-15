import { useEffect, useRef, useMemo, useState } from 'react'
import type { RefObject } from 'react'
import { useMap } from '@hooks/useMap'
import { useAutoLowPower } from '@hooks/useAutoLowPower'
import { usePrefetchAdjacent } from '@hooks/usePrefetchAdjacent'
import { useTilePrefetch } from '@hooks/useTilePrefetch'
import { useMapStore } from '@stores/mapStore'
import { useUIStore } from '@stores/uiStore'
import { useConnectionStore } from '@stores/connectionStore'
import { useLayerStore } from '@stores/layerStore'
import { addBasemap, removeBasemap, setImageOpacity } from '@services/BasemapManager'
import { sync as syncLayers, removeAll as removeAllLayers } from '@services/LayerManager'
import { addPois, removePois } from '@services/PoiManager'
import { getMapContent } from '@content'
import type { MapController } from '@services/MapRenderer'
import type { Poi } from '../../types/poi.ts'
import { MapControls } from './MapControls'
import { LayerMenu } from './LayerMenu'
import { PoiModal } from './PoiModal'
import { CalibrationPanel } from '@components/calibration/CalibrationPanel.tsx'
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
  const mapBuilt = useMapStore((s) => s.mapBuilt)
  const tilesStatus = useMapStore((s) => s.tilesStatus)
  const isSlow = useConnectionStore((s) => s.isSlow)
  const initConnection = useConnectionStore((s) => s.init)

  const basemapVisible = useUIStore((s) => s.basemapVisible)
  const basemapStyle = useUIStore((s) => s.basemapStyle)
  const imageOpacity = useUIStore((s) => s.imageOpacity)
  const tilesVisible = useUIStore((s) => s.tilesVisible)

  const { visibleLayers, opacities } = useLayerStore()

  const content = useMemo(() => getMapContent(mapId), [mapId])
  const layers = content?.layers ?? null
  const groups = content?.groups ?? null
  const pois = content?.pois ?? null
  const hasLayers = layers !== null && layers.length > 0
  const [activePoi, setActivePoi] = useState<Poi | null>(null)
  const [rebuildKey, setRebuildKey] = useState(1)
  const [calibrationOpen, setCalibrationOpen] = useState(false)

  useAutoLowPower()
  usePrefetchAdjacent(mapId)
  useTilePrefetch(mapId)

  useEffect(() => {
    initConnection()
  }, [initConnection])

  useEffect(() => {
    useLayerStore.getState().resetAll(mapId)
    const map = mapRef.current
    return () => {
      if (map) {
        removeAllLayers(map)
        removePois(map)
      }
    }
  }, [mapId, mapRef])

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

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    try {
      if (map.getLayer('atlas-tiles-layer')) {
        map.setLayoutProperty('atlas-tiles-layer', 'visibility', tilesVisible ? 'visible' : 'none')
      }
    } catch { /* noop */ }
  }, [tilesVisible, mapRef])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapBuilt || !layers) return
    syncLayers(map, mapId, layers, groups, { visibleLayers, opacities })
  }, [mapRef, mapId, layers, groups, visibleLayers, opacities, mapBuilt])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapBuilt || !pois) return
    addPois(map, mapId, pois, setActivePoi)
  }, [mapRef, mapId, pois, mapBuilt])

  return (
    <div className={styles.wrapper} key={`${mapId}-${rebuildKey}`}>
      <div ref={containerRef} className={styles.mapContainer} />
      <OfflineBanner />

      {!loading && tilesStatus === 'degraded' && isSlow && (
        <div className={styles.degradedBanner}>
          <span>Modo básico: el mapa es navegable sin alta resolución por conexión lenta.</span>
        </div>
      )}

      {ENABLE_DEV_TOOLS && !loading && !error && (
        <MapControls />
      )}

      {!loading && !error && hasLayers && <LayerMenu mapId={mapId} onCalibrate={() => setCalibrationOpen(true)} />}

      {ENABLE_DEV_TOOLS && calibrationOpen && controllerRef && (
        <CalibrationPanel
          key={mapId}
          mapId={mapId}
          controllerRef={controllerRef}
          onRebuild={() => setRebuildKey((k) => k + 1)}
          onClose={() => setCalibrationOpen(false)}
        />
      )}

      {activePoi && (
        <PoiModal poi={activePoi} onClose={() => setActivePoi(null)} />
      )}

      {(loading || tilesStatus === 'loading') && (
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
