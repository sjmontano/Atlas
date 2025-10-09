import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./entramados.css";
import modalsData from "../../components/Home/Modal/modalsData";
import InfoModal from "../../components/Home/Modal/modalinfo";

import { ICONS } from "@icons/icons.js";

import next from "../../../public/assets/img/background/iconos/next.svg";
import img2 from "../../../public/assets/img/background/fondoMancha.webp";

const entramadosContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(null);

  const handleOpenModalClick = (index) => {
    setModalIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalIndex(null);
  };
  
    return (
      <div>
        <main>
          <img className="aguasEntramados" src={img2} alt="" />
          <Link to="/Bienvenidos" >
          <img
              src={ICONS.line.back.svg}
              style={{position:"absolute", zIndex: "10" ,width: "25px" , height: "25px", top: "2.5vh", left: "2%"}}
            /></Link>
          <h1 className="h1MainEntramados">Tejidos para el atlas</h1>
          <div className="entramados-content">
            <div className="section">
              <h2>Entramados territoriales</h2>
              <h3 className="h3-line">Suárez</h3>
              <div className="images">
                <img
                  src="assets\img\entramados\asocoms.webp"
                  alt="asocoms.webp"
                />
                <img
                  src="assets\img\entramados\Logo_Consejo_río_Ovejas.webp"
                  alt="Logo_Consejo_río_Ovejas.webp"
                />
                <img
                  src="assets\img\entramados\Consejo municipal de juventud.webp"
                  alt="Consejo municipal de juventud.webp"
                />
                <img
                  src="assets\img\entramados\asomuafroyo.webp"
                  alt="asomuafroyo.webp"
                />
                <img
                  src="assets\img\entramados\Guardia cimarrona.webp"
                  alt="Guardia cimarrona.webp"
                />
                <img
                  src="assets\img\entramados\Asoyoge.webp"
                  alt="Asoyoge.webp"
                />
                <img
                  src="assets\img\entramados\Plataforma de juventudes.webp"
                  alt="Plataforma de juventudes.webp"
                />
              </div>
            </div>
            <div className="section">
              <h3 className="h3-line">Villa Rica</h3>
              <div className="images">
                <img src="assets\img\entramados\ACCN.webp" alt="ACCN.webp" />

                <img
                  src="assets\img\entramados\Casilda candumi.webp"
                  alt="Casilda candumi.webp"
                />
                <img
                  src="assets\img\entramados\Uoafroc.webp"
                  alt="Uoafroc.webp"
                />
                <img
                  src="assets\img\entramados\Consejo comunitario territorio y.webp"
                  alt="Consejo comunitario territorio y.webp"
                />
                <img
                  src="assets\img\entramados\fundacionHuellas.webp"
                  alt="Colectivo socio juvenil huellas.webp"
                />
              </div>

              <div className="section">
                <h3 className="h3-line">Oriente de Cali</h3>
                <div className="images">
                  <img
                    src="assets\img\entramados\El chontaduro.webp"
                    alt="El chontaduro.webp"
                  />
                  <img
                    src="assets\img\entramados\Afroyoga.webp"
                    alt="Afroyoga.webp"
                  />
                  <img src="assets\img\entramados\matamba.webp" alt="" />

                  <img
                    src="assets\img\entramados\la laguna.webp"
                    alt="la laguna.webp"
                  />
                  <img
                    src="assets\img\entramados\mujeresDelOriente.webp"
                    alt="Matamba.webp"
                  />
                  <img
                    src="assets\img\entramados\chicasComunicativas.webp"
                    alt="Un río Cauca.webp"
                  />
                </div>
              </div>
            </div>
            <div className="buttonsEntramados">
              <Link to="/credits" className="btn2Credits">
                <img src={next} width="50%" height="50%" />
                <h2 className="tejidoText">Equipos de trabajo</h2>
              </Link>
            </div>
          </div>
        </main>
        <section className="contenedor-inferior-entramados">
          <img
            src="/assets/img/background/footer-img.webp"
            alt="Fondo footer"
            className="footer-img-entramados"
          />
          <div className="footer-content-entramados">
            <p>2025 Atlas Sur del Valle del Alto del Rio Cauca.</p>
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
      </div>
    );
  }


export default entramadosContent;
