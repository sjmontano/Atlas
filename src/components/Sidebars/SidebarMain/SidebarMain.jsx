import React, { useState, useEffect } from 'react';
import './SidebarMain.css'; // Importa los estilos

const SidebarMain = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Función para abrir y cerrar el sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  // Función para cerrar el sidebar al presionar la tecla ESC
  const handleEscClose = (event) => {
    if (event.key === 'Escape') {
      setIsSidebarOpen(false);
    }
  };

  // Función para cerrar el sidebar cuando se hace clic fuera de él
  const handleClickOutside = (event) => {
    const sidebar = document.querySelector('.sidebar-main');
    const toggleBtn = document.getElementById('menu-toggle-btn');
    if (!sidebar.contains(event.target) && !toggleBtn.contains(event.target)) {
      setIsSidebarOpen(false);
    }
  };

  // Efecto para escuchar las teclas y clics fuera del sidebar
  useEffect(() => {
    document.addEventListener('keydown', handleEscClose);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscClose);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div>
      {/* Botón para abrir/cerrar el sidebar */}
      <button
        id="menu-toggle-btn"
        className="menu-toggle"
        onClick={toggleSidebar}
      >
        <span
          className={`menu-icon material-symbols-outlined ${isSidebarOpen ? 'menu-hide' : 'menu-show'}`}
        >
          menu
        </span>
        <span
          className={`menu-icon material-symbols-outlined ${isSidebarOpen ? 'menu-show' : 'menu-hide'}`}
        >
          close
        </span>
      </button>

      {/* Sidebar principal */}
      <aside className={`sidebar-main ${isSidebarOpen ? 'active' : ''}`}>
        <ul className="sidebar-main-list">
          
          {/* Ítem 1: Inicio */}
          <li className="sidebar-main-item">
            <div className="sidebar-main-icon-container">
              <span className="sidebar-main-icon material-symbols-outlined">home_app_logo</span>
            </div>
            <span className="sidebar-main-text">Inicio</span>
          </li>

          {/* Ítem 2: Cuenca Cauca */}
          <li className="sidebar-main-item">
            <div className="sidebar-main-icon-container">
              <span className="sidebar-main-icon material-symbols-outlined">location_on</span>
            </div>
            <span className="sidebar-main-text">Cuenca Cauca</span>
          </li>

          {/* Ítem 3: Capítulo 1 */}
          <li className="sidebar-main-item">
            <div className="sidebar-main-icon-container">
              <span className="sidebar-main-number">I</span>
            </div>
            <span className="sidebar-main-text">El valle alto del río Cauca, la cuenca y sus mundos</span>
          </li>

          {/* Ítem 4: Capítulo 2 */}
          <li className="sidebar-main-item">
            <div className="sidebar-main-icon-container">
              <span className="sidebar-main-number">II</span>
            </div>
            <span className="sidebar-main-text">Redes nodo y entramados territoriales</span>
          </li>

          {/* Ítem 5: Capítulo 3 */}
          <li className="sidebar-main-item">
            <div className="sidebar-main-icon-container">
              <span className="sidebar-main-number">III</span>
            </div>
            <span className="sidebar-main-text">Los caminos del río en el valle alto</span>
          </li>

          {/* Ítem 6: Capítulo 4 */}
          <li className="sidebar-main-item">
            <div className="sidebar-main-icon-container">
              <span className="sidebar-main-number">IV</span>
            </div>
            <span className="sidebar-main-text">Actores, acciones, capacidades y poderes</span>
          </li>

          {/* Ítem 7: Capítulo 5 */}
          <li className="sidebar-main-item">
            <div className="sidebar-main-icon-container">
              <span className="sidebar-main-number">V</span>
            </div>
            <span className="sidebar-main-text">Actores, acciones, capacidades y poderes</span>
          </li>

          {/* Ítem 8: Acerca de */}
          <li className="sidebar-main-item">
            <div className="sidebar-main-icon-container">
              <span className="sidebar-main-icon material-symbols-outlined">read_more</span>
            </div>
            <span className="sidebar-main-text">Acerca de</span>
          </li>

          {/* Ítem 9: Créditos */}
          <li className="sidebar-main-item">
            <div className="sidebar-main-icon-container">
              <span className="sidebar-main-icon material-symbols-outlined">sentiment_satisfied</span>
            </div>
            <span className="sidebar-main-text">Créditos</span>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default SidebarMain;
