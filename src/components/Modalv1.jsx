import { useRef } from "react";
import PropTypes from "prop-types";
import "../styles/Modal.css";
import { FiInfo } from "react-icons/fi";
import { GrClose } from "react-icons/gr";

const Modal = ({ setIsModalActive, data }) => {
    const modalRef = useRef(null); // Referencia al modal para manipularlo directamente

    // Función para cerrar el modal
    const closeModal = () => {
        setIsModalActive(false);
    };

    // Función para permitir el arrastre del modal
    const handleMouseDown = (e) => {
        const modal = modalRef.current;
        const offsetX = e.clientX - modal.getBoundingClientRect().left; // Distancia desde la izquierda
        const offsetY = e.clientY - modal.getBoundingClientRect().top; // Distancia desde la parte superior

        // Función para mover el modal mientras se arrastra
        const handleMouseMove = (e) => {
            modal.style.left = `${e.clientX - offsetX}px`;
            modal.style.top = `${e.clientY - offsetY}px`;
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

    const { name, description, imageUrl } = data;

    return (
        <div
            className="modal"
            ref={modalRef}
            style={{ backgroundImage: `url(${imageUrl})` }} // Establecer imagen de fondo
            onMouseDown={handleMouseDown}
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

            <div className="atlas-heading-content">
                <h1>Atlas</h1>
                <h3>Un río Cauca, muchos mundos</h3>
            </div>

            <div className="modal-content">
                <div>
                    <h1 className="modal-title">{name}</h1>
                </div>
                <div>
                    <p className="modal-text">{description}</p>
                </div>
            </div>

            <div>
                <img src={imageUrl} alt="Imagen del modal" className="modal-image" />
            </div>
        </div>
    );
};

Modal.propTypes = {
    setIsModalActive: PropTypes.func.isRequired,
    data: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
    }).isRequired,
    imageUrl: PropTypes.string.isRequired, // Propiedad de la imagen
};

export default Modal;
