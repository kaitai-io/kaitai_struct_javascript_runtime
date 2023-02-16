import type {Constructor} from "../util/mixin"
import {inflateRaw} from "pako"
import type {Data, InflateFunctionOptions} from "pako"
import type {KaitaiStreamZlibProcessingApi} from "../kaitai-api"

export function ZlibProcessor<TBase extends Constructor>(Base: TBase) {
  return class ZlibProcessor extends Base implements KaitaiStreamZlibProcessingApi {
    processZlib(buffer: Data, options?: InflateFunctionOptions) {
      return inflateRaw(buffer, options)
    }
  }
}
