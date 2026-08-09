import { create } from 'zustand'

const getConnectionInfo = () => {
  if (typeof navigator === 'undefined') return {}
  const conn = navigator.connection
  return {
    effectiveType: conn?.effectiveType ?? undefined,
    rtt: conn?.rtt ?? 0,
    downlink: conn?.downlink ?? 0,
    isSlow: conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g',
  }
}

export const useConnectionStore = create((set) => ({
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  ...getConnectionInfo(),

  init() {
    if (typeof window === 'undefined') return

    const onOnline = () => set({ isOnline: true })
    const onOffline = () => set({ isOnline: false })
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)

    const conn = navigator.connection
    if (conn) {
      const onConnectionChange = () => {
        const info = getConnectionInfo()
        set(info)
      }
      conn.addEventListener('change', onConnectionChange)
    }

    set(getConnectionInfo())
  },
}))
