/**
 * Arreglo de componentes JSX que representan los títulos y subtítulos
 * para las diferentes vistas del Capítulo 3: "Los caminos del río en el valle alto".
 * 
 * Cada elemento del arreglo corresponde a una sección específica de la narrativa.
 */
const titlesChapter3 = [
  // Título completo para la primera vista
  <h3 key="title-main">
    <span className="header-title-bold">III.</span>
    <span className="l"> Los caminos y conflictos del río Cauca en el valle alto</span>
  </h3>,

  // Subtítulos para vistas posteriores

  // Monocultivo de caña de azúcar
  <h3 key="monocultivo">
    <span className="header-title-bold">
      El desierto verde del valle alto del río Cauca
    </span>
  </h3>,

  // Aguas que llegan
  <h3 key="aguas-llegan">
    <span className="header-title-bold">
      Nos encharcaron el río
    </span>
  </h3>,

  // Se encharca arriba se deseca abajo
  <h3 key="encharca-arriba">
    <span className="header-title-bold">
      Cali deseca
    </span>
  </h3>,

  // Nos encharcaron el río
  <h3 key="encharcaron-rio">
    <span className="header-title-bold">
      Se encharca arriba se deseca abajo
    </span>
  </h3>,

  // Cali deseca
  <h3 key="cali-deseca">
    <span className="header-title-bold">
      Aguas que llegan
    </span>
  </h3>,
];

export default titlesChapter3;
