import React from "react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div>
      <h1>🔗 Navegación Rápida (Dev Mode)</h1>
      <ul>
        <li><Link to="/home">🏠 Home</Link></li>
        <li><Link to="/chapter1">📖 Capítulo 1</Link></li>
        <li><Link to="/chapter2">📖 Capítulo 2</Link></li>
        {/* Agrega más capítulos según sea necesario */}
      </ul>
    </div>
  );
};

export default Index;
