import { ATLAS_MAP_DATA } from "@map/data/atlasMapData";
import { describe, expect, it } from "vitest";
import { processBounds } from "../services/BoundsCalculator";
import {
    deriveTilesBoundsFromPgw,
    getMapSettings,
    resolveRuntimeBounds,
    type GeographicBoundsTuple,
    type MapSettings,
} from "./mapSettings";

const AUTO_THRESHOLD = 0.001;

type MapIdWithDimensions =
    | "intro"
    | "chapter1-encuadres"
    | "chapter1-ecosistemas"
    | "chapter1-formas-paisaje"
    | "chapter1-bredunco"
    | "chapter1-mosaicos-del-agua"
    | "chapter1-un-rio-cauca";

function buildPgwBounds(mapId: MapIdWithDimensions): {
    bounds: GeographicBoundsTuple;
    imagePixels: { width: number; height: number };
} {
    const mapData = ATLAS_MAP_DATA[mapId];

    if (!mapData.dimensions) {
        throw new Error(`Map ${mapId} does not expose dimensions`);
    }

    const result = processBounds(
        mapData.pgwData,
        mapData.dimensions.width,
        mapData.dimensions.height,
    );

    return {
        bounds: result.bounds,
        imagePixels: {
            width: mapData.dimensions.width,
            height: mapData.dimensions.height,
        },
    };
}

function withForcedTilesBounds(
    settings: MapSettings,
    bounds: GeographicBoundsTuple,
): MapSettings {
    if (!settings.tilesConfig) {
        throw new Error("Expected tilesConfig to exist");
    }

    return {
        ...settings,
        tilesBoundsStrategy: "auto",
        tilesConfig: {
            ...settings.tilesConfig,
            bounds,
        },
    };
}

function calculatePixelErrorMetrics(
    referenceBounds: GeographicBoundsTuple,
    candidateBounds: GeographicBoundsTuple,
    pgwBounds: GeographicBoundsTuple,
    imagePixels: { width: number; height: number },
): { meanPx: number; maxPx: number } {
    const longitudeSpan = Math.abs(pgwBounds[2] - pgwBounds[0]);
    const latitudeSpan = Math.abs(pgwBounds[3] - pgwBounds[1]);

    const lonPerPixel = longitudeSpan / imagePixels.width;
    const latPerPixel = latitudeSpan / imagePixels.height;

    const deltaWestPx = Math.abs(referenceBounds[0] - candidateBounds[0]) / lonPerPixel;
    const deltaSouthPx = Math.abs(referenceBounds[1] - candidateBounds[1]) / latPerPixel;
    const deltaEastPx = Math.abs(referenceBounds[2] - candidateBounds[2]) / lonPerPixel;
    const deltaNorthPx = Math.abs(referenceBounds[3] - candidateBounds[3]) / latPerPixel;

    const deltas = [deltaWestPx, deltaSouthPx, deltaEastPx, deltaNorthPx];
    const meanPx = deltas.reduce((acc, value) => acc + value, 0) / deltas.length;
    const maxPx = Math.max(...deltas);

    return { meanPx, maxPx };
}

describe("resolveRuntimeBounds", () => {
    it("uses derived runtime bounds for intro in auto mode when delta is low", () => {
        const mapId = "intro";
        const { bounds, imagePixels } = buildPgwBounds(mapId);
        const settings = getMapSettings(mapId);

        const runtime = resolveRuntimeBounds({
            mapId,
            pgwBounds: bounds,
            imagePixels,
            settings,
        });

        expect(runtime.strategy).toBe("auto");
        expect(runtime.source).toBe("tiles-derived");
        expect(runtime.maxDeltaDegrees).toBeDefined();
        expect(runtime.maxDeltaDegrees ?? Number.POSITIVE_INFINITY).toBeLessThanOrEqual(
            AUTO_THRESHOLD,
        );
    });

    it("keeps intro runtime error within target thresholds in pixel space", () => {
        const mapId = "intro";
        const { bounds: pgwBounds, imagePixels } = buildPgwBounds(mapId);
        const settings = getMapSettings(mapId);

        const configuredBounds = settings.tilesConfig?.bounds as GeographicBoundsTuple;
        const derivedBounds = deriveTilesBoundsFromPgw(
            pgwBounds,
            settings.initialBearing,
            imagePixels,
        );

        const metrics = calculatePixelErrorMetrics(
            configuredBounds,
            derivedBounds,
            pgwBounds,
            imagePixels,
        );

        expect(metrics.meanPx).toBeLessThanOrEqual(0.5);
        expect(metrics.maxPx).toBeLessThanOrEqual(1.0);
    });

    it("keeps configured bounds in auto mode when delta is above threshold", () => {
        const mapId = "intro";
        const { bounds, imagePixels } = buildPgwBounds(mapId);
        const settings = getMapSettings(mapId);

        const forcedBounds: GeographicBoundsTuple = [
            bounds[0] + 1,
            bounds[1] - 1,
            bounds[2] + 1,
            bounds[3] - 1,
        ];

        const runtime = resolveRuntimeBounds({
            mapId,
            pgwBounds: bounds,
            imagePixels,
            settings: withForcedTilesBounds(settings, forcedBounds),
        });

        expect(runtime.strategy).toBe("auto");
        expect(runtime.source).toBe("tiles-config");
        expect(runtime.bounds).toEqual(forcedBounds);
        expect(runtime.maxDeltaDegrees ?? 0).toBeGreaterThan(AUTO_THRESHOLD);
    });

    it("applies tile runtime strategy for chapter1-ecosistemas", () => {
        const mapId = "chapter1-ecosistemas";
        const { bounds, imagePixels } = buildPgwBounds(mapId);
        const settings = getMapSettings(mapId);

        const runtime = resolveRuntimeBounds({
            mapId,
            pgwBounds: bounds,
            imagePixels,
            settings,
        });

        expect(runtime.strategy).toBe("auto");
        expect(runtime.source).not.toBe("pgw");
    });

    it("applies tile runtime strategy for chapter1-encuadres", () => {
        const mapId = "chapter1-encuadres";
        const { bounds, imagePixels } = buildPgwBounds(mapId);
        const settings = getMapSettings(mapId);

        const runtime = resolveRuntimeBounds({
            mapId,
            pgwBounds: bounds,
            imagePixels,
            settings,
        });

        expect(runtime.strategy).toBe("auto");
        expect(runtime.source).not.toBe("pgw");
    });

    it("uses derived bounds for chapter1-ecosistemas when delta is low", () => {
        const mapId = "chapter1-ecosistemas";
        const { bounds, imagePixels } = buildPgwBounds(mapId);
        const settings = getMapSettings(mapId);

        const runtime = resolveRuntimeBounds({
            mapId,
            pgwBounds: bounds,
            imagePixels,
            settings,
        });

        // Después de la corrección: derivedBounds = pgwBounds (sin swap).
        // El delta entre configured y derived permanece < 0.001° → auto elige tiles-derived.
        expect(runtime.strategy).toBe("auto");
        expect(runtime.source).toBe("tiles-derived");
        expect(runtime.maxDeltaDegrees ?? Number.POSITIVE_INFINITY).toBeLessThanOrEqual(
            AUTO_THRESHOLD,
        );
    });
});
