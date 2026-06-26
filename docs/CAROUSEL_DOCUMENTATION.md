# 📸 Sistema de Carrusel - Atlas Frontend

## 🎯 Descripción
El sistema de carrusel permite mostrar múltiples imágenes en los componentes Modal con navegación intuitiva por botones y indicadores de puntos.

## 🚀 Características Implementadas
- ✅ Carrusel de imágenes de perfil (3 imágenes SVG)
- ✅ Carrusel de imágenes de talleres (3 imágenes WEBP)
- ✅ Navegación con botones anterior/siguiente
- ✅ Indicadores de puntos circulares
- ✅ Colores de marca del Atlas (azul claro/oscuro)
- ✅ Diseño responsive para móvil y desktop
- ✅ Compatibilidad total con modales existentes

## 📁 Archivos Modificados

### Componente Principal - Modal de Perfil
- **`src/components/Sidebars/SidebarLeft/SidebarLeft.jsx`**
  - Imports de imágenes: `perfil-1.svg`, `perfil-2.svg`, `perfil-3.svg`
  - Array `imagenesCarrusel` con las tres imágenes
  - Integración con Modal component

- **`src/components/Home/Modal/Modal.jsx`**
  - Nueva prop `images` para arrays de imágenes
  - Estado `currentImageIndex` para navegación
  - Funciones: `nextImage()`, `prevImage()`, `goToImage()`
  - Renderizado condicional carrusel/imagen única

- **`src/components/Home/Modal/Modal.css`**
  - Estilos para botones de navegación
  - Indicadores de puntos con estados activo/inactivo
  - Responsive design (mobile/desktop)

### Componente Secundario - Modal de Talleres
- **`src/components/Home/Modal/modalinfo.jsx`**
  - Componente `CarruselTaller` para imágenes de talleres
  - Integración con imágenes: `taller-1.webp`, `taller-2.webp`, `taller-3.webp`
  - Descripciones personalizadas para cada imagen

- **`src/components/Home/Modal/modalInfo.css`**
  - Estilos específicos para carrusel de talleres
  - Mejoras en scrollbar personalizado
  - Optimización de layout y z-index

## 🎨 Diseño Visual

### Colores Utilizados
- **Azul claro (inactivo)**: `rgba(173, 216, 230, 0.6)`
- **Azul oscuro (activo)**: `#0599B7`
- **Botones navegación**: `rgba(0, 0, 0, 0.5)` con hover
- **Fondo modal**: `#fffeee`

### Dimensiones Responsive
- **Desktop**: Botones 40px, indicadores 12px
- **Mobile**: Botones 35px, indicadores 10px
- **Márgenes**: Adaptivos según viewport

## 🔧 Uso de los Componentes

### Carrusel de Perfil (SidebarLeft)
```jsx
// En SidebarLeft.jsx
const imagenesCarrusel = [perfil1, perfil2, perfil3];

<Modal 
  onClose={handleCloseModal} 
  images={imagenesCarrusel} 
  isOpen={true} 
  isPerfil={true}
/>
```

### Carrusel de Talleres (InfoModal)
```jsx
// En modalinfo.jsx
{id === 1 && <CarruselTaller />}

const tallerData = [
  { image: taller1, description: "Descripción del taller 1" },
  { image: taller2, description: "Descripción del taller 2" },
  { image: taller3, description: "Descripción del taller 3" }
];
```

### Modal Simple (Compatibilidad)
```jsx
<Modal 
  onClose={handleClose} 
  image={singleImage} 
  isOpen={true} 
  isPerfil={false}
/>
```

## ⚡ Funcionalidades

### Navegación
- **Botones**: Anterior (◀) / Siguiente (▶)
- **Indicadores**: Click directo en cualquier punto
- **Teclado**: Escape para cerrar modal
- **Auto-reset**: Vuelve a la primera imagen al abrir

### Estados Dinámicos
- **Loop infinito**: La navegación es circular
- **Indicadores activos**: Punto azul oscuro para imagen actual
- **Hover effects**: Animaciones suaves en botones

## 🖼️ Assets Incluidos

### Imágenes de Perfil
- `public/assets/img/perfil/perfil-1.svg` - Miembro del equipo Atlas
- `public/assets/img/perfil/perfil-2.svg` - Líder comunitario
- `public/assets/img/perfil/perfil-3.svg` - Colaborador territorial

### Imágenes de Talleres
- `public/assets/img/talleres/taller-1.webp` - Taller de participación comunitaria
- `public/assets/img/talleres/taller-2.webp` - Sesión de cartografía territorial
- `public/assets/img/talleres/taller-3.webp` - Discusión colaborativa

## 🧪 Testing Realizado
- ✅ Navegación entre imágenes funcional
- ✅ Indicadores activos correctos
- ✅ Responsive en móvil y desktop
- ✅ Compatibilidad con modales existentes
- ✅ Reset automático al abrir modal
- ✅ Performance optimizada

## 📋 Estructura de Commits
1. `feat: Add profile images imports to SidebarLeft component`
2. `feat: Add carousel functionality to Modal component`
3. `style: Add carousel CSS styles to Modal component`
4. `assets: Add profile images for carousel functionality`
5. `feat: Add taller carousel and modal improvements`
6. `assets: Add workshop images for taller carousel`
7. `docs: Add carousel system documentation`

## 🔮 Futuras Mejoras
- [ ] Navegación con gestos táctiles (swipe)
- [ ] Transiciones suaves entre imágenes
- [ ] Zoom en imágenes
- [ ] Carga lazy de imágenes
- [ ] Autoplay con pause en hover
- [ ] Soporte para videos
- [ ] Galería en pantalla completa

## 🤝 Contribución
Para contribuir al sistema de carrusel:
1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/carousel-improvement`)
3. Commit cambios (`git commit -m 'feat: improve carousel'`)
4. Push a la rama (`git push origin feature/carousel-improvement`)
5. Crear Pull Request

## 📄 Licencia
Proyecto Atlas Pluriversal - Universidad Mayor de Colombia

---

**Desarrollado para Atlas Pluriversal** 🗺️  
**Versión**: 1.5.0  
**Fecha**: Agosto 2025
