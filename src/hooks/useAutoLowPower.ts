import { useEffect } from 'react'
import { useConnectionStore } from '@stores/connectionStore.ts'
import { useUIStore } from '@stores/uiStore.ts'

export function useAutoLowPower() {
  const isSlow = useConnectionStore((s) => s.isSlow)
  const setLowPowerMode = useUIStore((s) => s.setLowPowerMode)

  useEffect(() => {
    if (isSlow) {
      setLowPowerMode(true)
    }
  }, [isSlow, setLowPowerMode])
}
