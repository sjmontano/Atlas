import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LayerMenu } from '@components/map/LayerMenu'
import { useLayerStore } from '@stores/layerStore'

vi.mock('@content', () => ({
  getMapContent: vi.fn((mapId) => {
    if (mapId === 'test') {
      return {
        layers: [
          {
            id: 'layer-1',
            name: 'Layer One',
            type: 'raster-pgw',
            category: 'ecosystems',
            group: 'group-1',
            order: 1,
            opacity: 0.8,
            visibleByDefault: true,
            legend: { swatch: '#ff0000', description: 'Red layer' },
            image: '',
            pgw: [0, 1, 1, 0, 0, 0],
            width: 1,
            height: 1,
          },
          {
            id: 'layer-2',
            name: 'Layer Two',
            type: 'raster-pgw',
            category: 'ecosystems',
            group: 'group-1',
            order: 2,
            opacity: 0.5,
            legend: { swatch: '#00ff00' },
            image: '',
            pgw: [0, 1, 1, 0, 0, 0],
            width: 1,
            height: 1,
          },
        ],
        groups: [{ id: 'group-1', name: 'Group 1', order: 1 }],
      }
    }
    if (mapId === 'legend-only') {
      return {
        legends: [
          { id: 'leg-1', name: 'Río Cauca', swatch: '#2b83ba', order: 1, longText: 'Texto largo confirmado' },
          { id: 'leg-2', name: 'Represas', swatch: '#0c4c8a', group: '2022', order: 2 },
        ],
      }
    }
    return null
  }),
}))

describe('LayerMenu', () => {
  beforeEach(() => {
    useLayerStore.getState().resetAll('test')
  })

  it('renders group and layer names', () => {
    render(<LayerMenu mapId="test" onCalibrate={vi.fn()} />)
    expect(screen.getByText(/Capas/)).toBeDefined()
    fireEvent.click(screen.getByTitle('Mostrar panel'))
    expect(screen.getByText(/Group 1/)).toBeDefined()
    expect(screen.getByText(/Layer One/)).toBeDefined()
  })

  it('toggles layer visibility on checkbox click', () => {
    render(<LayerMenu mapId="test" onCalibrate={vi.fn()} />)
    fireEvent.click(screen.getByTitle('Mostrar panel'))
    const store = useLayerStore.getState()
    expect(store.visibleLayers.size).toBe(0)
    const checks = screen.getAllByRole('checkbox')
    const layerCheck = checks[checks.length - 1]
    fireEvent.click(layerCheck!)
    expect(useLayerStore.getState().visibleLayers.has('layer-1') || useLayerStore.getState().visibleLayers.has('layer-2')).toBe(true)
  })

  it('renders nothing when map has no layers', () => {
    const { container } = render(<LayerMenu mapId="empty" onCalibrate={vi.fn()} />)
    expect(container.innerHTML).toBe('')
  })

  it('toggles group expansion on click', () => {
    render(<LayerMenu mapId="test" onCalibrate={vi.fn()} />)
    fireEvent.click(screen.getByTitle('Mostrar panel'))
    const groupHeader = screen.getByText(/Group 1/)
    fireEvent.click(groupHeader!)
    expect(useLayerStore.getState().expandedGroups['group-1']).toBe(true)
  })

  it('renders legends without interactivity for a map with only legends', () => {
    render(<LayerMenu mapId="legend-only" onCalibrate={vi.fn()} />)
    fireEvent.click(screen.getByTitle('Mostrar panel'))
    expect(screen.getByText('Leyenda')).toBeDefined()
    expect(screen.getByText('Río Cauca')).toBeDefined()
    expect(screen.getByText('Represas')).toBeDefined()
    expect(screen.getByText('2022')).toBeDefined()
  })

  it('does not render a master checkbox when there are no activable layers', () => {
    render(<LayerMenu mapId="legend-only" onCalibrate={vi.fn()} />)
    fireEvent.click(screen.getByTitle('Mostrar panel'))
    expect(screen.queryByText(/Todas/)).toBeNull()
    expect(screen.queryByRole('checkbox')).toBeNull()
  })
})
