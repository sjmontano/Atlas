import { useMemo } from "react";
import mapDefaults from "../data/mapImages/mapDefaults";

const useMapProps = (selectedMap, maps) => {
  return useMemo(() => {
    if (!maps[selectedMap]) return null;

    return {
      ...mapDefaults,
      ...maps[selectedMap],
      mapName: maps[selectedMap].name, // 🆕 Agregar nombre del mapa para configuración de bounds
      imageUrls: maps[selectedMap].images || [], // Asegurar que imageUrls esté definida
      imageBounds: maps[selectedMap].imageBounds || [], // Asegurar que imageBounds esté definida
      regionZoomLimits: maps[selectedMap].regionZoomLimits || { min: 0, max: 20 }, // Asegurar que regionZoomLimits esté definida
      shadow: maps[selectedMap].shadow ?? mapDefaults.shadow, // Asegurar que shadow esté definida
    };
  }, [selectedMap, maps]);
};

export default useMapProps;