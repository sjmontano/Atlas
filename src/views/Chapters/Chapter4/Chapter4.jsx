import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import MapComponent from "../../../components/MapController/MapComponent";
import SidebarBottom from "../../../components/Sidebars/SidebarBottom/SidebarBottom";
import SidebarLeft from "../../../components/Sidebars/SidebarLeft/SidebarLeft";
import names from "../../../data/geojsonLayers/namesEncuadresIntroCap3";
import namesTramos from "../../../data/geojsonLayers/tramos";
import tramosCap3 from "../../../data/geojsonLayers/tramosEncuadres";
import toponimosIntroduccionCap4 from "../../../data/toponimos/introduccionCap4";


// Contextos y utilidades
import img2 from "../../../../public/assets/img/background/tituloPequeñoMapas.webp";
import modalsData from "../../../components/Home/Modal/modalsData"; // Datos para los modales
import { useShadow } from "../../../context/ShadowContext";
import useMapProps from "../../../Hooks/useMapProps";
import { getChapterMaps } from "../../../utils/geoUtils";
import "../Chapter1/Chapter1.css";

//rasterTiles

//iconos sidebard
import sidebarIconsChapter4 from "../../../data/sidebardIcons/sidebarIconsChapter4";

//galerias de imagenes
import { galeriasChapter2, mapaToGaleria } from "../../../data/galeriasImagenes/galeriasChapter2";

// Audios para el botón de reproducción (capítulo 3 )
import { audiosChapter3, audioToBotonChapter3 } from "../../../data/botonSonidos/audiosChapter3";

//titulos
import titlesChapter4 from "../../../data/titles/titlesChapter4";


import capitulo1 from "../../../../public/assets/img/background/capitulo1.webp";


import siluetaChapter2 from "../../../../public/assets/img/background/iconos/chapter2.svg";
import siluetaChapter3 from "../../../../public/assets/img/background/iconos/chapter3.svg";
import siluetaChapter4 from "../../../../public/assets/img/background/iconos/chapter4.svg";
import siluetaChapter1 from "../../../../public/assets/interface/icons/line/svg/chapter1-map.svg";

import fondoIcon from "../../../../public/assets/svg/inicio/fondoIcon.svg";
import homebtn from "../../../../public/assets/svg/inicio/logohome2.svg";
import tooltipBg from "../../../../public/assets/svg/sidebar-resources/FondoTooltip4.webp";
import logo from "../../../../public/logo.svg";

import audiobtn from "../../../../public/assets/svg/inicio/audio.svg";

//Loading
import AudioPlayer from "../../../components/AudioPlayer/AudioPlayer";
import LoadingScreen from "../../../components/Loading/LoadingScreen";
import usePreloadAssets from "../../../Hooks/usePreloadAssets";

/* ---------- PRECARGA ---------- */
const assetsToPreload = [
  "https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360613/geoImages/xz3jreum4xips6v20mpd.webp",
  "https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360645/geoImages/n124yhs25e83qdpkzknu.avif",
  "https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360577/geoImages/zvluewqlzmf9hw9fua6x.avif",
  "/assets/interface/hud/hud-cap1.svg",
  "/assets/interface/icons/arrow.svg",
  "/assets/img/background/tituloMapa2.webp",
  "/assets/img/background/menuLeft.webp",
  "/assets/interface/icons/line/svg/chapter1-map.svg",
  "/assets/img/background/miniMapCuenca.png",
];

const DELAY_MS = 0; // colchón visual

const Chapter4 = ({acceso=false}) => {

  /* ----- Precarga de imágenes ----- */
  const imagesLoaded = usePreloadAssets(assetsToPreload);
  const [mapReady, setMapReady] = useState(false);
  const navigate = useNavigate();

  // **Estados del componente**
  // Estado para el mapa seleccionado (índice del mapa actual)
  const [selectedMap, setSelectedMap] = useState(0);

  // Estado para el audio
  const [audioState, setAudioState] = useState({
    isVisible: false,
    isPlaying: false,
    src: null,
    title: ""
  });

  const playAudio = () => {
    const key = audioToBotonChapter3[selectedMap];
    console.log("selectedMap", selectedMap, "key", key); // ← confirma mapeo
    if (!key) return;
    const src = "/" + audiosChapter3[key].audios[0];
    const title = audiosChapter3[key].titulo;
    console.log("src", src);

    setAudioState({
      isVisible: true,
      isPlaying: true,
      src,
      title
    });
  };

  const handleAudioClose = () => {
    setAudioState(prev => ({ ...prev, isVisible: false, isPlaying: false }));
  };

  const handlePlayStateChange = (isPlaying) => {
    setAudioState(prev => ({ ...prev, isPlaying }));
  };




  // callback que llega desde MapComponent cuando emite "idle"
  const handleMapReady = () => {
    setTimeout(() => setMapReady(true), DELAY_MS);
  };

  // Contexto para actualizar el sombreado del mapa
  const { updateShadow } = useShadow();

  // Estado para almacenar los mapas generados dinámicamente
  const [maps, setMaps] = useState([]);


  const [agregados] = useState([
    {
      nevados: [],
      encuadres: [],
      toponimos: toponimosIntroduccionCap4,
      capas:[] ,
      backLink: "/Bienvenidos",
      rasterTiles:[],
    },
    {
      nevados: [],
      encuadres: [],
      toponimos:
      [],
      capas: [],
      backLink: "/Chapter2",
      rasterTiles: []
    },
    {
      nevados: [],
      encuadres: [],
      toponimos: [],
      capas: [],
      rasterTiles: [
        {
      name: "suarez1970",
      texto: "suarez 1970",
      id: "suarez1970-layer",
      sourceId: "suarez1970_",
      url: "https://res.cloudinary.com/dvluvxfvn/image/upload/v1764428583/geoImages/nq4xkltmzu1obibxz6sw.webp",
      opacity: 0.8,
    },
      ],
      backLink: "/Chapter2",
    },
    {
      nevados: [],
      encuadres: [],
      toponimos: [],
      capas: [],
      rasterTiles: [
        {
      name: "cali1937",
      texto: "Cuerpos de agua",
      id: "cali1937-layer",
      sourceId: "cali1937_",
      url: "https://res.cloudinary.com/dvluvxfvn/image/upload/v1764430100/geoImages/gfi90kqtutbhqgo1zc2m.png",
      opacity: 0.8,
      icono: "assets/mapasMenuCap2/cuerpoAgua.svg",

    },
    {
      name: "cali1937agua",
      texto: "Área urbana",
      id: "cali1937agua-layer",
      sourceId: "cali1937agua_",
      url: "https://res.cloudinary.com/dvluvxfvn/image/upload/v1764432532/geoImages/njp7ngydvrkqtcrkg8pm.webp",
      opacity: 0.8,
      icono: "assets/mapasMenuCap2/urbanA.svg",
    },
      ],
      backLink: "/Chapter2",
    },
    {
      nevados: [],
      encuadres: tramosCap3,
      toponimos: [

      ],
      capas: [],
      rasterTiles: [
        {
      name: "humedalesCapa1970",
      texto: "Humedales 1970",
      id: "humedalesCapa1970-layer",
      sourceId: "humedalesCapa1970_",
      url: "https://res.cloudinary.com/dvluvxfvn/image/upload/v1763849225/geoImages/lbbcrnrecpdfu5kqf1vp.webp",
      opacity: 0.8,
    },
      ],
      backLink: "/Chapter2",

    },
    { //elPaso
      nevados: [],
      encuadres: [],
      toponimos: [],
      capas: [],
      rasterTiles: [],
      backLink: "/Chapter2",
    },

    {
      nevados: [],
      encuadres: [],
      toponimos: [],
      capas: [],
      rasterTiles: [],
      backLink: "/Chapter2",
    },
    {
      nevados: [],
      encuadres: [],
      toponimos: [],
      capas: [],
      rasterTiles: [],
      backLink: "/Chapter2",
    },
    {
      nevados: [],
      encuadres: [],
      toponimos: [],
      capas: [],
      rasterTiles: [],
      backLink: "/Chapter2",
    },

    {
      nevados: [],
      encuadres: [],
      toponimos: [],
      capas: [],
      rasterTiles: [],
      backLink: "/Chapter2",
    },
    {
      nevados: [],
      encuadres: [],
      toponimos: [],
      capas: [],
      rasterTiles: [],
      backLink: "/Chapter2",
    },

    // ...Agregar más mapas según sea necesario
  ]);

  // Estado para el modal seleccionado
  const [selectedModal, setSelectedModal] = useState();

  // Estado para controlar si el capítulo está abierto
  const [isChapterOpen, setIsChapterOpen] = useState(true);

  const clickHome = () => {
    navigate("/Home");
  };



  // **Datos estáticos**
  // Información de los capítulos
  const chapters = [
    {
      id: "capitulo-1",
      number: "Cap. I",
      title: "El valle alto del río Cauca, \nsu cuenca y sus mundos",
      img: capitulo1,
      image: siluetaChapter1,
    },
    {
      id: "capitulo-2",
      number: "Cap. II",
      title:
        "Tejidos, nodos y alternativas \ntransformadoras en el sur del \nvalle alto del río Cauca",
      img: capitulo1,
      image: siluetaChapter2,
    },
    {
      id: "capitulo-3",
      number: "Cap. III",
      title: "Caminos y conflictos del río \nCauca en el valle alto",
      img: capitulo1,
      image: siluetaChapter3,
    },
    {
      id: "capitulo-4",
      number: "Cap. IV",
      title:
        "Actores, acciones, \ncapacidades y poderes en \nlos nodos del Tejido",
      img: capitulo1,
      image: siluetaChapter4,
    },
  ];

  // Información de los mapas disponibles
  const mapas = [
  ];

  // Obtener la galería actual según el mapa seleccionado
  const galeriaActual = mapaToGaleria[selectedMap]
    ? galeriasChapter2[mapaToGaleria[selectedMap]]
    : null;

  // Títulos dinámicos para diferentes vistas

  // **Efectos**
  // **Funciones**
  const handleMapChange = (index) => {
    setSelectedMap(index); // Actualiza el mapa
    console.log(index)

    // Busca el modal correspondiente en los datos de los modales
    const modalData = modalsData.find(
      (modal) => modal.id === index+60
    );
    // Actualiza el estado con el modal correspondiente
    if (modalData) {
      setSelectedModal(modalData);
    } else {
      console.warn(
        `⚠️ No se encontró un modal para el mapa con id: ${mapId} y título: ${mapTitle}`
      );
    }
  };

  // Efecto para cargar los mapas al inicio
  useEffect(() => {
    // Selecciona el modal inicial
    setSelectedModal(modalsData[53]);

    const loadMaps = async () => {
      // Obtiene mapas desde la utilidad geoUtils
      const generatedMaps = await getChapterMaps([
        { name: "introduccionCap4" },
        { name: "asoyoje" },
        { name: "elBuhido" },
        { name: "bosqueComestible" } ,
        { name: "losBajios" } ,
        { name: "elPaso" } ,
        { name: "lasMercedes" } ,
        { name: "laVirginia" } ,
        { name: "centroAgropecuario" } ,
        { name: "laCaicedo" } ,
        { name: "problematicas" } ,
        // ...Agregar más mapas según sea necesario
      ]);

      // Manejo de advertencia si no hay mapas
      if (generatedMaps.length === 0) {
        console.warn("⚠️ No se cargaron mapas válidos en Chapter2.jsx.");
      }

      // Actualiza el estado con los mapas generados
      setMaps(generatedMaps);
    };

    loadMaps();
    


  }, []);

  // Efecto para actualizar el sombreado según el mapa seleccionado
  useEffect(() => {
    if (maps.length > 0) {
      updateShadow(maps[selectedMap]?.shadow || false);
    }
    
  console.log(mapProps)
    
  }, [selectedMap, maps]);

  // **Funciones**

  // Obtiene las propiedades del mapa current
  const mapProps = useMapProps(selectedMap, maps);

  // **Renderizado**

  if(acceso==false){
    return <Navigate to="/"/>
  }

  /* ------------------ loader final ------------------ */
  const showPage = imagesLoaded && mapReady;
  return (
    <div id="cap1">
      {(!showPage ) && <LoadingScreen />} {/* overlay */}


       {/* Añadir SidebarLeft aquí */}
    <SidebarLeft
        datos={selectedModal}
      icons={sidebarIconsChapter4[selectedMap]}
      onMapChange={handleMapChange}
      galeriaData={galeriaActual}
    />
      {/* Título principal */}
      <Header
        
          props={mapProps}
        title={titlesChapter4[selectedMap]}
        index={selectedMap}
        onMapChange={handleMapChange}
        backLink={selectedMap != 0 ? "/chapter1" : "/Bienvenidos"}
      />
      {/* Barra inferior - Solo visible en el mapa 0 (encuadres) */}

         {/* Barra inferior - Solo visible en el mapa 0 (encuadres) */}
      {/* Boton home */}
      <div className="homeChapter1">
        {/*<img className="homeImage" src={home} alt="" />*/}
        <div className="btnHomeContainer" onClick={clickHome}>
          <img
            className="btnHomeChapter1"
            src={homebtn}
            alt="Casa"
          />
          <div className="homeTooltip-marker">
            <span>Casa</span>
            <img src={tooltipBg} alt="" />
          </div>
        </div>


        {(selectedMap === 0 ) && (
                          <a href="https://www.unriocauca.com/" target="_blank" rel="noopener noreferrer" className="btnLogoAtlas">
                          <img className="btnLogoBg" src={fondoIcon} alt="" />
                          <img className="btnLogoImg" src={logo} alt="Un río Cauca, muchos mundos" />
                          <div className="homeTooltip-marker">
                            <span>Un río Cauca</span>
                            <img src={tooltipBg} alt="" />
                          </div>
                        </a>
                        )}

      </div>

      {(selectedMap === 2 || selectedMap ===3 ) && (
        <div className="btnAudioPlay"
            style={{  top: selectedMap === 2?   "76vh": "73vh", left:   selectedMap === 2?  "67vw" : "55vw",}}>
          <img
            className="btnAudioPlayImage"
            src={audiobtn}
            alt="Play"
            onClick={playAudio}
          />
        </div>
      )}
      {/* Componente del mapa */}
      {mapProps && (
        <MapComponent
          isEncuadresOpen={true}
          props={mapProps}
          setIsChapterOpen={setIsChapterOpen}
          onMapChange={handleMapChange}
          nevados={agregados[selectedMap].nevados}
          encuadres={agregados[selectedMap].encuadres}
          names ={ selectedMap!=0 ?namesTramos : names}
          toponimos={agregados[selectedMap].toponimos}
          mapLayers={agregados[selectedMap].capas}
          rasterTiles={agregados[selectedMap].rasterTiles}
          selectedMap={selectedMap}
          onMapReady={handleMapReady}
          isfinca={selectedMap!==0 ? true : false}
        />
      )}
      {/* Miniatura del mapa */}

      {(selectedMap===0 || selectedMap===4) && (
        <div className="mapa-image-mini-chapter1">
        <img src="assets/img/background/miniMapValle.webp" alt="" />
      </div>
      )
      }

      {(selectedMap===2 ) && (
        <div className="mapa-image-mini-chapter1">
        <img src="assets/img/background/suarez.webp" alt="" />
      </div>
      )
      }

       {selectedMap==1 &&(
        <div className="mapa-image-mini-chapter1">
        <img src="assets/img/background/miniMapSur.webp" alt="" />
      </div>
      )


      }


      {selectedMap==3  && (
        <div className="mapa-image-mini-chapter1">
        <img src="assets/img/background/cali.webp" alt="" />
      </div>
      )
      }

      {selectedMap==5  && (
        <div className="mapa-image-mini-chapter1">
        <img src="assets/img/background/villaRica.webp" alt="" />
      </div>
      )
      }

      {selectedMap==6  && (
        <div className="mapa-image-mini-chapter1">
        <img src="assets/img/background/suarez.webp" alt="" />
      </div>
      )
      }



      {/* Barra lateral izquierda */}
      {selectedMap === 0 && (
        <SidebarBottom
          onMapChange={handleMapChange}
          chapters={chapters}
          selectedChapter={4}  // Cambiado de 1 a 2 para seleccionar el Capítulo 2
        />
      )}

      {/* Reproductor de Audio */}
      {audioState.isVisible && (
        <AudioPlayer
          src={audioState.src}
          title={audioState.title}
          onClose={handleAudioClose}
          onPlayStateChange={handlePlayStateChange}
          autoPlay={true}
        />
      )}

      {/* Icono del norte */}
      <div className="northIcon">
        <svg
          width="38"
          height="38"
          viewBox="0 0 56 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M54.6792 20.0076C54.2152 18.2806 53.3559 16.6853 52.1692 15.3476C50.686 13.7263 48.7483 12.5901 46.6092 12.0876C46.0616 11.94 45.5032 11.8363 44.9392 11.7776L44.0992 11.6776C42.3678 8.84605 40.0821 6.39362 37.3792 4.4676C33.9397 2.01595 29.9142 0.515428 25.7092 0.117598C24.5793 0.00892496 23.4435 -0.0244821 22.3092 0.0175977C21.7392 0.0175977 21.1692 0.127598 20.5992 0.187598C20.019 0.227116 19.4435 0.317463 18.8792 0.457598L17.1792 0.847598C16.8992 0.917598 16.6092 0.977598 16.3292 1.0576L15.4992 1.3576L13.8292 2.0076C13.2744 2.23242 12.7364 2.49642 12.2192 2.7976C11.6892 3.0876 11.1492 3.3476 10.6292 3.6576L9.15916 4.6876L8.41916 5.2176C8.17916 5.3976 7.96916 5.6176 7.73916 5.8276L6.41916 7.0776C5.99893 7.51674 5.60173 7.97736 5.22916 8.4576C4.8288 8.9109 4.46121 9.39212 4.12916 9.8976C3.44937 10.8841 2.85073 11.9242 2.33916 13.0076C0.325429 17.2384 -0.411289 21.9646 0.219159 26.6076C0.345374 27.6924 0.556013 28.7656 0.849159 29.8176C0.989159 30.3376 1.13916 30.8176 1.27916 31.3676C1.44055 31.8669 1.62746 32.3575 1.83916 32.8376C2.03916 33.3176 2.22916 33.8376 2.42916 34.2576C2.62916 34.6776 2.89916 35.1476 3.12916 35.5976C3.5856 36.4743 4.10008 37.3195 4.66916 38.1276C6.71937 40.823 9.33364 43.0379 12.3292 44.6176C14.2366 45.6744 16.2738 46.4779 18.3892 47.0076C21.3345 47.7427 24.4026 47.8416 27.3892 47.2976C29.9611 46.8284 32.4442 45.9613 34.7492 44.7276C38.5275 42.759 41.7367 39.8528 44.0692 36.2876L44.3292 35.8676C44.5157 35.8775 44.7026 35.8775 44.8892 35.8676C47.8054 35.5121 50.5051 34.1464 52.5192 32.0076C53.1317 31.3269 53.6497 30.5667 54.0592 29.7476C54.3583 29.0616 54.6122 28.3568 54.8192 27.6376C54.9292 26.9876 55.0192 26.3976 55.0792 25.8576C55.094 25.6212 55.094 25.384 55.0792 25.1476V24.8376C55.2248 23.2166 55.0895 21.5826 54.6792 20.0076ZM6.17916 15.0076C6.96832 13.1788 8.04904 11.4902 9.37916 10.0076L10.4492 9.0076C10.6292 8.8376 10.7992 8.6476 10.9892 8.4876L11.5892 8.0376L12.7892 7.1376C13.2092 6.8676 13.6692 6.6376 14.0992 6.3876C14.9654 5.83947 15.8831 5.37728 16.8392 5.0076L17.5292 4.7376L18.2692 4.5576L19.7192 4.1876C21.626 3.77098 23.5855 3.64956 25.5292 3.8276C26.4669 3.90999 27.3987 4.05026 28.3192 4.2476C29.2081 4.47636 30.0829 4.75684 30.9392 5.0876C32.557 5.7141 34.0919 6.53692 35.5092 7.5376C37.2357 8.8245 38.7506 10.3732 39.9992 12.1276C39.8592 12.1276 39.7192 12.1976 39.5892 12.2476C37.2418 13.0025 35.146 14.3859 33.5292 16.2476C33.1096 16.7412 32.7379 17.2736 32.4192 17.8376C32.2533 18.1294 32.1031 18.4298 31.9692 18.7376L31.6592 19.5576C31.4157 20.2666 31.2219 20.9917 31.0792 21.7276C26.4392 21.5776 21.2592 21.5376 16.5792 21.4876C11.0392 21.4276 7.16916 21.3476 4.57916 21.4876C4.57916 21.1976 4.57916 20.9076 4.57916 20.6176C4.83182 18.6594 5.37092 16.749 6.17916 14.9476V15.0076ZM32.3992 40.2076C28.5016 42.3364 23.9633 42.9761 19.6292 42.0076C17.9922 41.6036 16.4081 41.0095 14.9092 40.2376C12.5433 39.0806 10.4425 37.4463 8.73916 35.4376C8.51916 35.1476 8.30916 34.8676 8.09916 34.5476C7.88916 34.2276 7.68916 33.8676 7.48916 33.5476L6.85916 32.4076L6.34916 31.2576C6.16916 30.8676 5.99916 30.4676 5.81916 30.0776C5.63916 29.6876 5.56916 29.2376 5.43916 28.8176C5.30916 28.3976 5.14916 27.9776 5.06916 27.5376C4.98916 27.0976 4.90916 26.6476 4.81916 26.1976C4.74512 25.8683 4.69499 25.5341 4.66916 25.1976C7.25916 25.3876 11.0992 25.4076 16.5492 25.4676C21.1892 25.4676 26.3192 25.5976 30.9192 25.5576C31.0456 26.8474 31.3834 28.1076 31.9192 29.2876C32.6613 30.9407 33.7937 32.3889 35.2192 33.5076C35.7532 33.9332 36.3256 34.3082 36.9292 34.6276C37.3846 34.8676 37.8596 35.0684 38.3492 35.2276L38.7392 35.3476C36.9477 37.3491 34.7973 38.9975 32.3992 40.2076Z"
            fill="#193965"
          />
          <path
            d="M48.8392 20.1475C48.5792 18.5775 48.0392 17.4875 47.1992 17.5775C46.3592 17.6675 46.0692 18.7875 45.9992 20.2975C45.9092 21.5775 45.9292 23.1475 45.9392 24.6475L45.8692 24.5575C44.5792 22.9275 43.1992 21.0075 41.9992 19.6475C41.3992 18.9275 40.6692 17.8775 39.6492 17.7575C38.3992 17.6075 37.9992 19.4075 37.8892 20.3275C37.6555 22.0403 37.5651 23.7696 37.6192 25.4975C37.6192 28.9275 37.4992 30.0375 39.2092 30.0675C40.9192 30.0975 40.8292 28.9075 40.8192 25.4975C40.8192 24.4975 40.8192 23.4975 40.8192 22.4975C41.6592 23.7575 42.6792 25.0775 43.5892 26.2675C44.2292 27.0975 44.8492 27.9475 45.5192 28.7575C46.0592 29.4075 46.6292 30.1375 47.5192 30.0875C47.7295 30.0935 47.9386 30.0537 48.132 29.9708C48.3255 29.8879 48.4985 29.7639 48.6392 29.6075C48.8922 29.1672 49.0169 28.6649 48.9992 28.1575C49.0592 27.2575 49.0492 26.3575 49.0492 25.4675C49.1183 23.6914 49.0481 21.9126 48.8392 20.1475Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
};

export default Chapter4;
