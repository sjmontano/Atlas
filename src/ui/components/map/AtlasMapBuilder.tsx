/**
 * 🏗️ ATLAS MAP BUILDER
 * ====================
 *
 * Componente UI que delega la inicialización completa del mapa a `useAtlasMap`.
 * Se enfoca en la orquestación de estado (store/context) y renderizado.
 */

import type { MapConfig } from "@map/config/mapConfig";
import { getMapConfig } from "@map/config/mapConfig";
import { useMapContext } from "@map/context/MapContext";
import { useAtlasMap } from "@map/hooks/useAtlasMap";
import { useMapStore } from "@state";
import type maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { useEffect, useRef, useState } from "react";
import MapControls from "./MapControls.tsx";
import { MapError } from "./MapError.tsx";
import MapLegend from "./MapLegend.tsx";
import { MapLoadingShell } from "./MapLoadingShell.tsx";

interface AtlasMapBuilderProps {
  /** ID del mapa a construir */
  mapId?: string;
  /** Clases CSS adicionales */
  className?: string;
  /** Estilos inline */
  style?: React.CSSProperties;
  /** Callback cuando el mapa se construye exitosamente */
  onMapBuild?: (map: maplibregl.Map, config: MapConfig) => void;
  /** Callback cuando hay error */
  onError?: (error: string) => void;
  /** Habilitar controles de mapa personalizados */
  enableControls?: boolean;
  /** Habilitar leyenda de capas */
  enableLegend?: boolean;
}

const AtlasMapBuilder: React.FC<AtlasMapBuilderProps> = ({
  mapId = "intro",
  className,
  style,
  onMapBuild,
  onError,
  enableControls = false,
  enableLegend = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Controla si el shell de carga sigue montado (se desmonta tras el fade-out)
  const [showShell, setShowShell] = useState(true);

  // ─── Contexto + Store ────────────────────────────────────────────────────
  const { registerMap, unregisterMap } = useMapContext();
  const {
    setMapBuilt: storeSetMapBuilt,
    setLoading,
    setError: storeSetError,
  } = useMapStore();

  // ─── Inicialización delegada a useAtlasMap ───────────────────────────────
  const {
    map,
    mapBuilt,
    lowResReady,
    error,
    initialView,
    loading,
    layerManager,
  } = useAtlasMap({
    mapId,
    containerRef,
    enableLegend,
    onMapBuild: (m, config) => {
      registerMap(m);
      storeSetMapBuilt(true);
      setLoading(false);
      onMapBuild?.(m, config);
    },
    onError: (err) => {
      storeSetError(err);
      setLoading(false);
      onError?.(err);
    },
  });

  // Sincronizar loading con el store
  useEffect(() => {
    setLoading(loading);
  }, [loading, setLoading]);

  // Limpiar store y contexto al desmontar
  useEffect(() => {
    return () => {
      unregisterMap();
      storeSetMapBuilt(false);
    };
  }, [unregisterMap, storeSetMapBuilt]);

  // ─── Estado de error ─────────────────────────────────────────────────────
  if (error) {
    return (
      <MapError
        error={error}
        mapId={mapId}
        className={className}
        style={style}
      />
    );
  }

  // ─── Renderizado ─────────────────────────────────────────────────────────
  const currentConfig = getMapConfig(mapId);

  return (
    <div
      className={className}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        ...style,
      }}
    >
      {/* Contenedor del mapa MapLibre */}
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      {/* Shell de carga con fade-out al terminar la inicialización */}
      {showShell && (
        <MapLoadingShell
          mapName={currentConfig?.name}
          lowResReady={lowResReady}
          visible={!mapBuilt}
          onFadeComplete={() => setShowShell(false)}
        />
      )}

      {/* Controles de mapa */}
      {enableControls && mapBuilt && map && initialView && (
        <MapControls
          map={map}
          position="top-right"
          showZoom={true}
          showReset={true}
          showRotation={false}
          initialView={initialView}
          theme="atlas"
        />
      )}

      {/* Leyenda de capas */}
      {enableLegend && mapBuilt && layerManager && (
        <MapLegend
          layerManager={layerManager}
          position="bottom-left"
          title="Capas del mapa"
          collapsible={true}
          defaultCollapsed={false}
          showOpacityControl={true}
          theme="atlas"
        />
      )}
    </div>
  );
};

export default AtlasMapBuilder;
