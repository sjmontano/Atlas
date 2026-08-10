import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

const DevMenu = lazy(() =>
  import('@pages/DevMenu.tsx').then((m) => ({ default: m.DevMenu })),
)
const TestMapPage = lazy(() =>
  import('@pages/TestMapPage.tsx').then((m) => ({ default: m.TestMapPage })),
)

function Fallback() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#03091e',
      color: 'rgba(5,153,183,0.5)',
      fontSize: 'var(--text-sm)',
    }}>
      Cargando...
    </div>
  )
}

export function App() {
  useEffect(() => {
    const timer = setTimeout(() => {
      void import('@pages/TestMapPage.tsx')
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <BrowserRouter>
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={<Navigate to="/dev" replace />} />
          <Route path="/dev" element={<DevMenu />} />
          <Route path="/test/:mapId" element={<TestMapPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
