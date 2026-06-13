import { MapProvider } from "@map/context/MapContext";
import AtlasMapBuilder from "@ui/components/map/AtlasMapBuilder";
import { useEffect, useRef, useState } from "react";

/**
 * 🔬 PÁGINA DE COMPARACIÓN BOUNDS — INTRO
 * =========================================
 *
 * Muestra 3 instancias del mapa intro con distintos valores de tilesConfig.bounds:
 *
 *   A — Bounds actuales (correcto):
 *       tiles: [−78.908, −0.021, −65.739, 12.879]  → carga completa ✓
 *       vmb:   [−82.308,  3.202, −68.939,  9.559]
 *
 *   B — Bounds V17 original (sin transformar):
 *       tiles: [−78.908, −6.967, −65.739, −0.289]  → al sur ecuador, sin tiles ✗
 *
 *   C — Bounds fórmula antigua ("los −6°"):
 *       tiles: [−78.908, −0.289, −65.739,  6.388]  → solo mitad sur, desfasado ⚠
 *
 * Todos los paneles usan viewportMaxBounds correcto (Colombia) para que el
 * viewport sea comparable. La diferencia es qué tiles solicita cada uno.
 *
 * Ruta: /test-maps/intro-pgw-compare
 */

interface VariantInfo {
    mapId: string;
    label: string;
    fValue: string;
    latRange: string;
    status: "correct" | "wrong" | "base";
    description: string;
}

const VARIANTS: VariantInfo[] = [
    {
        mapId: "intro-pgw-current",
        label: "A — setTransformConstrain",
        fValue: "bearing-aware clamp (nuevo fix)",
        latRange: "vmb: [−82.308, 3.202, −68.939, 9.559]",
        status: "correct",
        description: "setTransformConstrain bearing-aware: W↔lat, H↔lon. Bounds sólidos a cualquier zoom. No escapa.",
    },
    {
        mapId: "intro-pgw-v17",
        label: "B — Bounds V17 Original",
        fValue: "tiles: [−78.908, −6.967, −65.739, −0.289]",
        latRange: "F v17 = −0.290036 → span 6.677° al sur del ecuador",
        status: "base",
        description: "Bounds del PGW original sin transformar. Tiles al sur del ecuador — panel vacío en Colombia.",
    },
    {
        mapId: "intro-pgw-transformed",
        label: "C — setMaxBounds (bug)",
        fValue: "setMaxBounds + bearing=-90 (actual)",
        latRange: "vmb: [−82.308, 3.202, −68.939, 9.559]",
        status: "wrong",
        description: "setMaxBounds es bearing-blind: axes invertidos con −90°. Zoom in → cámara escapa arriba/abajo.",
    },
];

const STATUS_COLORS: Record<VariantInfo["status"], string> = {
    correct: "#22c55e",
    wrong: "#f59e0b",
    base: "#ef4444",
};

const STATUS_LABELS: Record<VariantInfo["status"], string> = {
    correct: "✓ CONSTRAIN OK",
    wrong: "⚠ BUG EJES",
    base: "✕ SIN TILES",
};

function VariantPanel({ variant }: { variant: VariantInfo }) {
    const statusColor = STATUS_COLORS[variant.status];
    const panelRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Sincronizar estado con Fullscreen API (Esc del browser también actualiza)
    useEffect(() => {
        const handler = () => {
            setIsFullscreen(document.fullscreenElement === panelRef.current);
        };
        document.addEventListener("fullscreenchange", handler);
        return () => document.removeEventListener("fullscreenchange", handler);
    }, []);

    function toggleFullscreen() {
        if (!panelRef.current) return;
        if (!document.fullscreenElement) {
            void panelRef.current.requestFullscreen();
        } else {
            void document.exitFullscreen();
        }
    }

    return (
        <div
            ref={panelRef}
            style={{
                display: "flex",
                flexDirection: "column",
                width: "calc(33.333% - 8px)",
                height: "100%",
                background: "#111827",
                borderRadius: isFullscreen ? 0 : 8,
                overflow: "hidden",
                border: `2px solid ${statusColor}`,
                boxShadow: `0 0 16px ${statusColor}33`,
            }}
        >
            {/* Header del panel */}
            <div
                style={{
                    padding: "10px 14px 8px",
                    background: "#1f2937",
                    borderBottom: `1px solid ${statusColor}44`,
                    flexShrink: 0,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 4,
                    }}
                >
                    <span
                        style={{
                            color: "#f9fafb",
                            fontWeight: 700,
                            fontSize: 13,
                            letterSpacing: "0.02em",
                        }}
                    >
                        {variant.label}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span
                            style={{
                                background: statusColor,
                                color: "white",
                                fontSize: 10,
                                fontWeight: 700,
                                padding: "2px 6px",
                                borderRadius: 4,
                                letterSpacing: "0.05em",
                            }}
                        >
                            {STATUS_LABELS[variant.status]}
                        </span>
                        {/* Botón fullscreen */}
                        <button
                            onClick={toggleFullscreen}
                            title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                            style={{
                                background: isFullscreen ? "#374151" : "#1f2937",
                                border: `1px solid ${statusColor}66`,
                                borderRadius: 5,
                                color: "#e5e7eb",
                                cursor: "pointer",
                                padding: "3px 7px",
                                fontSize: 13,
                                lineHeight: 1,
                                display: "flex",
                                alignItems: "center",
                                transition: "background 0.15s",
                            }}
                        >
                            {isFullscreen ? "⛶" : "⛶"}
                            <span style={{ fontSize: 10, marginLeft: 4, color: "#9ca3af" }}>
                                {isFullscreen ? "Salir" : "Expandir"}
                            </span>
                        </button>
                    </div>
                </div>
                <code
                    style={{
                        display: "block",
                        color: "#93c5fd",
                        fontFamily: "monospace",
                        fontSize: 11,
                        marginBottom: 2,
                    }}
                >
                    {variant.fValue}
                </code>
                <code
                    style={{
                        display: "block",
                        color: "#6ee7b7",
                        fontFamily: "monospace",
                        fontSize: 11,
                        marginBottom: 4,
                    }}
                >
                    {variant.latRange}
                </code>
                <p
                    style={{
                        color: "#9ca3af",
                        fontSize: 10,
                        margin: 0,
                        lineHeight: 1.4,
                    }}
                >
                    {variant.description}
                </p>
            </div>

            {/* Contenedor del mapa */}
            <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
                <MapProvider>
                    <AtlasMapBuilder
                        mapId={variant.mapId}
                        style={{ width: "100%", height: "100%" }}
                        enableControls={false}
                        enableLegend={false}
                    />
                </MapProvider>
            </div>
        </div>
    );
}

function IntroPGWComparePage() {
    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                background: "#030712",
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                overflow: "hidden",
            }}
        >
            {/* Header global */}
            <div
                style={{
                    padding: "10px 20px",
                    background: "#111827",
                    borderBottom: "1px solid #374151",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexShrink: 0,
                }}
            >
                <div>
                    <h1
                        style={{
                            margin: 0,
                            color: "#f9fafb",
                            fontSize: 16,
                            fontWeight: 700,
                        }}
                    >
                        🔬 Comparación Bounds — Intro
                    </h1>
                    <p
                        style={{
                            margin: "2px 0 0",
                            color: "#6b7280",
                            fontSize: 11,
                        }}
                    >
                        A: setMaxBounds (correcto) · B: V17 sin tiles · C: setTransformConstrain (bearing-aware){" "}
                        — viewport fijo a Colombia en los 3 paneles
                    </p>
                </div>
                <a
                    href="/"
                    style={{
                        color: "#9ca3af",
                        textDecoration: "none",
                        fontSize: 12,
                        border: "1px solid #374151",
                        padding: "4px 10px",
                        borderRadius: 6,
                    }}
                >
                    ← Inicio
                </a>
            </div>

            {/* Grid de 3 mapas */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    gap: 8,
                    padding: 8,
                    minHeight: 0,
                }}
            >
                {VARIANTS.map((v) => (
                    <VariantPanel key={v.mapId} variant={v} />
                ))}
            </div>

            {/* Footer con invariantes */}
            <div
                style={{
                    padding: "6px 20px",
                    background: "#111827",
                    borderTop: "1px solid #374151",
                    display: "flex",
                    gap: 24,
                    flexShrink: 0,
                }}
            >
                <span style={{ color: "#6b7280", fontSize: 10 }}>
                    Tiles:{" "}
                    <code style={{ color: "#93c5fd" }}>
                        /assets/maps/tiles/intro/&#123;z&#125;/&#123;x&#125;/&#123;y&#125;.webp
                    </code>
                </span>
                <span style={{ color: "#6b7280", fontSize: 10 }}>
                    Tile extent real:{" "}
                    <code style={{ color: "#6ee7b7" }}>
                        lon [−78.91°, −65.74°] · lat [−0.02°, 12.88°]
                    </code>
                    {" — solo A carga tiles en este rango"}
                </span>
                <span style={{ color: "#6b7280", fontSize: 10 }}>
                    bearing:{" "}
                    <code style={{ color: "#fbbf24" }}>−90°</code>
                    {" · "}
                    imagen: 11141 × 5649 px
                </span>
            </div>
        </div>
    );
}

export default IntroPGWComparePage;
