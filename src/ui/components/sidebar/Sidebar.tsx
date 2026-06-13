/**
 * 📐 SIDEBAR
 * ==========
 * Panel lateral del Atlas. Se abre/cierra según uiStore.sidebarOpen.
 * Renderiza el panel activo: Capítulos | Capas | Búsqueda.
 *
 * REGLA: Solo lee/escribe uiStore. No conoce dominios directamente.
 * Los sub-paneles (ChapterNav, LayerPanel) encapsulan su propia
 * integración con los stores de dominio.
 */

import { useUIStore } from "@state";
import React from "react";
import ChapterNav from "../chapters/ChapterNav";
import LayerPanel from "../layers/LayerPanel";

type Tab = "chapters" | "layers" | "search";

const SIDEBAR_WIDTH = 280;
const HEADER_HEIGHT = 48;
const BG = "rgba(250, 250, 252, 0.98)";
const BORDER = "rgba(52,73,94,0.12)";
const ACCENT = "#3498db";
const TEXT_PRIMARY = "#2c3e50";
const TEXT_SECONDARY = "#7f8c8d";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "chapters", label: "Capítulos", icon: "📚" },
  { id: "layers", label: "Capas", icon: "🧱" },
  { id: "search", label: "Buscar", icon: "🔍" },
];

export const Sidebar: React.FC = () => {
  const { sidebarOpen, activeSidebarPanel, setSidebarPanel, toggleSidebar } =
    useUIStore();

  // Panel por defecto: chapters
  const activeTab = (activeSidebarPanel as Tab) ?? "chapters";

  const handleTabClick = (tab: Tab) => {
    if (activeSidebarPanel === tab && sidebarOpen) {
      toggleSidebar(); // colapsar si ya está en ese tab
    } else {
      setSidebarPanel(tab);
      if (!sidebarOpen) toggleSidebar(); // abrir si estaba cerrado
    }
  };

  return (
    <>
      {/* ── RAIL de iconos (siempre visible) ─────────────────────── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "48px",
          background: BG,
          borderRight: `1px solid ${BORDER}`,
          boxShadow: "2px 0 8px rgba(44,62,80,0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "16px",
          gap: "6px",
          zIndex: 200,
        }}
      >
        {/* Logo / branding mark */}
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: ACCENT,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.9rem",
            fontWeight: 900,
            marginBottom: "12px",
            flexShrink: 0,
            cursor: "pointer",
          }}
          title="Atlas Pluriversal del Río Cauca"
          onClick={() => window.open("https://atlasriosincauca.net", "_blank")}
        >
          A
        </div>

        {TABS.map((tab) => {
          const isActive = sidebarOpen && activeTab === tab.id;
          return (
            <button
              key={tab.id}
              title={tab.label}
              onClick={() => handleTabClick(tab.id)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                border: "none",
                background: isActive ? ACCENT : "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(52,73,94,0.08)";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
              }}
            >
              {tab.icon}
            </button>
          );
        })}
      </div>

      {/* ── PANEL de contenido (slide in/out) ───────────────────── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: sidebarOpen ? "48px" : `${48 - SIDEBAR_WIDTH}px`,
          width: `${SIDEBAR_WIDTH}px`,
          height: "100vh",
          background: BG,
          borderRight: `1px solid ${BORDER}`,
          boxShadow: sidebarOpen ? "4px 0 16px rgba(44,62,80,0.12)" : "none",
          display: "flex",
          flexDirection: "column",
          transition: "left 0.25s cubic-bezier(0.4,0,0.2,1)",
          zIndex: 190,
          overflow: "hidden",
        }}
      >
        {/* Header del panel */}
        <div
          style={{
            height: `${HEADER_HEIGHT}px`,
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            borderBottom: `1px solid ${BORDER}`,
            gap: "8px",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: "1rem" }}>
            {TABS.find((t) => t.id === activeTab)?.icon}
          </span>
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 600,
              color: TEXT_PRIMARY,
              flex: 1,
            }}
          >
            {TABS.find((t) => t.id === activeTab)?.label}
          </span>
          <button
            onClick={toggleSidebar}
            title="Cerrar panel"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: TEXT_SECONDARY,
              fontSize: "0.85rem",
              padding: "4px",
              borderRadius: "4px",
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Contenido del panel activo */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {activeTab === "chapters" && <ChapterNav />}
          {activeTab === "layers" && <LayerPanel />}
          {activeTab === "search" && (
            <div
              style={{
                padding: "16px",
                fontSize: "0.82rem",
                color: TEXT_SECONDARY,
              }}
            >
              Búsqueda disponible en próxima iteración.
            </div>
          )}
        </div>

        {/* Footer con metadatos */}
        <div
          style={{
            borderTop: `1px solid ${BORDER}`,
            padding: "8px 16px",
            flexShrink: 0,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.65rem",
              color: TEXT_SECONDARY,
              lineHeight: 1.4,
            }}
          >
            Atlas Pluriversal del Río Cauca
            <br />
            <span style={{ opacity: 0.7 }}>v2.0 · 2026</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
