import React from 'react';

const ImageCircle = ({ image, angle }) => {
  const circleStyle = {
    width: '120px',  // Tamaño del círculo
    height: '120px',
    borderRadius: '50%',
    backgroundImage: `url(${image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    cursor: 'pointer',
    border: '6px solid #003366', // Borde azul más grueso como en el ejemplo
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // Asegura que la imagen no sobresalga
  };

  // SVG de la flecha
  const svgStyle = {
    transform: `rotate(${angle}deg)`, // Aplica la rotación al SVG
    transition: 'transform 0.3s ease', // Transición suave al rotar
  };

  return (
        <svg style={svgStyle} width="129" height="107" viewBox="0 0 129 107" fill="none" xmlns="http://www.w3.org/2000/svg">
          
          <path d="M91.4298 91.4296C70.732 112.127 37.1743 112.127 16.4765 91.4296C-4.22132 70.7318 -4.22132 37.1741 16.4765 16.4763C37.1742 -4.2215 70.732 -4.22151 91.4298 16.4763L128.906 53.9529L91.4298 91.4296Z" fill="#03103A"/>
        <image
        x="10"  // Ajusta la posición horizontal de la imagen dentro del SVG
        y="8"  // Ajusta la posición vertical de la imagen dentro del SVG
        width="90"  // Tamaño de la imagen ajustado
        height="90"  // Tamaño de la imagen ajustado
        href={image}  // URL de la imagen
        style={{
          clipPath: 'circle(50%)',  // Aplica el estilo CSS para hacer la imagen circular,
    transform: `rotate(${angle*-1}deg)`,  // Aplica la rotación al SVG
    transformOrigin: '50% 50%' ,
    transformBox: 'fill-box',
        }}
      />
        </svg>
  );
};

export default ImageCircle;
