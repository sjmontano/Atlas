import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DevMenu } from '@pages/DevMenu.tsx'
import { TestMapPage } from '@pages/TestMapPage.tsx'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dev" replace />} />
        <Route path="/dev" element={<DevMenu />} />
        <Route path="/test/:mapId" element={<TestMapPage />} />
      </Routes>
    </BrowserRouter>
  )
}
