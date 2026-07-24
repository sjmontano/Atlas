export interface ChapterMapRef {
  mapId: string
  title: string
}

export interface Chapter {
  id: number
  title: string
  description: string
  maps: ChapterMapRef[]
  territories?: string[]
}

export const CHAPTERS: ReadonlyArray<Chapter>
export function getChapter(id: number): Chapter | null
export function getChapterMapIds(chapterId: number): string[]
export function getAllMaps(): ChapterMapRef[]
