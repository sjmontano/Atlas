import React from 'react';
import './SidebarBottom.css';

// Importar imágenes SVG correctamente
import MapaCap1 from '@svg/sidebar-resources/silueta-mapa-cap-1.svg';
import MapaCap2 from '@svg/sidebar-resources/silueta-mapa-cap-2.svg';
import MapaCap3 from '@svg/sidebar-resources/silueta-mapa-cap-3.svg';
import MapaCap4 from '@svg/sidebar-resources/silueta-mapa-cap-4.svg';

const SidebarBottom = ({ onMapChange }) => {
  // Lista de capítulos con su información <- Aqui se puede agregar más items
  const chapters = [
    { id: 'capitulo-1', number: '1', title: 'El valle alto del río Cauca, su cuenca y sus mundos' },
    { id: 'capitulo-2', number: '2', title: 'Redes nodo y entramados territoriales' },
    { id: 'capitulo-3', number: '3', title: 'Los caminos del río y el codiseño territorial' },
    { id: 'capitulo-4', number: '4', title: 'Poderes y acciones en el corredor afroalimentario' },
  ];

  return (
    <aside className="sidebar-bottom">
      {chapters.map((chapter, index) => (
        <div
          key={chapter.id}
          id={chapter.id}
          className="sidebar-bottom-item"
          onClick={() => onMapChange(index)}
        >
          <div className="sidebar-bottom-overlay">
            <span className="sidebar-bottom-number">{chapter.number}</span>
            <span className="sidebar-bottom-icon material-symbols-outlined">keyboard_arrow_up</span>
          </div>
          {chapter.image && (
            <img src={chapter.image} alt={`Mapa ${chapter.title}`} />
          )}
          <p className="sidebar-bottom-text">
            <span><strong>{chapter.title}</strong></span>
          </p>
        </div>
      ))}
    </aside>
  );
};

export default SidebarBottom;