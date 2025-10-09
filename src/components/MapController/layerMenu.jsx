import  { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "../../styles/layerControl.css";
import { RxEyeOpen, RxEyeClosed } from "react-icons/rx";


import menuAgregados from "../../../public/assets/img/background/menuAgregados.webp";
import iconoCapas1 from "../../../public/assets/svg/todos/Hud/icons/icon-line-webp/iconoCapas1.webp";
import lineaCapas from "../../../public/assets/img/background/indice-capas-menu.svg";

const LayerMenu = ({ layers, map, selectedMap }) => {
  const [layerVisibility, setLayerVisibility] = useState(
    layers.reduce((acc, layer) => {
      acc[layer.id] = true;
      return acc;
    }, {})
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
        newVisibility ? "none" : "visible"
      );
      
    } 
  };


  const toggleLayerGroupVisibility = (layersId, visible) => {
    
    layersId.forEach((item)=>{

      if (map && map.getLayer(item)) {
        const itemVisibility =  map.getLayoutProperty(item, 'visibility');
        map.setLayoutProperty(
          item,
          "visibility",
          visible ? visible:"none"
        );
      }

    });

  }

  const getLayerVisibility = (layersId) => {

    var itemVisibility = "none";

      if (map && map.getLayer(layersId)) {
        itemVisibility =  map.getLayoutProperty(layersId, 'visibility');
        
      }

      if (itemVisibility =="visible") {
        return false;
      }else{
        return true;
      }

  }

  // Estados para mostrar el menú con hover en JSX
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const icono = document.querySelector(".layer-menu-wrapper");
    const menu = document.querySelector(".layer-control-container");
    if (isHovered) {
      menu.style.display = "block";
      icono.style.width = "26vw";
      icono.style.left = "74vw";
    } else {
      menu.style.display = "none";
      icono.style.width = "6vw";
      icono.style.left = "94vw";
    }
  }, [isHovered]);

  const [isMenuOpen, setIsMenuOpen] = useState({
    uno: false,
    unoUno: false,
    unoDos: false,
    unoTres: false,
    unoCuatro:false,
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
    unoCuatro:false,
    dos: false,
    dosUno: false,
    dosDos: false,
    dosTres: false,
    tres: false,
  });

  const capasAgrupadas ={
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
    unoCuatro:[
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
    dosUno: [
      "bosqueFragmentado-layer",
      "regeneracionVegetal-layer",
    ],
    dosDos: [
      "agriculturaMixta-layer",
      "areasInundacion-layer",
      "monocultivos-layer",
      "ganaderia-layer",

    ],
    dosTres: [
      "zonaUrbanaIndustrial-layer",
      "aguaSuperficial-layer",

    ],
    tres: [],
  }

  return (
    <>
    <div className="lineaCapas"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
        <img src={lineaCapas} alt="" />
      </div>
    <div
      className="layer-menu-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/*<img className="menuAgregadosImage" src={menuAgregados} alt="" />*/}

      <div className="layer-menu-toggle">
        <img src={iconoCapas1} alt="" />
      </div>


      <div className="layer-control-container fade-in">
        <div id="layer-Control">
          <img
            src="/assets/img/background/menuCapasFinal.webp"
            alt=""
          />

          {selectedMap == 4 && (
            <div style={{ paddingTop: "20px", paddingBottom: "20px" , paddingLeft: "40px"}}>
              <br />
              <div className="subtitle">
                <span>Datos para la interacción <br />con las capas</span>
              </div>

              <div style={{padding: "0px 40px"}}>
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
                {layerVisibility["nubosidad-layer"] ? (
                  <RxEyeClosed
                    style={{
                      marginRight: "10px",
                      cursor: "pointer",
                      width: "3vh",
                      height: "3vh",
                    }}
                    onClick={() => toggleLayerVisibility("nubosidad-layer")}
                  />
                ) : (
                  <RxEyeOpen
                    style={{
                      marginRight: "10px",
                      cursor: "pointer",
                      width: "3vh",
                      height: "3vh",
                    }}
                    onClick={() => toggleLayerVisibility("nubosidad-layer")}
                  />
                )}
                <svg
                  width="31"
                  height="15"
                  viewBox="0 0 31 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="31" height="15" fill="#B1B2AE" />
                </svg>
                <span> <strong>Nubosidad:</strong> <br />Entre 7000 - 2000 msnm </span>
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
                <span> <strong>Glaciares y nivales:</strong> <br />Entre 5364 - 4800 msnm </span>
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
                  <path d="M6.82001 12.9H4V14.9H6.82001V12.9Z" fill="#F59E19" />
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

                <span> <strong>Zonas hidrográficas<br /> del sur del valle
                  alto <br />del río Cauca:</strong> <br />
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
                <span> <strong>Páramos:</strong><br />Entre 4500 - 2700 msnm</span>
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
                <span> <strong>Bosque alto andino:</strong> <br />Entre 4000 - 3000 msnm </span>
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
                <span> <strong>Bosques de niebla:</strong> <br />Entre 3500 - 1500 msnm </span>
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
                <span> <strong>Bosque subandino:</strong><br />Entre 2500 - 1000 msnm</span>
              </div>

              <div className="layer-item">
                {layerVisibility["acuifero2-layer"] ? (
                  <RxEyeClosed
                    style={{
                      marginRight: "10px",
                      cursor: "pointer",
                      width: "3vh",
                      height: "3vh",
                    }}
                    onClick={() => toggleLayerVisibility("acuifero2-layer")}
                  />
                ) : (
                  <RxEyeOpen
                    style={{
                      marginRight: "10px",
                      cursor: "pointer",
                      width: "3vh",
                      height: "3vh",
                    }}
                    onClick={() => toggleLayerVisibility("acuifero2-layer")}
                  />
                )}
                <svg
                  width="31"
                  height="15"
                  viewBox="0 0 31 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="31" height="15" fill="#829D9D" />
                </svg>
                <span> <strong>Acuífero del Cauca.</strong><br /> <strong>Libre a confinado:
                  </strong><br />
                  Entre 2000 - 1700 msnm. <br />Profundidad promedio: <br />100 a 400 M bajo la <br />superficie
                </span>
              </div>

              <div className="layer-item">
                {layerVisibility["acuifero1-layer"] ? (
                  <RxEyeClosed
                    style={{
                      marginRight: "10px",
                      cursor: "pointer",
                      width: "3vh",
                      height: "3vh",
                    }}
                    onClick={() => toggleLayerVisibility("acuifero1-layer")}
                  />
                ) : (
                  <RxEyeOpen
                    style={{
                      marginRight: "10px",
                      cursor: "pointer",
                      width: "3vh",
                      height: "3vh",
                    }}
                    onClick={() => toggleLayerVisibility("acuifero1-layer")}
                  />
                )}
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

                <span><strong>Acuífero del Valle <br />del Cauca. Libre <br />a
                  semiconfinado:</strong><br />
                  Entre 1100 - 900 msnm <br /> Profundidad promedio: <br />400 a 1000 M bajo la
                  superficie.
                </span>
              </div>

              <div className="subtitle">
                <span>
                  Flujos y zonas del Acuífero <br />
                  del Valle del Cauca
                </span>
              </div>

              <div className="layer-item">
                {layerVisibility["zonaDescarga-layer"] ? (
                  <RxEyeClosed
                    style={{
                      marginRight: "10px",
                      cursor: "pointer",
                      width: "3vh",
                      height: "3vh",
                    }}
                    onClick={() => toggleLayerVisibility("zonaDescarga-layer")}
                  />
                ) : (
                  <RxEyeOpen
                    style={{
                      marginRight: "10px",
                      cursor: "pointer",
                      width: "3vh",
                      height: "3vh",
                    }}
                    onClick={() => toggleLayerVisibility("zonaDescarga-layer")}
                  />
                )}
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
                {layerVisibility["zonaEquilibrio-layer"] ? (
                  <RxEyeClosed
                    style={{
                      marginRight: "10px",
                      cursor: "pointer",
                      width: "3vh",
                      height: "3vh",
                    }}
                    onClick={() =>
                      toggleLayerVisibility("zonaEquilibrio-layer")
                    }
                  />
                ) : (
                  <RxEyeOpen
                    style={{
                      marginRight: "10px",
                      cursor: "pointer",
                      width: "3vh",
                      height: "3vh",
                    }}
                    onClick={() =>
                      toggleLayerVisibility("zonaEquilibrio-layer")
                    }
                  />
                )}
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
                {layerVisibility["zonaRecarga-layer"] ? (
                  <RxEyeClosed
                    style={{
                      marginRight: "10px",
                      cursor: "pointer",
                      width: "3vh",
                      height: "3vh",
                    }}
                    onClick={() => toggleLayerVisibility("zonaRecarga-layer")}
                  />
                ) : (
                  <RxEyeOpen
                    style={{
                      marginRight: "10px",
                      cursor: "pointer",
                      width: "3vh",
                      height: "3vh",
                    }}
                    onClick={() => toggleLayerVisibility("zonaRecarga-layer")}
                  />
                )}
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
                {layerVisibility["zonaAcuifero-layer"] ? (
                  <RxEyeClosed
                    style={{
                      marginRight: "10px",
                      cursor: "pointer",
                      width: "3vh",
                      height: "3vh",
                    }}
                    onClick={() => toggleLayerVisibility("zonaAcuifero-layer")}
                  />
                ) : (
                  <RxEyeOpen
                    style={{
                      marginRight: "10px",
                      cursor: "pointer",
                      width: "3vh",
                      height: "3vh",
                    }}
                    onClick={() => toggleLayerVisibility("zonaAcuifero-layer")}
                  />
                )}
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
                  Zona con acuífero potencial libre a semiconfinado sin estudio
                </span>
              </div>

            </div>
          )}

          {selectedMap == 3 && (
            <div style={{ paddingTop: "20px", paddingBottom: "20px" , paddingLeft: "40px"}}>
              <br />
             {/*  <div className="subtitle">
                <span>Datos para la interacción <br />con las capas</span>
              </div>

              <div className="layer-item">
                <svg
                  width="31"
                  height="15"
                  viewBox="0 0 19 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.268 16.05H0L4.634 8.021L9.268 0L13.902 8.021L18.536 16.05H9.268Z"
                    fill="#010000"
                  />
                </svg>

                <span>Lugares representativos</span>
              </div>

              <div className="layer-item">
                <svg
                  width="31"
                  height="15"
                  viewBox="0 0 19 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.52037 16H0.28125L4.90081 7.996L9.52037 0L14.1399 7.996L18.7595 16H9.52037Z"
                    fill="#FC0100"
                  />
                </svg>

                <span>Volcanes</span>
              </div>

              <div className="layer-item">
                <svg
                  width="31"
                  height="15"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.3985 1.52197H1.52246V14.398H14.3985V1.52197Z"
                    fill="#FC0100"
                  />
                  <path
                    d="M14.398 1.52199V14.398H1.52199V1.52199H14.398ZM15.92 0H0V15.92H15.92V0Z"
                    fill="white"
                  />
                </svg>

                <span>Nodos</span>
              </div>

              <div className="layer-item">
                <svg
                  width="31"
                  height="15"
                  viewBox="0 0 40 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.0791 3.88H0.0791016V0H11.1591V2H2.0791V3.88Z"
                    fill="#010000"
                  />
                  <path d="M26.28 0H15V2H26.28V0Z" fill="#010000" />
                  <path
                    d="M39.7598 3.16H37.7598V2H28.7998V0H39.7598V3.16Z"
                    fill="#010000"
                  />
                  <path
                    d="M39.7598 5.67993H37.7598V16.5999H39.7598V5.67993Z"
                    fill="#010000"
                  />
                  <path
                    d="M2.0791 6.76001H0.0791016V18.04H2.0791V6.76001Z"
                    fill="#010000"
                  />
                  <path
                    d="M39.7598 23H28.7998V21H37.7598V19H39.7598V23Z"
                    fill="#010000"
                  />
                  <path d="M12.12 21H0V23H12.12V21Z" fill="#010000" />
                  <path d="M26.2795 21H14.5195V23H26.2795V21Z" fill="#010000" />
                </svg>
                <span>Valle alto de río Cauca</span>
              </div>
              <div className="layer-item">
                <svg
                  width="31"
                  height="15"
                  viewBox="0 0 38 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 4.14001H0V0H13.96V2H2V4.14001Z" fill="#802026" />
                  <path d="M23.8606 0H18.1006V2H23.8606V0Z" fill="#802026" />
                  <path
                    d="M37.8199 6.47998H35.8199V2H26.9199V0H37.8199V6.47998Z"
                    fill="#802026"
                  />
                  <path
                    d="M37.8203 10.0801H35.8203V15.66H37.8203V10.0801Z"
                    fill="#802026"
                  />
                  <path
                    d="M37.8203 22.2399H23.8604V20.2399H35.8203V18.8999H37.8203V22.2399Z"
                    fill="#802026"
                  />
                  <path
                    d="M20.26 20.24H15.04V22.24H20.26V20.24Z"
                    fill="#802026"
                  />
                  <path
                    d="M11.44 22.2401H0V17.1001H2V20.2401H11.44V22.2401Z"
                    fill="#802026"
                  />
                  <path d="M2 8.64014H0V13.5001H2V8.64014Z" fill="#802026" />
                </svg>

                <span>Sur valle alto río Cauca</span>
              </div>*/}

              


              

              <div className="subtitle">
                <span>Ecosistemas y transformaciones</span>
              </div>

              <div className="subtitle-2">
                <div className="espacio-2"></div>

                {/*!isMenuActive.uno ? (
                          <RxEyeClosed
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>{
                              toggleLayerGroupVisibility(capasAgrupadas.uno,"visible");
                              
                              setIsMenuActive({...isMenuActive, uno: !isMenuActive.uno})
                            }
                            }
                          />
                          ) : (
                          <RxEyeOpen
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>{
                              toggleLayerGroupVisibility(capasAgrupadas.uno,"none");
                              
                              setIsMenuActive({...isMenuActive, uno: !isMenuActive.uno})
                            }
                            }
                          />
                        )*/}

                { isMenuOpen.uno ? (
                    


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

                    {!isMenuActive.unoUno ? (
                          <RxEyeClosed
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>{
                              toggleLayerGroupVisibility(capasAgrupadas.unoUno,"visible");
                              
                              setIsMenuActive({...isMenuActive, unoUno: !isMenuActive.unoUno})
                            }
                            }
                          />
                          ) : (
                          <RxEyeOpen
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>{
                              toggleLayerGroupVisibility(capasAgrupadas.unoUno,"none");
                              
                              setIsMenuActive({...isMenuActive, unoUno: !isMenuActive.unoUno})
                            }
                            }
                          />
                        )}

                    <span>1.1. De litoral y aguas poco profundas</span>
                  </div>

                  {isMenuOpen.unoUno && (
                    <div className="unoUno">
                      <div className="layer-item">
                        <div className="espacio"></div>
                        <div className="espacio-2"></div>
                        {getLayerVisibility("sedimentosSubmarinos-layer") ? (
                          <RxEyeClosed
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>
                              toggleLayerVisibility(
                                "sedimentosSubmarinos-layer"
                              )
                            }
                          />
                          ) : (
                          <RxEyeOpen
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>
                              toggleLayerVisibility(
                                "sedimentosSubmarinos-layer"
                              )
                            }
                          />
                        )}
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
                        {getLayerVisibility("manglar-layer") ? (
                          <RxEyeClosed
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>
                              toggleLayerVisibility("manglar-layer")
                            }
                          />
                        ) : (
                          <RxEyeOpen
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>
                              toggleLayerVisibility("manglar-layer")
                            }
                          />
                        )}
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
                        {getLayerVisibility("llanuraMareal-layer") ? (
                          <RxEyeClosed
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>
                              toggleLayerVisibility("llanuraMareal-layer")
                            }
                          />
                        ) : (
                          <RxEyeOpen
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>
                              toggleLayerVisibility("llanuraMareal-layer")
                            }
                          />
                        )}
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
                        {getLayerVisibility("playas-layer") ? (
                          <RxEyeClosed
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>
                              toggleLayerVisibility("playas-layer")
                            }
                          />
                        ) : (
                          <RxEyeOpen
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>
                              toggleLayerVisibility("playas-layer")
                            }
                          />
                        )}
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
                        {getLayerVisibility("zonaPantanosa-layer") ? (
                          <RxEyeClosed
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>
                              toggleLayerVisibility("zonaPantanosa-layer")
                            }
                          />
                        ) : (
                          <RxEyeOpen
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>
                              toggleLayerVisibility("zonaPantanosa-layer")
                            }
                          />
                        )}
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

                    {!isMenuActive.unoDos ? (
                          <RxEyeClosed
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>{
                              toggleLayerGroupVisibility(capasAgrupadas.unoDos,"visible");
                              
                              setIsMenuActive({...isMenuActive, unoDos: !isMenuActive.unoDos})
                            }
                            }
                          />
                          ) : (
                          <RxEyeOpen
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>{
                              toggleLayerGroupVisibility(capasAgrupadas.unoDos,"none");
                              
                              setIsMenuActive({...isMenuActive, unoDos: !isMenuActive.unoDos})
                            }
                            }
                          />
                        )}

                    <span>1.2. Con vegetación de baja altura</span>
                  </div>

                  {isMenuOpen.unoDos && (
                    <div className="unoDos">
                      <div className="layer-item">
                        <div className="espacio"></div>
                        <div className="espacio-2"></div>
                        {getLayerVisibility("rocasExpuestas-layer") ? (
                          <RxEyeClosed
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>
                              toggleLayerVisibility("rocasExpuestas-layer")
                            }
                          />
                        ) : (
                          <RxEyeOpen
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>
                              toggleLayerVisibility("rocasExpuestas-layer")
                            }
                          />
                        )}
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
                        {getLayerVisibility("humedales-layer") ? (
                          <RxEyeClosed
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>
                              toggleLayerVisibility("humedales-layer")
                            }
                          />
                        ) : (
                          <RxEyeOpen
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>
                              toggleLayerVisibility("humedales-layer")
                            }
                          />
                        )}
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
                        {getLayerVisibility("arbustal-layer") ? (
                          <RxEyeClosed
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>
                              toggleLayerVisibility("arbustal-layer")
                            }
                          />
                        ) : (
                          <RxEyeOpen
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>
                              toggleLayerVisibility("arbustal-layer")
                            }
                          />
                        )}
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
                        {getLayerVisibility("herbazalPastos-layer") ? (
                          <RxEyeClosed
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>
                              toggleLayerVisibility("herbazalPastos-layer")
                            }
                          />
                        ) : (
                          <RxEyeOpen
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>
                              toggleLayerVisibility("herbazalPastos-layer")
                            }
                          />
                        )}
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

                    {!isMenuActive.unoTres ? (
                          <RxEyeClosed
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>{
                              toggleLayerGroupVisibility(capasAgrupadas.unoTres,"visible");
                              
                              setIsMenuActive({...isMenuActive, unoTres: !isMenuActive.unoTres})
                            }
                            }
                          />
                          ) : (
                          <RxEyeOpen
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>{
                              toggleLayerGroupVisibility(capasAgrupadas.unoTres,"none");
                              
                              setIsMenuActive({...isMenuActive, unoTres: !isMenuActive.unoTres})
                            }
                            }
                          />
                        )}

                    <span>1.3. Bosques</span>
                  </div>


                  {isMenuOpen.unoTres && (
                    <div className="unoTres">
                      <div className="layer-item">
                    <div className="espacio"></div>
                    <div className="espacio-2"></div>
                    {getLayerVisibility("xerofitico-layer") ? (
                      <RxEyeClosed
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("xerofitico-layer")
                        }
                      />
                    ) : (
                      <RxEyeOpen
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("xerofitico-layer")
                        }
                      />
                    )}
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
                    {getLayerVisibility("subxerofitico-layer") ? (
                      <RxEyeClosed
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("subxerofitico-layer")
                        }
                      />
                    ) : (
                      <RxEyeOpen
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("subxerofitico-layer")
                        }
                      />
                    )}
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
                    {getLayerVisibility("inundables-layer") ? (
                      <RxEyeClosed
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("inundables-layer")
                        }
                      />
                    ) : (
                      <RxEyeOpen
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("inundables-layer")
                        }
                      />
                    )}
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
                    {getLayerVisibility("secosTropicales-layer") ? (
                      <RxEyeClosed
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("secosTropicales-layer")
                        }
                      />
                    ) : (
                      <RxEyeOpen
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("secosTropicales-layer")
                        }
                      />
                    )}
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
                    {getLayerVisibility("humedosTropicales-layer") ? (
                      <RxEyeClosed
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("humedosTropicales-layer")
                        }
                      />
                    ) : (
                      <RxEyeOpen
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("humedosTropicales-layer")
                        }
                      />
                    )}
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
                    {getLayerVisibility("subandinos-layer") ? (
                      <RxEyeClosed
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("subandinos-layer")
                        }
                      />
                    ) : (
                      <RxEyeOpen
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("subandinos-layer")
                        }
                      />
                    )}
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
                    {getLayerVisibility("bosqueNiebla-layer") ? (
                      <RxEyeClosed
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("bosqueNiebla-layer")
                        }
                      />
                    ) : (
                      <RxEyeOpen
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("bosqueNiebla-layer")
                        }
                      />
                    )}
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
                    {getLayerVisibility("altoAndinos-layer") ? (
                      <RxEyeClosed
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("altoAndinos-layer")
                        }
                      />
                    ) : (
                      <RxEyeOpen
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("altoAndinos-layer")
                        }
                      />
                    )}
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

                    {!isMenuActive.unoCuatro ? (
                          <RxEyeClosed
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>{
                              toggleLayerGroupVisibility(capasAgrupadas.unoCuatro,"visible");
                              
                              setIsMenuActive({...isMenuActive, unoCuatro: !isMenuActive.unoCuatro})
                            }
                            }
                          />
                          ) : (
                          <RxEyeOpen
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>{
                              toggleLayerGroupVisibility(capasAgrupadas.unoCuatro,"none");
                              
                              setIsMenuActive({...isMenuActive, unoCuatro: !isMenuActive.unoCuatro})
                            }
                            }
                          />
                        )}

                    <span>1.4. Altas cumbres</span>
                  </div>

                  {isMenuOpen.unoCuatro && (
                    <div className="unoCuatro">
                      <div className="layer-item">
                    <div className="espacio"></div>
                    <div className="espacio-2"></div>
                    {getLayerVisibility("pantanoParamo-layer") ? (
                      <RxEyeClosed
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("pantanoParamo-layer")
                        }
                      />
                    ) : (
                      <RxEyeOpen
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("pantanoParamo-layer")
                        }
                      />
                    )}
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
                    {getLayerVisibility("Paramo-layer") ? (
                      <RxEyeClosed
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() => toggleLayerVisibility("Paramo-layer")}
                      />
                    ) : (
                      <RxEyeOpen
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() => toggleLayerVisibility("Paramo-layer")}
                      />
                    )}
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
                    {getLayerVisibility("laguna-layer") ? (
                      <RxEyeClosed
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() => toggleLayerVisibility("laguna-layer")}
                      />
                    ) : (
                      <RxEyeOpen
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() => toggleLayerVisibility("laguna-layer")}
                      />
                    )}
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
                    {getLayerVisibility("glaciaresNivales-layer") ? (
                      <RxEyeClosed
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("glaciaresNivales-layer")
                        }
                      />
                    ) : (
                      <RxEyeOpen
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("glaciaresNivales-layer")
                        }
                      />
                    )}
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

              <div className="subtitle-2">
                
                    <div className="espacio-2"></div>


                {/*!isMenuActive.dos ? (
                          <RxEyeClosed
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>{
                              toggleLayerGroupVisibility(capasAgrupadas.dos,"visible");
                              
                              setIsMenuActive({...isMenuActive, dos: !isMenuActive.dos})
                            }
                            }
                          />
                          ) : (
                          <RxEyeOpen
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>{
                              toggleLayerGroupVisibility(capasAgrupadas.dos,"none");
                              
                              setIsMenuActive({...isMenuActive, dos: !isMenuActive.dos})
                            }
                            }
                          />
                        )*/}

                {isMenuOpen.dos ? (
                  <svg
                    width="20"
                    height="12"
                    viewBox="0 0 22 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => setIsMenuOpen({ ...isMenuOpen, dos: false })}
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
                    onClick={() => setIsMenuOpen({ ...isMenuOpen, dos: true })}
                  >
                    <path
                      d="M0.33507 12.7169C-0.880746 11.5835 1.18318 9.5434 7.0013 3.20828L8.11629 2.01523L8.70937 1.4187C8.99468 1.05014 9.32326 0.717651 9.68796 0.428467C10.1388 0.13514 10.6675 -0.0138897 11.2043 0.00101867C11.7411 0.0159271 12.2608 0.194074 12.6949 0.511981C12.9135 0.675092 13.1126 0.863272 13.288 1.07272L13.626 1.44256L14.2191 2.07488C15.7433 3.76305 17.1845 5.42736 18.4478 6.91868C20.9328 9.90132 22.5044 12.2039 21.852 12.7169C21.1997 13.2299 19.0408 11.4344 16.3364 8.74405C14.9545 7.3959 13.4659 5.82107 11.9535 4.17466L11.3604 3.57813L11.1173 3.31566L9.26094 5.31999C3.41909 11.6491 1.54495 13.8444 0.33507 12.7169Z"
                      fill="#F2EEE7"
                    />
                  </svg>
                )}

                <span>2. Entornos del ser humano que transforman ecosistemas</span>
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
                    onClick={() => setIsMenuOpen({ ...isMenuOpen, dosUno: false })}
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
                    onClick={() => setIsMenuOpen({ ...isMenuOpen, dosUno: true })}
                  >
                    <path
                      d="M0.33507 12.7169C-0.880746 11.5835 1.18318 9.5434 7.0013 3.20828L8.11629 2.01523L8.70937 1.4187C8.99468 1.05014 9.32326 0.717651 9.68796 0.428467C10.1388 0.13514 10.6675 -0.0138897 11.2043 0.00101867C11.7411 0.0159271 12.2608 0.194074 12.6949 0.511981C12.9135 0.675092 13.1126 0.863272 13.288 1.07272L13.626 1.44256L14.2191 2.07488C15.7433 3.76305 17.1845 5.42736 18.4478 6.91868C20.9328 9.90132 22.5044 12.2039 21.852 12.7169C21.1997 13.2299 19.0408 11.4344 16.3364 8.74405C14.9545 7.3959 13.4659 5.82107 11.9535 4.17466L11.3604 3.57813L11.1173 3.31566L9.26094 5.31999C3.41909 11.6491 1.54495 13.8444 0.33507 12.7169Z"
                      fill="#F2EEE7"
                    />
                  </svg>
                )}
                {!isMenuActive.dosUno ? (
                          <RxEyeClosed
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>{
                              toggleLayerGroupVisibility(capasAgrupadas.dosUno,"visible");
                              
                              setIsMenuActive({...isMenuActive, dosUno: !isMenuActive.dosUno})
                            }
                            }
                          />
                          ) : (
                          <RxEyeOpen
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>{
                              toggleLayerGroupVisibility(capasAgrupadas.dosUno,"none");
                              
                              setIsMenuActive({...isMenuActive, dosUno: !isMenuActive.dosUno})
                            }
                            }
                          />
                        )}

                    <span>2.1. Intervenciones moderadas</span>
                  </div>

                  {isMenuOpen.dosUno && (
                    <div className="dosUno">
                      <div className="layer-item">
                        <div className="espacio"></div>
                        <div className="espacio-2"></div>
                          {getLayerVisibility("bosqueFragmentado-layer") ? (
                            <RxEyeClosed
                              style={{
                                padding: "0",
                                marginRight: "10px",
                                cursor: "pointer",
                                width: "3vh",
                                height: "3vh",
                              }}
                              onClick={() =>
                                toggleLayerVisibility("bosqueFragmentado-layer")
                              }
                            />
                          ) : (
                            <RxEyeOpen
                              style={{
                                padding: "0",
                                marginRight: "10px",
                                cursor: "pointer",
                                width: "3vh",
                                height: "3vh",
                              }}
                              onClick={() =>
                                toggleLayerVisibility("bosqueFragmentado-layer")
                              }
                            />
                          )}
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
                    {getLayerVisibility("regeneracionVegetal-layer") ? (
                      <RxEyeClosed
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("regeneracionVegetal-layer")
                        }
                      />
                    ) : (
                      <RxEyeOpen
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("regeneracionVegetal-layer")
                        }
                      />
                    )}
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
                    onClick={() => setIsMenuOpen({ ...isMenuOpen, dosDos: false })}
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
                    onClick={() => setIsMenuOpen({ ...isMenuOpen, dosDos: true })}
                  >
                    <path
                      d="M0.33507 12.7169C-0.880746 11.5835 1.18318 9.5434 7.0013 3.20828L8.11629 2.01523L8.70937 1.4187C8.99468 1.05014 9.32326 0.717651 9.68796 0.428467C10.1388 0.13514 10.6675 -0.0138897 11.2043 0.00101867C11.7411 0.0159271 12.2608 0.194074 12.6949 0.511981C12.9135 0.675092 13.1126 0.863272 13.288 1.07272L13.626 1.44256L14.2191 2.07488C15.7433 3.76305 17.1845 5.42736 18.4478 6.91868C20.9328 9.90132 22.5044 12.2039 21.852 12.7169C21.1997 13.2299 19.0408 11.4344 16.3364 8.74405C14.9545 7.3959 13.4659 5.82107 11.9535 4.17466L11.3604 3.57813L11.1173 3.31566L9.26094 5.31999C3.41909 11.6491 1.54495 13.8444 0.33507 12.7169Z"
                      fill="#F2EEE7"
                    />
                  </svg>
                )}

                {!isMenuActive.dosDos ? (
                          <RxEyeClosed
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>{
                              toggleLayerGroupVisibility(capasAgrupadas.dosDos,"visible");
                              
                              setIsMenuActive({...isMenuActive, dosDos: !isMenuActive.dosDos})
                            }
                            }
                          />
                          ) : (
                          <RxEyeOpen
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>{
                              toggleLayerGroupVisibility(capasAgrupadas.dosDos,"none");
                              
                              setIsMenuActive({...isMenuActive, dosDos: !isMenuActive.dosDos})
                            }
                            }
                          />
                        )}

                    <span>2.2. Zonas con agricultura y ganadería</span>
                  </div>


                  {isMenuOpen.dosDos && (
                    <div className="dosDos">
                    <div className="layer-item">
                    <div className="espacio"></div>
                    <div className="espacio-2"></div>
                    {getLayerVisibility("agriculturaMixta-layer") ? (
                      <RxEyeClosed
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("agriculturaMixta-layer")
                        }
                      />
                    ) : (
                      <RxEyeOpen
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("agriculturaMixta-layer")
                        }
                      />
                    )}
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
                    {getLayerVisibility("areasInundacion-layer") ? (
                      <RxEyeClosed
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("areasInundacion-layer")
                        }
                      />
                    ) : (
                      <RxEyeOpen
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("areasInundacion-layer")
                        }
                      />
                    )}
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
                    {getLayerVisibility("monocultivos-layer") ? (
                      <RxEyeClosed
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("monocultivos-layer")
                        }
                      />
                    ) : (
                      <RxEyeOpen
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("monocultivos-layer")
                        }
                      />
                    )}
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
                    {getLayerVisibility("ganaderia-layer") ? (
                      <RxEyeClosed
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() => toggleLayerVisibility("ganaderia-layer")}
                      />
                    ) : (
                      <RxEyeOpen
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() => toggleLayerVisibility("ganaderia-layer")}
                      />
                    )}
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
                    onClick={() => setIsMenuOpen({ ...isMenuOpen, dosTres: false })}
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
                    onClick={() => setIsMenuOpen({ ...isMenuOpen, dosTres: true })}
                  >
                    <path
                      d="M0.33507 12.7169C-0.880746 11.5835 1.18318 9.5434 7.0013 3.20828L8.11629 2.01523L8.70937 1.4187C8.99468 1.05014 9.32326 0.717651 9.68796 0.428467C10.1388 0.13514 10.6675 -0.0138897 11.2043 0.00101867C11.7411 0.0159271 12.2608 0.194074 12.6949 0.511981C12.9135 0.675092 13.1126 0.863272 13.288 1.07272L13.626 1.44256L14.2191 2.07488C15.7433 3.76305 17.1845 5.42736 18.4478 6.91868C20.9328 9.90132 22.5044 12.2039 21.852 12.7169C21.1997 13.2299 19.0408 11.4344 16.3364 8.74405C14.9545 7.3959 13.4659 5.82107 11.9535 4.17466L11.3604 3.57813L11.1173 3.31566L9.26094 5.31999C3.41909 11.6491 1.54495 13.8444 0.33507 12.7169Z"
                      fill="#F2EEE7"
                    />
                  </svg>
                )}

                {!isMenuActive.dosTres ? (
                          <RxEyeClosed
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>{
                              toggleLayerGroupVisibility(capasAgrupadas.dosTres,"visible");
                              
                              setIsMenuActive({...isMenuActive, dosTres: !isMenuActive.dosTres})
                            }
                            }
                          />
                          ) : (
                          <RxEyeOpen
                            style={{
                              padding: "0",
                              marginRight: "10px",
                              cursor: "pointer",
                              width: "3vh",
                              height: "3vh",
                            }}
                            onClick={() =>{
                              toggleLayerGroupVisibility(capasAgrupadas.dosTres,"none");
                              
                              setIsMenuActive({...isMenuActive, dosTres: !isMenuActive.dosTres})
                            }
                            }
                          />
                        )}

                    <span>2.3. Zonas con agricultura y ganadería </span>
                  </div>

                  {isMenuOpen.dosTres && (
                    <div className="dosTres">
                    <div className="layer-item">
                    <div className="espacio"></div>
                    
                    <div className="espacio-2"></div>
                    {getLayerVisibility("zonaUrbanaIndustrial-layer") ? (
                      <RxEyeClosed
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("zonaUrbanaIndustrial-layer")
                        }
                      />
                    ) : (
                      <RxEyeOpen
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("zonaUrbanaIndustrial-layer")
                        }
                      />
                    )}
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
                    {getLayerVisibility("aguaSuperficial-layer") ? (
                      <RxEyeClosed
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("aguaSuperficial-layer")
                        }
                      />
                    ) : (
                      <RxEyeOpen
                        style={{
                          padding: "0",
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "3vh",
                          height: "3vh",
                        }}
                        onClick={() =>
                          toggleLayerVisibility("aguaSuperficial-layer")
                        }
                      />
                    )}
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

              <div className="subtitle-2">

                <div className="espacio-2"></div>


                {getLayerVisibility("sinInformacion-layer") ? (
                  <RxEyeClosed
                    style={{
                      padding: "0",
                      marginRight: "10px",
                      cursor: "pointer",
                      width: "3vh",
                      height: "3vh",
                    }}
                    onClick={() =>
                      toggleLayerVisibility("sinInformacion-layer")
                    }
                  />
                ) : (
                  <RxEyeOpen
                    style={{
                      padding: "0",
                      marginRight: "10px",
                      cursor: "pointer",
                      width: "3vh",
                      height: "3vh",
                    }}
                    onClick={() =>
                      toggleLayerVisibility("sinInformacion-layer")
                    }
                  />
                )}

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
            </div>
          )}

          {selectedMap == 5 &&
          (
              <div  style={{paddingTop:"8vh", paddingBottom:"2vh", paddingLeft:"4vw", paddingRight:"1vw" }}>
            {layers.map((layer) => (
              <div key={layer.id} className="layer-item">
                {layerVisibility[layer.id] ? (
                  <RxEyeClosed
                    style={{ marginRight: "10px", cursor: "pointer" }}
                    onClick={() => toggleLayerVisibility(layer.id)}
                  />
                ) : (
                  <RxEyeOpen
                    style={{ marginRight: "10px", cursor: "pointer" }}
                    onClick={() => toggleLayerVisibility(layer.id)}
                  />
                )}
                <span>{layer.texto}</span>
              </div>
            ))} </div>)}
        </div>
      </div>
    </div></>
  );
};

LayerMenu.propTypes = {
  map: PropTypes.object.isRequired,
  layers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      texto: PropTypes.string.isRequired
    })
  ).isRequired,
};

export default LayerMenu;
