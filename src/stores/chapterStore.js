import { create } from 'zustand'
import { getChapterMapIds } from '@data/chapters/chapters.js'
import { useMapStore } from './mapStore.js'

export const useChapterStore = create((set) => ({
  activeChapter: 1,
  activeTerritory: null,
  chapterMaps: getChapterMapIds(1),

  goToChapter: (chapter) => {
    const maps = getChapterMapIds(chapter)
    set({ activeChapter: chapter, activeTerritory: null, chapterMaps: maps })

    if (maps.length > 0) {
      useMapStore.getState().setActiveMap(maps[0])
    }
  },

  goToTerritory: (territory) => set({ activeTerritory: territory }),
}))
