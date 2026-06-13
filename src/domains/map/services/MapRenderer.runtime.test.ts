import type maplibregl from "maplibre-gl";
import { describe, expect, it, vi } from "vitest";
import type { MapConfig } from "../config/mapConfig";
import { resolveRuntimeBounds } from "../config/mapSettings";
import { ATLAS_MAP_DATA } from "../data/atlasMapData";
import { processBounds, type BoundsResult } from "./BoundsCalculator";
import { createMapRenderer } from "./MapRenderer";

function createMapConfigForTest(mapId: keyof typeof ATLAS_MAP_DATA): MapConfig {
    const data = ATLAS_MAP_DATA[mapId];

    const lowResImagePath =
        "lowResImagePath" in data ? data.lowResImagePath : undefined;
    const dimensions =
        "dimensions" in data && data.dimensions
            ? { width: data.dimensions.width, height: data.dimensions.height }
            : undefined;
    const chapter = "chapter" in data ? data.chapter : undefined;
    const territory = "territory" in data ? data.territory : undefined;

    return {
        id: data.id,
        name: data.name,
        description: data.description,
        imagePath: data.imagePath,
        lowResImagePath,
        pgwData: [...data.pgwData] as [number, number, number, number, number, number],
        dimensions,
        chapter,
        territory,
    };
}

function createPrecomputedBounds(config: MapConfig): BoundsResult {
    if (!config.dimensions) {
        throw new Error("Expected dimensions for test config");
    }

    return processBounds(
        config.pgwData,
        config.dimensions.width,
        config.dimensions.height,
        undefined,
        { enabled: false },
    );
}

function createMockMap(options?: {
    bearing?: number;
    zoom?: number;
    center?: [number, number];
}): {
    map: maplibregl.Map;
    calls: {
        fitBounds: Array<unknown[]>;
        setCenter: Array<[number, number]>;
        setMinZoom: number[];
    };
} {
    const sources = new Map<string, unknown>();
    const layers = new Map<string, unknown>();

    let currentCenter: [number, number] = options?.center ?? [0, 0];
    const currentZoom = options?.zoom ?? 6;
    const currentBearing = options?.bearing ?? -90;

    const calls = {
        fitBounds: [] as Array<unknown[]>,
        setCenter: [] as Array<[number, number]>,
        setMinZoom: [] as number[],
    };

    const map = {
        getSource: (id: string) => sources.get(id),
        addSource: vi.fn((id, source) => {
            sources.set(id, source);
        }),
        getLayer: (id: string) => layers.get(id),
        addLayer: vi.fn((layer: unknown) => {
            const casted = layer as { id: string };
            layers.set(casted.id, layer);
        }),
        fitBounds: vi.fn((...args: unknown[]) => {
            calls.fitBounds.push(args);
        }),
        getBearing: vi.fn(() => currentBearing),
        setCenter: vi.fn((center: [number, number]) => {
            currentCenter = center;
            calls.setCenter.push(center);
        }),
        getZoom: vi.fn(() => currentZoom),
        setMinZoom: vi.fn((zoom: number) => {
            calls.setMinZoom.push(zoom);
        }),
        isSourceLoaded: vi.fn(() => true),
        on: vi.fn(),
        off: vi.fn(),
        removeLayer: vi.fn((id: string) => {
            layers.delete(id);
        }),
        removeSource: vi.fn((id: string) => {
            sources.delete(id);
        }),
        getCenter: vi.fn(() => ({ toArray: () => currentCenter } as maplibregl.LngLat)),
    } as unknown as maplibregl.Map;

    return {
        map,
        calls,
    };
}

describe("MapRenderer runtime integration", () => {
    it("uses precomputed runtime bounds for intro and fixes minZoom", async () => {
        const mapConfig = createMapConfigForTest("intro");
        const precomputedBounds = createPrecomputedBounds(mapConfig);

        const runtime = resolveRuntimeBounds({
            mapId: "intro",
            pgwBounds: precomputedBounds.bounds,
            imagePixels: mapConfig.dimensions,
            settings: {
                initialBearing: -90,
                useTiles: true,
                tilesBoundsStrategy: "auto",
                tilesConfig: {
                    urlTemplate: "/assets/maps/tiles/intro/{z}/{x}/{y}.webp",
                    tileSize: 512,
                    minZoom: 0,
                    maxZoom: 9,
                    bounds: [-78.907953240108, -0.290036434033, -72.230566466337, 12.878607862918],
                },
            },
        });

        const { map, calls } = createMockMap({ zoom: 6.25, bearing: -90 });
        const renderer = createMapRenderer(map, mapConfig, "intro");

        const readySpy = vi.fn();
        const adjustedBounds = await renderer.buildGeoreferencedMap(
            readySpy,
            precomputedBounds,
            runtime,
        );

        const expectedCenter: [number, number] = [
            (runtime.bounds[0] + runtime.bounds[2]) / 2,
            (runtime.bounds[1] + runtime.bounds[3]) / 2,
        ];

        expect(adjustedBounds).toEqual(runtime.bounds);
        expect(calls.fitBounds).toHaveLength(0);
        expect(calls.setCenter.at(-1)).toEqual(expectedCenter);
        expect(calls.setMinZoom).toEqual([6.25]);
        expect(readySpy).toHaveBeenCalledTimes(1);
    });

    it("keeps explicit zoom maps centered without fitBounds", async () => {
        const mapConfig = createMapConfigForTest("chapter1-ecosistemas");
        const precomputedBounds = createPrecomputedBounds(mapConfig);

        const runtime = resolveRuntimeBounds({
            mapId: "chapter1-ecosistemas",
            pgwBounds: precomputedBounds.bounds,
            imagePixels: mapConfig.dimensions,
            settings: {
                initialBearing: -90,
                useTiles: true,
                tilesBoundsStrategy: "auto",
                tilesConfig: {
                    urlTemplate: "/assets/maps/tiles/ecosistemas/{z}/{x}/{y}.webp",
                    tileSize: 512,
                    minZoom: 7,
                    maxZoom: 10,
                    bounds: [-77.717574, 1.505615, -72.824285, 4.258046],
                },
            },
        });

        const { map, calls } = createMockMap({ zoom: 7.1, bearing: -90 });
        const renderer = createMapRenderer(map, mapConfig, "chapter1-ecosistemas");

        const adjustedBounds = await renderer.buildGeoreferencedMap(
            undefined,
            precomputedBounds,
            runtime,
        );

        const expectedCenter: [number, number] = [
            (runtime.bounds[0] + runtime.bounds[2]) / 2,
            (runtime.bounds[1] + runtime.bounds[3]) / 2,
        ];

        expect(adjustedBounds).toEqual(runtime.bounds);
        expect(calls.fitBounds).toHaveLength(0);
        expect(calls.setCenter.at(-1)).toEqual(expectedCenter);
        expect(calls.setMinZoom).toHaveLength(0);
    });
});
