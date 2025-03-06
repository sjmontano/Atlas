import React, { useState } from 'react';
import './SidebarLeft.css'; // Importa los estilos correspondientes

const SidebarLeft = () => {
  // Estado para controlar el margen superior
  const [topMargin, setTopMargin] = useState('10%'); // Valor inicial

  // Lista de capítulos y secciones del sidebar izquierdo
  const sidebarItems = [
    { id: 1, icon: 'info', title: 'Información general' },
    { id: 2, icon: 'lan', title: 'Metadata' },
    { id: 3, icon: 'map', title: 'Mapoteca' },
    { id: 4, icon: 'download', title: 'Descarga del mapa en PDF' },
  ];

  return (
    <aside className="sidebar-left" style={{ marginTop: topMargin }}>
      <ul className="sidebar-left-list">
        {sidebarItems.map((item, index) => (
          <li
            key={item.id}
            className="sidebar-left-item"
            style={item.hasSpacing ? { marginBottom: item.spacing } : {}} // Espaciado condicional
          >
            <span className="sidebar-left-icon material-symbols-outlined">{item.icon}</span>
            <p className="sidebar-left-text">
              <strong>{item.title} </strong><br />
              {/* Añadir el subtítulo solo si está presente */}
              {item.subtitle && <strong className="has-subtitle">{item.subtitle}</strong>}
            </p>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SidebarLeft;

/*
Notas para el equipo de desarrollo:
id: Identificador único para este ítem dentro de la lista, asegurándonos de que no haya duplicados.
icon: Usamos Material Symbols para los íconos. Este es el ícono que aparece junto al título del ítem. Ejemplo: check_circle para un ícono de "check" (marca).
title: Este es el título visible en la interfaz de usuario para este ítem. Debe ser breve y representativo de la sección.
subtitle: Subtítulo adicional que aparece debajo del título. Si no se desea mostrar subtítulo, puede dejarse vacío ('').
hasSpacing: Este es un valor booleano. Si se establece en true, indica que este ítem debe tener un espaciado adicional abajo (en el caso de que necesitemos separar visualmente este ítem de otros).
spacing: Si hasSpacing es true, este valor especifica cuánto espaciado se aplicará al ítem, en este caso 40px. Si no se necesita espaciado adicional, no es necesario agregar esta propiedad.

const sidebarItems = [
  { 
    id: 0, 
    icon: 'check_circle', // Icono asociado a este ítem, puede ser cualquier icono de Material Symbols
    title: 'Nuevo ítem, título', // Título principal de este ítem, visible al usuario
    subtitle: 'Subtítulo, Este es un ejemplo', // Subtítulo opcional que aparecerá debajo del título, puede dejarse vacío si no se usa
    hasSpacing: true, // Si se establece en true, se aplica un espaciado adicional para este ítem
    spacing: '40px' // Valor de espaciado para este ítem si 'hasSpacing' es true, puede ser cualquier valor en px
  },
]*/