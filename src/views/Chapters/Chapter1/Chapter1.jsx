import React from "react";
import SidebarMain from "../../../components/Sidebars/SidebarMain/SidebarMain";
import SidebarLeft from "../../../components/Sidebars/SidebarLeft/SidebarLeft";
import SidebarBottom from "../../../components/Sidebars/SidebarBottom/SidebarBottom";
import Header from "../../../components/Header/Header";
import Map from "./Maps";

const Chapter1 = () => {
  return (
    <div id="cap1">
      <Header />
      <SidebarLeft />
      <SidebarMain />
      <SidebarBottom />
      
      {/* Puedes renderizar diferentes mapas según la ruta */}
      <Map />
    </div>
  );
};

export default Chapter1;
