import { describe, expect, it, vi } from "vitest";
import {
    applyFinalMaxBounds,
    resolveInitialMaxBounds,
} from "./useAtlasMap";

describe("useAtlasMap runtime maxBounds helpers", () => {
    const runtimeBounds: [number, number, number, number] = [
        -78.9,
        -0.29,
        -72.23,
        12.87,
    ];

    it("returns initial maxBounds when autoBounds is enabled or undefined", () => {
        expect(resolveInitialMaxBounds(true, runtimeBounds)).toEqual(runtimeBounds);
        expect(resolveInitialMaxBounds(undefined, runtimeBounds)).toEqual(runtimeBounds);
    });

    it("returns undefined initial maxBounds when autoBounds is false", () => {
        expect(resolveInitialMaxBounds(false, runtimeBounds)).toBeUndefined();
    });

    it("applies final maxBounds only when autoBounds is enabled", () => {
        const map = {
            setMaxBounds: vi.fn(),
        };

        applyFinalMaxBounds(map, true, runtimeBounds);
        applyFinalMaxBounds(map, undefined, runtimeBounds);
        applyFinalMaxBounds(map, false, runtimeBounds);

        expect(map.setMaxBounds).toHaveBeenCalledTimes(2);
        expect(map.setMaxBounds).toHaveBeenNthCalledWith(1, runtimeBounds);
        expect(map.setMaxBounds).toHaveBeenNthCalledWith(2, runtimeBounds);
    });
});
