/**
 * 🪵 MAP LOGGER
 * =============
 *
 * Logger estructurado por entorno, categoría y nivel de verbosidad.
 *
 * Niveles (de menor a mayor detalle):
 *   error  → solo errores
 *   warn   → warnings + errores               (default en producción)
 *   info   → eventos de alto nivel            (default en desarrollo)
 *   debug  → eventos internos por fase
 *   trace  → "nivel Z": TODO, incluido cada tile cargado (diagnóstico)
 *   silent → apaga todo (ni warn ni error)
 *
 * Cómo se decide el nivel (en orden de precedencia):
 *   1. Parámetro de URL `?log=<nivel>`  → override inmediato sin rebuild
 *      (también `?log=0` / `?log=silent` para apagar en producción)
 *   2. Variable de entorno `VITE_LOG_LEVEL=<nivel>`  → por build
 *   3. Default por entorno: dev → 'info', prod → 'warn'
 *
 * Uso:
 *   import { logger } from '@services/MapLogger'
 *   logger.info('MAP_INIT', 'Mapa inicializado', { mapId })
 *   logger.trace('TILES', 'Tile cargado', { z, x, y })
 */

type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent'

const LEVEL_ORDER: Record<LogLevel, number> = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  silent: 5,
}

function parseLevel(value: string | null | undefined): LogLevel | null {
  if (!value) return null
  const v = value.trim().toLowerCase()
  if (v === '0' || v === 'off' || v === 'none') return 'silent'
  if (v in LEVEL_ORDER) return v as LogLevel
  return null
}

function resolveLevel(): LogLevel {
  if (typeof window !== 'undefined') {
    const fromUrl = new URLSearchParams(window.location.search).get('log')
    const parsed = parseLevel(fromUrl)
    if (parsed) return parsed
  }

  const fromEnv = import.meta.env?.VITE_LOG_LEVEL
  const parsedEnv = parseLevel(fromEnv)
  if (parsedEnv) return parsedEnv

  return import.meta.env?.DEV ? 'trace' : 'warn'
}

const activeLevel = resolveLevel()

function shouldLog(level: LogLevel): boolean {
  return LEVEL_ORDER[level] >= LEVEL_ORDER[activeLevel]
}

function levelLabel(level: LogLevel): string {
  return level.toUpperCase().padEnd(5)
}

export const logger = {
  trace(category: string, ...args: unknown[]): void {
    if (shouldLog('trace')) console.debug(`[${levelLabel('trace')}][${category}]`, ...args)
  },
  debug(category: string, ...args: unknown[]): void {
    if (shouldLog('debug')) console.debug(`[${levelLabel('debug')}][${category}]`, ...args)
  },
  info(category: string, ...args: unknown[]): void {
    if (shouldLog('info')) console.info(`[${levelLabel('info')}][${category}]`, ...args)
  },
  warn(category: string, ...args: unknown[]): void {
    if (shouldLog('warn')) console.warn(`[${levelLabel('warn')}][${category}]`, ...args)
  },
  error(category: string, ...args: unknown[]): void {
    if (shouldLog('error')) console.error(`[${levelLabel('error')}][${category}]`, ...args)
  },
  group(category: string, label: string): void {
    if (shouldLog('debug')) console.group(`[${category}] ${label}`)
  },
  groupEnd(_category: string): void {
    if (shouldLog('debug')) console.groupEnd()
  },
  /** Nivel activo actual (útil para mostrarlo en UI/dev-tools) */
  get level(): LogLevel {
    return activeLevel
  },
}
