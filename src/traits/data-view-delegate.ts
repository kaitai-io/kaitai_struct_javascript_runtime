import type {Constructor} from "../util/mixin"

export type DataViewDelegateType = InstanceType<ReturnType<typeof DataViewDelegate>>

export function DataViewDelegate<TBase extends Constructor<{dataView: DataView}>>(Base: TBase) {
  return class DataViewDelegate extends Base {
    get buffer(): ArrayBuffer {
      return this.dataView.buffer
    }

    set buffer(value: ArrayBuffer) {
      this.dataView = new DataView(value, this.byteOffset, this.byteLength)
    }

    get byteOffset() {
      return this.dataView.byteOffset
    }

    set byteOffset(value: number) {
      this.dataView = new DataView(this.buffer, value, this.byteLength)
    }

    get byteLength() {
      return this.dataView.byteLength
    }

    set byteLength(value: number) {
      this.dataView = new DataView(this.buffer, this.byteOffset, value)
    }
  }
}
