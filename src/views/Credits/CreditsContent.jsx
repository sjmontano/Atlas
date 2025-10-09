import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Credits.css";
import modalsData from "../../components/Home/Modal/modalsData";
import InfoModal from "../../components/Home/Modal/modalinfo";
import home from "../../../public/assets/interface/ui/webp/fondoBtnHome.webp";
import homebtn from "../../../public/assets/svg/inicio/logohome2.svg";

const CreditsContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(null);
  const navigate = useNavigate();

  const handleOpenModalClick = (index) => {
    setModalIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalIndex(null);
  };
  const clickHome = () => {
    navigate("/Home");
  };

  const locations = [
    {
      name: "Nodo Suárez",
      link: "https://www.unriocauca.com/asocoms/",
      external: true,
    },
    {
      name: "Nodo Villa Rica",
      link: "https://www.unriocauca.com/accn/",
      external: true,
    },
    {
      name: "Nodo Oriente de Cali",
      link: "https://www.unriocauca.com/accc/",
      external: true,
    },
    {
      name: "Tejido de Transicionantes",
      link: "https://www.unriocauca.com/ttvc-tvgr/",
      external: true,
    },
  ];

  return (
    <main>
      <div className="homeCreditos">
        {/*<img className="homeImage" src={home} alt="" />*/}
        <img className="btnHome" onClick={clickHome} src={homebtn} alt="" />
      </div>
      <section
        className="contenedor-superior"
        style={{
          background: "linear-gradient(rgba(3, 60, 71, 0.7), rgba(3, 60, 71, 0.7)), url('/assets/svg/fondo.webp')",

          backgroundSize: "cover",
          height: "96vh",
        }}
      >

        <div className="creditos-contenedor">
          <Link to="/entramados" className="backArrowCreditos">
            <img
              src="assets/interface/icons/line/svg/back.svg"
              alt=""
              className="imagen-back-arrow"
              style={{ width: "24px", height: "24px", cursor: "pointer" }}
            />
          </Link>
          <img
            src="assets/img/background/fondoMancha.webp"
            alt=""
            className="fondo-h1-img"
          />
          <h1 className="h1MainCreditos">Equipos de trabajo</h1>
          <div className="description">
            <p>
              Este atlas es una creación colectiva del Tejido de Transicionantes
              por el Valle Geográfico del Río Cauca (TVGRC) a través de los
              colaboratorios de Cartografías críticas y codiseño territorial,
              Pensamiento para las Transiciones y Narrativas para las
              Transiciones, realizado en el marco del proyecto Diseñando
              transiciones regionales sistémicas en tiempos de emergencia social
              y climática en el sur del valle alto del río Cauca. Con el apoyo
              de: Fundación Henry Luce; One project y Fundación Ford, a través
              del Fondo para la Equidad Étnica y de Género. CEAF - Universidad
              ICESI.
            </p>

            <br />
            <div className="icon-text-container">
              <div
                className="icon-with-text"
                onClick={() => handleOpenModalClick(19)}
              >
                <img
                  src="assets/svg/imageCredits.webp"
                  className="icon"
                  alt="Icono"
                />
                <span className="text">
                  Laboratorio de Cartografías críticas y codiseño territorial
                </span>
              </div>
              <div
                className="icon-with-text"
                onClick={() => handleOpenModalClick(20)}
              >
                <img
                  src="assets/svg/imageCredits.webp"
                  className="icon"
                  alt="Icono"
                />
                <span className="text">
                  Concepción del atlas, producción cartográfica y textual
                </span>
              </div>
              <div
                className="icon-with-text"
                onClick={() => handleOpenModalClick(21)}
              >
                <img
                  src="assets/svg/imageCredits.webp"
                  className="icon"
                  alt="Icono"
                />
                <span className="text">Diseño gráfico y web</span>
              </div>
            </div>
          </div>
        </div>
        <div className="textoConocer">
          <span>Conoce sobre los entramados territoriales </span>
        </div>
        <ul className="location-list">
          {locations.map((location, index) => (
            <li key={location.name}>
              <img
                src="assets/svg/sidebar-resources/FondoTooltip4.webp"
                alt={location.name}
                onMouseEnter={(e) => {
                  e.currentTarget.src =
                    "assets/svg/sidebar-resources/FondoTooltip3.webp";
                  e.currentTarget.nextSibling.style.color = "black";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.src =
                    "assets/svg/sidebar-resources/FondoTooltip4.webp";
                  e.currentTarget.nextSibling.style.color = "white";
                }}
                onClick={() => {
                  const width = 900;
                  const height = 520;
                  const left = window.screenX + (window.innerWidth - width) / 2;
                  const top =
                    window.screenY + (window.innerHeight - height) / 1.4;

                  window.open(
                    location.link,
                    "_blank",
                    `width=${width},height=${height},scrollbars=yes,resizable=yes,left=${left},top=${top}`
                  );
                }}
                style={{ cursor: "pointer" }}
              />
              <div
                className="text-overlay"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  const width = 900;
                  const height = 520;
                  const left = window.screenX + (window.innerWidth - width) / 2;
                  const top =
                    window.screenY + (window.innerHeight - height) / 1.4;

                  window.open(
                    location.link,
                    "_blank",
                    `width=${width},height=${height},scrollbars=yes,resizable=yes,left=${left},top=${top}`
                  );
                }}
              >
                {location.name}
              </div>
            </li>
          ))}
        </ul>
        <div className="creditLogos">
          <img
            src="assets\img\entramados\logoCredits1.webp"
            alt="Logo Unriocauca"
            className="credit-logo1"
          />
          <img
            src="assets\img\entramados\logoCredits2.webp"
            alt="Logo Accn"
            className="credit-logo2"
          />
        </div>
      </section>

      <section className="contenedor-inferior-credits">
        <img
          src="assets/img/background/footer-img.webp"
          alt="Fondo footer"
          className="footer-img-credits"
        />
        <div className="footer-content-credits">
          <p>
            2025 Atlas Sur  del Valle del Alto del Rio Cauca.
          </p>
          <div className="footer-links-entramados">
              <button> 
                <img
                  className="politicasBtn-entramados"
                  src="/assets/img/background/politicas.webp"
                  alt=""
                  onClick={() => handleOpenModalClick(22)}
                />
              </button>
              <p onClick={() => handleOpenModalClick(22)} >Términos & condiciones</p>
            </div>
        </div>
      </section>

      {isModalOpen && modalIndex !== null && (
        <InfoModal onClose={handleCloseModal} datos={modalsData[modalIndex]} />
      )}
    </main>
  );
};

export default CreditsContent;
