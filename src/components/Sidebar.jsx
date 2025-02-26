import { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/Sidebar.css';
import { atlasAbout, atlasCredits, atlasI, atlasII, atlasIII, atlasIV, atlasLocation, atlasV, homeIcon } from '../../assets';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isOpen); // Estado para controlar si el sidebar está abierto o cerrado

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen); // Cambia el estado del sidebar
    toggleSidebar(); // Llama a la función toggleSidebar si es necesario para acciones adicionales
  };

  return (
    <div className="sidebar-container">
      <div className={`menu-toggle ${!isSidebarOpen ? 'active' : ''}`} onClick={handleSidebarToggle} id="toggle-button">
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      <div className={`sidemenu ${isSidebarOpen ? 'open' : ''}`} id="sidebar">
        {/* Dots para el menú */}
        <div className="dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>

        {/* Menú de elementos */}
        <ul>
          <li>
            <a href="#" id='inicio'>
              <div className="icon-container">
                <img src={homeIcon} alt="Inicio" className="icon" />
              </div>
              <div className="text-container">
                <span className="text">Inicio</span>
              </div>
            </a>
          </li>
          <li>
            <a href="#" id='cuenca-cauca'>
              <div className="icon-container" >
                <img src={atlasLocation} alt="Cuenca Cauca" className="icon" />
              </div>
              <div className="text-container">
                <span className="text">Cuenca Cauca</span>
              </div>
            </a>
          </li>
          <li>
            <a href="#" id='valle-rio-cauca'>
              <div className="icon-container">
                <img src={atlasI} alt="El Valle Alto del Río Cauca" className="icon" />
              </div>
              <div className="text-container">
                <span className="text">El valle alto del río Cauca, la cuenca y sus mundos</span>
              </div>
            </a>
          </li>
          <li>
            <a href="#" id='redes-nodo'>
              <div className="icon-container">
                <img src={atlasII} alt="Redes Nodo" className="icon" />
              </div>
              <div className="text-container">
                <span className="text">Redes nodo y entramados territoriales</span>
              </div>
            </a>
          </li>
          <li>
            <a href="#" id='cambios-rio'>
              <div className="icon-container">
                <img src={atlasIII} alt="Cambios del río" className="icon" />
              </div>
              <div className="text-container">
                <span className="text">Los cambios del río en el valle alto</span>
              </div>
            </a>
          </li>
          <li>
            <a href="#" id='actores-acciones'>
              <div className="icon-container">
                <img src={atlasIV} alt="Actores y acciones" className="icon" />
              </div>
              <div className="text-container">
                <span className="text">Actores, acciones, capacidades y poderes</span>
              </div>
            </a>
          </li>
          <li>
            <a href="#" id='actores-poderes'>
              <div className="icon-container" >
                <img src={atlasV} alt="Actores y poderes" className="icon" />
              </div>
              <div className="text-container">
                <span className="text">Actores, acciones, capacidades y poderes</span>
              </div>
            </a>
          </li>
          <li>
            <a href="#" id='acerca-de'>
              <div className="icon-container">
                <img src={atlasAbout} alt="Acerca de" className="icon" />
              </div>
              <div className="text-container">
                <span className="text">Acerca de</span>
              </div>
            </a>
          </li>
          <li>
            <a href="#" id='creditos'>
              <div className="icon-container">
                <img src={atlasCredits} alt="Créditos" className="icon" />
              </div>
              <div className="text-container">
                <span className="text">Créditos</span>
              </div>
            </a>
          </li>
        </ul>

        {/* Icono de cierre del menú */}
        <i id="exit"></i>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool,
  toggleSidebar: PropTypes.func
};

export default Sidebar;

