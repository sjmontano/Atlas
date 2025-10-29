import React, { useState } from 'react';
import './SidebarMain.css';
import ModalEnConstruccion from '../../Home/Modal/ModalEnConstruccion';

const SidebarMain = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubmenuId, setOpenSubmenuId] = useState(null);
  const [constructionModalOpen, setConstructionModalOpen] = useState(false);
  const [constructionTitle, setConstructionTitle] = useState('');

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const toggleSubmenu = (id) => {
    setOpenSubmenuId(prevId => prevId === id ? null : id);
  };

  const handleConstructionClick = (title) => {
    setConstructionTitle(title);
    setConstructionModalOpen(true);
  };

  const sidebarItems = [
    { id: 1, icon: 'home_app_logo', number: '', title: 'Inicio' },
    { id: 2, icon: 'location_on', number: '', title: 'Cuenca Cauca' },
    {
      id: 3,
      icon: '',
      number: 'I',
      title: 'El valle alto del río Cauca, la cuenca y sus mundos',
      hasSubmenu: true,
      subitems: [
        { id: 'mapa-1', title: 'Mapa 1' },
        { id: 'mapa-2', title: 'Mapa 2' },
        { id: 'mapa-3', title: 'Mapa 3' },
        { id: 'mapa-4', title: 'Mapa 4' }
      ]
    },
    { id: 4, icon: 'icon1', number: 'II', title: 'Redes nodo y entramados territoriales' },
    { id: 5, icon: '', number: 'III', title: 'Los caminos del río en el valle alto' },
    { id: 6, icon: '', number: 'IV', title: 'Actores, acciones, capacidades y poderes' },
    { id: 7, icon: 'sentiment_satisfied', number: '', title: 'Créditos' }
  ];

  return (
    <div>
      <button
        id="menu-toggle-btn"
        className="menu-toggle"
        onClick={toggleSidebar}
      >
        <span className={`menu-icon material-symbols-outlined ${isSidebarOpen ? 'menu-hide' : 'menu-show'}`}>
          menu
        </span>
        <span className={`menu-icon material-symbols-outlined ${isSidebarOpen ? 'menu-show' : 'menu-hide'}`}>
          close
        </span>
      </button>

      <aside className={`sidebar-main ${isSidebarOpen ? 'active' : ''}`}>
        <ul className="sidebar-main-list">
          {sidebarItems.map((item) => (
            <li
              key={item.id}
              className={`sidebar-main-item ${openSubmenuId === item.id ? 'active' : ''}`}
              onClick={() => {
                // Cap. III (id: 5) y Cap. IV (id: 6) abren modal de construcción
                if (item.id === 5 || item.id === 6) {
                  handleConstructionClick(item.title);
                } else if (item.hasSubmenu) {
                  toggleSubmenu(item.id);
                }
              }}
            >
              {/* Contenido principal del ítem */}
              <div className="main-content">
                <div className="sidebar-main-icon-container">
                  {item.icon && (
                    <span className="sidebar-main-icon material-symbols-outlined">
                      {item.icon}
                    </span>
                  )}
                  {item.number && (
                    <span className="sidebar-main-number">
                      {item.number}
                    </span>
                  )}
                </div>
                <span className="sidebar-main-text"><strong>{item.title}</strong></span>
              </div>

              {/* Submenú */}
              {item.hasSubmenu && (
                <div className="submenu">
                  <div className="submenu-content">
                    {item.subitems.map((subitem) => (
                      <div key={subitem.id} className="submenu-item">
                        {subitem.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </aside>

      {/* Modal de construcción */}
      <ModalEnConstruccion 
        isOpen={constructionModalOpen}
        onClose={() => setConstructionModalOpen(false)}
        titulo={constructionTitle}
      />
    </div>
  );
};

export default SidebarMain;