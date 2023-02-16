export type Encoding = "ascii" | "utf8" | "utf-8" | "ucs2" | "ucs-2" | "utf16le" | "utf-16le" | string

/**
 * Creates an array from an array of character codes.
 * Uses String.fromCharCode in chunks for memory efficiency and then concatenates
 * the resulting string chunks.
 */
export function createStringFromArray(array: Uint8Array, chunkSize = 0x8000) {
  const chunks = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(String.fromCharCode.apply(null, array.subarray(i, i + chunkSize) as any))
  }
  return chunks.join("")
}

export function bytesToString(array: Uint8Array, encoding: Encoding): string {
  return !encoding || encoding.toLowerCase() === "ascii"
    ? createStringFromArray(array)
    : new TextDecoder(encoding).decode(array)
}
