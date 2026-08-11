import { describe, it, expect, beforeEach } from 'vitest'
import { useLayerStore } from '@stores/layerStore'

function getState() {
  return useLayerStore.getState()
}

describe('layerStore', () => {
  beforeEach(() => {
    localStorage.clear()
    getState().resetAll('test-map')
  })

  describe('toggleLayer', () => {
    it('adds layer id to visibleLayers on first toggle', () => {
      getState().toggleLayer('layer-a')
      expect(getState().visibleLayers.has('layer-a')).toBe(true)
    })

    it('removes layer id on second toggle', () => {
      getState().toggleLayer('layer-a')
      getState().toggleLayer('layer-a')
      expect(getState().visibleLayers.has('layer-a')).toBe(false)
    })

    it('preserves other visible layers', () => {
      getState().toggleLayer('layer-a')
      getState().toggleLayer('layer-b')
      expect(getState().visibleLayers.has('layer-a')).toBe(true)
      expect(getState().visibleLayers.has('layer-b')).toBe(true)
    })
  })

  describe('setLayerOpacity', () => {
    it('sets opacity for a layer', () => {
      getState().setLayerOpacity('layer-a', 0.5)
      expect(getState().opacities['layer-a']).toBe(0.5)
    })

    it('updates existing opacity', () => {
      getState().setLayerOpacity('layer-a', 0.5)
      getState().setLayerOpacity('layer-a', 0.8)
      expect(getState().opacities['layer-a']).toBe(0.8)
    })
  })

  describe('setLayerGroupVisible', () => {
    it('activates all provided layer ids when visible=true', () => {
      getState().setLayerGroupVisible('g1', true, ['layer-a', 'layer-b'])
      expect(getState().visibleLayers.has('layer-a')).toBe(true)
      expect(getState().visibleLayers.has('layer-b')).toBe(true)
    })

    it('deactivates all provided layer ids when visible=false', () => {
      getState().toggleLayer('layer-a')
      getState().toggleLayer('layer-b')
      getState().setLayerGroupVisible('g1', false, ['layer-a', 'layer-b'])
      expect(getState().visibleLayers.has('layer-a')).toBe(false)
      expect(getState().visibleLayers.has('layer-b')).toBe(false)
    })
  })

  describe('expandedGroups', () => {
    it('toggleGroupExpanded toggles boolean', () => {
      getState().toggleGroupExpanded('g1')
      expect(getState().expandedGroups['g1']).toBe(true)
      getState().toggleGroupExpanded('g1')
      expect(getState().expandedGroups['g1']).toBe(false)
    })
  })

  describe('persistence', () => {
    it('persists visibleLayers to localStorage on change', () => {
      getState().resetAll('map-1')
      getState().toggleLayer('layer-a')
      const stored = JSON.parse(localStorage.getItem('atlas:layers:map-1')!)
      expect(stored.v).toContain('layer-a')
    })

    it('persists opacities to localStorage on change', () => {
      getState().resetAll('map-1')
      getState().setLayerOpacity('layer-a', 0.3)
      const stored = JSON.parse(localStorage.getItem('atlas:layers:map-1')!)
      expect(stored.o['layer-a']).toBe(0.3)
    })

    it('resetAll loads persisted state for the given mapId', () => {
      localStorage.setItem('atlas:layers:map-1', JSON.stringify({ v: ['layer-a'], o: { 'layer-a': 0.5 } }))
      getState().resetAll('map-1')
      expect(getState().visibleLayers.has('layer-a')).toBe(true)
      expect(getState().opacities['layer-a']).toBe(0.5)
    })

    it('resetAll clears state when no persisted data exists', () => {
      getState().toggleLayer('layer-a')
      getState().resetAll('fresh-map')
      expect(getState().visibleLayers.size).toBe(0)
      expect(Object.keys(getState().opacities).length).toBe(0)
    })

    it('does not persist expandedGroups', () => {
      getState().resetAll('map-1')
      getState().toggleGroupExpanded('g1')
      const stored = JSON.parse(localStorage.getItem('atlas:layers:map-1')!)
      expect(stored.eg).toBeUndefined()
    })
  })
})
