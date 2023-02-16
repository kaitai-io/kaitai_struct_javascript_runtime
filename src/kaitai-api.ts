export type KaitaiStreamApi = KaitaiStreamPositioningApi & KaitaiStreamReadingApi & KaitaiStreamProcessingApi

export interface KaitaiStreamPositioningApi {
  /**
   * Checks if we’ve reached end-of-stream and returns true if we did
   *
   * "reaching end-of-stream" is defined being in a position where
   * requesting of reading any single byte would result in reporting
   * an end-of-stream error, **not** as in C++ `istream` semantics
   */
  eof(): boolean

  /**
   * Seeks to absolute byte position n in a stream
   *
   * @param n absolute byte position in the stream
   */
  seek(n: number): void

  /**
   * @return current position in a stream in bytes
   */
  pos(): number
}

/**
 * One can read integers using one of read_$S$L$E operations, where:
 *
 * $S is either u if we want to read unsigned integer or s if we want signed one;
 *
 * $L is length of integer type in bytes. 1, 2, 4 and 8 bytes are supported;
 *
 * $E is endianness (order of bytes): le for little-endian or be for big-endian;
 *
 * A few examples:
 *
 * read_u8le - reads 8-byte (64-bit) unsigned integer, little-endian (AKA Intel, AKA VAX, etc)
 *
 * read_s2be - reads 2-byte (16-bit) signed integer, big-endian (AKA "network byte order", AKA Power, AKA Motorola, etc)
 *
 * read_u1 - reads 1-byte unsigned integer - no endianness is given as it’s pointless to do so
 *
 * Basically, it’s the same designation as used in the type clause in .ksy format.
 */
export type KaitaiStreamNumberReadingApi = {
  [key in `read${`U${2 | 4}` | `S${2 | 4}` | `F${2 | 4 | 8}`}${"be" | "le"}`]: () => number
} & {
  [key in `read${"U" | "S"}1`]: () => number
} & {
  [key in `read${"U" | "S"}8${"be" | "le"}`]: () => bigint
}

export interface KaitaiStreamByteArrayReadingApi {
  /**
   * Reads exactly n bytes from a stream; if there are less than n bytes
   * read before hitting end-of-stream, then it reports an error
   *
   * @param n the amount of bytes to read
   */
  readBytes(n: number): Uint8Array

  /**
   * Reads all remaining bytes from a stream
   */
  readBytesFull(): Uint8Array
}

/**
 * These methods implement process: ... functionality for attributes,
 * which basically takes a byte array and transforms it into another
 * byte array, performing some operation usually associated with
 * compression / encoding / encryption / obfuscation algorithms.
 * Sometimes extra parameters are passed to these algorithms.
 *
 * Note that generally these methods do not work with the stream, but
 * get an in-memory buffer to work with, so they should be preferably
 * implemented as static methods (or class methods, or the closest equivalent).
 */
export interface KaitaiStreamStringReadingApi {
  readStrEos(encoding: string): string

  readStrByteLimit(len: number, encoding: string): string

  readStrZ(
    encoding: string,
    term: number,
    includeTerm: boolean,
    consumeTerm: boolean,
    eosError: boolean,
  ): string
}

export type KaitaiStreamReadingApi = KaitaiStreamNumberReadingApi &
  KaitaiStreamByteArrayReadingApi &
  KaitaiStreamStringReadingApi

export type KaitaiStreamProcessingApi = KaitaiStreamBitopsProcessingApi & KaitaiStreamZlibProcessingApi

export interface KaitaiStreamBitopsProcessingApi {
  processXorOne(data: Uint8Array, key: number): Uint8Array

  processXorMany(data: Uint8Array, key: Uint8Array): Uint8Array

  processRotateLeft(data: Uint8Array, amount: number, groupSize: number): Uint8Array
}

export interface KaitaiStreamZlibProcessingApi {
  processZlib(data: Uint8Array): Uint8Array
}
