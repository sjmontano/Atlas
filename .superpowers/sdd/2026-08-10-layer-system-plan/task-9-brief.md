### Task 9: AtlasMap integration + Copy composites

**Files:**
- Modify: `src/components/map/AtlasMap.tsx`
- Create directories + copy files

**Interfaces:**
- Consumes: All tasks above (LayerManager, PoiManager, LayerMenu, PoiModal, layerStore, data)
- Produces: Fully integrated AtlasMap with layers, POIs, and menu

- [ ] **Step 1: Read current AtlasMap.tsx** (for context)

```bash
# No command needed — reference the design spec
```

- [ ] **Step 2: Rewrite AtlasMap.tsx**

```tsx
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
import { getMapLayers, getLayerGroups } from '@data/layers'
import { getPois } from '@data/pois'
import type { MapController } from '@services/MapRenderer'
import type { Poi } from '@types/poi'
import { MapControls } from './MapControls'
import { LayerMenu } from './LayerMenu'
import { PoiModal } from './PoiModal'
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
  const isSlow = useConnectionStore((s) => s.isSlow)
  const initConnection = useConnectionStore((s) => s.init)

  const basemapVisible = useUIStore((s) => s.basemapVisible)
  const basemapStyle = useUIStore((s) => s.basemapStyle)
  const imageOpacity = useUIStore((s) => s.imageOpacity)

  const visibleLayers = useLayerStore((s) => s.visibleLayers)
  const opacities = useLayerStore((s) => s.opacities)

  const layers = useMemo(() => getMapLayers(mapId), [mapId])
  const groups = useMemo(() => getLayerGroups(mapId), [mapId])
  const pois = useMemo(() => getPois(mapId), [mapId])
  const hasLayers = layers !== null && layers.length > 0
  const [activePoi, setActivePoi] = useState<Poi | null>(null)

  useAutoLowPower()
  usePrefetchAdjacent(mapId)
  useTilePrefetch(mapId)

  useEffect(() => {
    initConnection()
  }, [initConnection])

  useEffect(() => {
    useLayerStore.getState().resetAll(mapId)
    return () => {
      const map = mapRef.current
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
    if (!map || !layers) return
    syncLayers(map, mapId, layers, groups, { visibleLayers, opacities })
  }, [mapRef, mapId, layers, groups, visibleLayers, opacities])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !pois) return
    addPois(map, mapId, pois, setActivePoi)
  }, [mapRef, mapId, pois])

  return (
    <div className={styles.wrapper}>
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

      {!loading && !error && hasLayers && <LayerMenu mapId={mapId} onCalibrate={() => {}} />}

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
```

- [ ] **Step 3: Copy composite images**

```bash
New-Item -ItemType Directory -Force -Path "D:\Proyectos\Atlas\atlas-pluriversal\atlas\public\assets\maps\capas\ecosistemas"
Copy-Item "D:\Proyectos\Atlas\atlas-pluriversal\tiles\ecosistemas\_composites\*.webp" -Destination "D:\Proyectos\Atlas\atlas-pluriversal\atlas\public\assets\maps\capas\ecosistemas\"
```

- [ ] **Step 4: Commit**

```bash
git add src/components/map/AtlasMap.tsx public/assets/maps/capas/ecosistemas/
git commit -m "feat: integrate layers, POIs, and menu into AtlasMap; copy composite images"
```

---


