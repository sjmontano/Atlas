import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { RiCloseLargeFill } from "react-icons/ri";
import { HiArrowCircleLeft, HiArrowCircleRight } from "react-icons/hi";
import { useModal } from "../../../context/ContextModal";
import "./Modal.css";

const Modal = ({ isOpen, onClose, text, texto, image }) => {
  const { navigateModal } = useModal();

  // Referencias a elementos específicos dentro del modal
  const span = useRef(null);
  const linea = useRef(null);
  const titulo = useRef(null);

  // Ajusta la alineación del texto y la línea dependiendo del contenido del modal
  useEffect(() => {
    if (span.current && linea.current && titulo.current) {
      const textosDerecha = [
        "Paramo De Moras",
        "Nevado Huila",
        "Distrito Agua Blanca",
        "Laguna del Sonso",
        "Paramo Las Hermosas",
        "La Salvajina",
      ];

      if (textosDerecha.includes(text)) {
        span.current.style.left = "50%";
        linea.current.style.left = "50%";
        linea.current.style.width = "50%";
        titulo.current.style.left = "50%";
      } else {
        span.current.style.left = "8%";
        linea.current.style.left = "0";
        linea.current.style.width = "50%";
        titulo.current.style.left = "8%";
      }
    }
  }, [text]);

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

  return (
    <motion.div
      className="modal"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4 }}
    >
      <div className="modal-content" style={{ backgroundImage: `url(${image})` }}>
        {/* Botón para cerrar el modal */}
        <button id="botonSalir" onClick={onClose}>
          <RiCloseLargeFill size="40px" />
        </button>

        {/* Botón para avanzar al siguiente modal */}
        <button id="btnDerecha" onClick={() => navigateModal("next")}>
          <HiArrowCircleRight size="40px" />
        </button>

        {/* Botón para retroceder al modal anterior */}
        <button id="btnIzquierda" onClick={() => navigateModal("prev")}>
          <HiArrowCircleLeft size="40px" />
        </button>

        {/* Contenido del modal */}
        <h1 ref={titulo} className="modal-title">{text}</h1>
        <div className="linea" ref={linea}></div>
        <span ref={span} className="modal-text">{texto}</span>
      </div>
    </motion.div>
  );
};

export default Modal;