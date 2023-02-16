import type {Constructor} from "../util/mixin"
import {NotImplementedError} from "../errors/not-implemented-error"
import type {KaitaiStreamBitopsProcessingApi} from "../kaitai-api"

export function BitOpsProcessor<TBase extends Constructor>(Base: TBase) {
  return class BitOpsProcessor extends Base implements KaitaiStreamBitopsProcessingApi {
    processXorOne(data: Uint8Array, key: number) {
      return data.map(it => it ^ key)
    }

    processXorMany(data: Uint8Array, key: Uint8Array) {
      return data.map((it, i) => it ^ key[i % key.length])
    }

    processRotateLeft(data: Uint8Array, amount: number, groupSize: number) {
      if (groupSize !== 1) throw new NotImplementedError(`Group size != 1`)

      return data.map(it => ((it & 0xff) << amount) | ((it & 0xff) >>> (8 - amount)))
    }
  }
}
