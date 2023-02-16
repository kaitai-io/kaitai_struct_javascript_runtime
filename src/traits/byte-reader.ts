import type {Constructor} from "../util/mixin"
import type {DataViewDelegateType} from "./data-view-delegate"
import type {SequentialReaderType} from "./sequential-reader"
import type {ArrayReaderType} from "./array-reader"
import type {KaitaiStreamByteArrayReadingApi} from "../kaitai-api"
import {EOFError} from "../errors/eor-error"

export type ByteReaderType = InstanceType<ReturnType<typeof ByteReader>>

export function ByteReader<
  TBase extends Constructor<DataViewDelegateType & SequentialReaderType & ArrayReaderType>,
>(Base: TBase) {
  return class ByteReader extends Base implements KaitaiStreamByteArrayReadingApi {
    readBytes(length: number) {
      return this.mapUint8Array(length)
    }

    readBytesFull() {
      return this.mapUint8Array(this.size() - this.position)
    }

    readBytesTerm(terminator: number, include: boolean, consume: boolean, eosError: boolean) {
      const bytes = new Uint8Array(this.buffer, this.byteOffset + this.position, this.size() - this.position)
      const i = bytes.findIndex(it => it === terminator)
      if (i !== -1) {
        const bytesArray = this.mapUint8Array(include ? i + 1 : i)
        if (consume && !include) {
          this.position += 1
        }
        if (include && !consume) {
          this.position -= 1
        }
        return bytesArray
      } else if (eosError) {
        throw new EOFError(
          `Reached end of stream while looking for terminator <${terminator}>`,
          this.size() - this.position,
        )
      } else {
        return this.mapUint8Array(i)
      }
    }
  }
}
