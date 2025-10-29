import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import salir from "../../../../public/assets/svg/inicio/salir.svg";
import nextIcon from "../../../../public/assets/svg/imageCredits.webp";
import linea from "../../../../public/assets/svg/inicio/linea.svg";
import galleryIcon from "../../../../public/assets/svg/todos/Hud/icons/icon-line-webp/gallery.svg";
import "./Modal.css";

/**
 * ModalGaleria - Componente para mostrar galerías de imágenes con navegación tipo carrusel
 * Sigue la misma estructura visual que los otros modales del sistema
 * @param {boolean} isOpen - Controla si el modal está abierto
 * @param {function} onClose - Función para cerrar el modal
 * @param {string} titulo - Título de la galería
 * @param {array} imagenes - Array de rutas de imágenes a mostrar
 * @param {array} descripciones - Array de descripciones para cada imagen
 */
const ModalGaleria = ({ isOpen, onClose, titulo = "", imagenes = [], descripciones = [] }) => {
  // Estado para el índice de la imagen actual
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Función para avanzar a la siguiente imagen
  const nextImage = () => {
    if (imagenes.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagenes.length);
    }
  };

  // Función para retroceder a la imagen anterior
  const prevImage = () => {
    if (imagenes.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + imagenes.length) % imagenes.length);
    }
  };

  // Función para ir a una imagen específica
  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  // Reset del índice cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
    }
  }, [isOpen]);

  // Permite cerrar el modal con la tecla "Escape"
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Retorna `null` si el modal no está abierto
  if (!isOpen || imagenes.length === 0) return null;

  return (
    <motion.div
      className="modal"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4 }}
    >
      <div className="modal-content">
        {/* Imagen centrada - 60% del ancho del modal */}
        <img 
          className="imagenModalGaleria" 
          src={imagenes[currentImageIndex]} 
          alt={`${titulo} - Imagen ${currentImageIndex + 1}`}
        />
        
        {/* Descripción de la imagen debajo */}
        {descripciones && descripciones[currentImageIndex] && (
          <div className="galeria-descripcion">
            <p>{descripciones[currentImageIndex]}</p>
          </div>
        )}
        
        {/* Botón para cerrar el modal */}
        <button id="botonSalir" onClick={onClose}>
          <img src={salir} alt="Cerrar" />
        </button>

        {/* Contenedor del header: icono a la izquierda, título y línea a la derecha */}
        <div className="galeria-header">
          {/* Icono de galería a la izquierda */}
          <img className="galeriaIcon" src={galleryIcon} alt="Galería" />
          
          {/* Contenedor de título y decorador a la derecha */}
          <div className="galeria-title-container">
            <h1 className="modal-title galeria-modal-title">{titulo}</h1>
            <img className="linea galeria-linea" src={linea} alt="" />
          </div>
        </div>

        {/* Controles del carrusel */}
        {imagenes.length > 1 && (
          <>
            {/* Botón anterior - con icono en espejo */}
            <button 
              className="carousel-btn carousel-btn-prev" 
              onClick={prevImage}
              aria-label="Imagen anterior"
            >
              <img 
                src={nextIcon} 
                alt="Anterior" 
                style={{ transform: 'scaleX(-1)' }} 
              />
            </button>

            {/* Botón siguiente */}
            <button 
              className="carousel-btn carousel-btn-next" 
              onClick={nextImage}
              aria-label="Siguiente imagen"
            >
              <img src={nextIcon} alt="Siguiente" />
            </button>

            {/* Indicadores de posición */}
            <div className="carousel-indicators">
              {imagenes.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => goToImage(index)}
                  aria-label={`Ir a imagen ${index + 1}`}
                />
              ))}
            </div>

            {/* Contador de imágenes */}
            <div className="carousel-counter">
              {currentImageIndex + 1} / {imagenes.length}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

ModalGaleria.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  titulo: PropTypes.string,
  imagenes: PropTypes.arrayOf(PropTypes.string).isRequired,
  descripciones: PropTypes.arrayOf(PropTypes.string),
};

export default ModalGaleria;
