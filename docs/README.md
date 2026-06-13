# Documentacion de Atlas 2.0

Indice oficial de documentacion activa del proyecto.

## Documentacion activa

- [USO_RAPIDO.md](./USO_RAPIDO.md): onboarding tecnico y comandos diarios.
- [ARQUITECTURA.md](./ARQUITECTURA.md): estructura de modulos, stores y flujo UI -> dominio.
- [GUIA_PROYECTO_SIN_CAPAS.md](./GUIA_PROYECTO_SIN_CAPAS.md): guia operativa para consultas rapidas sin entrar a detalle de capas.
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md): estado real de la migracion backend -> datos estaticos.
- [ROTACION_MAPAS_ACTUAL.md](./ROTACION_MAPAS_ACTUAL.md): como funciona hoy la rotacion georreferenciada.
- [LOGGING_CONFIG.md](./LOGGING_CONFIG.md): niveles y uso del sistema de logs actual.
- [TILES_QUICK_START.md](./TILES_QUICK_START.md): arranque rapido para tiles.
- [TILES_GENERATION_GUIDE.md](./TILES_GENERATION_GUIDE.md): generacion de tiles.
- [TILES_SERVER_SETUP.md](./TILES_SERVER_SETUP.md): despliegue/servido de tiles.

## Investigaciones y postmortems

- [investigaciones/README.md](./investigaciones/README.md): indice de investigaciones tecnicas y fixes documentados.

## Orden de lectura recomendado

1. [USO_RAPIDO.md](./USO_RAPIDO.md)
2. [ARQUITECTURA.md](./ARQUITECTURA.md)
3. [GUIA_PROYECTO_SIN_CAPAS.md](./GUIA_PROYECTO_SIN_CAPAS.md)
4. [ROTACION_MAPAS_ACTUAL.md](./ROTACION_MAPAS_ACTUAL.md)

## Criterio de mantenimiento

- Si un documento usa rutas antiguas (por ejemplo `src/shared/...` o `src/services/maps/...`) debe actualizarse o eliminarse.
- Las investigaciones no son guia de uso: deben vivir en `docs/investigaciones/`.
- Cada fix relevante (errores, regresiones, decisiones de arquitectura) debe tener un registro breve en `docs/investigaciones/`.
