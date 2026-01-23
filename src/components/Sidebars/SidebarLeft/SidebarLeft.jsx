import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalGaleria from "../../Home/Modal/ModalGaleria";
import InfoModal from "../../Home/Modal/modalinfo";
import Modal from "../../Home/Modal/Modal";
import ModalImagen from "../../Home/Modal/ModalImagen";
import "./SidebarLeft.css";
import modalsData from "../../Home/Modal/modalsData";
import "./SidebarLeft.css";

import fondoItem from "../../../../public/assets/img/background/sidebardLeftItem.webp";
import fondoIcon from "../../../../public/assets/svg/todos/Hud/icons/icon-line-webp/icon-frame-1.webp";

import perfil1 from "../../../../public/assets/img/perfil/perfil-1.svg";
import perfil2 from "../../../../public/assets/img/perfil/perfil-2.svg";
import perfil3 from "../../../../public/assets/img/perfil/perfil-3.svg";

const SidebarLeft = ({ datos, icons = [] , onMapChange, galeriaData = null , selectedMap=0}) => {
  const navigate = useNavigate();
  const [topMargin] = useState("4%");
  console.log(datos)
  
  const [modalIndex, setModalIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMapoteca, setIsMapoteca] = useState(false);
  const [isGaleriaOpen, setIsGaleriaOpen] = useState(false);

  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Array de imágenes del perfil para el carrusel
  const imagenesCarrusel = [perfil1, perfil2, perfil3];

  {/*const handleOpenModalClick = (id, title="") => {
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
  };*/}

  const handleOpenModalClick = (id, title = "") => {

  // 👉 Si el título es "Presentación", se abre el modal principal
  if (title === "Presentación" || title === "Perfil") {
    setIsModalOpen(true);
    const iconItem = icons.find((item) => item.title === title);
    const link = iconItem?.link;
    
     if (link==="Datos") {
      setIsModalOpen(true);
          setModalIndex(selectedMap + 63);
          console.log(selectedMap)
    } 

  // 👉 Si el título es "Galería de imágenes", se abre la galería si hay datos
  } else if (title === "Galería de imágenes") {
    if (galeriaData && galeriaData.imagenes && galeriaData.imagenes.length > 0) {
      setIsGaleriaOpen(true);
    }

  // ✅ BLOQUE MODIFICADO: Maneja correctamente "Ficha técnica" y "Perfil cuenca"
  } else if (title === "Ficha técnica" || title === "Perfil cuenca" || title === "Datos" || title==="Mapa de árbol") {
    // Busca el objeto correspondiente en el array de íconos
    const iconItem = icons.find((item) => item.title === title);
    const link = iconItem?.link;

    // Si hay un link válido, lo abre en nueva pestaña
    if (link && (link.includes("https://docs.google") || link.includes("https://drive.google"))) {
      window.open(link, "_blank", "noopener,noreferrer");
    }else if (link==="Datos") {
      setIsModalOpen(true);
          setModalIndex(selectedMap + 63);
          console.log(selectedMap)
    } else if (link) {
      // Si hay link pero no es de Google, también lo abre (por si es un PDF u otra URL)
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      // Si no hay link, abre el modal/mapoteca
      setIsMapoteca(true);
    }

  // 👉 Si el id es 4, se ejecuta el cambio de mapa
  } else if (id === 10) {
    const mapId = parseInt(icons.find(u => u.id === 10).link);
    onMapChange(mapId);

  // 👉 Si el ítem tiene un link, se abre según el tipo (Drive o navegación interna)
  } else if (icons[id - 1].link) {
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

        {(isModalOpen &&
        modalIndex !== null) && (
          <ModalImagen onClose={handleCloseModal} datos={modalsData[modalIndex]} />
  ) }

      {(isModalOpen && modalIndex === null) && <InfoModal onClose={handleCloseModal} datos={datos} />}
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
  galeriaData: PropTypes.shape({
    titulo: PropTypes.string,
    imagenes: PropTypes.arrayOf(PropTypes.string),
    descripciones: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default SidebarLeft;
