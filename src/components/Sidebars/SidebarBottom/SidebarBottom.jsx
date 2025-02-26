import React from 'react';
import './SidebarBottom.css';

// Importar imágenes SVG correctamente
import MapaCap1 from '../../../assets/svg/sidebar-resources/silueta-mapa-cap-1.svg';
import MapaCap2 from '../../../assets/svg/sidebar-resources/silueta-mapa-cap-2.svg';
import MapaCap3 from '../../../assets/svg/sidebar-resources/silueta-mapa-cap-3.svg';
import MapaCap4 from '../../../assets/svg/sidebar-resources/silueta-mapa-cap-4.svg';

const SidebarBottom = () => {
  // Lista de capítulos con su información <- Aqui se puede agregar más items
  const chapters = [
    { id: 'capitulo-1', number: 'I', image: MapaCap1, title: 'El valle alto del río Cauca, su cuenca y sus mundos' },
    { id: 'capitulo-2', number: 'II', image: MapaCap2, title: 'Redes nodo y entramados territoriales' },
    { id: 'capitulo-3', number: 'III', image: MapaCap3, title: 'Los caminos del río y el codiseño territorial' },
    { id: 'capitulo-4', number: 'IV', image: MapaCap4, title: 'Poderes y acciones en el corredor afroalimentario' },
  ];

return (
  <aside className="sidebar-bottom">
    {chapters.map((chapter) => (
      <div key={chapter.id} id={chapter.id} className="sidebar-bottom-item">
        <div className="sidebar-bottom-overlay">
          <span className="sidebar-bottom-number">{chapter.number}</span>
          <span className="sidebar-bottom-icon material-symbols-outlined">keyboard_arrow_up</span>
        </div>
        <img src={chapter.image} alt={`Mapa ${chapter.title}`} />
        <p className="sidebar-bottom-text">
          <strong>{chapter.number}.</strong> 
          <span style={{ borderBottom: '0.1px solid rgba(var(--cyan-rgb), 0.5)'}}>{chapter.title}</span>
        </p>
      </div>
    ))}
  </aside>
);
};

export default SidebarBottom;
