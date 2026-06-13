/**
 * Ejemplo de uso de los hooks de capas geográficas
 * Muestra cómo integrar con MapLibre sin backend
 */

import { getMapLayerProfile } from "@layers/config/mapLayerProfiles";
import { useGeoLayers } from "@layers/hooks";
import { useLayersStore } from "@state";
import { useMapStore } from "@state/mapStore";
import type { Map as MapLibreMap } from "maplibre-gl";

interface LayerControlProps {
  map?: MapLibreMap | null;
}

export const LayerControl = ({ map }: LayerControlProps) => {
  const activeMapId = useMapStore((s) => s.activeMapId);

  // ─── Store global de capas ─────────────────────────────────────────
  const {
    visibleLayers: visibleLayersSet,
    activeCategories,
    opacities,
    toggleLayer,
  } = useLayersStore();
  const isVisible = (layerId: string) => visibleLayersSet.has(layerId);

  // Hook para capas geográficas (sin backend!)
  const {
    getLayersByCategory,
    loading: layersLoading,
    searchLayers,
    searchTerm,
  } = useGeoLayers();

  // Se mantiene para evitar warning de prop no usada;
  // la sincronización mapa-capas ahora vive en LayerMapSync.
  void map;
  void opacities;

  const categories = Array.from(activeCategories);
  const mapProfile = getMapLayerProfile(activeMapId);
  const associatedLayerIds = new Set(mapProfile?.associatedLayerIds ?? []);
  const categoryLabels: Record<string, string> = {
    rivers: "Rios",
    boundaries: "Limites",
    nodes: "Nodos Territoriales",
    ecosystems: "Ecosistemas",
    conflicts: "Conflictos",
  };

  const layersByCategory = categories
    .map((category) => ({
      category,
      layers: getLayersByCategory(category).filter((layer) =>
        associatedLayerIds.has(layer.id),
      ),
    }))
    .filter((entry) => entry.layers.length > 0);

  const handleToggle = (layerId: string) => toggleLayer(layerId);

  if (layersLoading) {
    return <div className="layer-control loading">Cargando capas...</div>;
  }

  return (
    <div className="layer-control">
      <h3>Control de Capas</h3>

      {/* Búsqueda */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Buscar capas..."
          value={searchTerm}
          onChange={(e) => searchLayers(e.target.value)}
        />
      </div>

      {layersByCategory.map(({ category, layers }) => (
        <div key={category} className="layer-category">
          <h4>
            {categoryLabels[category] ?? category} ({layers.length})
          </h4>
          {layers.map((layer) => (
            <label key={layer.id} className="layer-item">
              <input
                type="checkbox"
                checked={isVisible(layer.id)}
                onChange={() => handleToggle(layer.id)}
              />
              <span>{layer.name}</span>
              <span className="status">
                {isVisible(layer.id) ? "✓" : "○"}
              </span>
            </label>
          ))}
        </div>
      ))}

      {/* Estado */}
      <div className="layer-stats">
        <p>Capas activas: {visibleLayersSet.size}</p>
        <p>
          Backend: <span className="offline">DESCONECTADO</span>
        </p>
        <p>
          Modo: <span className="static">ESTÁTICO</span>
        </p>
      </div>
    </div>
  );
};

export default LayerControl;
