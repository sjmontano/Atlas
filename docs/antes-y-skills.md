# Antes y Skills - Estado Operativo

Fecha: 2026-04-13
Alcance: georreferenciacion, bounds runtime, pruebas por fases.

## Lo que esta pasando ahora
- El flujo runtime de bounds ya esta centralizado para mapas tiles y chapter1 opera con estrategia auto + fallback.
- Renderer consume runtime bounds precomputados en el camino principal.
- Hay pruebas cuantitativas en pixeles para validar precision y decisiones de fallback.
- El contrato de maxBounds inicial/final ya tiene pruebas dedicadas.

## Lo que se quiere lograr
- Publicar un gate de CI por metricas (meanPx/maxPx) antes de retirar overrides.
- Completar Fase C en chapter2 sin ruptura ni regresiones visuales.
- Mantener trazabilidad tecnica con bajo ruido de logs de test.

## Antes vs Ahora

### Antes
- Intro concentraba gran parte de la logica de decision de tiles.
- Persistia dualidad parcial hook/renderer en runtime.
- No habia cobertura cuantitativa por pixeles.

### Ahora
- Chapter1 entra al resolvedor central con estrategia auto.
- Hook y renderer comparten resultado runtime en camino principal.
- Hay validacion cuantitativa y pruebas de integracion runtime.

## Skills consolidados
- Georreferenciacion PGW con modelo canonico y correccion half-pixel.
- Diseno de resolvedor por estrategia con fallback por delta.
- Pruebas de integracion de renderer con mocks MapLibre en Vitest.
- Endurecimiento de entorno de pruebas para maplibre-gl en jsdom.

## Skills en progreso
- Automatizacion de reporte por mapa para metricas de precision.
- Gate de CI por umbrales de error en pixeles.
- Migracion controlada de chapter2 con compatibilidad.

## Criterios de salida para siguiente fase
- meanPx <= 0.5 y maxPx <= 1.0 en mapas objetivo por fase.
- Sin divergencia entre centro/zoom inicial y post-build.
- Sin expansion lateral perceptual en bearing -90.
- Sin spam de logs repetidos en pruebas.
