import type { Poi } from '@types/poi'
import styles from './PoiModal.module.css'

interface Props {
  poi: Poi
  onClose: () => void
}

export function PoiModal({ poi, onClose }: Props) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
          ×
        </button>
        <h2 className={styles.title}>{poi.popup.title}</h2>
        {poi.popup.body && <p className={styles.body}>{poi.popup.body}</p>}
        {poi.popup.image && (
          <img className={styles.image} src={poi.popup.image} alt={poi.popup.title} />
        )}
        {poi.popup.audio && (
          <audio className={styles.audio} controls src={poi.popup.audio} />
        )}
        {poi.capa && <span className={styles.capa}>{poi.capa}</span>}
      </div>
    </div>
  )
}
