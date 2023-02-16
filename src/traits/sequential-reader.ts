import type {Constructor} from "../util/mixin"
import type {DataViewDelegateType} from "./data-view-delegate"
import {EOFError} from "../errors/eor-error"
import {nativeEndianness} from "../util/endian"
import type {KaitaiStreamPositioningApi} from "../kaitai-api"

export type SequentialReaderType = InstanceType<ReturnType<typeof SequentialReader>>

export function SequentialReader<TBase extends Constructor<DataViewDelegateType>>(Base: TBase) {
  return class SequentialReader extends Base implements KaitaiStreamPositioningApi {
    position = 0

    bitsLeft = 0

    bits = 0

    endianness = nativeEndianness()

    size() {
      return this.byteLength - this.byteOffset
    }

    eof() {
      return this.position >= this.size() && this.bitsLeft === 0
    }

    pos() {
      return this.position
    }

    ensureBytesLeft(bytes: number) {
      if (this.position + bytes > this.size()) {
        throw new EOFError(bytes, this.size() - this.position)
      }
    }

    /**
     * Sets the KaitaiStream read/write position to given position.
     * Clamps between 0 and KaitaiStream length.
     *
     * @param position The new position
     */
    seek(position: number) {
      const newPosition = Math.max(0, Math.min(this.size() - 1, position))
      this.position = newPosition || 0
    }

    alignToByte() {
      this.bitsLeft = 0
      this.bits = 0
    }
  }
}
