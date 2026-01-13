import { useEffect } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import salir from "../../../../public/assets/svg/inicio/salir.svg";
import linea from "../../../../public/assets/svg/inicio/linea.svg";
import "./Modal.css";

/**
 * ModalEnConstruccion - Modal simple para indicar secciones en desarrollo
 * @param {boolean} isOpen - Controla si el modal está abierto
 * @param {function} onClose - Función para cerrar el modal
 * @param {string} titulo - Título del capítulo en construcción
 */
const ModalEnConstruccion = ({ isOpen, onClose, titulo = "Capítulo en construcción" }) => {
  
  // Permite cerrar el modal con la tecla "Escape"
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Retorna `null` si el modal no está abierto
  if (!isOpen) return null;

  return (
    <motion.div
      className="modal"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4 }}
      onClick={onClose} // Cerrar al hacer click en el fondo
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.2)', // Fondo más transparente
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div 
        className="modal-content modal-construccion" 
        onClick={(e) => e.stopPropagation()} // Evitar que se cierre al hacer click en el contenido
        style={{
          maxWidth: '400px',
          padding: '40px 30px',
          textAlign: 'center',
          minHeight: 'auto',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* Botón para cerrar el modal */}
        <button 
          id="botonSalir" 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            opacity: 0.8,
            transition: 'opacity 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.opacity = '1'}
          onMouseLeave={(e) => e.target.style.opacity = '0.8'}
        >
          <img src={salir} alt="Cerrar" style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }} />
        </button>

        {/* Icono de construcción */}
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
          🚧
        </div>

        {/* Mensaje */}
        <div style={{ 
          fontFamily: 'var(--atlas-font-family)',
          fontSize: '1.8rem',
          color: '#FFFFFF',
          lineHeight: '1.4',
          fontWeight: '700',
          marginBottom: '15px',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }}>
          En construcción
        </div>

        <p style={{ 
          fontSize: '1.1rem',
          color: 'rgba(255, 255, 255, 0.9)',
          lineHeight: '1.6',
          marginBottom: '25px',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
        }}>
          Este capítulo está en desarrollo.
        </p>

        {/* Botón de cerrar alternativo */}
        <button 
          onClick={onClose}
          style={{
            padding: '12px 30px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            fontSize: '1rem',
            fontFamily: 'var(--atlas-font-family)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontWeight: '600',
            backdropFilter: 'blur(5px)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }}
        >
          Cerrar
        </button>
      </div>
    </motion.div>
  );
};

ModalEnConstruccion.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  titulo: PropTypes.string
};

export default ModalEnConstruccion;
