import {BitsToBytesType, DataViewBitTypes, DataViewReadFunction, DataViewReadTypes} from "../util/data-view"
import {convertFloat16} from "../util/float-16"
import type {Constructor} from "../util/mixin"
import {DataViewDelegateType} from "./data-view-delegate"
import {SequentialReaderType} from "./sequential-reader"

export type NumberReaderType = InstanceType<ReturnType<typeof NumberReader>>

export function NumberReader<TBase extends Constructor<DataViewDelegateType & SequentialReaderType>>(
  Base: TBase,
) {
  return class NumberReader extends Base {
    readNumber<T extends DataViewReadTypes, S extends DataViewBitTypes<T>>(
      type: T,
      bits: S,
      bytes: BitsToBytesType<S>,
      littleEndian = false,
    ): (this: NumberReader) => ReturnType<DataView[DataViewReadFunction<T, S>]> {
      const functionName = `get${type}${bits}` as DataViewReadFunction<T, S>
      return function (this: NumberReader) {
        this.ensureBytesLeft(bytes)
        this.position += bytes

        return this.dataView[functionName](this.position, littleEndian) as ReturnType<
          DataView[DataViewReadFunction<T, S>]
        >
      }.bind(this)
    }

    readS1be = this.readNumber("Int", 8, 1)
    readS2be = this.readNumber("Int", 16, 2)
    readS4be = this.readNumber("Int", 32, 4)
    readS8be = this.readNumber("BigInt", 64, 8)

    readU1be = this.readNumber("Int", 8, 1)
    readU2be = this.readNumber("Uint", 16, 2)
    readU4be = this.readNumber("Uint", 32, 4)
    readU8be = this.readNumber("BigUint", 64, 8)

    readF2be() {
      return convertFloat16(this.readU1be())
    }

    readF4be = this.readNumber("Float", 32, 4)
    readF8be = this.readNumber("Float", 64, 8)

    readS1le = this.readNumber("Int", 8, 1, true)
    readS2le = this.readNumber("Int", 16, 2, true)
    readS4le = this.readNumber("Int", 32, 4, true)
    readS8le = this.readNumber("BigInt", 64, 8, true)

    readU1le = this.readNumber("Int", 8, 1, true)
    readU2le = this.readNumber("Uint", 16, 2, true)
    readU4le = this.readNumber("Uint", 32, 4, true)
    readU8le = this.readNumber("BigUint", 64, 8, true)

    readF2le() {
      return convertFloat16(this.readU1le())
    }

    readF4le = this.readNumber("Float", 32, 4, true)
    readF8le = this.readNumber("Float", 64, 8, true)
  }
}
