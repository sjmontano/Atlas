import { create } from 'zustand'
import { getChapterMapIds } from '@data/chapters/chapters.ts'
import { useMapStore } from './mapStore.ts'

export interface ChapterStoreState {
  activeChapter: number
  activeTerritory: string | null
  chapterMaps: string[]
  goToChapter: (chapter: number) => void
  goToTerritory: (territory: string) => void
}

export const useChapterStore = create<ChapterStoreState>()((set) => ({
  activeChapter: 1,
  activeTerritory: null,
  chapterMaps: getChapterMapIds(1),

  goToChapter: (chapter) => {
    const maps = getChapterMapIds(chapter)
    set({ activeChapter: chapter, activeTerritory: null, chapterMaps: maps })

    if (maps.length > 0) {
      useMapStore.getState().setActiveMap(maps[0]!)
    }
  },

  goToTerritory: (territory) => set({ activeTerritory: territory }),
}))
