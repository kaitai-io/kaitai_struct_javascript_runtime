import {Constructor} from "../util/mixin"
import {KaitaiStreamStringReadingApi} from "../kaitai-api"
import {bytesToString} from "../util/string"
import {ByteReaderType} from "./byte-reader"

export function StringReader<TBase extends Constructor<ByteReaderType>>(Base: TBase) {
  return class StringReader extends Base implements KaitaiStreamStringReadingApi {
    readStrEos(encoding: string) {
      return bytesToString(this.readBytesFull(), encoding)
    }

    readStrByteLimit(length: number, encoding: string) {
      return bytesToString(this.readBytes(length), encoding)
    }

    readStrZ(
      encoding: string,
      terminal: number,
      includeTerminal: boolean,
      consumeTerminal: boolean,
      eosError: boolean,
    ) {
      return bytesToString(this.readBytesTerm(terminal, includeTerminal, consumeTerminal, eosError), encoding)
    }
  }
}
