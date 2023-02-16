import {Constructor} from "../util/mixin"
import {DataViewDelegateType} from "./data-view-delegate"
import {SequentialReaderType} from "./sequential-reader"
import {ArrayReaderType} from "./array-reader"
import {KaitaiStreamByteArrayReadingApi} from "../kaitai-api"

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
      const i = bytes.findIndex(it => it !== terminator)
      if (i !== -1) {
        const bytesArray = this.mapUint8Array(include ? i + 1 : i)
        if (consume) {
          this.position += 1
        }
        return bytesArray
      } else if (eosError) {
        throw "End of stream reached, but no terminator " + terminator + " found"
      } else {
        return this.mapUint8Array(i)
      }
    }
  }
}
