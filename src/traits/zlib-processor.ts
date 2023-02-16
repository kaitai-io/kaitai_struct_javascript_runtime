import type {Constructor} from "../util/mixin"
import {Data, inflate, InflateOptions} from "pako"
import type {KaitaiStreamZlibProcessingApi} from "../kaitai-api"

export function ZlibProcessor<TBase extends Constructor>(Base: TBase) {
  return class ZlibProcessor extends Base implements KaitaiStreamZlibProcessingApi {
    processZlib(buffer: Data, options?: InflateOptions) {
      return inflate(buffer, options)
    }
  }
}
