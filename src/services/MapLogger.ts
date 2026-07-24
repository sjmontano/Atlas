/**
 * 🪵 MAP LOGGER
 * =============
 *
 * Logger estructurado por entorno y categoría.
 *
 * - Desarrollo: debug, info, warn, error
 * - Producción: solo warn, error
 *
 * Uso:
 *   import { logger } from '@services/MapLogger'
 *   logger.info('MAP_INIT', 'Mapa inicializado', { mapId })
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const isDev = Boolean(import.meta.env?.DEV)

function shouldLog(level: LogLevel): boolean {
  if (isDev) return true
  return level === 'warn' || level === 'error'
}

export const logger = {
  debug(category: string, ...args: unknown[]): void {
    if (shouldLog('debug')) console.debug(`[${category}]`, ...args)
  },
  info(category: string, ...args: unknown[]): void {
    if (shouldLog('info')) console.info(`[${category}]`, ...args)
  },
  warn(category: string, ...args: unknown[]): void {
    if (shouldLog('warn')) console.warn(`[${category}]`, ...args)
  },
  error(category: string, ...args: unknown[]): void {
    if (shouldLog('error')) console.error(`[${category}]`, ...args)
  },
  group(category: string, label: string): void {
    if (shouldLog('debug')) console.group(`[${category}] ${label}`)
  },
  groupEnd(_category: string): void {
    if (shouldLog('debug')) console.groupEnd()
  },
}
