// utils/mapTooltip.js
export const createMapTooltip = () => {
    const tooltip = document.createElement('div');
    tooltip.id = '  -tooltip';
    tooltip.style.position = 'fixed';
    tooltip.style.background = 'rgba(0, 0, 0, 0.8)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '8px 12px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '14px';
    tooltip.style.fontFamily = 'Arial, sans-serif';
    tooltip.style.display = 'none';
    tooltip.style.zIndex = '10000';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    tooltip.style.maxWidth = '300px';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.transform = 'translate(-50%, calc(-100% - 10px))'; // Posición arriba del cursor
    return tooltip;
  };
  
  let tooltipInstance = null;
  
  export const getMapTooltip = () => {
    if (!tooltipInstance) {
      tooltipInstance = createMapTooltip();
      document.body.appendChild(tooltipInstance);
    }
    return tooltipInstance;
  };
  
  export const cleanupMapTooltip = () => {
    if (tooltipInstance) {
      document.body.removeChild(tooltipInstance);
      tooltipInstance = null;
    }
};