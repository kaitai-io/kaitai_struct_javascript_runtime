export const enum Endian {
  LITTLE = 0,
  BIG = 1,
}

/**
 * Native endianness. Either KaitaiStream.BIG_ENDIAN or KaitaiStream.LITTLE_ENDIAN
 * depending on the platform endianness.
 */
export function nativeEndianness() {
  return new Int8Array(new Int16Array([1]).buffer)[0] as Endian
}