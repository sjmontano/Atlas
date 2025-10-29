import React, { useState } from 'react';
import './SidebarBottom.css';
import { Link } from 'react-router-dom';
import hoverImage from "../../../../public/assets/img/background/capitulo1.webp";
import ModalEnConstruccion from '../../Home/Modal/ModalEnConstruccion';

const SidebarBottom = ({ onMapChange, chapters=[], mapas=[], setIsChapterOpen, selectedChapter}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [constructionModalOpen, setConstructionModalOpen] = useState(false);
  const [constructionTitle, setConstructionTitle] = useState('');

  const isChapterMode = !!chapters;
  const mapData = isChapterMode ? chapters : mapas;
  const to=[
    {chapter:"/chapter1"},
    {chapter:"/chapter2"},
    {chapter:null}, // Cap. III - en construcción
    {chapter:null}, // Cap. IV - en construcción
  ]

  return (
    <aside className="sidebar-bottom">
      {mapData.map((item, index) => {
        const handleMouseEnter = () => setHoveredIndex(index);
        const handleMouseLeave = () => setHoveredIndex(null);
        const isHovered = hoveredIndex === index;
        const isSelected = index === selectedChapter - 1;

        // Verificar si es un capítulo en construcción (índices 2 y 3 = Cap. III y IV)
        const isConstructionChapter = isChapterMode && (index === 2 || index === 3);
        
        // Determinar el tipo de wrapper y sus props
        const Wrapper = (isChapterMode && !isSelected && !isConstructionChapter) ? Link : 'div';
        
        let wrapperProps = {};
        if (isConstructionChapter && !isSelected) {
          // Cap. III y IV → abrir modal de construcción
          wrapperProps = { 
            onClick: () => {
              setConstructionTitle(item.title);
              setConstructionModalOpen(true);
            }
          };
        } else if (isChapterMode && !isSelected) {
          // Otros capítulos → navegar normalmente
          wrapperProps = { to: to[index].chapter };
        } else if (!isSelected) {
          // Modo mapas → cambiar mapa
          wrapperProps = { onClick: () => onMapChange(index + 1) };
        }

        return (
          <Wrapper
            key={item.id}
            id={item.id}
            className={`sidebar-bottom-item ${isSelected ? 'selected' : ''}`}
            onMouseEnter={!isSelected ? handleMouseEnter : undefined}
            onMouseLeave={!isSelected ? handleMouseLeave : undefined}
            {...wrapperProps}
          >
            <img className="fondoItem" src={isHovered && !isSelected ? hoverImage : item.img} alt="" />
            <div className="sidebar-bottom-overlay">
              <span className="sidebar-bottom-number">{item.number}</span>
              <span className="sidebar-bottom-icon material-symbols-outlined">keyboard_arrow_up</span>
            </div>
            {(item.image && isHovered && !isSelected) && (
              <img  className="imagenHover" src={item.image} alt={`Mapa ${item.title}`} />
            )}
            <p className="sidebar-bottom-text">
              <span className="sidebar-bottom-number">{item.number+"\n"}</span>
              <span >{item.title}</span>
            </p>
          </Wrapper>
        );
      })}

      {/* Modal de construcción */}
      <ModalEnConstruccion 
        isOpen={constructionModalOpen}
        onClose={() => setConstructionModalOpen(false)}
        titulo={constructionTitle}
      />
    </aside>
  );
};

export default SidebarBottom;
