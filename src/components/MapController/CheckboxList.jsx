import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import mapLayers from "@data/mapLayers";

const CheckboxList = ({ map }) => {
  const [layersState, setLayersState] = useState(
    mapLayers.reduce((acc, layer) => {
      acc[layer.id] = true;
      return acc;
    }, {})
  );

  useEffect(() => {
    if (!map) return;

    const handleCheckboxChange = (layerId, checked) => {
      if (!map.getLayer(layerId)) {
        console.warn(`⚠️ La capa ${layerId} no existe en el mapa.`);
        return;
      }
      map.setLayoutProperty(layerId, "visibility", checked ? "visible" : "none");
      setLayersState((prev) => ({ ...prev, [layerId]: checked }));
    };

    document.getElementById("layer-Control").innerHTML = ""; // Limpiar antes de agregar checkboxes
    mapLayers.forEach((layer) => {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = layer.id;
      checkbox.checked = layersState[layer.id];
      checkbox.addEventListener("change", (e) => handleCheckboxChange(layer.id, e.target.checked));

      const label = document.createElement("label");
      label.htmlFor = layer.id;
      label.appendChild(checkbox);
      label.append(` ${layer.name}`);

      document.getElementById("layer-Control").appendChild(label);
      document.getElementById("layer-Control").appendChild(document.createElement("br"));
    });
  }, [map, layersState]);

  return <div id="layer-Control" className="checkbox-list"></div>;
};

CheckboxList.propTypes = {
  map: PropTypes.object,
};

export default CheckboxList;
