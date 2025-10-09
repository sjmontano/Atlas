# Sistema de Estilos Atlas Pluriversal

Este directorio contiene el sistema de diseño completo para Atlas Pluriversal, organizado de manera modular y escalable.

## 📁 Estructura de Archivos

```
src/infrastructure/ui/styles/
├── index.css          # Archivo principal que importa todo el sistema
├── variables.css      # Variables CSS y tokens de diseño
├── globals.css        # Estilos base, reset y tipografía
├── utilities.css      # Clases utilitarias
├── components.css     # Componentes base reutilizables
└── animations.css     # Animaciones globales
```

## 🎨 Orden de Importación

El sistema de estilos sigue un orden específico de importación para garantizar la correcta aplicación de estilos:

1. **Variables CSS** (`variables.css`) - Tokens de diseño y variables
2. **Estilos Base** (`globals.css`) - Reset, tipografía base y elementos HTML
3. **Utilidades** (`utilities.css`) - Clases utilitarias para layout, espaciado, etc.
4. **Componentes** (`components.css`) - Componentes reutilizables
5. **Animaciones** (`animations.css`) - Keyframes y clases de animación

## 🛠 Uso

### Importación Principal

```css
/* En tu archivo principal (App.tsx) */
import './infrastructure/ui/styles/index.css';
```

### Uso con Alias

```css
/* Usando el alias @styles configurado en Vite */
import '@styles/index.css';
```

## 🎯 Variables CSS (Design Tokens)

### Colores del Atlas

```css
--atlas-primary: #3d80a5;
--atlas-accent: #0599b7;
--atlas-light-blue: #7ec8e3;
--atlas-turquoise: #4cc0c8;
--atlas-cream: #efe3d6;
--atlas-off-white: #f2eee7;
```

### Tipografía

```css
--atlas-font-family: "Noto Sans", sans-serif;
--atlas-font-family-display: "Noto Sans Display", sans-serif;
--atlas-font-size-h1: 2.25rem;
--atlas-font-size-body: 1.25rem;
```

### Espaciado

```css
--atlas-spacing-xs: 0.25rem;
--atlas-spacing-sm: 0.5rem;
--atlas-spacing-md: 1rem;
--atlas-spacing-lg: 1.5rem;
--atlas-spacing-xl: 2rem;
--atlas-spacing-2xl: 3rem;
```

## 🧱 Clases Utilitarias

### Layout - Flexbox

```html
<div class="flex-center">Centrado</div>
<div class="flex-between">Separado</div>
<div class="flex-column">Columna</div>
```

### Espaciado

```html
<div class="p-md">Padding medium</div>
<div class="m-lg">Margin large</div>
<div class="px-sm py-md">Padding específico</div>
```

### Tipografía

```html
<h1 class="font-bold text-primary">Título</h1>
<p class="text-body font-normal">Texto normal</p>
```

### Estados y Efectos

```html
<button class="hover-scale transition-normal">Botón con efecto</button>
<div class="shadow-md rounded-lg">Tarjeta con sombra</div>
```

## 🎭 Componentes

### Botones

```html
<button class="btn btn-primary">Primario</button>
<button class="btn btn-secondary">Secundario</button>
<button class="btn btn-accent">Acento</button>
```

### Tarjetas

```html
<div class="atlas-card">
  <div class="atlas-card-header">
    <h3 class="atlas-card-title">Título</h3>
  </div>
  <div class="atlas-card-content">Contenido de la tarjeta</div>
</div>
```

### Modales

```html
<div class="modal-overlay">
  <div class="modal-content">
    <div class="modal-header">
      <h2 class="modal-title">Título</h2>
      <button class="modal-close">×</button>
    </div>
    <div class="modal-body">Contenido del modal</div>
  </div>
</div>
```

## 🎬 Animaciones

### Entrada

```html
<div class="fade-in">Aparición gradual</div>
<div class="slide-in-up">Deslizar hacia arriba</div>
<div class="scale-in">Escalar</div>
```

### Continuas

```html
<div class="pulse">Pulso</div>
<div class="float">Flotante</div>
<div class="spin">Rotación</div>
```

### Hover

```html
<div class="hover-scale">Escalar al pasar</div>
<div class="hover-lift">Elevar al pasar</div>
<div class="hover-glow">Brillo al pasar</div>
```

## 📱 Responsive Design

El sistema incluye breakpoints responsive:

- **Mobile**: max-width: 480px
- **Tablet**: max-width: 768px
- **Desktop**: 769px y superior

### Utilidades Responsive

```html
<!-- Ocultar en móvil -->
<div class="hidden md:block">Solo desktop</div>

<!-- Grid responsive -->
<div class="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">Grid responsive</div>
```

## ⚡ Optimización

### Reducción de Movimiento

El sistema respeta las preferencias de accesibilidad:

```css
@media (prefers-reduced-motion: reduce) {
  /* Animaciones reducidas automáticamente */
}
```

### Variables de Transición

```css
--atlas-transition-fast: 150ms ease-in-out;
--atlas-transition-normal: 250ms ease-in-out;
--atlas-transition-slow: 350ms ease-in-out;
```

## 🎨 Tipografía Específica del Atlas

### Títulos de Bienvenida

```html
<h1 class="atlas-welcome-title">Atlas Pluriversal</h1>
<h2 class="atlas-welcome-subtitle">Subtítulo</h2>
<p class="atlas-welcome-descriptor">Descripción</p>
```

### Títulos de Panel

```html
<h3 class="atlas-panel-title">Título de Panel</h3>
```

## 🔧 Herramientas de Desarrollo

### Clases de Debug

```html
<div class="debug-border">Con borde rojo</div>
<div class="debug-bg">Con fondo rojo transparente</div>
<div class="debug-outline">Con outline azul</div>
```

## 📦 Aliases de Vite

Los siguientes aliases están configurados:

- `@styles` → `src/infrastructure/ui/styles`
- `@ui` → `src/infrastructure/ui`
- `@assets` → `src/infrastructure/ui/assets`

## 🎯 Mejores Prácticas

1. **Usa variables CSS** para valores consistentes
2. **Prefiere clases utilitarias** para estilos simples
3. **Crea componentes** para patrones repetitivos
4. **Utiliza animaciones** con moderación
5. **Considera la accesibilidad** en todos los diseños

## 🔄 Migración del Sistema Anterior

Si estás migrando del sistema anterior:

1. Reemplaza importaciones de `global.css` por `styles/index.css`
2. Las clases existentes siguen funcionando
3. Nuevas utilidades disponibles para usar
4. Variables CSS centralizadas en `variables.css`
