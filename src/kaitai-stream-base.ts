export class KaitaiStreamBase {
  /**
   * Dependency configuration data. Holds urls for (optional) dynamic loading
   * of code dependencies from a remote server. For use by (static) processing functions.
   *
   * Caller should the supported keys to the asset urls as needed.
   * NOTE: `depUrls` is a static property of KaitaiStream (the factory),like the various
   * processing functions. It is NOT part of the prototype of instances.
   */
  static dependencyUrls = {
    /**
     * processZlib uses this and expected a link to a copy of pako.
     * specifically the pako_inflate.min.js script at:
     * https://raw.githubusercontent.com/nodeca/pako/master/dist/pako_inflate.min.js
     */
    zlib: undefined,
  }

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
  constructor(data: ArrayBuffer, byteOffset?: number, byteLength?: number)
  constructor(data: ArrayBuffer | DataView, byteOffset?: number, byteLength?: number) {
    if (data instanceof ArrayBuffer) {
      this.dataView = new DataView(data, byteOffset, byteLength)
    } else {
      this.dataView = data
    }
  }
}
