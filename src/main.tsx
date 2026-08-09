import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import './styles/globals.css'

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason instanceof DOMException && event.reason.name === 'AbortError') {
    event.preventDefault()
  }
})

// Service Worker — cache de tiles para rendimiento rural
// Solo en producción; en dev el SW interfiere con HMR.
// En dev se puede activar con VITE_ENABLE_SW=true en .env.local
const enableSW = !import.meta.env.DEV || import.meta.env.VITE_ENABLE_SW
if (enableSW && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {
    // Fallo silencioso: los tiles se sirven del servidor normalmente
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
