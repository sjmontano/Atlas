/**
 * 🧠 UI STORE — Estado de presentación
 * =======================================
 * - qué modal está abierto y con qué datos
 * - estado del sidebar
 * - panel activo en el sidebar
 *
 * REGLA: Este store NO conoce dominios. Solo sabe qué está visible en pantalla.
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";

type SidebarPanel = "chapters" | "layers" | "search" | null;
type ModalId = "territory-info" | "layer-info" | "media-gallery" | null;

interface UIStore {
  /** Sidebar abierto/cerrado */
  sidebarOpen: boolean;
  /** Panel activo dentro del sidebar */
  activeSidebarPanel: SidebarPanel;
  /** ID del modal abierto, null si ninguno */
  activeModal: ModalId;
  /** Payload para el modal activo (territorio, capa, etc.) */
  modalPayload: unknown;

  // ─── Acciones ────────────────────────────────────────────────────────────
  toggleSidebar: () => void;
  setSidebarPanel: (panel: SidebarPanel) => void;
  openModal: (modalId: ModalId, payload?: unknown) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIStore>()(
  devtools(
    (set) => ({
      sidebarOpen: false,
      activeSidebarPanel: null,
      activeModal: null,
      modalPayload: null,

      toggleSidebar: () =>
        set((s) => ({ sidebarOpen: !s.sidebarOpen }), false, "ToggleSidebar"),

      setSidebarPanel: (panel) =>
        set({ activeSidebarPanel: panel }, false, "SetSidebarPanel"),

      openModal: (modalId, payload = null) =>
        set(
          { activeModal: modalId, modalPayload: payload },
          false,
          "OpenModal",
        ),

      closeModal: () =>
        set({ activeModal: null, modalPayload: null }, false, "CloseModal"),
    }),
    { name: "UIStore" },
  ),
);
