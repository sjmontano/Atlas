import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import nextIcon from "../../../../public/assets/img/background/iconos/next.svg";
import linea from "../../../../public/assets/svg/inicio/linea.svg";
import salir from "../../../../public/assets/svg/inicio/salir.svg";
import "./modalInfo.css"; // Asegúrate de tener los estilos necesarios
import "./modalSizes.css"; // Importar sistema de tamaños

// Importaciones de imágenes del taller para el carrusel
import taller1 from "../../../../public/assets/img/talleres/taller-1.webp";
import taller2 from "../../../../public/assets/img/talleres/taller-2.webp";
import taller3 from "../../../../public/assets/img/talleres/taller-3.webp";
import { Padding } from "maplibre-gl";

// Componente de carrusel para el InfoModal

// Componente para el botón de cierre del modal
const CloseButton = ({ onClose, right="0vw", top="30%"}) => (
  <img
    src={salir}
    className="close-btn-modal-info"
    style={{left:right, top:top}}
    id="closeModal-info"
    onClick={onClose}
    alt="Cerrar modal"
  />
);

CloseButton.propTypes = {
  onClose: PropTypes.func.isRequired,
};



// Componente para el botón de compartir en redes sociales

// Componente principal del modal
const ModalImagen = ({ onClose, datos }) => {
    
  
  return (
    <div  className={`modal-info  modal-size-${datos.id>=70 ? "medium" : "gigante"}`} style={{padding:"0"}} id="modal-info">
      
          <CloseButton onClose={onClose} right={"1vw"} top={"3vw"} />
         {datos.texto}
          
    </div>
  );
};

ModalImagen.propTypes = {
  onClose: PropTypes.func.isRequired,
  datos: PropTypes.shape({
    id: PropTypes.number, // Agregar validación para id
    layaut: PropTypes.string,
    size: PropTypes.string, // Agregar validación para size
    icono: PropTypes.node,
    title: PropTypes.string,
    highLight: PropTypes.string,
    texto: PropTypes.node,
    image: PropTypes.string,
    description: PropTypes.string,
    boton: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    link: PropTypes.string,
  }).isRequired,
};

export default ModalImagen;
