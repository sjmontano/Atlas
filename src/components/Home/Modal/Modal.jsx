import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import linea from "../../../../public/assets/svg/inicio/linea.svg";
import salir from "../../../../public/assets/svg/inicio/salir.svg";
import nextIcon from "../../../../public/assets/img/background/iconos/next.svg";
import "./Modal.css";
import fondoGota from "../../../../public/assets/svg/sidebar-resources/fondoIcon1.svg";
import gota from "../../../../public/assets/svg/sidebar-resources/marker1.svg";


const Modal = ({ isOpen, onClose, text="", texto="", image="" , images=[], id =0, isPerfil=false}) => {
  // Referencias a elementos específicos dentro del modal
  const span = useRef(null);
  const lineaRef = useRef(null);
  const titulo = useRef(null);

  // Estado para el carrusel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Funciones del carrusel
  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    }
  };

  // Función del carrusel
  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  // Reset del índice cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
    }
  }, [isOpen]);

    

  // Ajusta la alineación del texto y la línea dependiendo del contenido del modal
useEffect(() => {
  const idsDerecha = new Set([
    "paramoHermosas",
    "CerroTeta",
    "salvajina",
    "lagunaSonso",
    "villarica",
    "pondaje",
    "suarez",
    "orienteDeCali",
  ]);

  const isRightAligned = idsDerecha.has(id);

  if (span.current && titulo.current && lineaRef.current) {
    // Remueve clases anteriores
    span.current.classList.remove("modal-align-left", "modal-align-right");
    titulo.current.classList.remove("modal-align-left", "modal-align-right");
    lineaRef.current.classList.remove("linea-align-left", "linea-align-right");

    // Aplica la nueva clase
    const alignClass = isRightAligned ? "modal-align-right" : "modal-align-left";
    const lineaClass = isRightAligned ? "linea-align-right" : "linea-align-left";

    span.current.classList.add(alignClass);
    titulo.current.classList.add(alignClass);
    lineaRef.current.classList.add(lineaClass);
  }
}, [id, text, isOpen]);


  // Permite cerrar el modal con la tecla "Escape"
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Retorna `null` si el modal no está abierto para evitar que se renderice
  if (!isOpen) return null;

  // Determinar qué imagen mostrar
  const imageToShow = isPerfil && images.length > 0 ? images[currentImageIndex] : image;

  return (
    <motion.div
      className={`modal ${isPerfil ? 'modal-perfil' : ''}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4 }}
    >
      <div className="modal-content">
        {/* Imagen principal */}
        <img className="imagenModalGrande" src={imageToShow} alt="" />
        
        {/* Botón para cerrar el modal */}
        <button id="botonSalir" onClick={onClose}>
          <img src={salir} alt="" />
        </button>

        {/* Carrusel para perfil */}
        {isPerfil && images.length > 1 && (
          <>
            {/* Botones de navegación */}
            <button 
              className="carousel-btn carousel-btn-prev" 
              onClick={prevImage}
              aria-label="Imagen anterior"
            >
              <img src={nextIcon} alt="Anterior" style={{ transform: 'rotate(-180deg)' }} />
            </button>
            <button 
              className="carousel-btn carousel-btn-next" 
              onClick={nextImage}
              aria-label="Siguiente imagen"
            >
              <img src={nextIcon} alt="Siguiente" />
            </button>

            {/* Indicadores de puntos */}
            <div className="carousel-indicators">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => goToImage(index)}
                  aria-label={`Ir a imagen ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Botón para avanzar al siguiente modal 
        <button id="btnDerecha" onClick={() => navigateModal("next")}>
          <HiArrowCircleRight size="40px" />
        </button>

         Botón para retroceder al modal anterior 
        <button id="btnIzquierda" onClick={() => navigateModal("prev")}>
          <HiArrowCircleLeft size="40px" />
        </button>*/}
        
        {/* Elementos decorativos para modales normales */}
        {!isPerfil && <img className="fondoGota" src={fondoGota} alt="" />}
        {!isPerfil && <img className="gotaModal" src={gota} alt="" />}
        {!isPerfil && <img className="linea" src={linea} alt="" />}

        {/* Contenido del modal para modales normales */}
        {!isPerfil && (
          <>
            <h1 ref={titulo} className="modal-title">{text}</h1>
            {/*<img src={linea}  ref={lineaRef}  />*/}
            <span ref={span} className="modal-text">{texto}</span>
          </>
        )}
        
      </div>
    </motion.div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  text: PropTypes.string,
  texto: PropTypes.string,
  image: PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.string), // Nueva prop para múltiples imágenes
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isPerfil: PropTypes.bool,
};
export default Modal;
