/**
 * 📚 useChapter — Hook de navegación por capítulos
 * ==================================================
 * Wrapper reactivo sobre chaptersStore.
 * Devuelve datos del capítulo activo + función de navegación.
 */

import { useChaptersStore } from "@state/chaptersStore";
import type { Chapter } from "../data/chaptersData";
import { getChapter } from "../data/chaptersData";

export interface UseChapterResult {
  activeChapter: number;
  chapterData: Chapter | undefined;
  chapterMaps: string[];
  activeTerritory: string | null;
  goToChapter: (chapter: number) => void;
  goToTerritory: (territory: string | null) => void;
}

export function useChapter(): UseChapterResult {
  const {
    activeChapter,
    chapterMaps,
    activeTerritory,
    goToChapter,
    goToTerritory,
  } = useChaptersStore();

  return {
    activeChapter,
    chapterData: getChapter(activeChapter),
    chapterMaps,
    activeTerritory,
    goToChapter,
    goToTerritory,
  };
}
