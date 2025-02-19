import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AtlasApp from './AtlasApp';
import '../src/assets/styles/Global.css';

// main.jsx
import SidebarMain from './components/Sidebars/SidebarMain/SidebarMain';
import SidebarLeft from './components/Sidebars/SidebarLeft/SidebarLeft'; // Ajusta la ruta según tu estructura
import SidebarBottom from './components/Sidebars/SidebarBottom/SidebarBottom';  // Ajusta la ruta según tu estructura




createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <AtlasApp /> */}
    <SidebarMain/>
    <SidebarLeft/>
    <SidebarBottom/>
  </StrictMode>,
);
