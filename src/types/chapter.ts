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
