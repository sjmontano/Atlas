import type { Map as MapLibreMap } from "maplibre-gl";

type EffectiveConnectionType = "slow-2g" | "2g" | "3g" | "4g";

interface NetworkInformationLike {
    effectiveType?: EffectiveConnectionType;
    saveData?: boolean;
}

export interface RuntimeDeviceProfile {
    effectiveType?: EffectiveConnectionType;
    saveData: boolean;
    deviceMemory?: number;
    hardwareConcurrency?: number;
}

export interface LayerActivationBenchmarkOptions {
    map: MapLibreMap;
    layerIds: string[];
    setLayersVisibility: (layerIds: string[], visible: boolean) => void;
    benchmarkName?: string;
    timeoutMs?: number;
    fpsSampleMs?: number;
    settleDelayMs?: number;
}

export interface LayerActivationBenchmarkResult {
    benchmarkName: string;
    measuredAt: string;
    layerCount: number;
    activationMs: number;
    layersReady: number;
    allLayersReady: boolean;
    timeoutMs: number;
    fpsAverage: number;
    fpsMin: number;
    fpsP95: number;
    longTasksSupported: boolean;
    longTaskCount: number;
    longTaskTotalMs: number;
    longTaskMaxMs: number;
    profile: RuntimeDeviceProfile;
    cpuMetricNote: string;
    gpuMetricNote: string;
}

export interface AtlasLayerPerfApi {
    runCurrentMapAB: () => Promise<LayerActivationBenchmarkResult>;
    runEcosistemasAB: () => Promise<LayerActivationBenchmarkResult>;
}

declare global {
    interface Window {
        atlasLayerPerf?: AtlasLayerPerfApi;
    }
}

const DEFAULT_TIMEOUT_MS = 20_000;
const DEFAULT_FPS_SAMPLE_MS = 4_500;
const DEFAULT_SETTLE_DELAY_MS = 140;

const sleep = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

const toFixedNumber = (value: number, digits = 1): number =>
    Number(value.toFixed(digits));

const percentile = (values: number[], p: number): number => {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const rank = Math.min(sorted.length - 1, Math.max(0, Math.floor(p * sorted.length)));
    return sorted[rank];
};

const safeGetLayer = (map: MapLibreMap, layerId: string) => {
    try {
        return map.getLayer(layerId);
    } catch {
        return undefined;
    }
};

const safeGetSource = (map: MapLibreMap, sourceId: string) => {
    try {
        return map.getSource(sourceId);
    } catch {
        return undefined;
    }
};

const isLayerVisible = (map: MapLibreMap, layerId: string): boolean => {
    const runtimeLayerIds = [
        `${layerId}-raster`,
        `${layerId}-fill`,
        `${layerId}-stroke`,
        layerId,
    ];

    for (const runtimeLayerId of runtimeLayerIds) {
        if (!safeGetLayer(map, runtimeLayerId)) {
            continue;
        }

        try {
            const visibility = map.getLayoutProperty(runtimeLayerId, "visibility");
            if (visibility === "none") {
                continue;
            }
            return true;
        } catch {
            return true;
        }
    }

    return false;
};

const isLayerSourceLoaded = (map: MapLibreMap, layerId: string): boolean => {
    const rasterSourceId = `${layerId}-source`;
    if (safeGetSource(map, rasterSourceId)) {
        return map.isSourceLoaded(rasterSourceId);
    }

    if (safeGetSource(map, layerId)) {
        return map.isSourceLoaded(layerId);
    }

    return false;
};

const waitUntilLayersReady = (
    map: MapLibreMap,
    layerIds: string[],
    timeoutMs: number,
): Promise<{ readyCount: number; elapsedMs: number; success: boolean }> => {
    const start = performance.now();

    return new Promise((resolve) => {
        const tick = () => {
            const readyCount = layerIds.reduce((acc, layerId) => {
                if (isLayerVisible(map, layerId) && isLayerSourceLoaded(map, layerId)) {
                    return acc + 1;
                }
                return acc;
            }, 0);

            const elapsedMs = performance.now() - start;
            if (readyCount === layerIds.length) {
                resolve({ readyCount, elapsedMs, success: true });
                return;
            }

            if (elapsedMs >= timeoutMs) {
                resolve({ readyCount, elapsedMs, success: false });
                return;
            }

            requestAnimationFrame(tick);
        };

        tick();
    });
};

const readRuntimeDeviceProfile = (): RuntimeDeviceProfile => {
    if (typeof navigator === "undefined") {
        return { saveData: false };
    }

    const nav = navigator as Navigator & {
        connection?: NetworkInformationLike;
        deviceMemory?: number;
    };

    const connection = nav.connection;
    const deviceMemory =
        typeof nav.deviceMemory === "number" ? nav.deviceMemory : undefined;

    return {
        effectiveType: connection?.effectiveType,
        saveData: connection?.saveData === true,
        deviceMemory,
        hardwareConcurrency:
            typeof nav.hardwareConcurrency === "number"
                ? nav.hardwareConcurrency
                : undefined,
    };
};

const measureFpsDuringMotion = async (
    map: MapLibreMap,
    sampleMs: number,
): Promise<{ averageFps: number; minFps: number; p95Fps: number }> => {
    const sampleDurationMs = Math.max(1_800, sampleMs);
    const fpsSamples: number[] = [];

    const startCenter = map.getCenter();
    const initialCenter: [number, number] = [startCenter.lng, startCenter.lat];
    const initialZoom = map.getZoom();

    const moveDuration = Math.max(450, Math.round(sampleDurationMs * 0.42));
    const moveOffset: [number, number] = [0.15, 0.09];

    let lastFrameTs = 0;
    const startTs = performance.now();

    const rafPromise = new Promise<void>((resolve) => {
        const onFrame = (ts: number) => {
            if (lastFrameTs > 0) {
                const delta = ts - lastFrameTs;
                if (delta > 0) {
                    fpsSamples.push(1000 / delta);
                }
            }

            lastFrameTs = ts;

            if (ts - startTs >= sampleDurationMs) {
                resolve();
                return;
            }

            requestAnimationFrame(onFrame);
        };

        requestAnimationFrame(onFrame);
    });

    map.easeTo({
        center: [initialCenter[0] + moveOffset[0], initialCenter[1] + moveOffset[1]],
        zoom: initialZoom + 0.45,
        duration: moveDuration,
        essential: true,
        easing: (value) => value,
    });

    setTimeout(() => {
        map.easeTo({
            center: initialCenter,
            zoom: initialZoom,
            duration: moveDuration,
            essential: true,
            easing: (value) => value,
        });
    }, Math.round(sampleDurationMs * 0.5));

    await rafPromise;
    map.stop();

    const averageFps =
        fpsSamples.length > 0
            ? fpsSamples.reduce((acc, value) => acc + value, 0) / fpsSamples.length
            : 0;

    const minFps = fpsSamples.length > 0 ? Math.min(...fpsSamples) : 0;
    const p95Fps = percentile(fpsSamples, 0.95);

    return {
        averageFps: toFixedNumber(averageFps, 1),
        minFps: toFixedNumber(minFps, 1),
        p95Fps: toFixedNumber(p95Fps, 1),
    };
};

const startLongTaskObserver = () => {
    const durations: number[] = [];

    const supportsLongTasks =
        typeof PerformanceObserver !== "undefined" &&
        Array.isArray(PerformanceObserver.supportedEntryTypes) &&
        PerformanceObserver.supportedEntryTypes.includes("longtask");

    if (!supportsLongTasks) {
        return () => ({
            supported: false,
            count: 0,
            totalMs: 0,
            maxMs: 0,
        });
    }

    const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            durations.push(entry.duration);
        });
    });

    observer.observe({ entryTypes: ["longtask"] });

    return () => {
        observer.disconnect();

        const totalMs = durations.reduce((acc, value) => acc + value, 0);
        const maxMs = durations.length > 0 ? Math.max(...durations) : 0;

        return {
            supported: true,
            count: durations.length,
            totalMs: toFixedNumber(totalMs, 1),
            maxMs: toFixedNumber(maxMs, 1),
        };
    };
};

export async function runLayerActivationBenchmark(
    options: LayerActivationBenchmarkOptions,
): Promise<LayerActivationBenchmarkResult> {
    const {
        map,
        setLayersVisibility,
        benchmarkName = "layers-ab",
        timeoutMs = DEFAULT_TIMEOUT_MS,
        fpsSampleMs = DEFAULT_FPS_SAMPLE_MS,
        settleDelayMs = DEFAULT_SETTLE_DELAY_MS,
    } = options;

    const uniqueLayerIds = Array.from(new Set(options.layerIds));
    if (uniqueLayerIds.length === 0) {
        throw new Error("Benchmark sin capas: layerIds está vacío");
    }

    const profile = readRuntimeDeviceProfile();

    // Reinicia a estado base para que A/B sea comparable entre corridas.
    setLayersVisibility(uniqueLayerIds, false);
    await sleep(settleDelayMs);

    const stopLongTaskObserver = startLongTaskObserver();

    setLayersVisibility(uniqueLayerIds, true);

    const visibilityResult = await waitUntilLayersReady(
        map,
        uniqueLayerIds,
        timeoutMs,
    );

    const activationMs = visibilityResult.elapsedMs;
    const fpsResult = await measureFpsDuringMotion(map, fpsSampleMs);
    const longTasks = stopLongTaskObserver();

    const result: LayerActivationBenchmarkResult = {
        benchmarkName,
        measuredAt: new Date().toISOString(),
        layerCount: uniqueLayerIds.length,
        activationMs: toFixedNumber(activationMs, 1),
        layersReady: visibilityResult.readyCount,
        allLayersReady: visibilityResult.success,
        timeoutMs,
        fpsAverage: fpsResult.averageFps,
        fpsMin: fpsResult.minFps,
        fpsP95: fpsResult.p95Fps,
        longTasksSupported: longTasks.supported,
        longTaskCount: longTasks.count,
        longTaskTotalMs: longTasks.totalMs,
        longTaskMaxMs: longTasks.maxMs,
        profile,
        cpuMetricNote:
            "CPU estimada por long tasks del hilo principal (no hay API directa de CPU por pestaña).",
        gpuMetricNote:
            "GPU sin API estándar directa en navegador; usar FPS + long tasks como proxy operativo.",
    };

    console.groupCollapsed(`[AtlasPerf] ${benchmarkName}`);
    console.table({
        capas: result.layerCount,
        activacionMs: result.activationMs,
        capasListas: `${result.layersReady}/${result.layerCount}`,
        fpsPromedio: result.fpsAverage,
        fpsMin: result.fpsMin,
        fpsP95: result.fpsP95,
        longTasks: result.longTaskCount,
        longTasksMs: result.longTaskTotalMs,
        longTaskMaxMs: result.longTaskMaxMs,
        red: result.profile.effectiveType ?? "unknown",
        saveData: result.profile.saveData,
        deviceMemory: result.profile.deviceMemory ?? "n/a",
        cores: result.profile.hardwareConcurrency ?? "n/a",
    });
    console.groupEnd();

    return result;
}
