/**
 * 🌍 ATLAS — Shell principal del visor
 * =====================================
 * Ensambla el layout completo:
 *   Sidebar (rail + panel) + AtlasMapBuilder (mapa)
 *
 * Patrón de conexión store → UI:
 *   - useMapStore.activeMapId  ──▶  AtlasMapBuilder.mapId
 *   - chaptersStore.goToChapter() ──▶ actualiza activeMapId en mapStore
 *   - uiStore.toggleSidebar() ──▶ abre/cierra Sidebar
 *
 * MapProvider vive aquí, envolviendo tanto el mapa como el sidebar,
 * para que LayerPanel pueda acceder a la instancia de MapLibre vía
 * useMapContext() sin prop drilling.
 */

import { MapProvider } from "@map/context/MapContext";
import { useMapStore } from "@state";
import React from "react";
import LayerMapSync from "./components/layers/LayerMapSync";
import AtlasMapBuilder from "./components/map/AtlasMapBuilder";
import Sidebar from "./components/sidebar/Sidebar";

const RAIL_WIDTH = 48; // px — ancho del rail de iconos del sidebar

export const Atlas: React.FC = () => {
  const activeMapId = useMapStore((s) => s.activeMapId);

  return (
    <MapProvider>
      <LayerMapSync />
      {/* Layout completo: ocupa viewport */}
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          overflow: "hidden",
          background: "#f8f9fa",
        }}
      >
        {/* Sidebar (rail + panel flotante) */}
        <Sidebar />

        {/* Área del mapa — ocupa el espacio restante dejando el rail */}
        <div
          style={{
            flex: 1,
            marginLeft: `${RAIL_WIDTH}px`,
            height: "100%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <AtlasMapBuilder
            key={activeMapId} /* remonta cuando cambia el mapa */
            mapId={activeMapId}
            enableControls={true}
            enableLegend={true}
            onMapBuild={(_map, config) => {
              console.log(`[Atlas] Mapa listo: ${config.name}`);
            }}
            onError={(err) => {
              console.error(`[Atlas] Error en mapa:`, err);
            }}
          />
        </div>
      </div>
    </MapProvider>
  );
};

export default Atlas;
