import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/assets/styles/Global.css';

// main.jsx
import SidebarMain from './components/Sidebars/SidebarMain/SidebarMain';
import SidebarLeft from './components/Sidebars/SidebarLeft/SidebarLeft'; 
import SidebarBottom from './components/Sidebars/SidebarBottom/SidebarBottom'; 
import Header from './components/Header/Header';




createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <AtlasApp /> */}
    <Header/>
    <SidebarMain/>
    <SidebarLeft/>
    <SidebarBottom/>
  </StrictMode>,
);
