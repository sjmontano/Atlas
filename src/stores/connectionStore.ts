import { create } from 'zustand'

interface ConnectionInfo {
  effectiveType?: string
  rtt: number
  downlink: number
  isSlow: boolean
}

export interface ConnectionStoreState extends ConnectionInfo {
  isOnline: boolean
  init: () => void
}

// `navigator.connection` no forma parte de los tipos DOM estándar.
interface NavigatorWithConnection extends Navigator {
  connection?: {
    effectiveType?: string
    rtt?: number
    downlink?: number
    addEventListener?: (type: string, listener: () => void) => void
  }
}

const getConnection = (): NavigatorWithConnection['connection'] =>
  (navigator as NavigatorWithConnection).connection

const getConnectionInfo = (): Partial<ConnectionInfo> => {
  if (typeof navigator === 'undefined') return {}
  const conn = getConnection()
  return {
    effectiveType: conn?.effectiveType ?? undefined,
    rtt: conn?.rtt ?? 0,
    downlink: conn?.downlink ?? 0,
    isSlow: conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g',
  }
}

export const useConnectionStore = create<ConnectionStoreState>()((set) => ({
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  ...(getConnectionInfo() as ConnectionInfo),

  init() {
    if (typeof window === 'undefined') return

    const onOnline = () => set({ isOnline: true })
    const onOffline = () => set({ isOnline: false })
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)

    const conn = getConnection()
    if (conn?.addEventListener) {
      conn.addEventListener('change', () => {
        set(getConnectionInfo())
      })
    }

    set(getConnectionInfo())
  },
}))
