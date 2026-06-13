/**
 * 🎨 TEMAS VISUALES PARA MAPAS
 * =============================
 *
 * Sistema centralizado de temas para componentes de mapa.
 * Elimina duplicación entre MapControls y MapLegend.
 */

export interface MapTheme {
  /** Color de fondo */
  background: string;
  /** Color de texto */
  color: string;
  /** Color de texto secundario */
  colorSecondary?: string;
  /** Color de borde */
  border?: string;
  /** Sombra */
  boxShadow?: string;
  /** Filtro de fondo */
  backdropFilter?: string;
  /** Color de hover para botones */
  hoverBackground?: string;
  /** Color activo/seleccionado */
  activeBackground?: string;
  /** Color de botón activo */
  activeColor?: string;
  /** Borde redondeado */
  borderRadius?: string;
}

/**
 * Tema claro - Fondo blanco con bordes sutiles
 */
export const LIGHT_THEME: MapTheme = {
  background: "rgba(255, 255, 255, 0.98)",
  color: "#333",
  colorSecondary: "#666",
  border: "1px solid rgba(0, 0, 0, 0.1)",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
  backdropFilter: "blur(4px)",
  hoverBackground: "rgba(0, 0, 0, 0.05)",
  activeBackground: "#007bff",
  activeColor: "#fff",
  borderRadius: "8px",
};

/**
 * Tema oscuro - Fondo negro con alto contraste
 */
export const DARK_THEME: MapTheme = {
  background: "rgba(30, 30, 30, 0.95)",
  color: "#fff",
  colorSecondary: "#ccc",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.5)",
  backdropFilter: "blur(8px)",
  hoverBackground: "rgba(255, 255, 255, 0.1)",
  activeBackground: "#0d6efd",
  activeColor: "#fff",
  borderRadius: "8px",
};

/**
 * Tema Atlas - Esquema de colores del proyecto
 */
export const ATLAS_THEME: MapTheme = {
  background: "rgba(250, 250, 252, 0.98)",
  color: "#2c3e50",
  colorSecondary: "#7f8c8d",
  border: "1px solid rgba(52, 73, 94, 0.15)",
  boxShadow: "0 4px 12px rgba(44, 62, 80, 0.12)",
  backdropFilter: "blur(6px)",
  hoverBackground: "rgba(52, 73, 94, 0.08)",
  activeBackground: "#3498db",
  activeColor: "#fff",
  borderRadius: "10px",
};

/**
 * Mapa de temas disponibles
 */
export const MAP_THEMES: Record<string, MapTheme> = {
  light: LIGHT_THEME,
  dark: DARK_THEME,
  atlas: ATLAS_THEME,
};

/**
 * Obtiene un tema por nombre, con fallback a light
 *
 * @param themeName - Nombre del tema ('light' | 'dark' | 'atlas')
 * @returns Objeto de tema correspondiente
 *
 * @example
 * ```ts
 * const theme = getMapTheme('atlas');
 * // { background: 'rgba(250, 250, 252, 0.98)', color: '#2c3e50', ... }
 * ```
 */
export function getMapTheme(themeName: string = "light"): MapTheme {
  return MAP_THEMES[themeName] || LIGHT_THEME;
}
