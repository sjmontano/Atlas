import React from 'react';

const ImageCircle = ({ image, angle , tamaño=80 , color="#03103A", mapName=""}) => {
  const circleStyle = {
    width: '120px',  // Tamaño del círculo
    height: '120px',
    borderRadius: '50%',
    backgroundImage: `url(${image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    cursor: 'pointer',
    border: `6px solid ${ color =="#03103A"? "#03103A":"#003366"}`, // Borde azul más grueso como en el ejemplo
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // Asegura que la imagen no sobresalga
  };
 
  // Contenedor que permite rotar desde la punta de la gota
  const containerStyle = {
    transform: `rotate(${angle}deg)`, // Aplica la rotación desde la punta
    transition: 'transform 0.3s ease', // Transición suave al rotar
    position: 'relative',
    // Ya no necesitamos compensación porque el origen está en la punta
  };

  return (
    <div style={containerStyle}>
        <svg width={tamaño} height="80" viewBox="0 0 129 107" fill="none" xmlns="http://www.w3.org/2000/svg">
          
          <path d="M91.4298 91.4296C70.732 112.127 37.1743 112.127 16.4765 91.4296C-4.22132 70.7318 -4.22132 37.1741 16.4765 16.4763C37.1742 -4.2215 70.732 -4.22151 91.4298 16.4763L128.906 53.9529L91.4298 91.4296Z" fill={color}/>
        <image
        x= {mapName=="introduccionCap4"? "0":"10"}  // Ajusta la posición horizontal de la imagen dentro del SVG
        y= {mapName=="introduccionCap4"? "0":"8"}   // Ajusta la posición vertical de la imagen dentro del SVG
        width={mapName=="introduccionCap4"? "110":"90"}   // Tamaño de la imagen ajustado
        height={mapName=="introduccionCap4"? "110":"90"}   // Tamaño de la imagen ajustado
        href={image}  // URL de la imagen
        style={{
          clipPath: 'circle(50%)',  // Aplica el estilo CSS para hacer la imagen circular,
          transform: `rotate(${mapName=="introduccionCap4"? (angle*-1) -50:angle*-1}deg)`,  // Contra-rotación para mantener la imagen derecha
          transformOrigin: '50% 50%',
          transformBox: 'fill-box',
        }}
      />
        </svg>
    </div>
  );
};

export default ImageCircle;
