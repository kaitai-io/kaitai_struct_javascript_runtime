export type DataViewReadTypes = "Int" | "Float" | "Uint" | "BigUint" | "BigInt"
export type DataViewBitTypes<T extends DataViewReadTypes> = T extends "Int"
  ? 8 | 16 | 32
  : T extends "Uint"
  ? 16 | 32
  : T extends "Float"
  ? 32 | 64
  : T extends "BigUint"
  ? 64
  : T extends "BigInt"
  ? 64
  : never
export type BitsToBytesType<T extends 8 | 16 | 32 | 64> = T extends 8
  ? 1
  : T extends 16
  ? 2
  : T extends 32
  ? 4
  : T extends 64
  ? 8
  : never

export type DataViewReadFunction<T extends DataViewReadTypes, S extends DataViewBitTypes<T>> = Extract<
  keyof DataView,
  `get${T}${S}`
>
