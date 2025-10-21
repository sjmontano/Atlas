import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import maplibregl from "maplibre-gl";
import InfoModal from "../Home/Modal/modalinfo";
import modalData from "../Home/Modal/modalsData";

// Imágenes importadas
import image from "../../../public/assets/svg/inicio/circuloNumero.svg";
import FondoTooltip1 from "../../../public/assets/svg/sidebar-resources/FondoTooltip4.webp";
import { h1 } from "framer-motion/client";
import ImageCircle from "../../context/circuloConDireccion";
import { createRoot } from "react-dom/client";

/**
 * Componente que agrega los toponimos como popups en el mapa usando MapLibre GL.
 * Cada toponimo se muestra como un icono numerado, con tooltip y modal de información.
 * Algunos números se muestran más grandes según la lista definida.
 */
const ToponimosLayer = ({ map, toponimos, selectedMap, onMapChange, mapName ="" }) => {
  // Estado para controlar la apertura del modal de información
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Estado para saber qué índice de modal mostrar
  const [modalIndex, setModalIndex] = useState(null);

  useEffect(() => {
    // Si no hay mapa o toponimos, no hacer nada
    if (!map || !toponimos) return;


    // Array para guardar los popups y poder limpiarlos después
    const popups = [];

    // Recorrer cada toponimo y crear su popup en el mapa
    toponimos.forEach((toponimo, index) => {
      // Crear el nodo HTML para el popup
      const popupNode = document.createElement("div");
      popupNode.style.position = "relative";
      popupNode.style.display = "inline-block";
      popupNode.style.color = "transparent";
      popupNode.style.zIndex = "2000";
      popupNode.style.borderRadius = "20%";
      popupNode.style.cursor = "pointer";

      // Renderizar el contenido del popup con HTML
      // Los números definidos en el array se muestran más grandes (40px y 2.5vh)

      

      popupNode.innerHTML = `
         <div style="position: relative; display: flex; justify-content: center; align-items: center; cursor: pointer;">
            <img class="imagenNumeros" src="${image}" 
              style="width: ${
                [2,3,4,6,7,8,9,10,11,14,15,26,28,32].includes(toponimo.numero) 
                  ? '30px' 
                  : '25px'
              }; height: 30px; z-index: 1;" />
            <p style="opacity:1; margin:0; position:absolute; font-size:${
                [2,3,4,6,7,8,9,10,11,14,15,26,28,32].includes(toponimo.numero) 
                  ? '2.5vh' 
                  : '2.0vh'
              }; 
                color: aliceblue;
                z-index: 5;
                ">${toponimo.numero}</p>
          
          <div class="tooltip" style="
            z-index: 1000;
            display: block;
            position: absolute;
            padding: 4px 8px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
            text-align: center;
          ">
            <img src="${FondoTooltip1}" style="
              width: 110%;
              height: 74%;
              position: absolute;
              top: 0;
              left: 0;
              z-index: 1;
  border-radius: 6px;              /* Opcional: redondear las esquinas */
                          
            "/>
            <h3 style="
              position: relative; 
              margin-top: 5px; 
              z-index: 2; 
              font-size: 16px; 
              color: white; 
              margin-left: 5%;
            ">${toponimo.name}</h3>
            <p style="
              position: relative; 
              z-index: 2; 
              color: white; 
              margin-top: 0; 
              font-size: 12px; 
              text-align: center; 
              margin-left: 15%; 
              padding-bottom: 2%;
            ">${toponimo.capa}</p>
          </div>
        </div>
      `;

      // Obtener referencias a los elementos del popup
      const img = popupNode.querySelector("img.imagenNumeros");
      const tooltip = popupNode.querySelector(".tooltip");


      /**
       * Función para posicionar el tooltip dinámicamente según la posición en pantalla.
       * Evita que el tooltip se salga de la ventana.
       */
      const positionTooltip = () => {
        if (!tooltip) return;

        // Dimensiones de la ventana
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Posición del popup
        const rect = popupNode.getBoundingClientRect();
        
        // Mostrar temporalmente el tooltip para medirlo
        tooltip.style.opacity = "1";
        tooltip.style.visibility = "hidden";
        const tooltipRect = tooltip.getBoundingClientRect();
        tooltip.style.visibility = "visible";
        
        // Dimensiones reales del tooltip
        const tooltipWidth = tooltipRect.width || 150;
        const tooltipHeight = tooltipRect.height || 80;
        
        // Margen de seguridad
        const margin = 10;
        
        // Resetear estilos
        tooltip.style.top = "";
        tooltip.style.bottom = "";
        tooltip.style.left = "";
        tooltip.style.right = "";
        tooltip.style.transform = "";
        
        // Posicionamiento horizontal
        if (rect.right + tooltipWidth + margin > windowWidth) {
          // Si se sale por la derecha, posicionar a la izquierda
          tooltip.style.right = "10px";
          tooltip.style.left = "auto";
        } else if (rect.left - tooltipWidth - margin < 0) {
          // Si se sale por la izquierda, posicionar a la derecha
          tooltip.style.left = "10px";
          tooltip.style.right = "auto";
        } else {
          // Posición por defecto (ajuste especial para el número 30)
          tooltip.style.left = toponimo.numero == 30 ? "-50px" : "2px";
          tooltip.style.right = "auto";
        }
        
        // Posicionamiento vertical
        if (rect.top - tooltipHeight - margin < 0) {
          // Si se sale por arriba, posicionar abajo
          tooltip.style.top = "0";
          tooltip.style.bottom = "auto";
        } else if (rect.bottom + tooltipHeight + margin > windowHeight) {
          // Si se sale por abajo, posicionar arriba
          tooltip.style.bottom = "-8px";
          tooltip.style.top = "auto";
        } else {
          // Posición por defecto
          tooltip.style.top = "2px";
          tooltip.style.bottom = "auto";
        }
      };

      // Evento para mostrar el tooltip al pasar el mouse
      popupNode.addEventListener("mouseenter", () => {
        if (tooltip) {
          positionTooltip();
          tooltip.style.opacity = "1";
        }
      });

      // Evento para ocultar el tooltip al quitar el mouse
      popupNode.addEventListener("mouseleave", () => {
        if (tooltip) tooltip.style.opacity = "0";
      });

      // Evento para abrir el modal de información al hacer clic en el icono
      popupNode.addEventListener("click", () => {

        if (toponimos[0].capa==="Nodo Suárez") {
          onMapChange(index+1);
        }else{

        setModalIndex(index + 8); // El índice +8 depende de la estructura de modalData
        setIsModalOpen(true);
        }
      });

      // Crear el popup de MapLibre GL y agregarlo al mapa
      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: [0, 0],
      })
        .setDOMContent(popupNode)
        .setLngLat(toponimo.coords);
        

        console.log(mapName);
        if (mapName=="ASuarez" || mapName=="AVillaRica"|| mapName=="VDOrienteCali") {
          const root = createRoot(popupNode);  // Usamos `createRoot` para React 18
        root.render(<ImageCircle angle={90} image="/assets/img/entramados/Asoyoge.webp" />);
      
        }
        



        popup.addTo(map);

      // Guardar el popup para poder limpiarlo después
      popups.push(popup);
    });

    // Limpiar los popups cuando el componente se desmonta o cambia el mapa/toponimos
    return () => {
      popups.forEach((popup) => popup.remove());
    };
  }, [map, toponimos]);

  // Función para abrir el modal desde otro lugar si se requiere
  const handleOpenModalClick = (index) => {
    setModalIndex(index);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Renderiza el modal de información si está abierto y el mapa seleccionado no es el 2
  return (
    <>
      {isModalOpen && modalIndex !== null && selectedMap != 2 && (
        <InfoModal onClose={handleCloseModal} datos={modalData[modalIndex]} />
      )}

    </>
  );
};

export default ToponimosLayer;
