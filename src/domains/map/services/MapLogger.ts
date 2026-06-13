/**
 * 🔊 LOGGER SERVICE
 * =================
 * Logger con niveles y supresión automática en producción.
 *
 * Dev  (import.meta.env.DEV = true) → debug, info, warn, error
 * Prod                               → warn, error solamente
 *
 * API pública retrocompatible:
 *   logger.log()  → alias de debug
 *   logger.group()/groupEnd() → solo en debug
 */

const LOG_LEVEL_MAP = { debug: 0, info: 1, warn: 2, error: 3 } as const;
type Level = keyof typeof LOG_LEVEL_MAP;

const ACTIVE_LEVEL: Level = import.meta.env.DEV ? "debug" : "warn";

function meetsLevel(level: Level): boolean {
  return LOG_LEVEL_MAP[level] >= LOG_LEVEL_MAP[ACTIVE_LEVEL];
}

export type LogCategory = string;

export const logger = {
  /** Debug — solo desarrollo */
  debug(category: LogCategory, ...args: unknown[]): void {
    if (meetsLevel("debug")) console.log(`[${category}]`, ...args);
  },
  /** Info — solo desarrollo */
  info(category: LogCategory, ...args: unknown[]): void {
    if (meetsLevel("info")) console.info(`[${category}]`, ...args);
  },
  /** Alias de debug para retrocompatibilidad */
  log(category: LogCategory, ...args: unknown[]): void {
    if (meetsLevel("debug")) console.log(`[${category}]`, ...args);
  },
  /** Warn — visible en dev y prod */
  warn(category: LogCategory, ...args: unknown[]): void {
    if (meetsLevel("warn")) console.warn(`⚠️ [${category}]`, ...args);
  },
  /** Error — siempre visible */
  error(category: LogCategory, ...args: unknown[]): void {
    console.error(`❌ [${category}]`, ...args);
  },
  /** Abre grupo — solo debug */
  group(category: LogCategory, label: string): void {
    if (meetsLevel("debug")) console.group(`[${category}] ${label}`);
  },
  /** Cierra grupo — solo debug */
  groupEnd(category?: LogCategory): void {
    if (meetsLevel("debug")) console.groupEnd();
    void category;
  },
  /** Tabla — solo debug */
  table(category: LogCategory, data: unknown): void {
    if (meetsLevel("debug")) {
      console.table(data);
      void category;
    }
  },
  isEnabled(category: LogCategory): boolean {
    void category;
    return import.meta.env.DEV;
  },
};

export function shouldLog(category: LogCategory): boolean {
  void category;
  return import.meta.env.DEV;
}

export function getLogConfig(): { enabled: boolean; level: Level } {
  return { enabled: import.meta.env.DEV, level: ACTIVE_LEVEL };
}
