/**
 * 📚 DATOS DE CAPÍTULOS — Narrativa pura
 * =========================================
 * REGLA CRÍTICA: Este archivo solo conoce mapIds como strings.
 * NO importa de @map, NO importa MapConfig, NO conoce PGW.
 * La composición ocurre en mapConfigProvider, no aquí.
 */

export interface ChapterMapRef {
  /** ID del mapa en el registro técnico (atlasMapData.ts) */
  mapId: string;
  /** Nombre narrativo del mapa en este capítulo */
  title: string;
  /** Descripción para el usuario */
  description?: string;
}

export interface Chapter {
  id: number;
  title: string;
  subtitle?: string;
  maps: ChapterMapRef[];
  territories?: string[];
}

export const CHAPTERS_DATA: Record<number, Chapter> = {
  1: {
    id: 1,
    title: "Cartografías de la Cuenca",
    subtitle: "Una visión territorial del Río Cauca",
    maps: [
      {
        mapId: "chapter1-encuadres",
        title: "Encuadres Territoriales",
        description: "Vista general de los encuadres territoriales del Atlas",
      },
      {
        mapId: "chapter1-ecosistemas",
        title: "Ecosistemas",
        description: "Ecosistemas de la cuenca del Río Cauca",
      },
      {
        mapId: "chapter1-formas-paisaje",
        title: "Formas del Paisaje",
        description: "Las formas que definen el territorio de la cuenca",
      },
      {
        mapId: "chapter1-bredunco",
        title: "Bredunco",
        description: "Mapa Bredunco de la cuenca",
      },
      {
        mapId: "chapter1-mosaicos-del-agua",
        title: "Mosaicos del Agua",
        description: "Mosaicos hídricos de la cuenca",
      },
      {
        mapId: "chapter1-un-rio-cauca",
        title: "Un Río Cauca, Muchos Mundos",
        description: "Lecturas múltiples del territorio del Río Cauca",
      },
    ],
    territories: [],
  },
  2: {
    id: 2,
    title: "Territorios Específicos",
    subtitle: "Nodos y territorios del Valle del Cauca",
    maps: [
      {
        mapId: "chapter2-valle",
        title: "Valle del Cauca",
      },
      {
        mapId: "chapter2-suarez",
        title: "Suárez",
      },
    ],
    territories: ["valle", "suarez"],
  },
};

export function getChapter(id: number): Chapter | undefined {
  return CHAPTERS_DATA[id];
}

export function getChapterMapIds(chapterId: number): string[] {
  return CHAPTERS_DATA[chapterId]?.maps.map((m) => m.mapId) ?? [];
}
