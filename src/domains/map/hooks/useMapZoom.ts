/**
 * 🔍 HOOK DE ZOOM AUTOMÁTICO
 * ===========================
 *
 * Hook para calcular zoom automático basado en el tamaño del contenedor.
 * Observa cambios de tamaño del contenedor.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import type { GeographicBounds } from "../services/BoundsCalculator";
import { logger } from "../services/MapLogger";
import {
  calculateAutoZoomFromElement,
  type ZoomSettings,
} from "../utils/zoomCalculator";

export interface UseMapZoomOptions {
  bounds: GeographicBounds;
  center: [number, number];
  settings: ZoomSettings;
  enabled: boolean;
}

export interface UseMapZoomResult {
  zoom: number;
  recalculate: () => void;
}

const ZOOM_EPSILON = 0.0001;

export function useMapZoom(
  containerRef: RefObject<HTMLElement | null>,
  options: UseMapZoomOptions,
): UseMapZoomResult {
  const { bounds, center, settings, enabled } = options;

  // Inicializar con initialZoom si autoBounds=false, o con 0 si auto-cálculo activo
  const [zoom, setZoom] = useState<number>(
    enabled ? 0 : settings.initialZoom,
  );

  // Refs para evitar stale closure en ResizeObserver
  const boundsRef = useRef(bounds);
  const centerRef = useRef(center);
  const settingsRef = useRef(settings);
  const enabledRef = useRef(enabled);
  const lastLoggedZoomRef = useRef<number | null>(null);

  useEffect(() => {
    boundsRef.current = bounds;
    centerRef.current = center;
    settingsRef.current = settings;
    enabledRef.current = enabled;
  }, [bounds, center, settings, enabled]);

  const recalculateInternal = useCallback((reason: "manual" | "deps" | "resize") => {
    if (!enabledRef.current) {
      const fallbackZoom = settingsRef.current.initialZoom;
      setZoom((prev) =>
        Math.abs(prev - fallbackZoom) <= ZOOM_EPSILON ? prev : fallbackZoom,
      );

      if (
        lastLoggedZoomRef.current === null ||
        Math.abs(lastLoggedZoomRef.current - fallbackZoom) > ZOOM_EPSILON
      ) {
        logger.debug(
          "hooks",
          `[useMapZoom] zoom recalculated (${reason}): ${fallbackZoom}`,
        );
        lastLoggedZoomRef.current = fallbackZoom;
      }
      return;
    }

    const newZoom = calculateAutoZoomFromElement(
      containerRef.current,
      boundsRef.current,
      centerRef.current,
      settingsRef.current,
    );

    if (
      lastLoggedZoomRef.current === null ||
      Math.abs(lastLoggedZoomRef.current - newZoom) > ZOOM_EPSILON
    ) {
      logger.debug(
        "hooks",
        `[useMapZoom] zoom recalculated (${reason}): ${newZoom}`,
      );
      lastLoggedZoomRef.current = newZoom;
    }

    setZoom((prev) => (Math.abs(prev - newZoom) <= ZOOM_EPSILON ? prev : newZoom));
  }, [containerRef]); // solo containerRef es estable

  const recalculate = useCallback(() => {
    recalculateInternal("manual");
  }, [recalculateInternal]);

  // Calcular al cambiar configuración relevante
  useEffect(() => {
    recalculateInternal("deps");
  }, [bounds, center, settings, enabled, recalculateInternal]);

  // ResizeObserver — usa refs para evitar stale closure
  useEffect(() => {
    if (!containerRef.current || !enabled) return;
    const observer = new ResizeObserver(() => recalculateInternal("resize"));
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [containerRef, enabled, recalculateInternal]);

  return { zoom, recalculate };
}
