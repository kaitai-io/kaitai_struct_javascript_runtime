export class KaitaiStreamBase {
  dataView!: DataView

  /**
   * @param data The data to read from
   */
  constructor(data: DataView)
  /**
   * @param data The data to read from
   * @param byteOffset Offset from the data beginning for the KaitaiStream.
   * @param byteLength Virtual byte length of the KaitaiStream backing buffer.
   */
  constructor(data: ArrayBuffer | Uint8Array, byteOffset?: number, byteLength?: number)
  constructor(data: ArrayBuffer | DataView | Uint8Array, byteOffset?: number, byteLength?: number) {
    if (data instanceof ArrayBuffer) {
      this.dataView = new DataView(data, byteOffset, byteLength)
    } else if (data instanceof DataView) {
      this.dataView = data
    } else {
      this.dataView = new DataView(data.buffer, byteOffset, byteLength)
    }
  }
}
