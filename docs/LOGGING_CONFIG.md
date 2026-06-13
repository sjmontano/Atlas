# Logging Config - Estado Actual

Configuracion vigente del sistema de logs del dominio de mapas.

## Archivo fuente

- `src/domains/map/services/MapLogger.ts`

## Niveles

- `debug`
- `info`
- `warn`
- `error`

## Comportamiento por entorno

- En desarrollo (`import.meta.env.DEV = true`): se permiten `debug`, `info`, `warn`, `error`.
- En produccion: se muestran `warn` y `error`.

## API disponible

```ts
logger.debug(category, ...args)
logger.info(category, ...args)
logger.log(category, ...args) // alias de debug
logger.warn(category, ...args)
logger.error(category, ...args)
logger.group(category, label)
logger.groupEnd(category?)
logger.table(category, data)
```

## Ejemplo de uso

```ts
import { logger } from "@map/services/MapLogger";

logger.info("MAP_INIT", "Mapa inicializado", { mapId });
logger.warn("MAP_INIT", "Fuente no encontrada", { sourceId });
logger.error("MAP_INIT", "Error construyendo mapa", error);
```

## Recomendaciones

1. Usar categorias consistentes (`MAP_INIT`, `mapRenderer`, `hooks`, etc.).
2. Evitar logs de alto volumen en loops de render.
3. Para debug temporal, preferir `debug`/`info` y luego limpiar.
