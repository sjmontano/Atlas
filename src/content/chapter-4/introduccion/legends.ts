import type { LegendItem } from '../../../types/layer'
import { legenda } from '../shared'

export const LEGENDS: LegendItem[] = [
  legenda('intro-cap4-leyenda-monocultivo', 'Monocultivo de caña de azúcar', 'monocultivoAzucar.svg', 10),
  legenda('intro-cap4-leyenda-areas-urbanas', 'Áreas urbanas', 'areaUrbana.svg', 20),
  legenda('intro-cap4-leyenda-fincas-tradicionales', 'Fincas tradicionales, cultivos diversos y bosques', 'fincaTradicional.svg', 30),
  {
    ...legenda('intro-cap4-leyenda-cuerpos-agua', 'Cuerpos de agua', 'riosPrincipales.svg', 40),
    icon: '/assets/mapasMenuCap2/riosPrincipales.svg',
  },
  legenda('intro-cap4-leyenda-curvas-nivel', 'Curvas de nivel', 'curvaNivel.svg', 50),
  legenda('intro-cap4-leyenda-agropalenke', 'Fincas tradicionales Agropalenke soberanía de vida', 'palenke.svg', 60),
]
