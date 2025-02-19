import React from 'react';
import './SidebarBottom.css'; // Importa los estilos correspondientes

// Importamos los archivos SVG
import cap1 from '../../../assets/svg/sidebar-resources/silueta-mapa-cap-1.svg';
import cap2 from '../../../assets/svg/sidebar-resources/silueta-mapa-cap-2.svg';
import cap3 from '../../../assets/svg/sidebar-resources/silueta-mapa-cap-3.svg';
import cap4 from '../../../assets/svg/sidebar-resources/silueta-mapa-cap-4.svg';

const SidebarBottom = () => {
  return (
    <aside className="sidebar-bottom">
        
      {/* Capítulo 1 */}
      <div id="capitulo-1" className="sidebar-bottom-item">
        <div className="sidebar-bottom-overlay">
          <span className="sidebar-bottom-number">I</span>
          <span className="sidebar-bottom-icon material-symbols-outlined">
            keyboard_arrow_up
          </span>
        </div>
        <img src={cap1} alt="Mapa Capítulo 1" />
        <p className="sidebar-bottom-text">
          <strong>I.</strong> El valle alto del río Cauca, <br />
          <strong>su cuenca y sus mundos</strong>
        </p>
      </div>

      {/* Capítulo 2 */}
      <div id="capitulo-2" className="sidebar-bottom-item">
        <div className="sidebar-bottom-overlay">
          <span className="sidebar-bottom-number">II</span>
          <span className="sidebar-bottom-icon material-symbols-outlined">
            keyboard_arrow_up
          </span>
        </div>
        <img src={cap2} alt="Mapa Capítulo 2" />
        <p className="sidebar-bottom-text">
          <strong>II.</strong> Redes nodo y
          <br />
          <strong>entramados territoriales</strong>
        </p>
      </div>

      {/* Capítulo 3 */}
      <div id="capitulo-3" className="sidebar-bottom-item">
        <div className="sidebar-bottom-overlay">
          <span className="sidebar-bottom-number">III</span>
          <span className="sidebar-bottom-icon material-symbols-outlined">
            keyboard_arrow_up
          </span>
        </div>
        <img src={cap3} alt="Mapa Capítulo 3" />
        <p className="sidebar-bottom-text">
          <strong>III.</strong> Los caminos del río y el
          <br />
          codiseño territorial en el valle alto.
        </p>
      </div>

      {/* Capítulo 4 */}
      <div id="capitulo-4" className="sidebar-bottom-item">
        <div className="sidebar-bottom-overlay">
          <span className="sidebar-bottom-number">IV</span>
          <span className="sidebar-bottom-icon material-symbols-outlined">
            keyboard_arrow_up
          </span>
        </div>
        <img src={cap4} alt="Mapa Capítulo 4" />
        <p className="sidebar-bottom-text">
          <strong>IV.</strong> Poderes y acciones
          <br />
          <strong>en el corredor afroalimentario</strong>
        </p>
      </div>
    </aside>
  );
};

export default SidebarBottom;
