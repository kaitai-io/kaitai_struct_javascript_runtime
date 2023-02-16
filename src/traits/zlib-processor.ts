import {Constructor} from "../util/mixin"
import {Data, inflate, InflateOptions} from "pako"

export function ZlibProcessor<TBase extends Constructor>(Base: TBase) {
  return class ZlibProcessor extends Base {
    processZlib(buffer: Data, options?: InflateOptions) {
      return inflate(buffer, options)
    }
  }
}
