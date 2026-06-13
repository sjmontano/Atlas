/**
 * 🗺️ MAP CONTEXT — Referencia mutable a la instancia MapLibre
 * ============================================================
 * REGLA: La instancia de MapLibre NO va en Zustand porque no es
 * serializable. Va aquí como ref, disponible para cualquier hook
 * que necesite actuar sobre el mapa sin prop drilling.
 *
 * Patrón:
 *  - useMapStore (Zustand): flags reactivos (mapBuilt, activeMapId)
 *  - MapContext (React Context): referencia al objeto maplibregl.Map
 *
 * Solo AtlasMapBuilder registra la instancia via registerMap().
 * Hooks como useMapLayers, useSpatialConstraints usan useMapContext().
 */

import maplibregl from "maplibre-gl";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface MapContextValue {
  /** Instancia de MapLibre GL JS. null hasta que AtlasMapBuilder la registra. */
  map: maplibregl.Map | null;
  /** true cuando la instancia está registrada y el mapa está listo */
  isReady: boolean;
  /** Solo AtlasMapBuilder debe llamar esto */
  registerMap: (map: maplibregl.Map) => void;
  /** Llamado en cleanup de AtlasMapBuilder */
  unregisterMap: () => void;
}

const MapContext = createContext<MapContextValue>({
  map: null,
  isReady: false,
  registerMap: () => { },
  unregisterMap: () => { },
});

export function MapProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [isReady, setIsReady] = useState(false);

  const registerMap = useCallback((mapInstance: maplibregl.Map) => {
    setMap(mapInstance);
    setIsReady(true);
  }, []);

  const unregisterMap = useCallback(() => {
    setMap(null);
    setIsReady(false);
  }, []);

  return (
    <MapContext.Provider
      value={{ map, isReady, registerMap, unregisterMap }}
    >
      {children}
    </MapContext.Provider>
  );
}

/**
 * Hook para acceder a la instancia de MapLibre desde cualquier componente.
 * Usar en hooks de dominio (useMapLayers) o controles de UI avanzados.
 *
 * @example
 * const { map, isReady } = useMapContext();
 * if (isReady && map) map.flyTo({ center: [...] });
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useMapContext(): MapContextValue {
  return useContext(MapContext);
}
