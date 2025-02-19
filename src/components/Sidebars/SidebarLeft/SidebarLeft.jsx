import React from 'react';
import './SidebarLeft.css'; // Importa los estilos correspondientes

const SidebarLeft = () => {
  return (
    <aside className="sidebar-left">
      {/* Lista de ítems dentro del sidebar */}
      <ul className="sidebar-left-list">
        
        {/* Ítem 1 */}
        <li className="sidebar-left-item">
          <span className="sidebar-left-icon material-symbols-outlined">auto_stories</span>
          <p className="sidebar-left-text">
            <strong>I.</strong> El valle alto del río Cauca, <br />
            <strong>su cuenca y sus mundos</strong>
          </p>
        </li>

        {/* Ítem 2 */}
        <li className="sidebar-left-item">
          <span className="sidebar-left-icon material-symbols-outlined">info</span>
          <p className="sidebar-left-text">
            <strong>II.</strong> Dinámicas ambientales y territoriales, <br />
            <strong>caminos y transformaciones</strong>
          </p>
        </li>

        {/* Ítem 3 */}
        <li className="sidebar-left-item">
          <span className="sidebar-left-icon material-symbols-outlined">border_inner</span>
          <p className="sidebar-left-text">
            <strong>III.</strong> Ecosistemas y biodiversidad, <br />
            <strong>riqueza y fragilidad</strong>
          </p>
        </li>

        {/* Ítem 4 */}
        <li className="sidebar-left-item">
          <span className="sidebar-left-icon material-symbols-outlined">map</span>
          <p className="sidebar-left-text">
            <strong>IV.</strong> Comunidades y cultura, <br />
            <strong>historias y saberes</strong>
          </p>
        </li>

        {/* Ítem 5 */}
        <li className="sidebar-left-item">
          <span className="sidebar-left-icon material-symbols-outlined">download</span>
          <p className="sidebar-left-text">
            <strong>V.</strong> Producción y economía, <br />
            <strong>tradición e innovación</strong>
          </p>
        </li>

        {/* Ítem 6 */}
        <li className="sidebar-left-item">
          <span className="sidebar-left-icon material-symbols-outlined">question_mark</span>
          <p className="sidebar-left-text">
            <strong>VI.</strong> Retos y perspectivas, <br />
            <strong>futuro del valle alto del Cauca</strong>
          </p>
        </li>

      </ul>
    </aside>
  );
};

export default SidebarLeft;
