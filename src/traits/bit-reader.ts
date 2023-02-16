import type {Constructor} from "../util/mixin"
import type {SequentialReaderType} from "./sequential-reader"
import type {ByteReaderType} from "./byte-reader"

export function BitReader<TBase extends Constructor<SequentialReaderType & ByteReaderType>>(Base: TBase) {
  return class BitReader extends Base {
    /**
     * bitsLeft = 3
     *      \  \  bitsNeeded = 10 -> bytesNeeded = 2
     *       \  \ /         \
     *  |01101xxx|xxxxxxxx|xx......|
     *        \             /\     \
     *         \__ n = 13 _/  \     \
     *                       new bitsLeft = 6
     */
    readBitsIntBe(n: number) {
      // JS only supports bit operations on 32 bits
      if (n > 32) {
        throw new RangeError(
          `readBitsIntBe: the maximum supported bit length is 32 (tried to read ${n} bits)`,
        )
      }
      let res = 0

      let bitsNeeded = n - this.bitsLeft
      this.bitsLeft = -bitsNeeded & 7 // `-bitsNeeded mod 8`

      if (bitsNeeded > 0) {
        // 1 bit  => 1 byte
        // 8 bits => 1 byte
        // 9 bits => 2 bytes
        let bytesNeeded = ((bitsNeeded - 1) >> 3) + 1 // `ceil(bitsNeeded / 8)` (NB: `x >> 3` is `floor(x / 8)`)
        let buf = this.readBytes(bytesNeeded)
        for (let i = 0; i < bytesNeeded; i++) {
          res = (res << 8) | buf[i]
        }

        let newBits = res
        res = (res >>> this.bitsLeft) | (this.bits << bitsNeeded) // `x << 32` is defined as `x << 0` in JS, but only `0 << 32`
        // can occur here (`n = 32` and `bitsLeft = 0`, this implies
        // `bits = 0` unless changed externally)
        this.bits = newBits // will be masked at the end of the function
      } else {
        res = this.bits >>> -bitsNeeded // shift unneeded bits out
      }

      let mask = (1 << this.bitsLeft) - 1 // `bitsLeft` is in range 0..7, so `(1 << 32)` does not have to be considered
      this.bits &= mask

      // always return an unsigned 32-bit integer
      return res >>> 0
    }

    /**
     *    n = 13       bitsNeeded = 10
     *                    /       \
     * bitsLeft = 3  ______       __
     *    \  \      /      \      \ \
     *    |xxx01101|xxxxxxxx|......xx|
     *                       \    /
     *                    new bitsLeft = 6
     *
     *          bitsLeft = 7
     *             \      \
     *    |01101100|..xxxxx1|........|
     *                \___/
     *                n = 5
     */
    readBitsIntLe(n: number) {
      // JS only supports bit operations on 32 bits
      if (n > 32) {
        throw new RangeError(
          `readBitsIntLe: the maximum supported bit length is 32 (tried to read ${n} bits)`,
        )
      }
      let res = 0
      let bitsNeeded = n - this.bitsLeft

      if (bitsNeeded > 0) {
        // 1 bit  => 1 byte
        // 8 bits => 1 byte
        // 9 bits => 2 bytes
        let bytesNeeded = ((bitsNeeded - 1) >> 3) + 1 // `ceil(bitsNeeded / 8)` (NB: `x >> 3` is `floor(x / 8)`)
        let buf = this.readBytes(bytesNeeded)
        for (let i = 0; i < bytesNeeded; i++) {
          res |= buf[i] << (i * 8)
        }

        // NB: in JavaScript, bit shift operators always shift by modulo 32 of the right-hand operand (see
        // https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-unsignedRightShift),
        // so `res >>> 32` is equivalent to `res >>> 0` (but we don't want that)
        let newBits = bitsNeeded < 32 ? res >>> bitsNeeded : 0
        res = (res << this.bitsLeft) | this.bits
        this.bits = newBits
      } else {
        res = this.bits
        this.bits >>>= n
      }

      this.bitsLeft = -bitsNeeded & 7 // `-bitsNeeded mod 8`

      // always return an unsigned 32-bit integer
      if (n < 32) {
        res &= (1 << n) - 1 // this produces a signed 32-bit int, but the sign bit is cleared
      } else {
        res >>>= 0
      }
      return res
    }
  }
}
