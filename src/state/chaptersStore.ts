/**
 * 📚 CHAPTERS STORE — Estado narrativo de capítulos
 * ====================================================
 * - capítulo activo
 * - territorio activo dentro del capítulo
 * - lista de mapas del capítulo activo
 *
 * REGLA: Este store puede llamar a useMapStore.getState() y
 * useLayersStore.getState() para orquestar —
 * los dominios no se llaman entre sí, los stores sí.
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useLayersStore } from "./layersStore";
import { useMapStore } from "./mapStore";

/** Los mapas de cada capítulo — se expande con chaptersData */
const CHAPTER_MAPS: Record<number, string[]> = {
  1: [
    "chapter1-encuadres",
    "chapter1-ecosistemas",
    "chapter1-formas-paisaje",
    "chapter1-bredunco",
    "chapter1-mosaicos-del-agua",
    "chapter1-un-rio-cauca",
  ],
  2: ["chapter2-valle", "chapter2-suarez"],
};

interface ChaptersStore {
  activeChapter: number;
  activeTerritory: string | null;
  chapterMaps: string[];

  // ─── Acciones ────────────────────────────────────────────────────────────
  goToChapter: (chapter: number) => void;
  goToTerritory: (territory: string | null) => void;
}

export const useChaptersStore = create<ChaptersStore>()(
  devtools(
    (set) => ({
      activeChapter: 1,
      activeTerritory: null,
      chapterMaps: CHAPTER_MAPS[1],

      goToChapter: (chapter) => {
        const maps = CHAPTER_MAPS[chapter] ?? [];
        set(
          { activeChapter: chapter, activeTerritory: null, chapterMaps: maps },
          false,
          "GoToChapter",
        );

        // Orquestación directa entre stores (Zustand, sin React)
        useLayersStore.getState().applyChapterDefaults(chapter);
        if (maps.length > 0) {
          useMapStore.getState().setActiveMap(maps[0]);
        }
      },

      goToTerritory: (territory) =>
        set({ activeTerritory: territory }, false, "GoToTerritory"),
    }),
    { name: "ChaptersStore" },
  ),
);
