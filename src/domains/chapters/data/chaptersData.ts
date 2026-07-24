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
      {
        mapId: "chapter2-cali",
        title: "Oriente de Cali",
      },
      {
        mapId: "chapter2-villa-rica",
        title: "Villa Rica",
      },
    ],
    territories: ["valle", "suarez", "cali", "villa-rica"],
  },

  // ═══════════════════════════════════════════════════════════
  // Capítulo 3 — Caminos y conflictos del río Cauca (6 mapas)
  // Portado desde Atlas v17
  // ═══════════════════════════════════════════════════════════
  3: {
    id: 3,
    title: "Caminos y Conflictos del Río Cauca",
    subtitle: "Conflictos ambientales y territoriales en el valle alto",
    maps: [
      {
        mapId: "chapter3-introduccion",
        title: "Introducción Capítulo 3",
        description: "Visión general de los conflictos del río Cauca",
      },
      {
        mapId: "chapter3-monocultivo",
        title: "Monocultivo de Caña",
        description: "Expansión del monocultivo de caña de azúcar",
      },
      {
        mapId: "chapter3-encharcaron",
        title: "Nos Encharcaron el Río",
        description: "Transformaciones del cauce del río Cauca",
      },
      {
        mapId: "chapter3-cali-deseca",
        title: "Cali se Deseca",
        description: "Pérdida de humedales en el área de Cali",
      },
      {
        mapId: "chapter3-humedales",
        title: "Humedales del Cauca",
        description: "Ecosistemas de humedal en la cuenca",
      },
      {
        mapId: "chapter3-arcilla",
        title: "Arcilla y Territorio",
        description: "Extracción de arcilla y transformación territorial",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // Capítulo 4 — Actores, acciones, capacidades y poderes (11 mapas)
  // Portado desde Atlas v17
  // ═══════════════════════════════════════════════════════════
  4: {
    id: 4,
    title: "Actores, Acciones, Capacidades y Poderes",
    subtitle: "Nodos del tejido territorial",
    maps: [
      {
        mapId: "chapter4-introduccion",
        title: "Introducción Capítulo 4",
      },
      {
        mapId: "chapter4-asoyoge",
        title: "Asoyoge",
      },
      {
        mapId: "chapter4-el-buhido",
        title: "El Buhído",
      },
      {
        mapId: "chapter4-bosque-comestible",
        title: "Bosque Comestible",
      },
      {
        mapId: "chapter4-los-bajios",
        title: "Los Bajíos",
      },
      {
        mapId: "chapter4-el-paso",
        title: "El Paso",
      },
      {
        mapId: "chapter4-las-mercedes",
        title: "Las Mercedes",
      },
      {
        mapId: "chapter4-la-virginia",
        title: "La Virginia",
      },
      {
        mapId: "chapter4-centro-agropecuario",
        title: "Centro Agropecuario",
      },
      {
        mapId: "chapter4-la-caicedo",
        title: "La Caicedo",
      },
      {
        mapId: "chapter4-problematicas",
        title: "Problemáticas Ambientales",
      },
    ],
  },
};

export function getChapter(id: number): Chapter | undefined {
  return CHAPTERS_DATA[id];
}

export function getChapterMapIds(chapterId: number): string[] {
  return CHAPTERS_DATA[chapterId]?.maps.map((m) => m.mapId) ?? [];
}
