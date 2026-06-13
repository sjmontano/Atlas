import type { Map as MapLibreMap } from "maplibre-gl";

type LayerPulseTarget = {
    id: string;
    property: "raster-opacity" | "fill-opacity" | "line-opacity" | "circle-opacity";
    baseOpacity: number;
};

const pulseTimersByLayer = new Map<string, number[]>();
const PULSE_STEPS = [1, 0.3, 1, 0.45, 1];
const PULSE_INTERVAL_MS = 95;

const resolveNumericOpacity = (value: unknown, fallback: number): number => {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === "string") {
        const parsed = Number.parseFloat(value);
        if (Number.isFinite(parsed)) {
            return parsed;
        }
    }

    return fallback;
};

const addTargetIfLayerExists = (
    map: MapLibreMap,
    targets: LayerPulseTarget[],
    id: string,
    property: LayerPulseTarget["property"],
    fallbackOpacity: number,
) => {
    let layerExists = false;
    try {
        layerExists = !!map.getLayer(id);
    } catch {
        layerExists = false;
    }

    if (!layerExists) {
        return;
    }

    let current: unknown;
    try {
        current = map.getPaintProperty(id, property);
    } catch {
        current = fallbackOpacity;
    }

    targets.push({
        id,
        property,
        baseOpacity: resolveNumericOpacity(current, fallbackOpacity),
    });
};

const getPulseTargets = (map: MapLibreMap, layerId: string): LayerPulseTarget[] => {
    const targets: LayerPulseTarget[] = [];

    addTargetIfLayerExists(map, targets, `${layerId}-raster`, "raster-opacity", 0.9);
    addTargetIfLayerExists(map, targets, `${layerId}-fill`, "fill-opacity", 0.48);
    addTargetIfLayerExists(map, targets, `${layerId}-stroke`, "line-opacity", 0.8);

    let baseLayer: ReturnType<MapLibreMap["getLayer"]>;
    try {
        baseLayer = map.getLayer(layerId);
    } catch {
        baseLayer = undefined;
    }
    if (baseLayer?.type === "line") {
        addTargetIfLayerExists(map, targets, layerId, "line-opacity", 0.8);
    } else if (baseLayer?.type === "circle") {
        addTargetIfLayerExists(map, targets, layerId, "circle-opacity", 0.8);
    } else if (baseLayer?.type === "fill") {
        addTargetIfLayerExists(map, targets, layerId, "fill-opacity", 0.48);
    }

    return targets;
};

const clearLayerPulseTimers = (layerId: string) => {
    const timers = pulseTimersByLayer.get(layerId);
    if (!timers) {
        return;
    }

    timers.forEach((timerId) => window.clearTimeout(timerId));
    pulseTimersByLayer.delete(layerId);
};

export const pulseLayer = (map: MapLibreMap | null | undefined, layerId: string) => {
    if (!map) {
        return;
    }

    const targets = getPulseTargets(map, layerId);
    if (targets.length === 0) {
        return;
    }

    clearLayerPulseTimers(layerId);

    const timers: number[] = [];

    PULSE_STEPS.forEach((stepOpacityFactor, index) => {
        const timeoutId = window.setTimeout(() => {
            targets.forEach((target) => {
                let layerExists = false;
                try {
                    layerExists = !!map.getLayer(target.id);
                } catch {
                    layerExists = false;
                }

                if (!layerExists) {
                    return;
                }

                try {
                    map.setPaintProperty(
                        target.id,
                        target.property,
                        Math.max(0, Math.min(1, target.baseOpacity * stepOpacityFactor)),
                    );
                } catch {
                    // Si el estilo cambió durante el pulso, ignoramos este tick.
                }
            });

            if (index === PULSE_STEPS.length - 1) {
                pulseTimersByLayer.delete(layerId);
            }
        }, index * PULSE_INTERVAL_MS);

        timers.push(timeoutId);
    });

    pulseTimersByLayer.set(layerId, timers);
};
