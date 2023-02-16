import {Constructor} from "../util/mixin"
import {DataViewDelegateType} from "./data-view-delegate"
import {SequentialReaderType} from "./sequential-reader"

export type ArrayReaderType = InstanceType<ReturnType<typeof ArrayReader>>

export function ArrayReader<TBase extends Constructor<DataViewDelegateType & SequentialReaderType>>(
  Base: TBase,
) {
  return class ArrayReader extends Base {
    /**
     * Maps a Uint8Array into the KaitaiStream buffer.
     *
     * Nice for quickly reading in data.
     *
     * @param length Number of elements to map.
     * @return Uint8Array to the KaitaiStream backing buffer.
     */
    mapUint8Array(length = 0) {
      this.ensureBytesLeft(length)
      this.position += length
      return new Uint8Array(this.buffer, this.byteOffset + this.position, length)
    }
  }
}
