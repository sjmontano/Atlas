import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import InfoModal from "../Modal/modalinfo";
import modalsData from "../Modal/modalsData"; // Asegúrate de importar el componente InfoModal
import "./ContentInfo.css";
import img from "../../../../public/assets/svg/sidebar-resources/fondoIcon1.svg";

import playIcon from "../../../../public/assets/svg/inicio/play.svg";
import metadata from "../../../../public/assets/svg/inicio/metadata.svg";
import fondoIcon from "../../../../public/assets/svg/inicio/fondoIcon.svg";
import credits from "../../../../public/assets/svg/inicio/credits.svg";

const ContentInfo = ({ title, subtitle, description, image, logo, logoLink }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const datos = modalsData[0]; // Datos del primer modal

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="content-info__container">
      
      <img className="img-fondo" src={image} alt="" />
      <header className="header-home">
        <a href={logoLink || "#"} target="_blank" rel="noopener noreferrer">
          <img src={logo} className="header-home-logo" alt="Logo" />
        </a>
      </header>
      <div className="content-info__content">
        <div className="mapa-image-mini">
          <img src="assets/img/background/miniMapSur.webp" alt="" />
        </div>
        <section className="content-titles">
          <h1 className="home-title">{title}</h1>
          <h3 className="home-subtitle">{subtitle}</h3>
        </section>
        <p className="home-description">{description}</p>
      </div>

      <div className="buttons">
        <div className="btn_1" onClick={handleOpenModal}>
          <div className="homeTooltip-marker">
            <span>
              <React.Fragment key={0}>
                Ficha técnica
                <br />
              </React.Fragment>
            </span>
            <img src={img} alt="" />
          </div>
          <img src={fondoIcon} width="90%" height="90%" />
          <img src={metadata} width="70%" height="70%" />
        </div>
        {/* Botón de inicio */}
        <Link to="/Bienvenidos">
          <div className="btn_2">
            <div className="homeTooltip-marker">
              <span>
                <React.Fragment key={0}>
                  Inicio
                  <br />
                </React.Fragment>
              </span>
              <img src={img} alt="" />
            </div>
            <img src={fondoIcon} width="90%" height="90%" />
            <img src={playIcon} width="70%" height="70%" />
          </div>
        </Link>
        
        {/* Botón de créditos */}
        <Link to="/entramados">
          <div className="btn_credits">
            <div className="homeTooltip-marker">
             
              <span>
                <React.Fragment key={0}>
                  Tejidos para el atlas
                  <br />
                </React.Fragment>
              </span>
              <img src={img} alt="" />
            </div>
            <img src={credits} width="70%" height="70%" alt="Créditos" />
          </div>
        </Link>
      </div>

      {isModalOpen && <InfoModal onClose={handleCloseModal} datos={datos}/>}
    </div>
  );
};

ContentInfo.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
};

export default ContentInfo;
