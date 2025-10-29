import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./SidebarLeft.css";
import InfoModal from "../../Home/Modal/modalinfo";
import ModalGaleria from "../../Home/Modal/ModalGaleria";

import fondoItem from "../../../../public/assets/img/background/sidebardLeftItem.webp";
import fondoIcon from "../../../../public/assets/svg/todos/Hud/icons/icon-line-webp/icon-frame-1.webp";

import perfil1 from "../../../../public/assets/img/perfil/perfil-1.svg";
import perfil2 from "../../../../public/assets/img/perfil/perfil-2.svg";
import perfil3 from "../../../../public/assets/img/perfil/perfil-3.svg";


import Modal from "../../Home/Modal/Modal";
const SidebarLeft = ({ datos, icons = [] , onMapChange, selectedMap, galeriaData = null}) => {
  const navigate = useNavigate();
  const [topMargin] = useState("4%");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMapoteca, setIsMapoteca] = useState(false);
  const [isGaleriaOpen, setIsGaleriaOpen] = useState(false);
  
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Array de imágenes del perfil para el carrusel
  const imagenesCarrusel = [perfil1, perfil2, perfil3];

  const handleOpenModalClick = (id, title="") => {
    if (title==="Presentación") {
      
      setIsModalOpen(true);
    } else if (title==="Galería de imágenes") {
      // Abrir galería de imágenes si hay datos disponibles
      if (galeriaData && galeriaData.imagenes && galeriaData.imagenes.length > 0) {
        setIsGaleriaOpen(true);
      }
    } else if (title==="Ficha técnica" || title==="Perfil cuenca") {
      const link = icons[1]?.link;
      if (link && link.includes("https://docs.google")) {
        window.open(link, "_blank", "noopener,noreferrer");
      } else if (link && link.includes("https://drive.google")) {
        window.open(link, "_blank", "noopener,noreferrer");
      } else {
        setIsMapoteca(true);
      }
    } else if (id === 4) {
        const mapId = parseInt(icons[id - 1].link);
        onMapChange(mapId);
      
      }else if (icons[id - 1].link) {
      if (icons[id - 1].link.includes("https://drive")) {
        window.open(icons[id - 1].link, "_blank");
      } else {
        navigate(icons[id - 1].link);
      }
    }
  };
 
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsMapoteca(false);
    setIsGaleriaOpen(false);
  };

  return (
    <aside className="sidebar-left" style={{ marginTop: topMargin }}>
      <ul className="sidebar-left-list">
        {icons.map((item, index) => {
          const handleMouseEnter = () => setHoveredIndex(index);
          const handleMouseLeave = () => setHoveredIndex(null);
          const isHovered = hoveredIndex === index;

          return (
            <li
              key={item.id}
              onClick={() => handleOpenModalClick(item.id, item.title)}
              className="sidebar-left-item"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                position: "relative",
                marginLeft: "2vh",
                display: "flex",
                alignItems: "center",
                ...(item.hasSpacing ? { marginBottom: item.spacing } : {}),
              }}
            >
              {/* Contenedor fijo para el ícono + fondo */}
              <div className="icon-container">
                <img
                  src={fondoIcon}
                  alt="Fondo ícono"
                  className="icon-background"
                />

                <img src={item.icon} alt="Ícono" className="icon-img" />
              </div>

              {isHovered && (
                <img
                  src={fondoItem}
                  alt="Hover fondo"
                  className="hover-background"
                />
              )}
              {/* Texto */}
              <p className={`sidebar-left-text ${isHovered ? "visible" : ""}`}>
                <strong>{item.title}</strong>
                <br />
                {item.subtitle && (
                  <strong className="has-subtitle">{item.subtitle}</strong>
                )}
              </p>
            </li>
          );
        })}
      </ul>

      {isModalOpen && <InfoModal onClose={handleCloseModal} datos={datos} />}
      {isMapoteca && (
        <Modal
          onClose={handleCloseModal}
          images={imagenesCarrusel}
          isOpen={true}
          isPerfil={true}
        />
      )}
      {isGaleriaOpen && galeriaData && (
        <ModalGaleria
          isOpen={isGaleriaOpen}
          onClose={handleCloseModal}
          titulo={galeriaData.titulo}
          imagenes={galeriaData.imagenes}
          descripciones={galeriaData.descripciones}
        />
      )}
    </aside>
  );
};

SidebarLeft.propTypes = {
  datos: PropTypes.object,
  icons: PropTypes.array,
  onMapChange: PropTypes.func,
  selectedMap: PropTypes.number,
  galeriaData: PropTypes.shape({
    titulo: PropTypes.string,
    imagenes: PropTypes.arrayOf(PropTypes.string),
    descripciones: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default SidebarLeft;
