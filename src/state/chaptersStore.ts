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
 *
 * IMPORTANTE: Los mapas se derivan de chaptersData.ts.
 * NO duplicar CHAPTER_MAPS aquí; usa getChapterMapIds().
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getChapterMapIds } from "@chapters/data/chaptersData";
import { useLayersStore } from "./layersStore";
import { useMapStore } from "./mapStore";

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
      chapterMaps: getChapterMapIds(1),

      goToChapter: (chapter) => {
        const maps = getChapterMapIds(chapter);
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
