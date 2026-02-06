import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import "../../styles/layerControl.css";
import EyeIcon from "./EyeIcon";

import lineaCapas from "../../../public/assets/img/background/indice-capas-menu.svg";
import iconoCapas1 from "../../../public/assets/svg/todos/Hud/icons/icon-line-webp/iconoCapas1.webp";
import fondoSidebarLeftItem from "../../../public/assets/img/background/sidebardLeftItem.webp";

const LayerMenu = ({ layers, map, selectedMap, mapName }) => {
  console.log(mapName);
  const [layerVisibility, setLayerVisibility] = useState(
    layers.reduce((acc, layer) => {
      acc[layer.id] = true;
      return acc;
    }, {}),
  );

  const toggleLayerVisibility = (layerId) => {
    const newVisibility = !layerVisibility[layerId];
    setLayerVisibility((prev) => ({
      ...prev,
      [layerId]: newVisibility,
    }));

    if (map && map.getLayer(layerId)) {
      map.setLayoutProperty(
        layerId,
        "visibility",
        newVisibility ? "none" : "visible",
      );
    }
  };

  const toggleLayerGroupVisibility = (layersId, visible) => {
    layersId.forEach((item) => {
      if (map && map.getLayer(item)) {
        const itemVisibility = map.getLayoutProperty(item, "visibility");
        map.setLayoutProperty(item, "visibility", visible ? visible : "none");
      }
    });
  };

  const getLayerVisibility = (layersId) => {
    var itemVisibility = "none";

    if (map && map.getLayer(layersId)) {
      itemVisibility = map.getLayoutProperty(layersId, "visibility");
    }

    if (itemVisibility == "visible") {
      return false;
    } else {
      return true;
    }
  };

  // Estados para mostrar el menú con hover en JSX
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const icono = document.querySelector(".layer-menu-wrapper");
    const menu = document.querySelector(".layer-control-container");
    if (isHovered || isOpen) {
      menu.style.display = "block";
      icono.style.width = "26vw";
      icono.style.left = "74vw";
    } else {
      menu.style.display = "none";
      icono.style.width = "6vw";
      icono.style.left = "94vw";
    }
  }, [isHovered, isOpen]);

  const [isMenuOpen, setIsMenuOpen] = useState({
    uno: false,
    unoUno: false,
    unoDos: false,
    unoTres: false,
    unoCuatro: false,
    dos: false,
    dosUno: false,
    dosDos: false,
    dosTres: false,
    tres: false,
  });
  const [isMenuActive, setIsMenuActive] = useState({
    uno: false,
    unoUno: false,
    unoDos: false,
    unoTres: false,
    unoCuatro: false,
    dos: false,
    dosUno: false,
    dosDos: false,
    dosTres: false,
    tres: false,
  });

  const capasAgrupadas = {
    uno: [
      "sedimentosSubmarinos-layer",
      "manglar-layer",
      "llanuraMareal-layer",
      "playas-layer",
      "zonaPantanosa-layer",
      "rocasExpuestas-layer",
      "humedales-layer",
      "arbustal-layer",
      "herbazalPastos-layer",
      "xerofitico-layer",
      "subxerofitico-layer",
      "inundables-layer",
      "secosTropicales-layer",
      "humedosTropicales-layer",
      "subandinos-layer",
      "bosqueNiebla-layer",
      "altoAndinos-layer",
      "pantanoParamo-layer",
      "Paramo-layer",
      "laguna-layer",
      "glaciaresNivales-layer",
    ],
    unoUno: [
      "sedimentosSubmarinos-layer",
      "manglar-layer",
      "llanuraMareal-layer",
      "playas-layer",
      "zonaPantanosa-layer",
    ],
    unoDos: [
      "rocasExpuestas-layer",
      "humedales-layer",
      "arbustal-layer",
      "herbazalPastos-layer",
    ],
    unoTres: [
      "xerofitico-layer",
      "subxerofitico-layer",
      "inundables-layer",
      "secosTropicales-layer",
      "humedosTropicales-layer",
      "subandinos-layer",
      "bosqueNiebla-layer",
      "altoAndinos-layer",
    ],
    unoCuatro: [
      "pantanoParamo-layer",
      "Paramo-layer",
      "laguna-layer",
      "glaciaresNivales-layer",
    ],
    dos: [
      "bosqueFragmentado-layer",
      "regeneracionVegetal-layer",
      "agriculturaMixta-layer",
      "areasInundacion-layer",
      "monocultivos-layer",
      "ganaderia-layer",
      "zonaUrbanaIndustrial-layer",
      "aguaSuperficial-layer",
    ],
    dosUno: ["bosqueFragmentado-layer", "regeneracionVegetal-layer"],
    dosDos: [
      "agriculturaMixta-layer",
      "areasInundacion-layer",
      "monocultivos-layer",
      "ganaderia-layer",
    ],
    dosTres: ["zonaUrbanaIndustrial-layer", "aguaSuperficial-layer"],
    tres: [],
  };

  return (
    <>
      <div className="lineaCapas">
        <img src={lineaCapas} alt="" style={{ width: "100%" }} />
      </div>
      <div className="layer-menu-wrapper">
        {/*<img className="menuAgregadosImage" src={menuAgregados} alt="" />*/}

        <div className="layer-menu-toggle" onClick={() => setIsOpen((v) => !v)}>
          <img src={iconoCapas1} alt="" className="icon-img" />
          <div className="layer-contenedor-menu">
            <img
              src={fondoSidebarLeftItem}
              alt=""
              className="layer-menu-fondo"
            />
          </div>
          <span className="layer-menu-label"> Menú de capas</span>
        </div>

        <div className="layer-control-container fade-in">
          <div id="layer-Control">
            <img src="/assets/img/background/menuCapasFinal.webp" alt="" />

            {mapName === "tejidosDelAgua" && (
              <div
                className="scroll-container"
                style={{
                  paddingTop: "7vh",
                  paddingBottom: "7vh",
                  paddingLeft: "40px",
                  paddingRight: "0",
                  height: "86vh",
                  overflow: "scroll",
                }}
              >
                <div className="margen"></div>

                <div className="subtitle">
                  <span>
                    Datos para la interacción <br />
                    con las capas
                  </span>
                </div>

                <div style={{ padding: "0px 40px" }}>
                  <div className="layer-item">
                    <svg
                      width="33"
                      height="16"
                      viewBox="0 0 33 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M33 15.14H0V0H33V15.14ZM2 13.14H31V2H2V13.14Z"
                        fill="#E7352A"
                      />
                      <path
                        d="M12.4702 10.21C13.3317 10.21 14.0302 9.51159 14.0302 8.65002C14.0302 7.78846 13.3317 7.09003 12.4702 7.09003C11.6086 7.09003 10.9102 7.78846 10.9102 8.65002C10.9102 9.51159 11.6086 10.21 12.4702 10.21Z"
                        fill="#E7352A"
                      />
                      <path
                        d="M4.97015 10.21C5.83172 10.21 6.53021 9.51159 6.53021 8.65002C6.53021 7.78846 5.83172 7.09003 4.97015 7.09003C4.10859 7.09003 3.41016 7.78846 3.41016 8.65002C3.41016 9.51159 4.10859 10.21 4.97015 10.21Z"
                        fill="#E7352A"
                      />
                      <path
                        d="M27.5298 10.21C28.3913 10.21 29.0898 9.51159 29.0898 8.65002C29.0898 7.78846 28.3913 7.09003 27.5298 7.09003C26.6682 7.09003 25.9697 7.78846 25.9697 8.65002C25.9697 9.51159 26.6682 10.21 27.5298 10.21Z"
                        fill="#E7352A"
                      />
                      <path
                        d="M20.0298 10.21C20.8913 10.21 21.5898 9.51159 21.5898 8.65002C21.5898 7.78846 20.8913 7.09003 20.0298 7.09003C19.1682 7.09003 18.4697 7.78846 18.4697 8.65002C18.4697 9.51159 19.1682 10.21 20.0298 10.21Z"
                        fill="#E7352A"
                      />
                    </svg>

                    <span>Zona urbana</span>
                  </div>

                  <div className="layer-item">
                    <svg
                      width="29"
                      height="2"
                      viewBox="0 0 29 2"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line
                        y1="1"
                        x2="29"
                        y2="1"
                        stroke="#3A90C8"
                        stroke-width="2"
                      />
                    </svg>

                    <span>Ríos principales</span>
                  </div>

                  <div className="layer-item">
                    <svg
                      width="29"
                      height="2"
                      viewBox="0 0 29 2"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line
                        y1="1"
                        x2="29"
                        y2="1"
                        stroke="#4E96BC"
                        stroke-width="2"
                      />
                    </svg>

                    <span>Ríos tributarios</span>
                  </div>
                </div>

                <div className="subtitle">
                  <span>El agua de arriba a abajo</span>
                </div>

                <div className="layer-item">
                  <EyeIcon
                    isHidden={layerVisibility["nubosidad-layer"]}
                    onClick={() => toggleLayerVisibility("nubosidad-layer")}
                  />
                  <svg
                    width="31"
                    height="15"
                    viewBox="0 0 31 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="31" height="15" fill="#B1B2AE" />
                  </svg>
                  <span>
                    {" "}
                    <strong>Nubosidad:</strong> <br />
                    Entre 7000 - 2000 msnm{" "}
                  </span>
                </div>

                <div className="layer-item">
                  <div className="espacio"></div>
                  <svg
                    width="31"
                    height="15"
                    viewBox="0 0 31 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="31" height="15" fill="#CCEFD5" />
                  </svg>
                  <span>
                    {" "}
                    <strong>Glaciares y nivales:</strong> <br />
                    Entre 5364 - 4800 msnm{" "}
                  </span>
                </div>

                <div className="layer-item">
                  <div className="espacio"></div>
                  <svg
                    width="33"
                    height="15"
                    viewBox="0 0 33 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2.96942 0H0.149414V2H2.96942V0Z" fill="#F59E19" />
                    <path d="M2 3.95001H0V6.77002H2V3.95001Z" fill="#F59E19" />
                    <path d="M2 7.96002H0V10.78H2V7.96002Z" fill="#F59E19" />
                    <path
                      d="M32.0195 1.95001H30.0195V4.77002H32.0195V1.95001Z"
                      fill="#F59E19"
                    />
                    <path
                      d="M32.0195 6.77997H30.0195V9.59998H32.0195V6.77997Z"
                      fill="#F59E19"
                    />
                    <path
                      d="M32.0195 11.08H30.0195V13.9H32.0195V11.08Z"
                      fill="#F59E19"
                    />
                    <path d="M8.03967 0H5.21973V2H8.03967V0Z" fill="#F59E19" />
                    <path d="M11.8796 0H9.05957V2H11.8796V0Z" fill="#F59E19" />
                    <path d="M16.9196 0H14.0996V2H16.9196V0Z" fill="#F59E19" />
                    <path d="M20.9694 0H18.1494V2H20.9694V0Z" fill="#F59E19" />
                    <path d="M25.9196 0H23.0996V2H25.9196V0Z" fill="#F59E19" />
                    <path d="M29.9694 0H27.1494V2H29.9694V0Z" fill="#F59E19" />
                    <path
                      d="M2.96942 12.9H0.149414V14.9H2.96942V12.9Z"
                      fill="#F59E19"
                    />
                    <path
                      d="M6.82001 12.9H4V14.9H6.82001V12.9Z"
                      fill="#F59E19"
                    />
                    <path
                      d="M10.86 12.9H8.04004V14.9H10.86V12.9Z"
                      fill="#F59E19"
                    />
                    <path
                      d="M15.8796 12.9H13.0596V14.9H15.8796V12.9Z"
                      fill="#F59E19"
                    />
                    <path
                      d="M19.9304 12.9H17.1104V14.9H19.9304V12.9Z"
                      fill="#F59E19"
                    />
                    <path
                      d="M24.8796 12.9H22.0596V14.9H24.8796V12.9Z"
                      fill="#F59E19"
                    />
                    <path
                      d="M28.9801 12.9H26.1602V14.9H28.9801V12.9Z"
                      fill="#F59E19"
                    />
                  </svg>

                  <span>
                    {" "}
                    <strong>
                      Zonas hidrográficas
                      <br /> del sur del valle alto <br />
                      del río Cauca:
                    </strong>{" "}
                    <br />
                    Entre 5364 - 900 msnm
                  </span>
                </div>

                <div className="layer-item">
                  <div className="espacio"></div>
                  <svg
                    width="31"
                    height="15"
                    viewBox="0 0 31 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="31" height="15" fill="#87B2A3" />
                  </svg>
                  <span>
                    {" "}
                    <strong>Páramos:</strong>
                    <br />
                    Entre 4500 - 2700 msnm
                  </span>
                </div>

                <div className="layer-item">
                  <div className="espacio"></div>
                  <svg
                    width="31"
                    height="15"
                    viewBox="0 0 31 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="31" height="15" fill="#538C55" />
                  </svg>
                  <span>
                    {" "}
                    <strong>Bosque alto andino:</strong> <br />
                    Entre 4000 - 3000 msnm{" "}
                  </span>
                </div>

                <div className="layer-item">
                  <div className="espacio"></div>
                  <svg
                    width="31"
                    height="15"
                    viewBox="0 0 31 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="31" height="15" fill="#4AAB6A" />
                  </svg>
                  <span>
                    {" "}
                    <strong>Bosque de niebla:</strong> <br />
                    Entre 3500 - 1500 msnm{" "}
                  </span>
                </div>

                <div className="layer-item">
                  <div className="espacio"></div>
                  <svg
                    width="31"
                    height="15"
                    viewBox="0 0 31 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="31" height="15" fill="#76C23D" />
                  </svg>
                  <span>
                    {" "}
                    <strong>Bosque subandino:</strong>
                    <br />
                    Entre 2500 - 1000 msnm
                  </span>
                </div>

                <div className="layer-item">
                  <EyeIcon
                    isHidden={layerVisibility["acuifero2-layer"]}
                    onClick={() => toggleLayerVisibility("acuifero2-layer")}
                  />
                  <svg
                    width="31"
                    height="15"
                    viewBox="0 0 31 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="31" height="15" fill="#829D9D" />
                  </svg>
                  <span>
                    {" "}
                    <strong>Acuífero del Cauca.</strong>
                    <br /> <strong>Libre a confinado:</strong>
                    <br />
                    Entre 2000 - 1700 msnm. <br />
                    Profundidad promedio: <br />
                    100 a 400 M bajo la <br />
                    superficie
                  </span>
                </div>

                <div className="layer-item">
                  <EyeIcon
                    isHidden={layerVisibility["acuifero1-layer"]}
                    onClick={() => toggleLayerVisibility("acuifero1-layer")}
                  />
                  <svg
                    width="43"
                    height="27"
                    viewBox="0 0 43 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="37"
                      height="21"
                      fill="#7CB3B3"
                      stroke="#5A8FB3"
                      stroke-width="6"
                      stroke-linejoin="round"
                    />
                  </svg>

                  <span>
                    <strong>
                      Acuífero del Valle <br />
                      del Cauca. Libre <br />a semiconfinado:
                    </strong>
                    <br />
                    Entre 1100 - 900 msnm <br /> Profundidad promedio: <br />
                    400 a 1000 M bajo la superficie.
                  </span>
                </div>

                <div className="subtitle-2">
                  <span>
                    Flujos y zonas del Acuífero <br />
                    del Valle del Cauca
                  </span>
                </div>

                <div className="layer-item">
                  <EyeIcon
                    isHidden={layerVisibility["zonaDescarga-layer"]}
                    onClick={() => toggleLayerVisibility("zonaDescarga-layer")}
                  />
                  <svg
                    width="33"
                    height="16"
                    viewBox="0 0 33 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M32.4399 15.2933H0V0H32.4399V15.2933ZM1.97331 13.2667H30.4666V2.02665H1.97331V13.2667Z"
                      fill="#6697B2"
                    />
                    <path
                      d="M6.9069 7.44012H2.93359V10.1201H6.9069V7.44012Z"
                      fill="#6697B2"
                    />
                    <path
                      d="M13.6009 7.44012H10.9209V10.1201H13.6009V7.44012Z"
                      fill="#6697B2"
                    />
                    <path
                      d="M21.6012 7.44012H17.6812V10.1201H21.6012V7.44012Z"
                      fill="#6697B2"
                    />
                    <path
                      d="M28.3206 7.44012H25.6406V10.1201H28.3206V7.44012Z"
                      fill="#6697B2"
                    />
                  </svg>

                  <span>Descarga</span>
                </div>

                <div className="layer-item">
                  <EyeIcon
                    isHidden={layerVisibility["zonaEquilibrio-layer"]}
                    onClick={() =>
                      toggleLayerVisibility("zonaEquilibrio-layer")
                    }
                  />
                  <svg
                    width="33"
                    height="16"
                    viewBox="0 0 33 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M32.4399 15.2934H0V0H32.4399V15.2934ZM1.97331 13.28H30.4666V2.04004H1.97331V13.28Z"
                      fill="#3DF4E8"
                    />
                    <path
                      d="M6.9069 7.44006H2.93359V10.1201H6.9069V7.44006Z"
                      fill="#3DF4E8"
                    />
                    <path
                      d="M13.6009 7.44006H10.9209V10.1201H13.6009V7.44006Z"
                      fill="#3DF4E8"
                    />
                    <path
                      d="M21.6012 7.44006H17.6812V10.1201H21.6012V7.44006Z"
                      fill="#3DF4E8"
                    />
                    <path
                      d="M28.3206 7.44006H25.6406V10.1201H28.3206V7.44006Z"
                      fill="#3DF4E8"
                    />
                  </svg>

                  <span>Equilibrio</span>
                </div>
                <div className="layer-item">
                  <EyeIcon
                    isHidden={layerVisibility["zonaRecarga-layer"]}
                    onClick={() => toggleLayerVisibility("zonaRecarga-layer")}
                  />
                  <svg
                    width="33"
                    height="16"
                    viewBox="0 0 33 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M32.4399 15.2934H0V0H32.4399V15.2934ZM1.97331 13.28H30.4666V2.02669H1.97331V13.28Z"
                      fill="#8AF1CD"
                    />
                    <path
                      d="M6.9069 7.45337H2.93359V10.1334H6.9069V7.45337Z"
                      fill="#8AF1CD"
                    />
                    <path
                      d="M13.6009 7.45337H10.9209V10.1334H13.6009V7.45337Z"
                      fill="#8AF1CD"
                    />
                    <path
                      d="M21.6012 7.45337H17.6812V10.1334H21.6012V7.45337Z"
                      fill="#8AF1CD"
                    />
                    <path
                      d="M28.3206 7.45337H25.6406V10.1334H28.3206V7.45337Z"
                      fill="#8AF1CD"
                    />
                  </svg>

                  <span>Recarga</span>
                </div>
                <div className="layer-item">
                  <EyeIcon
                    isHidden={layerVisibility["zonaAcuifero-layer"]}
                    onClick={() => toggleLayerVisibility("zonaAcuifero-layer")}
                  />
                  <svg
                    width="40"
                    height="21"
                    viewBox="0 0 40 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M34.6667 5.33337H5.38672V14.9334H34.6667V5.33337Z"
                      fill="#A3BDB0"
                    />
                    <path
                      d="M34.6667 5.33333V14.9333H5.33333V5.33333H34.6667ZM40 0H0V20.2667H40V0Z"
                      fill="#9BD1C3"
                    />
                  </svg>

                  <span>
                    Zona con acuífero potencial libre a semiconfinado sin
                    estudio
                  </span>
                </div>

                <div className="margen2"></div>
              </div>
            )}

            {mapName === "ecosistemas" && (
              <div
                className="scroll-container"
                style={{
                  paddingBottom: "7vh",
                  paddingLeft: "40px",
                  height: "86vh",
                  overflow: "scroll",
                  paddingTop: "7vh",
                }}
              >
                <div className="margen"></div>

                <div className="subtitle">
                  <span>Ecosistemas y transformaciones</span>
                </div>

                <div className="subtitle-3">
                  <div className="espacio-2"></div>

                  {isMenuOpen.uno ? (
                    <svg
                      width="20"
                      height="12"
                      viewBox="0 0 38 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() =>
                        setIsMenuOpen({ ...isMenuOpen, uno: false })
                      }
                    >
                      <path
                        d="M0.590293 0.469685C2.66029 -1.39032 5.76029 2.34968 15.4403 13.1197L18.2503 16.2497L21.1603 13.2497L24.2503 10.1097C26.2503 8.10968 28.1903 6.21969 29.9003 4.67969C33.3303 1.60969 35.9003 -0.210315 36.8303 0.489685C37.7603 1.18968 36.1003 3.80968 33.1803 7.41968C31.7203 9.21968 29.9403 11.2597 27.9803 13.4197L24.9803 16.7397L21.5503 20.3897C21.0761 20.8887 20.4951 21.2739 19.8509 21.5163C19.2066 21.7588 18.5158 21.8522 17.8303 21.7897C17.1492 21.6993 16.4937 21.4709 15.9039 21.1184C15.3141 20.7659 14.8025 20.2967 14.4003 19.7397L11.6103 16.6197C1.89029 5.81969 -1.48971 2.32968 0.590293 0.469685Z"
                        fill="#F2EEE7"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="12"
                      viewBox="0 0 22 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() =>
                        setIsMenuOpen({ ...isMenuOpen, uno: true })
                      }
                    >
                      <path
                        d="M0.33507 12.7169C-0.880746 11.5835 1.18318 9.5434 7.0013 3.20828L8.11629 2.01523L8.70937 1.4187C8.99468 1.05014 9.32326 0.717651 9.68796 0.428467C10.1388 0.13514 10.6675 -0.0138897 11.2043 0.00101867C11.7411 0.0159271 12.2608 0.194074 12.6949 0.511981C12.9135 0.675092 13.1126 0.863272 13.288 1.07272L13.626 1.44256L14.2191 2.07488C15.7433 3.76305 17.1845 5.42736 18.4478 6.91868C20.9328 9.90132 22.5044 12.2039 21.852 12.7169C21.1997 13.2299 19.0408 11.4344 16.3364 8.74405C14.9545 7.3959 13.4659 5.82107 11.9535 4.17466L11.3604 3.57813L11.1173 3.31566L9.26094 5.31999C3.41909 11.6491 1.54495 13.8444 0.33507 12.7169Z"
                        fill="#F2EEE7"
                      />
                    </svg>
                  )}

                  <span>1. Amenazados y en estado vulnerable</span>
                </div>

                {isMenuOpen.uno && (
                  <div className="uno">
                    <div className="subtitle-2">
                      <div className="espacio-2"></div>

                      {isMenuOpen.unoUno ? (
                        <svg
                          width="20"
                          height="12"
                          viewBox="0 0 38 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() =>
                            setIsMenuOpen({ ...isMenuOpen, unoUno: false })
                          }
                        >
                          <path
                            d="M0.590293 0.469685C2.66029 -1.39032 5.76029 2.34968 15.4403 13.1197L18.2503 16.2497L21.1603 13.2497L24.2503 10.1097C26.2503 8.10968 28.1903 6.21969 29.9003 4.67969C33.3303 1.60969 35.9003 -0.210315 36.8303 0.489685C37.7603 1.18968 36.1003 3.80968 33.1803 7.41968C31.7203 9.21968 29.9403 11.2597 27.9803 13.4197L24.9803 16.7397L21.5503 20.3897C21.0761 20.8887 20.4951 21.2739 19.8509 21.5163C19.2066 21.7588 18.5158 21.8522 17.8303 21.7897C17.1492 21.6993 16.4937 21.4709 15.9039 21.1184C15.3141 20.7659 14.8025 20.2967 14.4003 19.7397L11.6103 16.6197C1.89029 5.81969 -1.48971 2.32968 0.590293 0.469685Z"
                            fill="#F2EEE7"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="12"
                          viewBox="0 0 22 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() =>
                            setIsMenuOpen({ ...isMenuOpen, unoUno: true })
                          }
                        >
                          <path
                            d="M0.33507 12.7169C-0.880746 11.5835 1.18318 9.5434 7.0013 3.20828L8.11629 2.01523L8.70937 1.4187C8.99468 1.05014 9.32326 0.717651 9.68796 0.428467C10.1388 0.13514 10.6675 -0.0138897 11.2043 0.00101867C11.7411 0.0159271 12.2608 0.194074 12.6949 0.511981C12.9135 0.675092 13.1126 0.863272 13.288 1.07272L13.626 1.44256L14.2191 2.07488C15.7433 3.76305 17.1845 5.42736 18.4478 6.91868C20.9328 9.90132 22.5044 12.2039 21.852 12.7169C21.1997 13.2299 19.0408 11.4344 16.3364 8.74405C14.9545 7.3959 13.4659 5.82107 11.9535 4.17466L11.3604 3.57813L11.1173 3.31566L9.26094 5.31999C3.41909 11.6491 1.54495 13.8444 0.33507 12.7169Z"
                            fill="#F2EEE7"
                          />
                        </svg>
                      )}

                      <EyeIcon
                        isHidden={!isMenuActive.unoUno}
                        onClick={() => {
                          const newVisibility = !isMenuActive.unoUno;
                          toggleLayerGroupVisibility(
                            capasAgrupadas.unoUno,
                            newVisibility ? "visible" : "none",
                          );

                          setIsMenuActive({
                            ...isMenuActive,
                            unoUno: newVisibility,
                          });
                        }}
                      />

                      <span>1.1. De litoral y aguas poco profundas</span>
                    </div>

                    {isMenuOpen.unoUno && (
                      <div className="unoUno">
                        <div className="layer-item">
                          <div className="espacio"></div>
                          <div className="espacio-2"></div>
                          <EyeIcon
                            isHidden={getLayerVisibility(
                              "sedimentosSubmarinos-layer",
                            )}
                            onClick={() =>
                              toggleLayerVisibility(
                                "sedimentosSubmarinos-layer",
                              )
                            }
                          />
                          <svg
                            width="31"
                            height="15"
                            viewBox="0 0 31 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="31" height="15" fill="#69D3BF" />
                          </svg>
                          <span>Sedimentos submarinos</span>
                        </div>

                        <div className="layer-item">
                          <div className="espacio"></div>
                          <div className="espacio-2"></div>
                          <EyeIcon
                            isHidden={getLayerVisibility("manglar-layer")}
                            onClick={() =>
                              toggleLayerVisibility("manglar-layer")
                            }
                          />
                          <svg
                            width="31"
                            height="15"
                            viewBox="0 0 31 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="31" height="15" fill="#7ECABD" />
                          </svg>
                          <span>Manglar</span>
                        </div>

                        <div className="layer-item">
                          <div className="espacio"></div>
                          <div className="espacio-2"></div>
                          <EyeIcon
                            isHidden={getLayerVisibility("llanuraMareal-layer")}
                            onClick={() =>
                              toggleLayerVisibility("llanuraMareal-layer")
                            }
                          />
                          <svg
                            width="31"
                            height="15"
                            viewBox="0 0 31 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="31" height="15" fill="#57BB8A" />
                          </svg>
                          <span>Llanura mareal</span>
                        </div>

                        <div className="layer-item">
                          <div className="espacio"></div>
                          <div className="espacio-2"></div>
                          <EyeIcon
                            isHidden={getLayerVisibility("playas-layer")}
                            onClick={() =>
                              toggleLayerVisibility("playas-layer")
                            }
                          />
                          <svg
                            width="31"
                            height="15"
                            viewBox="0 0 31 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="31" height="15" fill="#F4EDBF" />
                          </svg>
                          <span>Playas</span>
                        </div>

                        <div className="layer-item">
                          <div className="espacio"></div>
                          <div className="espacio-2"></div>
                          <EyeIcon
                            isHidden={getLayerVisibility("zonaPantanosa-layer")}
                            onClick={() =>
                              toggleLayerVisibility("zonaPantanosa-layer")
                            }
                          />
                          <svg
                            width="31"
                            height="15"
                            viewBox="0 0 31 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="31" height="15" fill="#B1804D" />
                          </svg>
                          <span>Zona pantanosa</span>
                        </div>
                      </div>
                    )}

                    <div className="subtitle-2">
                      <div className="espacio-2"></div>

                      {isMenuOpen.unoDos ? (
                        <svg
                          width="20"
                          height="12"
                          viewBox="0 0 38 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() =>
                            setIsMenuOpen({ ...isMenuOpen, unoDos: false })
                          }
                        >
                          <path
                            d="M0.590293 0.469685C2.66029 -1.39032 5.76029 2.34968 15.4403 13.1197L18.2503 16.2497L21.1603 13.2497L24.2503 10.1097C26.2503 8.10968 28.1903 6.21969 29.9003 4.67969C33.3303 1.60969 35.9003 -0.210315 36.8303 0.489685C37.7603 1.18968 36.1003 3.80968 33.1803 7.41968C31.7203 9.21968 29.9403 11.2597 27.9803 13.4197L24.9803 16.7397L21.5503 20.3897C21.0761 20.8887 20.4951 21.2739 19.8509 21.5163C19.2066 21.7588 18.5158 21.8522 17.8303 21.7897C17.1492 21.6993 16.4937 21.4709 15.9039 21.1184C15.3141 20.7659 14.8025 20.2967 14.4003 19.7397L11.6103 16.6197C1.89029 5.81969 -1.48971 2.32968 0.590293 0.469685Z"
                            fill="#F2EEE7"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="12"
                          viewBox="0 0 22 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() =>
                            setIsMenuOpen({ ...isMenuOpen, unoDos: true })
                          }
                        >
                          <path
                            d="M0.33507 12.7169C-0.880746 11.5835 1.18318 9.5434 7.0013 3.20828L8.11629 2.01523L8.70937 1.4187C8.99468 1.05014 9.32326 0.717651 9.68796 0.428467C10.1388 0.13514 10.6675 -0.0138897 11.2043 0.00101867C11.7411 0.0159271 12.2608 0.194074 12.6949 0.511981C12.9135 0.675092 13.1126 0.863272 13.288 1.07272L13.626 1.44256L14.2191 2.07488C15.7433 3.76305 17.1845 5.42736 18.4478 6.91868C20.9328 9.90132 22.5044 12.2039 21.852 12.7169C21.1997 13.2299 19.0408 11.4344 16.3364 8.74405C14.9545 7.3959 13.4659 5.82107 11.9535 4.17466L11.3604 3.57813L11.1173 3.31566L9.26094 5.31999C3.41909 11.6491 1.54495 13.8444 0.33507 12.7169Z"
                            fill="#F2EEE7"
                          />
                        </svg>
                      )}

                      <EyeIcon
                        isHidden={!isMenuActive.unoDos}
                        onClick={() => {
                          const newVisibility = !isMenuActive.unoDos;
                          toggleLayerGroupVisibility(
                            capasAgrupadas.unoDos,
                            newVisibility ? "visible" : "none",
                          );

                          setIsMenuActive({
                            ...isMenuActive,
                            unoDos: newVisibility,
                          });
                        }}
                      />

                      <span>1.2. Con vegetación de baja altura</span>
                    </div>

                    {isMenuOpen.unoDos && (
                      <div className="unoDos">
                        <div className="layer-item">
                          <div className="espacio"></div>
                          <div className="espacio-2"></div>
                          <EyeIcon
                            isHidden={getLayerVisibility(
                              "rocasExpuestas-layer",
                            )}
                            onClick={() =>
                              toggleLayerVisibility("rocasExpuestas-layer")
                            }
                          />
                          <svg
                            width="31"
                            height="15"
                            viewBox="0 0 31 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="31" height="15" fill="#888977" />
                          </svg>
                          <span>Rocas expuestas</span>
                        </div>

                        <div className="layer-item">
                          <div className="espacio"></div>
                          <div className="espacio-2"></div>
                          <EyeIcon
                            isHidden={getLayerVisibility("humedales-layer")}
                            onClick={() =>
                              toggleLayerVisibility("humedales-layer")
                            }
                          />
                          <svg
                            width="31"
                            height="15"
                            viewBox="0 0 31 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="31" height="15" fill="#ACF1AE" />
                          </svg>
                          <span>Humedales</span>
                        </div>

                        <div className="layer-item">
                          <div className="espacio"></div>
                          <div className="espacio-2"></div>
                          <EyeIcon
                            isHidden={getLayerVisibility("arbustal-layer")}
                            onClick={() =>
                              toggleLayerVisibility("arbustal-layer")
                            }
                          />
                          <svg
                            width="31"
                            height="15"
                            viewBox="0 0 31 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="31" height="15" fill="#A7C774" />
                          </svg>
                          <span>Vegetación arbustiva (arbustal)</span>
                        </div>

                        <div className="layer-item">
                          <div className="espacio"></div>
                          <div className="espacio-2"></div>
                          <EyeIcon
                            isHidden={getLayerVisibility(
                              "herbazalPastos-layer",
                            )}
                            onClick={() =>
                              toggleLayerVisibility("herbazalPastos-layer")
                            }
                          />
                          <svg
                            width="31"
                            height="15"
                            viewBox="0 0 31 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="31" height="15" fill="#F3BE32" />
                          </svg>
                          <span>Campos de hierbas y pastos (herbazal)</span>
                        </div>
                      </div>
                    )}

                    <div className="subtitle-2">
                      <div className="espacio-2"></div>

                      {isMenuOpen.unoTres ? (
                        <svg
                          width="20"
                          height="12"
                          viewBox="0 0 38 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() =>
                            setIsMenuOpen({ ...isMenuOpen, unoTres: false })
                          }
                        >
                          <path
                            d="M0.590293 0.469685C2.66029 -1.39032 5.76029 2.34968 15.4403 13.1197L18.2503 16.2497L21.1603 13.2497L24.2503 10.1097C26.2503 8.10968 28.1903 6.21969 29.9003 4.67969C33.3303 1.60969 35.9003 -0.210315 36.8303 0.489685C37.7603 1.18968 36.1003 3.80968 33.1803 7.41968C31.7203 9.21968 29.9403 11.2597 27.9803 13.4197L24.9803 16.7397L21.5503 20.3897C21.0761 20.8887 20.4951 21.2739 19.8509 21.5163C19.2066 21.7588 18.5158 21.8522 17.8303 21.7897C17.1492 21.6993 16.4937 21.4709 15.9039 21.1184C15.3141 20.7659 14.8025 20.2967 14.4003 19.7397L11.6103 16.6197C1.89029 5.81969 -1.48971 2.32968 0.590293 0.469685Z"
                            fill="#F2EEE7"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="12"
                          viewBox="0 0 22 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() =>
                            setIsMenuOpen({ ...isMenuOpen, unoTres: true })
                          }
                        >
                          <path
                            d="M0.33507 12.7169C-0.880746 11.5835 1.18318 9.5434 7.0013 3.20828L8.11629 2.01523L8.70937 1.4187C8.99468 1.05014 9.32326 0.717651 9.68796 0.428467C10.1388 0.13514 10.6675 -0.0138897 11.2043 0.00101867C11.7411 0.0159271 12.2608 0.194074 12.6949 0.511981C12.9135 0.675092 13.1126 0.863272 13.288 1.07272L13.626 1.44256L14.2191 2.07488C15.7433 3.76305 17.1845 5.42736 18.4478 6.91868C20.9328 9.90132 22.5044 12.2039 21.852 12.7169C21.1997 13.2299 19.0408 11.4344 16.3364 8.74405C14.9545 7.3959 13.4659 5.82107 11.9535 4.17466L11.3604 3.57813L11.1173 3.31566L9.26094 5.31999C3.41909 11.6491 1.54495 13.8444 0.33507 12.7169Z"
                            fill="#F2EEE7"
                          />
                        </svg>
                      )}

                      <EyeIcon
                        isHidden={!isMenuActive.unoTres}
                        onClick={() => {
                          const newVisibility = !isMenuActive.unoTres;
                          toggleLayerGroupVisibility(
                            capasAgrupadas.unoTres,
                            newVisibility ? "visible" : "none",
                          );

                          setIsMenuActive({
                            ...isMenuActive,
                            unoTres: newVisibility,
                          });
                        }}
                      />

                      <span>1.3. Bosques</span>
                    </div>

                    {isMenuOpen.unoTres && (
                      <div className="unoTres">
                        <div className="layer-item">
                          <div className="espacio"></div>
                          <div className="espacio-2"></div>
                          <EyeIcon
                            isHidden={getLayerVisibility("xerofitico-layer")}
                            onClick={() =>
                              toggleLayerVisibility("xerofitico-layer")
                            }
                          />
                          <svg
                            width="31"
                            height="15"
                            viewBox="0 0 31 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="31" height="15" fill="#DCC248" />
                          </svg>
                          <span>Extremadamente secos (Xerofítico)</span>
                        </div>
                        <div className="layer-item">
                          <div className="espacio"></div>
                          <div className="espacio-2"></div>
                          <EyeIcon
                            isHidden={getLayerVisibility("subxerofitico-layer")}
                            onClick={() =>
                              toggleLayerVisibility("subxerofitico-layer")
                            }
                          />
                          <svg
                            width="31"
                            height="15"
                            viewBox="0 0 31 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="31" height="15" fill="#EADC79" />
                          </svg>
                          <span>Muy secos (Subxerofítico)</span>
                        </div>
                        <div className="layer-item">
                          <div className="espacio"></div>
                          <div className="espacio-2"></div>
                          <EyeIcon
                            isHidden={getLayerVisibility("inundables-layer")}
                            onClick={() =>
                              toggleLayerVisibility("inundables-layer")
                            }
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                          />
                          <svg
                            width="31"
                            height="15"
                            viewBox="0 0 31 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="31" height="15" fill="#4FD381" />
                          </svg>
                          <span>Inundables</span>
                        </div>

                        <div className="layer-item">
                          <div className="espacio"></div>
                          <div className="espacio-2"></div>
                          <EyeIcon
                            isHidden={getLayerVisibility(
                              "secosTropicales-layer",
                            )}
                            onClick={() =>
                              toggleLayerVisibility("secosTropicales-layer")
                            }
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                          />
                          <svg
                            width="31"
                            height="15"
                            viewBox="0 0 31 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="31" height="15" fill="#81E837" />
                          </svg>
                          <span>Secos tropicales</span>
                        </div>
                        <div className="layer-item">
                          <div className="espacio"></div>
                          <div className="espacio-2"></div>
                          <EyeIcon
                            isHidden={getLayerVisibility(
                              "humedosTropicales-layer",
                            )}
                            onClick={() =>
                              toggleLayerVisibility("humedosTropicales-layer")
                            }
                          />
                          <svg
                            width="31"
                            height="15"
                            viewBox="0 0 31 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="31" height="15" fill="#AEDE53" />
                          </svg>
                          <span>Húmedos tropicales</span>
                        </div>
                        <div className="layer-item">
                          <div className="espacio"></div>
                          <div className="espacio-2"></div>
                          <EyeIcon
                            isHidden={getLayerVisibility("subandinos-layer")}
                            onClick={() =>
                              toggleLayerVisibility("subandinos-layer")
                            }
                          />
                          <svg
                            width="31"
                            height="15"
                            viewBox="0 0 31 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="31" height="15" fill="#74C433" />
                          </svg>
                          <span>Subandinos</span>
                        </div>
                        <div className="layer-item">
                          <div className="espacio"></div>
                          <div className="espacio-2"></div>
                          <EyeIcon
                            isHidden={getLayerVisibility("bosqueNiebla-layer")}
                            onClick={() =>
                              toggleLayerVisibility("bosqueNiebla-layer")
                            }
                          />
                          <svg
                            width="31"
                            height="15"
                            viewBox="0 0 31 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="31" height="15" fill="#41A968" />
                          </svg>
                          <span>De niebla</span>
                        </div>

                        <div className="layer-item">
                          <div className="espacio"></div>
                          <div className="espacio-2"></div>
                          <EyeIcon
                            isHidden={getLayerVisibility("altoAndinos-layer")}
                            onClick={() =>
                              toggleLayerVisibility("altoAndinos-layer")
                            }
                          />
                          <svg
                            width="31"
                            height="15"
                            viewBox="0 0 31 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="31" height="15" fill="#41854A" />
                          </svg>
                          <span>Alto andinos</span>
                        </div>
                      </div>
                    )}

                    <div className="subtitle-2">
                      <div className="espacio-2"></div>

                      {isMenuOpen.unoCuatro ? (
                        <svg
                          width="20"
                          height="12"
                          viewBox="0 0 38 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() =>
                            setIsMenuOpen({ ...isMenuOpen, unoCuatro: false })
                          }
                        >
                          <path
                            d="M0.590293 0.469685C2.66029 -1.39032 5.76029 2.34968 15.4403 13.1197L18.2503 16.2497L21.1603 13.2497L24.2503 10.1097C26.2503 8.10968 28.1903 6.21969 29.9003 4.67969C33.3303 1.60969 35.9003 -0.210315 36.8303 0.489685C37.7603 1.18968 36.1003 3.80968 33.1803 7.41968C31.7203 9.21968 29.9403 11.2597 27.9803 13.4197L24.9803 16.7397L21.5503 20.3897C21.0761 20.8887 20.4951 21.2739 19.8509 21.5163C19.2066 21.7588 18.5158 21.8522 17.8303 21.7897C17.1492 21.6993 16.4937 21.4709 15.9039 21.1184C15.3141 20.7659 14.8025 20.2967 14.4003 19.7397L11.6103 16.6197C1.89029 5.81969 -1.48971 2.32968 0.590293 0.469685Z"
                            fill="#F2EEE7"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="12"
                          viewBox="0 0 22 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() =>
                            setIsMenuOpen({ ...isMenuOpen, unoCuatro: true })
                          }
                        >
                          <path
                            d="M0.33507 12.7169C-0.880746 11.5835 1.18318 9.5434 7.0013 3.20828L8.11629 2.01523L8.70937 1.4187C8.99468 1.05014 9.32326 0.717651 9.68796 0.428467C10.1388 0.13514 10.6675 -0.0138897 11.2043 0.00101867C11.7411 0.0159271 12.2608 0.194074 12.6949 0.511981C12.9135 0.675092 13.1126 0.863272 13.288 1.07272L13.626 1.44256L14.2191 2.07488C15.7433 3.76305 17.1845 5.42736 18.4478 6.91868C20.9328 9.90132 22.5044 12.2039 21.852 12.7169C21.1997 13.2299 19.0408 11.4344 16.3364 8.74405C14.9545 7.3959 13.4659 5.82107 11.9535 4.17466L11.3604 3.57813L11.1173 3.31566L9.26094 5.31999C3.41909 11.6491 1.54495 13.8444 0.33507 12.7169Z"
                            fill="#F2EEE7"
                          />
                        </svg>
                      )}

                      <EyeIcon
                        isHidden={!isMenuActive.unoCuatro}
                        onClick={() => {
                          const newVisibility = !isMenuActive.unoCuatro;
                          toggleLayerGroupVisibility(
                            capasAgrupadas.unoCuatro,
                            newVisibility ? "visible" : "none",
                          );

                          setIsMenuActive({
                            ...isMenuActive,
                            unoCuatro: newVisibility,
                          });
                        }}
                      />

                      <span>1.4. Altas cumbres</span>
                    </div>

                    {isMenuOpen.unoCuatro && (
                      <div className="unoCuatro">
                        <div className="layer-item">
                          <div className="espacio"></div>
                          <div className="espacio-2"></div>
                          <EyeIcon
                            isHidden={getLayerVisibility("pantanoParamo-layer")}
                            onClick={() =>
                              toggleLayerVisibility("pantanoParamo-layer")
                            }
                          />
                          <svg
                            width="31"
                            height="15"
                            viewBox="0 0 31 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="31" height="15" fill="#E99968" />
                          </svg>
                          <span>Pantano de páramo (Turbera)</span>
                        </div>
                        <div className="layer-item">
                          <div className="espacio"></div>
                          <div className="espacio-2"></div>
                          <EyeIcon
                            isHidden={getLayerVisibility("Paramo-layer")}
                            onClick={() =>
                              toggleLayerVisibility("Paramo-layer")
                            }
                          />
                          <svg
                            width="31"
                            height="15"
                            viewBox="0 0 31 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="31" height="15" fill="#87B3A4" />
                          </svg>
                          <span>Páramo</span>
                        </div>

                        <div className="layer-item">
                          <div className="espacio"></div>
                          <div className="espacio-2"></div>
                          <EyeIcon
                            isHidden={getLayerVisibility("laguna-layer")}
                            onClick={() =>
                              toggleLayerVisibility("laguna-layer")
                            }
                          />
                          <svg
                            width="31"
                            height="15"
                            viewBox="0 0 31 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="31" height="15" fill="#81E59D" />
                          </svg>
                          <span>Laguna</span>
                        </div>

                        <div className="layer-item">
                          <div className="espacio"></div>
                          <div className="espacio-2"></div>
                          <EyeIcon
                            isHidden={getLayerVisibility(
                              "glaciaresNivales-layer",
                            )}
                            onClick={() =>
                              toggleLayerVisibility("glaciaresNivales-layer")
                            }
                          />
                          <svg
                            width="31"
                            height="15"
                            viewBox="0 0 31 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="31" height="15" fill="#CFF5DD" />
                          </svg>
                          <span>Glaciares y nivales</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="subtitle-4">
                  <div className="espacio-2"></div>

                  {isMenuOpen.dos ? (
                    <svg
                      width="20"
                      height="12"
                      viewBox="0 0 22 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() =>
                        setIsMenuOpen({ ...isMenuOpen, dos: false })
                      }
                    >
                      <path
                        d="M0.33507 12.7169C-0.880746 11.5835 1.18318 9.5434 7.0013 3.20828L8.11629 2.01523L8.70937 1.4187C8.99468 1.05014 9.32326 0.717651 9.68796 0.428467C10.1388 0.13514 10.6675 -0.0138897 11.2043 0.00101867C11.7411 0.0159271 12.2608 0.194074 12.6949 0.511981C12.9135 0.675092 13.1126 0.863272 13.288 1.07272L13.626 1.44256L14.2191 2.07488C15.7433 3.76305 17.1845 5.42736 18.4478 6.91868C20.9328 9.90132 22.5044 12.2039 21.852 12.7169C21.1997 13.2299 19.0408 11.4344 16.3364 8.74405C14.9545 7.3959 13.4659 5.82107 11.9535 4.17466L11.3604 3.57813L11.1173 3.31566L9.26094 5.31999C3.41909 11.6491 1.54495 13.8444 0.33507 12.7169Z"
                        fill="#F2EEE7"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="12"
                      viewBox="0 0 22 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() =>
                        setIsMenuOpen({ ...isMenuOpen, dos: true })
                      }
                    >
                      <path
                        d="M0.33507 12.7169C-0.880746 11.5835 1.18318 9.5434 7.0013 3.20828L8.11629 2.01523L8.70937 1.4187C8.99468 1.05014 9.32326 0.717651 9.68796 0.428467C10.1388 0.13514 10.6675 -0.0138897 11.2043 0.00101867C11.7411 0.0159271 12.2608 0.194074 12.6949 0.511981C12.9135 0.675092 13.1126 0.863272 13.288 1.07272L13.626 1.44256L14.2191 2.07488C15.7433 3.76305 17.1845 5.42736 18.4478 6.91868C20.9328 9.90132 22.5044 12.2039 21.852 12.7169C21.1997 13.2299 19.0408 11.4344 16.3364 8.74405C14.9545 7.3959 13.4659 5.82107 11.9535 4.17466L11.3604 3.57813L11.1173 3.31566L9.26094 5.31999C3.41909 11.6491 1.54495 13.8444 0.33507 12.7169Z"
                        fill="#F2EEE7"
                      />
                    </svg>
                  )}

                  <span>
                    2. Entornos del ser humano que transforman ecosistemas
                  </span>
                </div>

                {isMenuOpen.dos && (
                  <div className="dos">
                    <div className="subtitle-2">
                      <div className="espacio-2"></div>

                      {isMenuOpen.dosUno ? (
                        <svg
                          width="20"
                          height="12"
                          viewBox="0 0 22 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() =>
                            setIsMenuOpen({ ...isMenuOpen, dosUno: false })
                          }
                        >
                          <path
                            d="M0.33507 12.7169C-0.880746 11.5835 1.18318 9.5434 7.0013 3.20828L8.11629 2.01523L8.70937 1.4187C8.99468 1.05014 9.32326 0.717651 9.68796 0.428467C10.1388 0.13514 10.6675 -0.0138897 11.2043 0.00101867C11.7411 0.0159271 12.2608 0.194074 12.6949 0.511981C12.9135 0.675092 13.1126 0.863272 13.288 1.07272L13.626 1.44256L14.2191 2.07488C15.7433 3.76305 17.1845 5.42736 18.4478 6.91868C20.9328 9.90132 22.5044 12.2039 21.852 12.7169C21.1997 13.2299 19.0408 11.4344 16.3364 8.74405C14.9545 7.3959 13.4659 5.82107 11.9535 4.17466L11.3604 3.57813L11.1173 3.31566L9.26094 5.31999C3.41909 11.6491 1.54495 13.8444 0.33507 12.7169Z"
                            fill="#F2EEE7"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="12"
                          viewBox="0 0 22 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() =>
                            setIsMenuOpen({ ...isMenuOpen, dosUno: true })
                          }
                        >
                          <path
                            d="M0.33507 12.7169C-0.880746 11.5835 1.18318 9.5434 7.0013 3.20828L8.11629 2.01523L8.70937 1.4187C8.99468 1.05014 9.32326 0.717651 9.68796 0.428467C10.1388 0.13514 10.6675 -0.0138897 11.2043 0.00101867C11.7411 0.0159271 12.2608 0.194074 12.6949 0.511981C12.9135 0.675092 13.1126 0.863272 13.288 1.07272L13.626 1.44256L14.2191 2.07488C15.7433 3.76305 17.1845 5.42736 18.4478 6.91868C20.9328 9.90132 22.5044 12.2039 21.852 12.7169C21.1997 13.2299 19.0408 11.4344 16.3364 8.74405C14.9545 7.3959 13.4659 5.82107 11.9535 4.17466L11.3604 3.57813L11.1173 3.31566L9.26094 5.31999C3.41909 11.6491 1.54495 13.8444 0.33507 12.7169Z"
                            fill="#F2EEE7"
                          />
                        </svg>
                      )}
                      <EyeIcon
                        isHidden={!isMenuActive.dosUno}
                        onClick={() => {
                          const newVisibility = !isMenuActive.dosUno;
                          toggleLayerGroupVisibility(
                            capasAgrupadas.dosUno,
                            newVisibility ? "visible" : "none",
                          );

                          setIsMenuActive({
                            ...isMenuActive,
                            dosUno: newVisibility,
                          });
                        }}
                      />

                      <span>2.1. Intervenciones moderadas</span>
                    </div>

                    {isMenuOpen.dosUno && (
                      <div className="dosUno">
                        <div className="layer-item">
                          <div className="espacio"></div>
                          <div className="espacio-2"></div>
                          <EyeIcon
                            isHidden={getLayerVisibility(
                              "bosqueFragmentado-layer",
                            )}
                            onClick={() =>
                              toggleLayerVisibility("bosqueFragmentado-layer")
                            }
                          />
                          <svg
                            width="31"
                            height="15"
                            viewBox="0 0 31 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="31" height="15" fill="#B44D5E" />
                          </svg>
                          <span>Bosque fragmentado</span>
                        </div>
                        <div className="layer-item">
                          <div className="espacio"></div>
                          <div className="espacio-2"></div>
                          <EyeIcon
                            isHidden={getLayerVisibility(
                              "regeneracionVegetal-layer",
                            )}
                            onClick={() =>
                              toggleLayerVisibility("regeneracionVegetal-layer")
                            }
                          />
                          <svg
                            width="31"
                            height="15"
                            viewBox="0 0 31 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="31" height="15" fill="#8E60A1" />
                          </svg>
                          <span>Vegetación en regeneración</span>
                        </div>
                      </div>
                    )}

                    <div className="subtitle-2">
                      <div className="espacio-2"></div>

                      {isMenuOpen.dosDos ? (
                        <svg
                          width="20"
                          height="12"
                          viewBox="0 0 22 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() =>
                            setIsMenuOpen({ ...isMenuOpen, dosDos: false })
                          }
                        >
                          <path
                            d="M0.33507 12.7169C-0.880746 11.5835 1.18318 9.5434 7.0013 3.20828L8.11629 2.01523L8.70937 1.4187C8.99468 1.05014 9.32326 0.717651 9.68796 0.428467C10.1388 0.13514 10.6675 -0.0138897 11.2043 0.00101867C11.7411 0.0159271 12.2608 0.194074 12.6949 0.511981C12.9135 0.675092 13.1126 0.863272 13.288 1.07272L13.626 1.44256L14.2191 2.07488C15.7433 3.76305 17.1845 5.42736 18.4478 6.91868C20.9328 9.90132 22.5044 12.2039 21.852 12.7169C21.1997 13.2299 19.0408 11.4344 16.3364 8.74405C14.9545 7.3959 13.4659 5.82107 11.9535 4.17466L11.3604 3.57813L11.1173 3.31566L9.26094 5.31999C3.41909 11.6491 1.54495 13.8444 0.33507 12.7169Z"
                            fill="#F2EEE7"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="12"
                          viewBox="0 0 22 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() =>
                            setIsMenuOpen({ ...isMenuOpen, dosDos: true })
                          }
                        >
                          <path
                            d="M0.33507 12.7169C-0.880746 11.5835 1.18318 9.5434 7.0013 3.20828L8.11629 2.01523L8.70937 1.4187C8.99468 1.05014 9.32326 0.717651 9.68796 0.428467C10.1388 0.13514 10.6675 -0.0138897 11.2043 0.00101867C11.7411 0.0159271 12.2608 0.194074 12.6949 0.511981C12.9135 0.675092 13.1126 0.863272 13.288 1.07272L13.626 1.44256L14.2191 2.07488C15.7433 3.76305 17.1845 5.42736 18.4478 6.91868C20.9328 9.90132 22.5044 12.2039 21.852 12.7169C21.1997 13.2299 19.0408 11.4344 16.3364 8.74405C14.9545 7.3959 13.4659 5.82107 11.9535 4.17466L11.3604 3.57813L11.1173 3.31566L9.26094 5.31999C3.41909 11.6491 1.54495 13.8444 0.33507 12.7169Z"
                            fill="#F2EEE7"
                          />
                        </svg>
                      )}

                      <EyeIcon
                        isHidden={!isMenuActive.dosDos}
                        onClick={() => {
                          toggleLayerGroupVisibility(
                            capasAgrupadas.dosDos,
                            !isMenuActive.dosDos ? "visible" : "none",
                          );

                          setIsMenuActive({
                            ...isMenuActive,
                            dosDos: !isMenuActive.dosDos,
                          });
                        }}
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                      />

                      <span>2.2. Zonas con agricultura y ganadería</span>
                    </div>

                    {isMenuOpen.dosDos && (
                      <div className="dosDos">
                        <div className="layer-item">
                          <div className="espacio"></div>
                          <div className="espacio-2"></div>
                          <EyeIcon
                            isHidden={getLayerVisibility(
                              "agriculturaMixta-layer",
                            )}
                            onClick={() =>
                              toggleLayerVisibility("agriculturaMixta-layer")
                            }
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                          />
                          <svg
                            width="31"
                            height="15"
                            viewBox="0 0 31 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="31" height="15" fill="#D4BADD" />
                          </svg>
                          <span>Agricultura mixta</span>
                        </div>
                        <div className="layer-item">
                          <div className="espacio"></div>
                          <div className="espacio-2"></div>
                          <EyeIcon
                            isHidden={getLayerVisibility(
                              "areasInundacion-layer",
                            )}
                            onClick={() =>
                              toggleLayerVisibility("areasInundacion-layer")
                            }
                          />
                          <svg
                            width="31"
                            height="15"
                            viewBox="0 0 31 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="31" height="15" fill="#EF7CA5" />
                          </svg>
                          <span>Áreas de inundación y humedales desecados</span>
                        </div>
                        <div className="layer-item">
                          <div className="espacio"></div>
                          <div className="espacio-2"></div>
                          <EyeIcon
                            isHidden={getLayerVisibility("monocultivos-layer")}
                            onClick={() =>
                              toggleLayerVisibility("monocultivos-layer")
                            }
                          />
                          <svg
                            width="31"
                            height="15"
                            viewBox="0 0 31 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="31" height="15" fill="#DCAA4F" />
                          </svg>
                          <span>Monocultivos</span>
                        </div>
                        <div className="layer-item">
                          <div className="espacio"></div>
                          <div className="espacio-2"></div>
                          <EyeIcon
                            isHidden={getLayerVisibility("ganaderia-layer")}
                            onClick={() =>
                              toggleLayerVisibility("ganaderia-layer")
                            }
                          />
                          <svg
                            width="31"
                            height="15"
                            viewBox="0 0 31 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="31" height="15" fill="#F4F339" />
                          </svg>
                          <span>Ganadería</span>
                        </div>
                      </div>
                    )}

                    <div className="subtitle-2">
                      <div className="espacio-2"></div>

                      {isMenuOpen.dosTres ? (
                        <svg
                          width="20"
                          height="12"
                          viewBox="0 0 22 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() =>
                            setIsMenuOpen({ ...isMenuOpen, dosTres: false })
                          }
                        >
                          <path
                            d="M0.33507 12.7169C-0.880746 11.5835 1.18318 9.5434 7.0013 3.20828L8.11629 2.01523L8.70937 1.4187C8.99468 1.05014 9.32326 0.717651 9.68796 0.428467C10.1388 0.13514 10.6675 -0.0138897 11.2043 0.00101867C11.7411 0.0159271 12.2608 0.194074 12.6949 0.511981C12.9135 0.675092 13.1126 0.863272 13.288 1.07272L13.626 1.44256L14.2191 2.07488C15.7433 3.76305 17.1845 5.42736 18.4478 6.91868C20.9328 9.90132 22.5044 12.2039 21.852 12.7169C21.1997 13.2299 19.0408 11.4344 16.3364 8.74405C14.9545 7.3959 13.4659 5.82107 11.9535 4.17466L11.3604 3.57813L11.1173 3.31566L9.26094 5.31999C3.41909 11.6491 1.54495 13.8444 0.33507 12.7169Z"
                            fill="#F2EEE7"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="12"
                          viewBox="0 0 22 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() =>
                            setIsMenuOpen({ ...isMenuOpen, dosTres: true })
                          }
                        >
                          <path
                            d="M0.33507 12.7169C-0.880746 11.5835 1.18318 9.5434 7.0013 3.20828L8.11629 2.01523L8.70937 1.4187C8.99468 1.05014 9.32326 0.717651 9.68796 0.428467C10.1388 0.13514 10.6675 -0.0138897 11.2043 0.00101867C11.7411 0.0159271 12.2608 0.194074 12.6949 0.511981C12.9135 0.675092 13.1126 0.863272 13.288 1.07272L13.626 1.44256L14.2191 2.07488C15.7433 3.76305 17.1845 5.42736 18.4478 6.91868C20.9328 9.90132 22.5044 12.2039 21.852 12.7169C21.1997 13.2299 19.0408 11.4344 16.3364 8.74405C14.9545 7.3959 13.4659 5.82107 11.9535 4.17466L11.3604 3.57813L11.1173 3.31566L9.26094 5.31999C3.41909 11.6491 1.54495 13.8444 0.33507 12.7169Z"
                            fill="#F2EEE7"
                          />
                        </svg>
                      )}

                      <EyeIcon
                        isHidden={!isMenuActive.dosTres}
                        onClick={() => {
                          const newVisibility = !isMenuActive.dosTres;
                          toggleLayerGroupVisibility(
                            capasAgrupadas.dosTres,
                            newVisibility ? "visible" : "none",
                          );

                          setIsMenuActive({
                            ...isMenuActive,
                            dosTres: newVisibility,
                          });
                        }}
                      />

                      <span>2.3. Intervenciones severas </span>
                    </div>

                    {isMenuOpen.dosTres && (
                      <div className="dosTres">
                        <div className="layer-item">
                          <div className="espacio"></div>

                          <div className="espacio-2"></div>
                          <EyeIcon
                            isHidden={getLayerVisibility(
                              "zonaUrbanaIndustrial-layer",
                            )}
                            onClick={() =>
                              toggleLayerVisibility(
                                "zonaUrbanaIndustrial-layer",
                              )
                            }
                          />
                          <svg
                            width="31"
                            height="15"
                            viewBox="0 0 31 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="31" height="15" fill="#E24A3C" />
                          </svg>
                          <span>
                            Zonas urbanizadas, industrializadas y con minería
                            intensiva
                          </span>
                        </div>

                        <div className="layer-item">
                          <div className="espacio-2"></div>
                          <div className="espacio"></div>
                          <EyeIcon
                            isHidden={getLayerVisibility(
                              "aguaSuperficial-layer",
                            )}
                            onClick={() =>
                              toggleLayerVisibility("aguaSuperficial-layer")
                            }
                          />
                          <svg
                            width="31"
                            height="15"
                            viewBox="0 0 31 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="31" height="15" fill="#4342A8" />
                          </svg>
                          <span>Cuerpos de agua artificial</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="subtitle-3">
                  <div className="espacio-2"></div>

                  <EyeIcon
                    isHidden={getLayerVisibility("sinInformacion-layer")}
                    onClick={() =>
                      toggleLayerVisibility("sinInformacion-layer")
                    }
                  />

                  <svg
                    width="31"
                    height="15"
                    viewBox="0 0 31 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="31" height="15" fill="#F7F5E7" />
                  </svg>

                  <span>3. Sin información y otras áreas</span>
                </div>

                <div className="margen2"></div>
              </div>
            )}

            {mapName === "unRioCaucaMuchosMundos" && (
              <div
                className="scroll-container"
                style={{
                  paddingTop: "7vh",
                  paddingBottom: "7vh",
                  paddingLeft: "4vw",
                  paddingRight: "1vw",
                  height: "86vh",
                  overflow: "scroll",
                }}
              >
                <div className="margen"></div>
                {layers.map((layer) => (
                  <div key={layer.id} className="layer-item">
                    <EyeIcon
                      isHidden={layerVisibility[layer.id]}
                      onClick={() => toggleLayerVisibility(layer.id)}
                    />
                    <span>{layer.texto}</span>
                  </div>
                ))}{" "}
              </div>
            )}

            {mapName === "TNATransformadoras" && (
              <div
                className="scroll-container"
                style={{
                  marginLeft: "15%",
                  display: "flex",
                  flexDirection: "column",
                  paddingTop: "7vh",
                  paddingBottom: "7vh",
                  height: "86vh",
                  overflow: "scroll",
                }}
              >
                <div className="margen"></div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-6%",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/image.svg"
                      alt="Río Cauca"
                      style={{ width: "32px", height: "15px" }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  >
                    Río Cauca
                  </span>
                </div>

                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-5%",
                    marginTop: "2%",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/riosPrincipales.svg"
                      alt=""
                      style={{
                        width: "38px",
                        height: "15px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Ríos principales
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-5%",
                    marginTop: "1%",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/riosTributarios.svg"
                      alt=""
                      style={{
                        width: "40px",
                        height: "10px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Ríos tributarios
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-5%",
                    marginTop: "1%",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/humedales2.svg"
                      alt=""
                      style={{
                        width: "25px",
                        height: "15px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Humedales
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-5%",
                    marginTop: "1%",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/represas.svg"
                      alt=""
                      style={{
                        width: "40px",
                        height: "19px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Represas
                  </span>
                </div>
                <br />
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-5%",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/zonasUrbanas.svg"
                      alt=""
                      style={{
                        width: "28px",
                        height: "14px",
                        objectFit: "cover",
                        objectPosition: "center",
                        marginLeft: "1px",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Zonas urbanas
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-26%",
                    marginTop: "1%",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/redVial.svg"
                      alt=""
                      style={{
                        width: "28px",
                        height: "35px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Red víal
                  </span>
                </div>
                <br />
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-5%",
                    marginTop: "1%",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/areasMixtas.svg"
                      alt=""
                      style={{
                        width: "20px",
                        height: "15px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "22.5%",
                    }}
                  >
                    Áreas mixtas (Fincas tradicionales, bosques, zonas verdes y
                    policultivos)
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-5%",
                    marginTop: "-1%",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/monocultivos.svg"
                      alt=""
                      style={{
                        width: "30px",
                        height: "13px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4.5%",
                    }}
                  >
                    Monocultivos (caña de azúcar y otros)
                  </span>
                </div>
                <br />
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-5%",
                    marginTop: "-3%",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/surValleAlto.svg"
                      alt="Represas"
                      style={{
                        width: "24px",
                        height: "12px",
                        objectFit: "cover",
                        objectPosition: "center",
                        marginTop: "2px",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "5%",
                    }}
                  >
                    Sur del valle alto del río Cauca
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-10%",
                    marginTop: "1%",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.3)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/entramados.svg"
                      alt="Represas"
                      style={{
                        width: "28px",
                        height: "15px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Entramados territoriales
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-3%",
                    marginTop: "1%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "1%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/suarez.svg"
                      alt="Represas"
                      style={{
                        width: "25px",
                        height: "25px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "6%",
                    }}
                  >
                    Nodo-entramado territorial Suárez
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-3%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "-7%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.4)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/villaRica.svg"
                      alt="Represas"
                      style={{
                        width: "25px",
                        height: "30px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Nodo-entramado territorial Villa Rica
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-5%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "-7%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/cali.svg"
                      alt="Represas"
                      style={{
                        width: "25px",
                        height: "25px",
                        objectFit: "cover",
                        objectPosition: "center",
                        marginBottom: "3px",
                        marginRight: "2.5px",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Nodo-entramado territorial Oriente de Cali
                  </span>
                </div>

                <div className="margen2"></div>
              </div>
            )}

            {/*Capas modelo Cali*/}

            {mapName === "MOrienteCali" && (
              <div
                className="scroll-container"
                style={{
                  marginLeft: "15%",
                  paddingTop: "7vh",
                  paddingBottom: "7vh",
                  display: "flex",
                  flexDirection: "column",
                  height: "86vh",
                  overflow: "scroll",
                }}
              >
                <div className="margen"></div>
                <h4
                  style={{
                    marginLeft: "28%",
                    fontSize: "18px",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: "600",
                    marginBottom: "2%",
                  }}
                >
                  Lo estructural
                </h4>

                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-5%",
                    marginTop: "-1%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "-6.5%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/menuCapasMoCali/orienteCali.svg"
                      alt="Río Cauca"
                      style={{
                        width: "50%",
                        height: "50%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Poblaciones del Pacífico colombiano
                  </span>
                </div>

                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-4%",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/menuCapasMoCali/poblacionesValle.svg"
                      alt=""
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        objectPosition: "center",
                        paddingRight: "3px",
                        paddingTop: "2.8px",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Oriente de Cali
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-8%",
                    marginTop: "-2%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/menuCapasMoCali/manglares.svg"
                      alt=""
                      style={{
                        width: "50px",
                        height: "45px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                    }}
                  >
                    Manglares
                  </span>
                </div>
                <h4
                  style={{
                    marginLeft: "28%",
                    fontSize: "18px",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: "600",
                    marginBottom: "2%",
                  }}
                >
                  Lo emblemático o notable
                </h4>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-8%",
                    marginTop: "-3%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/menuCapasMoCali/regionPacifica.svg"
                      alt=""
                      style={{
                        width: "40px",
                        height: "35px",
                        objectFit: "cover",
                        objectPosition: "center",
                        marginLeft: "2.5px",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                    }}
                  >
                    Región Pacífica
                  </span>
                </div>
                <h4
                  style={{
                    marginLeft: "28%",
                    fontSize: "18px",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: "600",
                    marginBottom: "2%",
                  }}
                >
                  Entorno del litoral Pacífico
                </h4>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-1.8%",
                    marginTop: "-3%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/menuCapasMoCali/palafitos.svg"
                      alt=""
                      style={{
                        width: "28px",
                        height: "25px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Palafitos
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-1%",
                    marginTop: "-4.4%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/menuCapasMoCali/palmeras.svg"
                      alt=""
                      style={{
                        width: "28px",
                        height: "20px",
                        marginTop: "4px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                    }}
                  >
                    Palmera
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-9%",
                    marginTop: "-5%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "5%",
                      marginRight: "3%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/menuCapasMoCali/tendederos.svg"
                      alt=""
                      style={{
                        width: "33px",
                        height: "40px",
                        marginTop: "5px",
                        marginLeft: "6px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "18px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                    }}
                  >
                    Tendederos
                  </span>
                </div>
                <h4
                  style={{
                    marginLeft: "28%",
                    fontSize: "18px",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: "600",
                    marginBottom: "2%",
                  }}
                >
                  Lo problemático o conflictivo
                </h4>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "-3%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/menuCapasMoCali/visionExtractivista.svg"
                      alt=""
                      style={{
                        width: "48px",
                        height: "30px",
                        marginTop: "12px",
                        marginLeft: "28px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Visión extractivista
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-6%",
                    marginTop: "-7%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                      marginBottom: "-3px",
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/menuCapasMoCali/flujoMigra.svg"
                      alt=""
                      style={{
                        width: "50px",
                        height: "30px",
                        marginBottom: "5px",
                        objectFit: "cover",
                        objectPosition: "center",
                        marginLeft: "3px",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                    }}
                  >
                    Flujos de migradestierro
                  </span>
                </div>
                <h4
                  style={{
                    marginLeft: "28%",
                    fontSize: "18px",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: "600",
                    marginBottom: "-2%",
                  }}
                >
                  Convenciones
                </h4>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-5%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/riosPrincipales.svg"
                      alt=""
                      style={{
                        width: "50px",
                        height: "6px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                    }}
                  >
                    Red hidríca
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "-2%",
                    marginBottom: "-5%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/redVial.svg"
                      alt=""
                      style={{ width: "50px", height: "20px" }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  >
                    vías
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "-2%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/zonasUrbanas.svg"
                      alt=""
                      style={{
                        width: "34px",
                        height: "15px",
                        objectFit: "cover",
                        objectPosition: "center",
                        marginLeft: "2px",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                    }}
                  >
                    Centros poblados
                  </span>
                </div>

                <div className="margen2"></div>
              </div>
            )}

            {/*Capas Modelo territorial de villa rica*/}
            {mapName === "MVillaRica" && (
              <div
                className="scroll-container"
                style={{
                  marginLeft: "15%",
                  paddingTop: "7vh",
                  paddingBottom: "7vh",
                  display: "flex",
                  flexDirection: "column",
                  height: "86vh",
                  overflow: "scroll",
                }}
              >
                <div className="margen"></div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-5%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "4%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src=""
                      alt="Río Cauca"
                      style={{
                        width: "68px",
                        height: "45px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Cabeceras municipales
                  </span>
                </div>

                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-5%",
                    marginTop: "-2%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "4%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/riosPrincipales.svg"
                      alt=""
                      style={{
                        width: "26px",
                        height: "28px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Cuerpos de agua
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-6%",
                    marginTop: "-2%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "4%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/redVial.svg"
                      alt=""
                      style={{
                        width: "24px",
                        height: "20px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                    }}
                  >
                    Red Víal
                  </span>
                </div>
                <h4
                  style={{
                    marginLeft: "26%",
                    fontSize: "18px",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: "600",
                    marginBottom: "2%",
                  }}
                >
                  Lo estructural
                </h4>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-5%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "-13.5%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/menuCapasMoVillaRica/fincaTradicional.svg"
                      alt=""
                      style={{
                        width: "20px",
                        height: "20px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                    }}
                  >
                    Fincas tradicionales, bosques, zonas verdes y policultivos
                  </span>
                </div>
                <h4
                  style={{
                    marginLeft: "27%",
                    fontSize: "18px",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: "600",
                    marginBottom: "2%",
                  }}
                >
                  Lo emblemático o notable{" "}
                </h4>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-2%",
                    marginTop: "-1%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/menuCapasMoVillaRica/lugaresEmblematicos.svg"
                      alt=""
                      style={{
                        width: "20px",
                        height: "20px",
                        objectFit: "cover",
                        objectPosition: "center",
                        marginBottom: "2px",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Lugares emblemáticos
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-6%",
                    marginTop: "-5%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/menuCapasMoVillaRica/panamericana.svg"
                      alt=""
                      style={{
                        width: "25px",
                        height: "20px",
                        objectFit: "cover",
                        objectPosition: "center",
                        marginBottom: "4px",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                    }}
                  >
                    Vía Panamericana
                  </span>
                </div>
                <h4
                  style={{
                    marginLeft: "28%",
                    fontSize: "18px",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: "600",
                    marginBottom: "2%",
                  }}
                >
                  Lo problemático o conflictivo{" "}
                </h4>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-2%",
                    marginTop: "-2%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/menuCapasMoVillaRica/ingenios.svg"
                      alt=""
                      style={{
                        width: "30px",
                        height: "34px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                    }}
                  >
                    Ingenios
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-2%",
                    marginTop: "-5%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/menuCapasMoVillaRica/haciendas.svg"
                      alt=""
                      style={{
                        width: "80px",
                        height: "40px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                    }}
                  >
                    Haciendas
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-2%",
                    marginTop: "-5%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/menuCapasMoVillaRica/zonaIndustrial.svg"
                      alt=""
                      style={{
                        width: "30px",
                        height: "28px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                    }}
                  >
                    Zona industrial
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-2%",
                    marginTop: "-5%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="/assets/mapasMenuCap2/menuCapasMoVillaRica/canaAzucar.svg"
                      alt=""
                      style={{
                        width: "40px",
                        height: "38px",
                        objectFit: "cover",
                        objectPosition: "center",
                        marginTop: "6px",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                    }}
                  >
                    Caña de azúcar
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-3%",
                    marginTop: "-5%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/menuCapasMoVillaRica/proyectosUrbanizacion.svg"
                      alt=""
                      style={{
                        width: "28px",
                        height: "28px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                    }}
                  >
                    Proyectos de urbanización
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-3%",
                    marginTop: "-3%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "-0.6%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/menuCapasMoVillaRica/lagosMineria.svg"
                      alt=""
                      style={{
                        width: "25px",
                        height: "29px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                    }}
                  >
                    Lagos de minería de arcilla
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-2%",
                    marginTop: "-4%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "1%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/menuCapasMoVillaRica/ganaderia.svg"
                      alt=""
                      style={{
                        width: "38px",
                        height: "28px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                    }}
                  >
                    Ganadería
                  </span>
                </div>
                <h4
                  style={{
                    marginLeft: "27%",
                    fontSize: "18px",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: "600",
                    marginBottom: "4%",
                    marginTop: "3%",
                  }}
                >
                  Lo transformador
                </h4>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-5%",
                    marginTop: "-2%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "-7%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/menuCapasMoVillaRica/casaNiña.svg"
                      alt=""
                      style={{
                        width: "28px",
                        height: "36px",
                        objectFit: "cover",
                        objectPosition: "center",
                        marginRight: "2px",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Asociación cultural casa del niño y la niña
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-5%",
                    marginTop: "-3%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "-5.5%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/menuCapasMoVillaRica/consejoTitulado.svg"
                      alt=""
                      style={{
                        width: "28px",
                        height: "30px",
                        objectFit: "cover",
                        objectPosition: "center",
                        marginRight: "2px",
                        marginBottom: "2px",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                    }}
                  >
                    Consejos comunitarios titulados
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-5%",
                    marginTop: "-3%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/menuCapasMoVillaRica/concejoComunitario.svg"
                      alt=""
                      style={{
                        width: "40px",
                        height: "20px",
                        objectFit: "cover",
                        objectPosition: "center",
                        marginRight: "5px",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                    }}
                  >
                    Consejos Comunitarios
                  </span>
                </div>

                <div className="margen2"></div>
              </div>
            )}

            {/*Modelo territoria de suarez*/}
            {mapName === "MSuarez" && (
              <div
                className="scroll-container"
                style={{
                  marginLeft: "15%",
                  paddingTop: "7vh",
                  paddingBottom: "7vh",
                  display: "flex",
                  flexDirection: "column",
                  height: "86vh",
                  overflow: "scroll",
                }}
              >
                <div className="margen"></div>
                <h4
                  style={{
                    marginLeft: "26%",
                    fontSize: "18px",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: "600",
                    marginBottom: "2%",
                  }}
                >
                  Lo estructural
                </h4>

                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-5%",
                    marginTop: "-2%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/menuCapasMoSuarez/concejoSuarez.svg"
                      alt="Río Cauca"
                      style={{
                        width: "18px",
                        height: "18px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Consejos Comunitarios
                  </span>
                </div>

                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-7%",
                    marginTop: "-2%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/menuCapasMoVillaRica/fincaTradicional.svg"
                      alt=""
                      style={{ width: "20px", height: "20px" }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Cabecera de Suárez
                  </span>
                </div>
                <h4
                  style={{
                    marginLeft: "26%",
                    fontSize: "18px",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: "600",
                    marginBottom: "2%",
                  }}
                >
                  Lo emblemático o notable
                </h4>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-1%",
                    marginTop: "-2%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%  ",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/menuCapasMoVillaRica/lugaresEmblematicos.svg"
                      alt=""
                      style={{
                        width: "22px",
                        height: "22px",
                        objectFit: "cover",
                        objectPosition: "center",
                        marginBottom: "3px",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                    }}
                  >
                    Lugares emblemáticos
                  </span>
                </div>
                <h4
                  style={{
                    marginLeft: "26%",
                    fontSize: "18px",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: "600",
                    marginTop: "3%",
                    marginBottom: "3%",
                  }}
                >
                  Lo problemático o conflictivo
                </h4>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-2%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "1%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/menuCapasMoVillaRica/haciendas.svg"
                      alt=""
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Minería
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-2%",
                    marginTop: "-4%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "1.9%",
                      marginRight: "6%",
                      width: "50px",
                      height: "50px", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/menuCapasMoSuarez/coca.svg"
                      alt=""
                      style={{ width: "50px", height: "40px" }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "-5px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                    }}
                  >
                    Cultivos de Coca (ha)
                  </span>
                </div>
                <h4
                  style={{
                    marginLeft: "26%",
                    fontSize: "18px",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: "600",
                    marginBottom: "4%",
                    marginTop: "1%",
                  }}
                >
                  Lo transformador
                </h4>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-4%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "-8%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/menuCapasMoSuarez/zonaInfluencia.svg"
                      alt=""
                      style={{
                        width: "29px",
                        height: "29px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Área de influencia de Consejos Comunitarios
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-6.5%",
                    marginTop: "-3%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/menuCapasMoSuarez/trayectorias.svg"
                      alt=""
                      style={{
                        width: "29px",
                        height: "25px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                    }}
                  >
                    Trayectorias de paz
                  </span>
                </div>
                <h4
                  style={{
                    marginLeft: "26%",
                    fontSize: "18px",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: "600",
                    marginBottom: "2%",
                  }}
                >
                  Convenciones
                </h4>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-5%",
                    marginTop: "-2%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/riosPrincipales.svg"
                      alt=""
                      style={{
                        width: "50px",
                        height: "10px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                    }}
                  >
                    Red hidríca
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-5%",
                    marginTop: "-2%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/redVial.svg"
                      alt=""
                      style={{ width: "60px", height: "20px" }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "18px",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      objectFit: "cover",
                      objectPosition: "center",
                      marginTop: "4px",
                    }}
                  >
                    vías
                  </span>
                </div>

                <div className="margen2"></div>
              </div>
            )}

            {mapName === "humedalesCap3" && (
              <div
                className="scroll-container"
                style={{
                  paddingTop: "7vh",
                  paddingBottom: "7vh",
                  paddingLeft: "4vw",
                  paddingRight: "1vw",
                  height: "86vh",
                  overflow: "scroll",
                }}
              >
                <div
                  style={{
                    marginLeft: "3.5%",
                  }}
                >
                  {layers.map((layer) => (
                    <div key={layer.id} className="layer-item">
                      <EyeIcon
                        isHidden={layerVisibility[layer.id]}
                        onClick={() => toggleLayerVisibility(layer.id)}
                        style={{
                          margin: "0",
                          cursor: "pointer",
                          width: "1.5vw",
                          height: "1.5vw",
                        }}
                      />
                      <h4
                        style={{
                          margin: "0%",
                          marginLeft: "5%",
                          marginTop: "0.4vw",
                          fontSize: "1.04vw",
                          fontFamily: "Noto Sans, sans-serif",
                          fontWeight: "600",
                        }}
                      >
                        1970
                      </h4>
                    </div>
                  ))}{" "}
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "2%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "-24%",
                      marginBottom: "-24%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/hum.svg"
                      alt="Río Cauca"
                      style={{
                        width: "70%",
                        height: "40%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Río Cauca
                  </span>
                </div>
                <h4
                  style={{
                    marginLeft: "27%",
                    fontSize: "1.04vw",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: "600",
                    marginBottom: "-3%",
                    marginTop: "3%",
                  }}
                >
                  2022
                </h4>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "2%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "4%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/rioCauca.svg"
                      alt="Río Cauca"
                      style={{
                        width: "70%",
                        height: "70%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginBottom: "-5px",
                    }}
                  >
                    Río Cauca
                  </span>
                </div>

                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "-4%",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/riosPrincipales.svg"
                      alt=""
                      style={{
                        width: "28px",
                        height: "20px",
                        objectFit: "cover",
                        objectPosition: "center",
                        paddingRight: "3px",
                        paddingTop: "2.8px",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Ríos principales
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "-6%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/represas.svg"
                      alt=""
                      style={{
                        width: "20px",
                        height: "20px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                    }}
                  >
                    Represas
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "-5%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/humedal.svg"
                      alt=""
                      style={{
                        width: "22px",
                        height: "10px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                    }}
                  >
                    Humedales
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "-5%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/zonasUrbana.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "15px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Zonas urbanas
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "-5%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/diques.svg"
                      alt=""
                      style={{
                        width: "25px",
                        height: "2px",
                        marginTop: "4px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                    }}
                  >
                    Diques y bordas
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "-5%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "5%",
                      marginRight: "3%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/curvasNivel.svg"
                      alt=""
                      style={{
                        width: "28px",
                        height: "2px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "18px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                    }}
                  >
                    Curvas de nivel
                  </span>
                </div>
              </div>
            )}

            {mapName === "nosEncharcaronElRio" && (
              <div
                className="scroll-container"
                style={{
                  marginLeft: "6vw",
                  marginTop: "7vh",
                  marginBottom: "7vh",
                  display: "flex",
                  flexDirection: "column",
                  height: "86vh",
                  overflow: "scroll",
                }}
              >
                {layers.map((layer) => (
                  <div key={layer.id} className="layer-item">
                    <EyeIcon
                      isHidden={layerVisibility[layer.id]}
                      onClick={() => toggleLayerVisibility(layer.id)}
                      style={{
                        margin: "0",
                        marginLeft: "-10.5vw",
                        marginTop: "-0.2vw",
                        cursor: "pointer",
                        width: "1.5vw",
                        height: "1.5vw",
                      }}
                    />

                    <h4
                      style={{
                        marginTop: "0%",
                        marginLeft: "7%",
                        fontSize: "1.04vw",
                        fontFamily: "Noto Sans, sans-serif",
                        fontWeight: "600",
                        marginBottom: "-2%",
                      }}
                    >
                      1970
                    </h4>
                  </div>
                ))}{" "}
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "-2%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "4%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/hum.svg"
                      alt="Río Cauca"
                      style={{
                        width: "50%",
                        height: "50%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginBottom: "-5px",
                    }}
                  >
                    Construcciones
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "-4%",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/hum.svg"
                      alt=""
                      style={{
                        width: "22px",
                        height: "2px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Vías
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "-6%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/riosPrincipales.svg"
                      alt=""
                      style={{
                        width: "32px",
                        height: "6px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                    }}
                  >
                    Quebradas
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "-6%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "5%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/rioCauca.svg"
                      alt=""
                      style={{
                        width: "24px",
                        height: "6px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                    }}
                  >
                    Río Cauca
                  </span>
                </div>
                <h4
                  style={{
                    marginTop: "3%",
                    marginLeft: "28%",
                    fontSize: "1.04vw",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: "600",
                    marginBottom: "-2%",
                  }}
                >
                  2022
                </h4>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "2%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "4%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/construccion.svg"
                      alt="Río Cauca"
                      style={{
                        width: "70%",
                        height: "70%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginBottom: "-5px",
                    }}
                  >
                    Construcciones
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "-4%",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/represas.svg"
                      alt=""
                      style={{
                        width: "14px",
                        height: "28px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Salvajina
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "-6%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3%",
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/riosPrincipales.svg"
                      alt=""
                      style={{
                        width: "32px",
                        height: "6px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "4px",
                    }}
                  >
                    Red hídrica
                  </span>
                </div>
              </div>
            )}
            {mapName === "caliDeseca" && (
              <div
                className="scroll-container"
                style={{
                  marginLeft: "15%",
                  marginTop: "7vh",
                  marginBottom: "7vh",
                  display: "flex",
                  flexDirection: "column",
                  height: "86vh",
                  overflow: "scroll",
                }}
              >
                <h4
                  style={{
                    marginLeft: "26%",
                    fontSize: "1vw",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: "600",
                    marginBottom: "3%",
                  }}
                >
                  1937
                </h4>
                {layers.map((layer) => (
                  <div key={layer.id} className="layer-item">
                    <EyeIcon
                      isHidden={layerVisibility[layer.id]}
                      onClick={() => toggleLayerVisibility(layer.id)}
                      style={{
                        margin: "0",
                        marginLeft: "-0.5vw",
                        marginTop: "-0.2vw",
                        cursor: "pointer",
                        width: "1.5vw",
                        height: "1.5vw",
                      }}
                    />

                    <div
                      style={{
                        marginLeft: "0%",
                        marginRight: "0.5vw",
                        width: "25px",
                        height: "25px", // igual ancho y alto para que el círculo sea perfecto
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(2px)",
                        backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                        borderRadius: "50%", // hace el div circular
                        overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                      }}
                    >
                      <img
                        src={layer.icono}
                        alt=""
                        style={{
                          width: "50%",
                          height: "50%",
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        marginLeft: "0",
                        fontSize: "1vw",
                        fontFamily: "Noto Sans, sans-serif",
                        fontWeight: "300",
                      }}
                    >
                      {layer.texto}
                    </span>
                  </div>
                ))}{" "}
                <h4
                  style={{
                    marginLeft: "26%",
                    fontSize: "1vw",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: "600",
                    marginBottom: "-3%",
                  }}
                >
                  2022
                </h4>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "2%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "1vw",
                      marginLeft: "13%",
                      marginRight: "0%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/represas.svg"
                      alt="Río Cauca"
                      style={{
                        width: "50%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginBottom: "-5px",
                    }}
                  >
                    Cuerpos de agua
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "-4%",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "13%",
                      marginRight: "0%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/construccion.svg"
                      alt=""
                      style={{
                        width: "50%",
                        height: "50%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Área urbana
                  </span>
                </div>
              </div>
            )}
            {mapName === "monocultivo" && (
              <div
                className="scroll-container"
                style={{
                  marginLeft: "15%",
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "7vh",
                  marginBottom: "7vh",
                  height: "86vh",
                  overflow: "scroll",
                }}
              >
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "4px 8px",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/riosPrincipales.svg"
                      alt=""
                      style={{
                        width: "38px",
                        height: "15px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Ríos principales
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "4px 8px",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/riosTributarios.svg"
                      alt=""
                      style={{
                        width: "40px",
                        height: "10px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Ríos tributarios
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "4px 8px",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/represas.svg"
                      alt=""
                      style={{
                        width: "40px",
                        height: "19px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Represas
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "4px 8px",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/zonaUrbana.svg"
                      alt=""
                      style={{
                        width: "14px",
                        height: "14px",
                        objectFit: "cover",
                        objectPosition: "center",
                        marginLeft: "1px",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Zonas urbanas
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "4px 8px",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/redVial.svg"
                      alt=""
                      style={{
                        width: "22px",
                        height: "30px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Red víal
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "4px 8px",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/fincaTra.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "1vw",
                    }}
                  >
                    Fincas tradicionales y cultivos diversos.
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-5%",
                    padding: "4px 8px",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/zonaVerde.svg"
                      alt="Represas"
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                        marginTop: "2px",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Bosques
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-18%",
                    padding: "4px 8px",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "5%",
                      marginRight: "6%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.3)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/cañaAzucar.svg"
                      alt="Represas"
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "16px",
                    }}
                  >
                    Monocultivos (caña de azúcar)
                  </span>
                </div>
              </div>
            )}
            {mapName === "arcilla" && (
              <div
                className="scroll-container"
                style={{
                  marginLeft: "15%",
                  marginTop: "7vh",
                  marginBottom: "7vh",
                  display: "flex",
                  flexDirection: "column",
                  height: "86vh",
                  overflow: "scroll",
                }}
              >
                <h4
                  style={{
                    marginLeft: "26%",
                    fontSize: "1.3vw",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: "600",
                    marginBottom: "3%",
                  }}
                >
                  Lagos de mineria de arcillas{" "}
                </h4>
                {layers.map((layer) => (
                  <div key={layer.id} className="layer-item">
                    <EyeIcon
                      isHidden={layerVisibility[layer.id]}
                      onClick={() => toggleLayerVisibility(layer.id)}
                      style={{
                        margin: "0",
                        marginLeft: "-0.5vw",
                        marginTop: "-0.2vw",
                        cursor: "pointer",
                        width: "1.5vw",
                        height: "1.5vw",
                      }}
                    />

                    <div
                      style={{
                        marginLeft: "0%",
                        marginRight: "0.5vw",
                        width: "25px",
                        height: "25px", // igual ancho y alto para que el círculo sea perfecto
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(2px)",
                        backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                        borderRadius: "50%", // hace el div circular
                        overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                      }}
                    >
                      <img
                        src={layer.icono}
                        alt=""
                        style={{
                          width: "50%",
                          height: "50%",
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        marginLeft: "0",
                        fontSize: "1.2vw",
                        fontFamily: "Noto Sans, sans-serif",
                        fontWeight: "300",
                      }}
                    >
                      {layer.texto}
                    </span>
                  </div>
                ))}{" "}
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "-7%",
                  }}
                >
                  <div
                    style={{
                      marginTop: "1vw",
                      marginLeft: "13%",
                      marginRight: "0%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/fincaTradi.svg"
                      alt="Río Cauca"
                      style={{
                        width: "50%",
                        height: "50%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.2vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginBottom: "1px",
                      marginTop: "20%",
                    }}
                  >
                    Fincas tradicionales, cultivos diversos y bosques.
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "-4%",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "13%",
                      marginRight: "0%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/tituloMinero.svg"
                      alt=""
                      style={{
                        width: "50%",
                        height: "50%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.2vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Título minero vigente
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "-4%",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "13%",
                      marginRight: "0%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/veredas.svg"
                      alt=""
                      style={{
                        width: "60%",
                        height: "60%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.2vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Veredas
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "-4%",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "13%",
                      marginRight: "0%",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/quebradas.svg"
                      alt=""
                      style={{
                        width: "100%",
                        height: "15%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "1.2vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Ríos y quebradas
                  </span>
                </div>
              </div>
            )}

            {/*Capas cap 4 */}
            {mapName === "introduccionCap4" && (
              <div
                className="scroll-container"
                style={{
                  marginLeft: "18%",
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "7vh",
                  marginBottom: "7vh",
                  height: "86vh",
                  overflow: "scroll",
                }}
              >
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "3%",
                    marginTop: "2%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/monocultivoAzucar.svg"
                      alt=""
                      style={{
                        width: "32px",
                        height: "12px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Monocultivo de caña de azúcar
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "3%",
                    marginTop: "1%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/areaUrbana.svg"
                      alt=""
                      style={{
                        width: "30px",
                        height: "12px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Áreas urbanas
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "3%",
                    marginTop: "1%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/fincaTradicional.svg"
                      alt=""
                      style={{
                        width: "24px",
                        height: "12px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Fincas tradicionales, cultivos diversos y bosques
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "3%",
                    marginTop: "1%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/mapasMenuCap2/riosPrincipales.svg"
                      alt=""
                      style={{
                        width: "24px",
                        height: "14px",
                        objectFit: "cover",
                        objectPosition: "center",
                        marginLeft: "1px",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Cuerpos de agua
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "3%",
                    marginTop: "1%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/curvaNivel.svg"
                      alt=""
                      style={{
                        width: "32px",
                        height: "2px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Curvas de nivel
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-3%",
                    marginTop: "1%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/palenke.svg"
                      alt=""
                      style={{
                        width: "25px",
                        height: "25px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Fincas tradicionales Agropalenke soberanía de vida
                  </span>
                </div>
              </div>
            )}
            {mapName === "asoyoge" && (
              <div
                className="scroll-container"
                style={{
                  marginLeft: "18%",
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "7vh",
                  marginBottom: "7vh",
                  height: "86vh",
                  overflow: "scroll",
                }}
              >
                <h4
                  style={{
                    marginLeft: "18%",
                    fontSize: "1.3vw",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: "600",
                    marginTop: "3%",
                  }}
                >
                  Zonificación{" "}
                </h4>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-3%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/viviendaEspaciosAsociados.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    1.Vivienda y espacios asociados
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    marginTop: "5%",
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "2%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/transformacionProductiva.svg"
                      alt="Represas"
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                        marginTop: "2px",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    5.Transformación productiva
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-14%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.3)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/delimitacion.svg"
                      alt="Represas"
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Delimitación
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "16%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.3)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/trocha.svg"
                      alt="Represas"
                      style={{
                        width: "35px",
                        height: "4px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Trocha
                  </span>
                </div>
              </div>
            )}
            {mapName === "losBajios" && (
              <div
                className="scroll-container"
                style={{
                  marginLeft: "18%",
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "7vh",
                  marginBottom: "7vh",
                  height: "86vh",
                  overflow: "scroll",
                }}
              >
                <h4
                  style={{
                    marginLeft: "18%",
                    fontSize: "1.3vw",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: "600",
                    marginBottom: "6%",
                  }}
                >
                  Zonificación{" "}
                </h4>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/aljibe.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Cuerpos de agua - Aljibe
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/huertas.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Huerta
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/construccion.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Construcción
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/cultivoDiverso.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Cultivos diversos
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/delimitacion.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Delimitación
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/trocha.svg"
                      alt=""
                      style={{
                        width: "25px",
                        height: "2px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Trocha
                  </span>
                </div>
              </div>
            )}
            {mapName === "elPaso" && (
              <div
                className="scroll-container"
                style={{
                  marginLeft: "18%",
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "7vh",
                  marginBottom: "7vh",
                  height: "86vh",
                  overflow: "scroll",
                }}
              >
                <h4
                  style={{
                    marginLeft: "18%",
                    fontSize: "1.3vw",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: "600",
                    marginBottom: "5%",
                  }}
                >
                  Zonificación{" "}
                </h4>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "3%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/charcoBaño.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Charco de baño
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "3%",
                    marginTop: "-1%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/zocabonOro.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Zocavones de oro
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "3%",
                    marginTop: "1%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/entradaPredio.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "-6px",
                    }}
                  >
                    Entradas al predio
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "3%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/extraccionOro.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Extracción de oro Aluvión
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/bosqueAreaExtracion.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    6.bosques y áreas de conservación
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-3%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/zonaTransicion.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Zonas en transición
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "8%",
                    marginBottom: "3%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/pastoreo.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    8.Pastoreo
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-3%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/mineria.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Mineria
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "6%",
                    marginBottom: "-33%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/cuerposAgua.svg"
                      alt=""
                      style={{
                        width: "25px",
                        height: "2px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Cuerpos de agua
                  </span>
                </div>
              </div>
            )}
            {mapName === "lasMercedes" && (
              <div
                className="scroll-container"
                style={{
                  marginLeft: "18%",
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "7vh",
                  marginBottom: "7vh",
                  height: "86vh",
                  overflow: "scroll",
                }}
              >
                <h4
                  style={{
                    marginLeft: "18%",
                    fontSize: "1.3vw",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: "600",
                  }}
                >
                  Zonificación{" "}
                </h4>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "3%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "Start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/entradaPredio.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "-3%",
                    }}
                  >
                    1.Entrada a la finca
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "5%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/estanque.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Estanque para peces que se dañó
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "3%",
                    alignSelf: "start",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/zonaDesecho.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Zonas con desechos de plastico y botellas de alcohol
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "3%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/viviendaEspaciosAsociados.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Vivienda y espacios asociados
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-20%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/criaAnimales.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Cría de animales
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "24%",
                    marginBottom: "3%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/zonaTransicion.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      marginTop: "-2%",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Zonas en transición
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-16%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/cultivoDiverso2.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      marginTop: "-2%",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Cultivos diversos
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "20%",
                    marginBottom: "8%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/productivasEspeciales.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      marginTop: "-2%",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Productivas especiales
                  </span>
                </div>

                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "-4%",
                    marginBottom: "4%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/delimitacion.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Finca Las Mercedes: límite
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "-3%",
                    marginBottom: "4%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/trocha.svg"
                      alt=""
                      style={{
                        width: "25px",
                        height: "2px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginTop: "-1%",
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Trocha
                  </span>
                </div>
              </div>
            )}
            {mapName === "laVirginia" && (
              <div
                className="scroll-container"
                style={{
                  marginLeft: "18%",
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "7vh",
                  marginBottom: "7vh",
                  height: "86vh",
                  overflow: "scroll",
                }}
              >
                <h4
                  style={{
                    marginLeft: "18%",
                    fontSize: "1.3vw",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: "600",
                    marginBottom: "1%",
                  }}
                >
                  Zonificación{" "}
                </h4>
                <h3
                  style={{
                    marginLeft: "18%",
                    fontSize: "1.3vw",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: "600",
                    marginBottom: "8%",
                  }}
                >
                  1.Vestigios de Casa
                </h3>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "3%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/entradaPredio.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Entrada finca
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/sistemaRiego.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Cuerpo de agua - sistema de riego
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/burilico.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Burilico
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/semillero.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Semillero
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/cultivoDiverso.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Cultivos diversos
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/cultivoDiverso2.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Productivos especiales
                  </span>
                </div>

                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/delimitacion.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Delimitación
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/trocha.svg"
                      alt=""
                      style={{
                        width: "25px",
                        height: "2px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Vía
                  </span>
                </div>
              </div>
            )}
            {mapName === "centroAgropecuario" && (
              <div
                className="scroll-container"
                style={{
                  marginLeft: "18%",
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "7vh",
                  marginBottom: "7vh",
                  height: "86vh",
                  overflow: "scroll",
                }}
              >
                <h4
                  style={{
                    marginLeft: "18%",
                    fontSize: "1.3vw",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: "600",
                  }}
                >
                  Zonificación{" "}
                </h4>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/aljibe2.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Cuerpos de agua - Aljibe
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/nidoHormiga.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Nido de hormiga arriera
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alingSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/viviendaEspaciosAsociados.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Vivienda y espacios asociados
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alingSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/criaAnimales.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Cría de animales
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/bosqueAreaExtracion.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Bosques y áreas de conservación
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alingSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/zonaTransicion.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Zonas de transición
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alingSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/cultivoDiverso.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Cultivos diversos
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alingSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/productivasEspeciales.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Productivas especiales
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alingSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/delimitacion.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Delimitación
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alingSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/trocha.svg"
                      alt=""
                      style={{
                        width: "25px",
                        height: "2px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Trocha
                  </span>
                </div>
              </div>
            )}
            {mapName === "elBuhido" && (
              <div
                className="scroll-container"
                style={{
                  marginLeft: "18%",
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "7vh",
                  marginBottom: "7vh",
                  height: "86vh",
                  overflow: "scroll",
                }}
              >
                <h4
                  style={{
                    marginLeft: "18%",
                    fontSize: "1.3vw",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: "600",
                    marginBottom: "4%",
                  }}
                >
                  Zonificación{" "}
                </h4>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alingSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/disposicionResiduos.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginTop: "6%",
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    2.Disposición de residuos
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "3%",
                    marginTop: "-1%",
                  }}
                >
                  <div
                    style={{
                      alingSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/entradaPredio.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    1.Entrada
                  </span>
                </div>
                <h4
                  style={{
                    marginLeft: "18%",
                    fontSize: "1.3vw",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: "600",
                    marginBottom: "1%",
                    marginTop: "4%",
                  }}
                >
                  Zonificación{" "}
                </h4>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "4%",
                    marginTop: "1%",
                  }}
                >
                  <div
                    style={{
                      alingSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/viviendaEspaciosAsociados.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                      marginTop: "12px",
                    }}
                  >
                    1.Vivienda y espacios asociados
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "4%",
                  }}
                >
                  <div
                    style={{
                      alingSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/criaAnimales.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    4.Cría de animales
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-3%",
                    marginTop: "1%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/bosqueAreaExtracion.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    6.bosques y áreas de conservación
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "8%",
                    marginBottom: "-3%",
                  }}
                >
                  <div
                    style={{
                      alingSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/cultivoDiverso.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    9.Cultivos diversos
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "8%",
                    marginBottom: "-2%",
                  }}
                >
                  <div
                    style={{
                      alingSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/zonaTransicion.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    7.Zonas en transición
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "8%",
                    marginBottom: "-4%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/productivasEspeciales.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    10.Productivas especiales
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "8%",
                    marginBottom: "-3%",
                  }}
                >
                  <div
                    style={{
                      alingSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/delimitacion.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Delimitación
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "8%",
                    marginBottom: "-12%",
                  }}
                >
                  <div
                    style={{
                      alingSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/trocha.svg"
                      alt=""
                      style={{
                        width: "25px",
                        height: "2px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Trocha
                  </span>
                </div>
              </div>
            )}
            {mapName === "bosqueComestible" && (
              <div
                className="scroll-container"
                style={{
                  marginLeft: "18%",
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "7vh",
                  marginBottom: "7vh",
                  height: "86vh",
                  overflow: "scroll",
                }}
              >
                <h4
                  style={{
                    marginLeft: "18%",
                    fontSize: "1.3vw",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: "600",
                  }}
                >
                  Zonificación{" "}
                </h4>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/botaderoColchon.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Botadero de colchones y escombros
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4//botaderoEscombro.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Botadero de escombros y basura
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/compuertaVertedero.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Compuerta de vertimiento de aguas residuales
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alingSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/zonaBasura.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Quema de basuras
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alingSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/cuerpoAgua2.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Cuerpo de agua
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alingSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/zonaColmatada.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Zona colmatada
                  </span>
                </div>
              </div>
            )}
            {mapName === "problematicas" && (
                  <div
                    className="scroll-container"
                    style={{
                      marginLeft: "18%",
                      display: "flex",
                      flexDirection: "column",
                      marginTop: "7vh",
                      marginBottom: "7vh",
                      height: "86vh",
                      overflow: "scroll",
                    }}
                  >
                    <h4
                      style={{
                        marginLeft: "18%",
                        fontSize: "1.3vw",
                        fontFamily: "Noto Sans, sans-serif",
                        fontWeight: "600",
                        marginBottom: "6%",
                      }}
                    >
                      Problematicas{" "}
                    </h4>
                    <div
                      className="layer-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          alignSelf: "start",
                          width: "25px",
                          height: "25px", // igual ancho y alto para que el círculo sea perfecto
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backdropFilter: "blur(2px)",
                          backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                          borderRadius: "50%", // hace el div circular
                          overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                        }}
                      >
                        <img
                          src="assets/iconsCap4/areaUrbanaNueva.svg"
                          alt=""
                          style={{
                            width: "20px",
                            height: "20px",
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          marginLeft: "10px",
                          fontSize: "1.04vw",
                          fontFamily: "Noto Sans, sans-serif",
                          fontWeight: "300",
                        }}
                      >
                        Áreas urbanas nuevas
                      </span>
                    </div>
                    <div
                      className="layer-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          alignSelf: "start",
                          width: "25px",
                          height: "25px", // igual ancho y alto para que el círculo sea perfecto
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backdropFilter: "blur(2px)",
                          backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                          borderRadius: "50%", // hace el div circular
                          overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                        }}
                      >
                        <img
                          src="assets/iconsCap4/disposicionResiduos.svg"
                          alt=""
                          style={{
                            width: "25px",
                            height: "25px",
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          marginLeft: "10px",
                          fontSize: "1.04vw",
                          fontFamily: "Noto Sans, sans-serif",
                          fontWeight: "300",
                        }}
                      >
                        Disposición de residuos y escombros
                      </span>
                    </div>
                    <div
                      className="layer-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          alignSelf: "start",
                          width: "25px",
                          height: "25px", // igual ancho y alto para que el círculo sea perfecto
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backdropFilter: "blur(2px)",
                          backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                          borderRadius: "50%", // hace el div circular
                          overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                        }}
                      >
                        <img
                          src="assets/iconsCap4/ocupacionFranjas.svg"
                          alt=""
                          style={{
                            width: "20px",
                            height: "20px",
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          marginLeft: "10px",
                          fontSize: "1.04vw",
                          fontFamily: "Noto Sans, sans-serif",
                          fontWeight: "300",
                          marginTop: "-10px",
                        }}
                      >
                        Ocupación de las franjas de protección del humedal
                      </span>
                    </div>
                    <div
                      className="layer-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          alignSelf: "start",
                          width: "25px",
                          height: "25px", // igual ancho y alto para que el círculo sea perfecto
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backdropFilter: "blur(2px)",
                          backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                          borderRadius: "50%", // hace el div circular
                          overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                        }}
                      >
                        <img
                          src="assets/iconsCap4/palenke.svg"
                          alt=""
                          style={{
                            width: "15px",
                            height: "15px",
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          marginLeft: "10px",
                          fontSize: "1.04vw",
                          fontFamily: "Noto Sans, sans-serif",
                          fontWeight: "300",
                        }}
                      >
                        Verimiento de aguas residuales
                      </span>
                    </div>
                    <h4
                      style={{
                        
                        marginTop: "2vh",
                        marginBottom: "2vh",
                        marginLeft: "18%",
                        fontSize: "1.3vw",
                        fontFamily: "Noto Sans, sans-serif",
                        fontWeight: "600",
                      }}
                    >
                      Agua{" "}
                    </h4>
                    <div
                      className="layer-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          alignSelf: "start",
                          width: "25px",
                          height: "25px", // igual ancho y alto para que el círculo sea perfecto
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backdropFilter: "blur(2px)",
                          backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                          borderRadius: "50%", // hace el div circular
                          overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                        }}
                      >
                        <img
                          src="assets/iconsCap4/Canales.svg"
                          alt=""
                          style={{
                            width: "15px",
                            height: "1px",
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          marginLeft: "10px",
                          fontSize: "1.04vw",
                          fontFamily: "Noto Sans, sans-serif",
                          fontWeight: "300",
                        }}
                      >
                        Canales
                      </span>
                    </div>
                    <div
                      className="layer-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          alignSelf: "start",
                          width: "25px",
                          height: "25px", // igual ancho y alto para que el círculo sea perfecto
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backdropFilter: "blur(2px)",
                          backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                          borderRadius: "50%", // hace el div circular
                          overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                        }}
                      >
                        <img
                          src="assets/iconsCap4/aljibe.svg"
                          alt=""
                          style={{
                            width: "18px",
                            height: "18px",
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          marginLeft: "10px",
                          fontSize: "1.04vw",
                          fontFamily: "Noto Sans, sans-serif",
                          fontWeight: "300",
                        }}
                      >
                        Humedales y actualidad
                      </span>
                    </div>
                    <div
                      className="layer-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          alignSelf: "start",
                          width: "25px",
                          height: "25px", // igual ancho y alto para que el círculo sea perfecto
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backdropFilter: "blur(2px)",
                          backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                          borderRadius: "50%", // hace el div circular
                          overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                        }}
                      >
                        <img
                          src="assets/iconsCap4/humedalesPot.svg"
                          alt=""
                          style={{
                            width: "20px",
                            height: "20px",
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          marginLeft: "10px",
                          fontSize: "1.04vw",
                          fontFamily: "Noto Sans, sans-serif",
                          fontWeight: "300",
                        }}
                      >
                        Humedales  POT 2000-2014
                      </span>
                    </div>
                    <h4
                      style={{
                        marginLeft: "18%",
                        
                        marginTop: "2vh",
                        marginBottom: "2vh",
                        fontSize: "1.3vw",
                        fontFamily: "Noto Sans, sans-serif",
                        fontWeight: "600",
                      }}
                    >
                      Elementos{" "}
                    </h4>
                     <div
                      className="layer-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          alignSelf: "start",
                          width: "25px",
                          height: "25px", // igual ancho y alto para que el círculo sea perfecto
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backdropFilter: "blur(2px)",
                          backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                          borderRadius: "50%", // hace el div circular
                          overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                        }}
                      >
                        <img
                          src="assets/iconsCap4/areaUrbana.svg"
                          alt=""
                          style={{
                            width: "18px",
                            height: "18px",
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          marginLeft: "10px",
                          fontSize: "1.04vw",
                          fontFamily: "Noto Sans, sans-serif",
                          fontWeight: "300",
                        }}
                      >
                        Área urbana 2022
                      </span>
                    </div>
                    <div
                      className="layer-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          alignSelf: "start",
                          width: "25px",
                          height: "25px", // igual ancho y alto para que el círculo sea perfecto
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backdropFilter: "blur(2px)",
                          backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                          borderRadius: "50%", // hace el div circular
                          overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                        }}
                      >
                        <img
                          src="assets/iconsCap4/zonaVerdes2014.svg"
                          alt=""
                          style={{
                            width: "20px",
                            height: "20px",
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          marginLeft: "10px",
                          fontSize: "1.04vw",
                          fontFamily: "Noto Sans, sans-serif",
                          fontWeight: "300",
                        }}
                      >
                        Zonas verdes 2014
                      </span>
                    </div>
                  </div>
                )}
            {mapName === "laCaicedo" && (
              <div
                className="scroll-container"
                style={{
                  marginLeft: "18%",
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "7vh",
                  marginBottom: "7vh",
                  height: "86vh",
                  overflow: "scroll",
                }}
              >
                <h4
                  style={{
                    marginLeft: "18%",
                    fontSize: "1.3vw",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: "600",
                    marginBottom: "8%",
                  }}
                >
                  Zonificación{" "}
                </h4>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "3%",
                    marginTop: "-4%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/dispocisionResiduos2.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    2.Disposición de residuos
                  </span>
                </div>

                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "3%",
                    marginTop: "-4%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/entradaPredio.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    1.Entrada finca
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/viviendaEspaciosAsociados.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    1.Vivienda y espacios asociados
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "3%",
                    marginTop: "4%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/criaAnimales.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    4.Cría de animales
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "3%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/transformacionProductiva.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    5.Transformación productiva
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-18%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/zonaTransicion.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    7.Zonas en transición
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "22%",
                    marginBottom: "6%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/cultivoDiverso.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    9.Cultivos diversos
                  </span>
                </div>

                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "-4%",
                    marginBottom: "8%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/delimitacion.svg"
                      alt=""
                      style={{
                        width: "0.97vw",
                        height: "2.05vh",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Delimitación
                  </span>
                </div>
                <div
                  className="layer-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "-3%",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "start",
                      width: "1.63vw",
                      height: "3.42vh", // igual ancho y alto para que el círculo sea perfecto
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.6)", // blanco con transparencia
                      borderRadius: "50%", // hace el div circular
                      overflow: "hidden", // asegura que la imagen no sobresalga del círculo
                    }}
                  >
                    <img
                      src="assets/iconsCap4/trocha.svg"
                      alt=""
                      style={{
                        width: "25px",
                        height: "2px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginTop: "-1%",
                      marginLeft: "10px",
                      fontSize: "1.04vw",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: "300",
                    }}
                  >
                    Vía
                  </span>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </>
  );
};

LayerMenu.propTypes = {
  map: PropTypes.object.isRequired,
  layers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      texto: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default LayerMenu;
