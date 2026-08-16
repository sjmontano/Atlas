import type { LegendItem } from '../../types/layer'

const ICONS = '/assets/iconsCap4'

export const legenda = (
  id: string,
  name: string,
  icon: string,
  order: number,
  group?: string,
): LegendItem => ({
  id,
  name,
  icon: `${ICONS}/${icon}`,
  order,
  group,
})
