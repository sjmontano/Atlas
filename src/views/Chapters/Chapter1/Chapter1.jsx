import React, { useState, useEffect } from "react";
import SidebarMain from "../../../components/Sidebars/SidebarMain/SidebarMain";
import SidebarLeft from "../../../components/Sidebars/SidebarLeft/SidebarLeft";
import SidebarBottom from "../../../components/Sidebars/SidebarBottom/SidebarBottom";
import Header from "../../../components/Header/Header";
import MapComponent from "../../../components/MapController/MapComponent";
import { useShadow } from "../../../context/ShadowContext";
import { getChapterMaps } from "../../../utils/geoUtils"; // 🔥 IMPORTACIÓN AHORA FUNCIONA
import "./Chapter1.css";

const Chapter1 = () => {
  const [selectedMap, setSelectedMap] = useState(0);
  const { updateShadow } = useShadow();
  const [maps, setMaps] = useState([]); // Estado para almacenar los mapas generados

  useEffect(() => {
    const loadMaps = async () => {
      const generatedMaps = await getChapterMaps([
        { name: "intro" }, 
        { name: "encuadres" }, 
        { name: "otro" }, 
      ]);
      setMaps(generatedMaps);
    };

    loadMaps();
  }, []);

  useEffect(() => {
    if (maps.length > 0) {
      updateShadow(maps[selectedMap]?.shadow || false); // Aplica sombra solo si está activada
    }
  }, [selectedMap, maps]);

  const handleMapChange = (index) => {
    setSelectedMap(index);
  };

  return (
    <div id="cap1">
      <Header />
      <SidebarLeft />
      <SidebarBottom onMapChange={handleMapChange} />
      {maps.length > 0 && (
        <MapComponent
          imageBounds={maps[selectedMap].imageBounds}
          regionZoomLimits={maps[selectedMap].regionZoomLimits}
          imageUrls={maps[selectedMap].images}
        />
      )}
    </div>
  );
};

export default Chapter1;
