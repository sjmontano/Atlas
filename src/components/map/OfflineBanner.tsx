import { useConnectionStore } from '@stores/connectionStore.ts'
import styles from './OfflineBanner.module.css'

export function OfflineBanner() {
  const isOnline = useConnectionStore((s) => s.isOnline)
  const isSlow = useConnectionStore((s) => s.isSlow)

  if (isOnline && !isSlow) return null

  return (
    <div className={styles.banner}>
      {!isOnline ? (
        <span>
          Sin conexión. El mapa se muestra con datos en caché.
        </span>
      ) : (
        <span>
          Conexión lenta detectada. El mapa funciona en modo básico.
        </span>
      )}
    </div>
  )
}
