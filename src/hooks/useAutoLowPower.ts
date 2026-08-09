import { useEffect } from 'react'
import { useConnectionStore } from '@stores/connectionStore.js'
import { useUIStore } from '@stores/uiStore.js'

export function useAutoLowPower() {
  const isSlow = useConnectionStore((s) => s.isSlow)
  const setLowPowerMode = useUIStore((s) => s.setLowPowerMode)

  useEffect(() => {
    if (isSlow) {
      setLowPowerMode(true)
    }
  }, [isSlow, setLowPowerMode])
}
