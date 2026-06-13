/**
 * 🛡️ ERROR UTILS — Manejo tipado de errores
 * ============================================
 * Elimina los `catch (err: any)` dispersos en el proyecto.
 * TypeScript 4+ requiere `unknown` en catch; estas utilidades
 * hacen el narrowing de forma centralizada.
 */

/**
 * Extrae un mensaje legible de cualquier tipo de error.
 * Seguro con `Error`, strings, objetos con `message`, y valores inesperados.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (
    error !== null &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return "Error desconocido";
}

/**
 * Wrapper async con resultado tipo [T, null] | [null, string].
 * Elimina try/catch inline en el cuerpo de hooks y servicios.
 *
 * @example
 * ```ts
 * const [dims, err] = await trySafe(() => getImageDimensions(path));
 * if (err) { setError(err); return; }
 * setDimensions(dims);
 * ```
 */
export async function trySafe<T>(
  fn: () => Promise<T>,
): Promise<[T, null] | [null, string]> {
  try {
    return [await fn(), null];
  } catch (error: unknown) {
    return [null, getErrorMessage(error)];
  }
}
