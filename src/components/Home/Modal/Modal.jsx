import { motion } from "framer-motion";
import { RiCloseLargeFill } from "react-icons/ri";
import "./Modal.css";

const Modal = ({ isOpen, onClose, text, texto, image }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="modal"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4 }}
    >
      <div className="modal-content">
        <img src={image} alt={text} loading="lazy" />
        <button onClick={onClose}>
          <RiCloseLargeFill size="40px" />
        </button>
        <h1>{text}</h1>
        <p>{texto}</p>
      </div>
    </motion.div>
  );
};

export default Modal;