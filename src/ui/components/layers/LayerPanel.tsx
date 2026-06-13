/**
 * 🧱 LAYER PANEL
 * ==============
 * Wrapper del LayerControl para el sidebar.
 * Obtiene la instancia del mapa desde MapContext
 * para pasársela a LayerControl.
 */

import { useMapContext } from "@map/context/MapContext";
import React from "react";
import { LayerControl } from "../layers/LayerControl";

export const LayerPanel: React.FC = () => {
  const { map } = useMapContext();

  return (
    <div style={{ padding: "8px 4px" }}>
      <LayerControl map={map} />
    </div>
  );
};

export default LayerPanel;
