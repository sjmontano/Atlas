import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AtlasApp from './AtlasApp';
import './style.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AtlasApp />
  </StrictMode>,
);
