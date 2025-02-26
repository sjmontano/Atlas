import React from 'react';
import './Header.css'; // Importamos los estilos del header

const Header = () => {
  return (
    <header className="header">
      {/* Grupo izquierdo: Icono de regreso + Título */}
      <div className="header-left-group">
        {/* Icono de regreso */}
        <div className="header-back">
          <span className="material-symbols-outlined">arrow_back</span>
        </div>

        {/* Título del header */}
        <div className="header-title">
          <h1>
            <span className="header-title-bold">Cuenca Alta</span>
            <span className="header-title-normal"> del río Cauca</span>
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
