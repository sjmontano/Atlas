import React, { useState } from 'react';
import './SidebarBottom.css';
import { Link } from 'react-router-dom';
import hoverImage from "../../../../public/assets/img/background/capitulo1.webp";

const SidebarBottom = ({ onMapChange, chapters=[], mapas=[], setIsChapterOpen, selectedChapter}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const isChapterMode = !!chapters;
  const mapData = isChapterMode ? chapters : mapas;
  const to=[
    {chapter:"/chapter1"},
    {chapter:"/chapter2"},
    {chapter:"/chapter2"},
    {chapter:"/chapter2"},
  ]

  return (
    <aside className="sidebar-bottom">
      {mapData.map((item, index) => {
        const handleMouseEnter = () => setHoveredIndex(index);
        const handleMouseLeave = () => setHoveredIndex(null);
        const isHovered = hoveredIndex === index;
        const isSelected = index === selectedChapter - 1;

        const Wrapper = isChapterMode && !isSelected ? Link : 'div';
        const wrapperProps = isChapterMode && !isSelected
          ? { to: to[index].chapter }
          : { onClick: isSelected ? undefined : () => onMapChange(index + 1) };

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
    </aside>
  );
};

export default SidebarBottom;
