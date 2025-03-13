import { useRef } from "react";
import { useEffect } from "react";
import PropTypes from "prop-types";
import "../styles/Modal.css";
import logoModal from "../../assets/logo-modal.png"
import { FiInfo } from "react-icons/fi";
import { GrClose } from "react-icons/gr";
import { RiCloseLargeFill } from "react-icons/ri";


const Modal = ({ isOpen, onClose, text, image,derecha,izquierda }) => {
    const modalRef = useRef(null); // Referencia al modal para manipularlo directamente


    // Función para permitir el arrastre del modal
    const handleMouseDown = (e) => {
        const modal = modalRef.current;
        const offsetX = e.clientX - modal.getBoundingClientRect().left; // Distancia desde la izquierda
        const offsetY = e.clientY - modal.getBoundingClientRect().top; // Distancia desde la parte superior


        // Función para mover el modal mientras se arrastra
        const handleMouseMove = (e) => {
            modal.style.left = `${e.clientX}px`;
            modal.style.top = `${e.clientY}px`;
        };

        // Eliminar los eventos cuando se suelta el ratón
        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        // Añadir event listeners para mover el modal
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };




    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="modal"
            ref={modalRef}
        // onMouseDown={handleMouseDown}
        >
            {/* Si deseas mantener la cabecera, puedes descomentar esta sección */}
            {/* <div className="modal-header">
                <FiInfo className="info-icon" />
                <GrClose
                    className="button-close"
                    color="#0F6E50"
                    onClick={closeModal}
                />
            </div> */}

           
            <div className="modal-content"

                style={{ backgroundImage: `url(${image})` }} // Establecer imagen de fondo
            >

                <button id="botonSalir" className="absolute top-2 right-2 text-black" onClick={onClose}>
                    
                    <RiCloseLargeFill  color="#0F6E50" size="30px" className="map-marker"/>

                </button>


                <h1>{text}</h1>
                <div className="linea"></div>
                <span>Abastece las dos cuencas mas importantes del país (Cuenca alta del <br />
                    Río Magdalena y Cuenca alta del Río Cauca) catalogándola como una <br />
                    estrella hídrica del macizo colombiano, que aporta bienes y servicios <br />
                    ambientales representados en ecosistemas de Páramo, subparamo, <br />
                    bosque Andino y altoandino, favoreciendo asi la viabilidad de <br />
                    especies de flora y fauna.</span>

            </div>

        </div>
    );
};

export default Modal;
