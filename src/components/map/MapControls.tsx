import { useUIStore } from '@stores/uiStore'
import type { BasemapStyle } from '@services/BasemapManager'
import styles from './MapControls.module.css'

const BASEMAP_OPTIONS: { value: BasemapStyle; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'streets', label: 'Streets', icon: '🗺️' },
  { value: 'satellite', label: 'Satellite', icon: '🛰️' },
]

export function MapControls() {
  const basemapVisible = useUIStore((s) => s.basemapVisible)
  const basemapStyle = useUIStore((s) => s.basemapStyle)
  const imageOpacity = useUIStore((s) => s.imageOpacity)
  const toggleBasemap = useUIStore((s) => s.toggleBasemap)
  const setBasemapStyle = useUIStore((s) => s.setBasemapStyle)
  const setImageOpacity = useUIStore((s) => s.setImageOpacity)

  return (
    <div className={styles.toolbar} role="toolbar" aria-label="Mapa base (dev)">
      <div className={styles.row}>
        <button
          className={`${styles.toggleBtn} ${basemapVisible ? styles.active : ''}`}
          onClick={toggleBasemap}
          title={basemapVisible ? 'Ocultar mapa base' : 'Mostrar mapa base'}
        >
          <span className={styles.toggleIcon}>🌐</span>
          <span className={styles.toggleLabel}>{BASEMAP_OPTIONS.find((o) => o.value === basemapStyle)?.icon}</span>
        </button>

        <div className={styles.divider} />

        {BASEMAP_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`${styles.styleBtn} ${basemapStyle === opt.value ? styles.active : ''} ${!basemapVisible ? styles.disabled : ''}`}
            onClick={() => setBasemapStyle(opt.value)}
            disabled={!basemapVisible}
            title={opt.label}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className={styles.row}>
        <label className={styles.sliderLabel}>Imagen</label>
        <input
          type="range"
          className={styles.slider}
          min="0"
          max="1"
          step="0.05"
          value={imageOpacity}
          onChange={(e) => setImageOpacity(parseFloat(e.target.value))}
          title={`Opacidad de imagen: ${Math.round(imageOpacity * 100)}%`}
        />
        <span className={styles.sliderValue}>{Math.round(imageOpacity * 100)}%</span>
      </div>
    </div>
  )
}
