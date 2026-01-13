# Registro de Soluciones y Correcciones de Bugs

## 1. Ajustar tooltips superpuestos en la capa “Pliegues, llanuras y otras formas del paisaje”

**Estado:** Completado
**Fecha:** 22 de diciembre de 2025

### Descripción del Problema

Los tooltips de los topónimos (marcadores numerados) se superponían incorrectamente. Al hacer hover sobre un marcador, su tooltip aparecía, pero a veces quedaba oculto detrás de otros marcadores cercanos debido al orden de apilamiento (z-index) predeterminado de los popups en el mapa.

### Solución Implementada

Se modificó el comportamiento de los eventos `mouseenter` y `mouseleave` en el componente que renderiza los topónimos para manipular dinámicamente el `z-index` del contenedor del popup.

**Archivo modificado:** `src/components/MapController/agregarToponimos.jsx`

### Detalles Técnicos

El problema radicaba en que elevar el `z-index` del contenido interno del popup no era suficiente, ya que el contenedor padre (`.maplibregl-popup`) generado por la librería de mapas seguía teniendo un nivel de apilamiento estándar.

**Lógica aplicada:**

1.  **Al entrar el mouse (mouseenter):** Se busca el elemento padre con la clase `.maplibregl-popup` usando `closest()`. Se le asigna un `z-index` muy alto (`10000`) para forzarlo a estar por encima de todo.
2.  **Al salir el mouse (mouseleave):** Se busca nuevamente el contenedor y se limpia la propiedad `z-index` (asignando `""`), devolviéndolo a su estado original para no afectar la interacción futura con otros elementos.

### Cómo modificar esta solución

Si se requiere cambiar el comportamiento o ajustar la superposición:

- Buscar en `src/components/MapController/agregarToponimos.jsx`.
- Localizar los `addEventListener` de `mouseenter` y `mouseleave` dentro del `useEffect` principal.
- Ajustar el valor de `10000` si se necesita otro nivel de capa, o modificar la lógica de selección del contenedor si la estructura del DOM de MapLibre cambia.

## 3. Ajustar manchas de fondo detrás de los textos

**Estado:** Completado
**Fecha:** 22 de diciembre de 2025

**Problema:**
Las manchas de fondo (imágenes decorativas) detrás de los títulos tenían un tamaño fijo o se ajustaban manualmente con porcentajes en cada vista, lo que causaba que en títulos cortos (como "Cali deseca") la mancha fuera muy grande, o en títulos largos el texto se desbordara. Además, la imagen se deformaba al estirarse manualmente.

**Solución:**
Se refactorizó el componente `Header` para que maneje la imagen de fondo internamente.

1.  Se añadió la prop `bgImage` al componente `Header`.
2.  Se envolvió el título en un contenedor (`.header-title-wrapper`) que tiene `width: fit-content`.
3.  La imagen de fondo se posiciona absolutamente dentro de este contenedor con `width: 100%` y `height: 100%`.
4.  Se añadió `padding` al contenedor para dar "aire" al texto (especialmente a la derecha, como se solicitó).
5.  Se eliminaron las etiquetas `<img>` manuales en `Chapter1.jsx`, `Chapter2.jsx`, `Chapter3.jsx` y `Chapter4.jsx` y se pasó la imagen correspondiente a través de la prop `bgImage`.

**Archivos modificados:**

- `src/components/Header/Header.jsx`
- `src/components/Header/Header.css`
- `src/views/Chapters/Chapter1/Chapter1.jsx`
- `src/views/Chapters/Chapter2/Chapter2.jsx`
- `src/views/Chapters/Chapter3/Chapter3.jsx`
- `src/views/Chapters/Chapter4/Chapter4.jsx`

**Cómo modificar:**
Para ajustar el "aire" alrededor del texto, editar el `padding` en `.header-title-wrapper.has-bg` en `src/components/Header/Header.css`.
