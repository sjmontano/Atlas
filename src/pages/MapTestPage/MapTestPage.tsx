import { MapProvider } from "@map/context/MapContext";
import AtlasMapBuilder from "@ui/components/map/AtlasMapBuilder";
import { useParams } from "react-router-dom";

/**
 * 🗺️ VISOR DE MAPAS ATLAS - PÁGINA DE PRUEBAS
 * ============================================
 *
 * Vista completa del mapa georreferenciado del Atlas.
 * Acepta cualquier mapId vía URL: /test-maps/:mapId
 * Fallback: intro
 */

function MapTestPage() {
  const { mapId } = useParams<{ mapId: string }>();
  const resolvedMapId = mapId ?? "intro";

  return (
    <MapProvider>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          margin: 0,
          padding: 0,
          overflow: "hidden",
        }}
      >
        <AtlasMapBuilder
          mapId={resolvedMapId}
          enableControls={true}
          enableLegend={true}
          onMapBuild={(_map, config) => {
            console.log(`🎉 Mapa construido exitosamente: ${config.name}`);
            console.log(`🎮 Controles personalizados habilitados`);
            console.log(`🗺️ Leyenda de capas habilitada`);
          }}
          onError={(error) => {
            console.error(`💥 Error en mapa:`, error);
          }}
        />
      </div>
    </MapProvider>
  );
}

export default MapTestPage;
