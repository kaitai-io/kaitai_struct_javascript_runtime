// -*- mode: js; js-indent-level: 2; -*-

// Interfaces for optional dependencies
interface IconvLite {
  decode(buffer: Buffer | Uint8Array, encoding: string): string
}

interface Zlib {
  inflateSync(buf: ArrayBuffer | NodeJS.ArrayBufferView): Buffer;
}

interface Pako {
  inflate(data: Uint8Array | number[]): Uint8Array;
}

// Workaround for https://github.com/microsoft/TypeScript/issues/36470
declare global {
  interface CallableFunction {
    apply<T, A, R>(this: (this: T, ...args: A[]) => R, thisArg: T, args: ArrayLike<A>): R;
  }
}

// When loaded into a web worker, pako gets added to the global scope
declare const pako: Pako;

/**
 * KaitaiStream is an implementation of Kaitai Struct API for JavaScript.
 * Based on DataStream - https://github.com/kig/DataStream.js .
 */
class KaitaiStream {
  /**
   * @param arrayBuffer ArrayBuffer to read from.
   * @param byteOffset Offset from arrayBuffer beginning for the KaitaiStream.
   */
  constructor(arrayBuffer: ArrayBuffer | DataView | number, byteOffset?: number) {
    this._byteOffset = byteOffset || 0;
    if (arrayBuffer instanceof ArrayBuffer) {
      this.buffer = arrayBuffer;
    } else if (typeof arrayBuffer == "object") {
      this.dataView = arrayBuffer;
      if (byteOffset) {
        this._byteOffset += byteOffset;
      }
    } else {
      this.buffer = new ArrayBuffer(arrayBuffer || 1);
    }
    this.pos = 0;
    this.alignToByte();
  }

  /**
   * Virtual byte length of the KaitaiStream backing buffer.
   * Updated to be max of original buffer size and last written size.
   * If dynamicSize is false is set to buffer size.
   */
  private _byteLength = 0;
  private _byteOffset = 0;
  private _buffer!: ArrayBuffer;
  private _dataView!: DataView;

  public pos: number;
  public bits = 0;
  public bitsLeft = 0;

  /**
   * Dependency configuration data. Holds urls for (optional) dynamic loading
   * of code dependencies from a remote server. For use by (static) processing functions.
   *
   * Caller should the supported keys to the asset urls as needed.
   * NOTE: `depUrls` is a static property of KaitaiStream (the factory), like the various
   * processing functions. It is NOT part of the prototype of instances.
   */
  static depUrls: Record<string, string | undefined> = {
    // processZlib uses this and expected a link to a copy of pako.
    // specifically the pako_inflate.min.js script at:
    // https://raw.githubusercontent.com/nodeca/pako/master/dist/pako_inflate.min.js
    zlib: undefined
  };

  public static iconvlite?: IconvLite;
  public static zlib?: Pako | Zlib;

  /**
   * Gets the backing ArrayBuffer of the KaitaiStream object.
   *
   * @returns The backing ArrayBuffer.
   */
  get buffer() {
    this._trimAlloc();
    return this._buffer;
  }
  /**
   * Sets the backing ArrayBuffer of the KaitaiStream object and updates the
   * DataView to point to the new buffer.
   */
  set buffer(v) {
    this._buffer = v;
    this._dataView = new DataView(this._buffer, this._byteOffset);
    this._byteLength = this._buffer.byteLength;
  }

  /**
   * Gets the byteOffset of the KaitaiStream object.
   *
   * @returns The byteOffset.
   */
  get byteOffset() {
    return this._byteOffset;
  }
  /**
   * Sets the byteOffset of the KaitaiStream object and updates the DataView to
   * point to the new byteOffset.
   */
  set byteOffset(v) {
    this._byteOffset = v;
    this._dataView = new DataView(this._buffer, this._byteOffset);
    this._byteLength = this._buffer.byteLength;
  }

  /**
   * Gets the backing DataView of the KaitaiStream object.
   *
   * @returns The backing DataView.
   */
  get dataView() {
    return this._dataView;
  }
  /**
   * Sets the backing DataView of the KaitaiStream object and updates the buffer
   * and byteOffset to point to the DataView values.
   */
  set dataView(v) {
    this._byteOffset = v.byteOffset;
    this._buffer = v.buffer;
    this._dataView = new DataView(this._buffer, this._byteOffset);
    this._byteLength = this._byteOffset + v.byteLength;
  }

  /**
   * Internal function to trim the KaitaiStream buffer when required.
   * Used for stripping out the extra bytes from the backing buffer when
   * the virtual byteLength is smaller than the buffer byteLength (happens after
   * growing the buffer with writes and not filling the extra space completely).
   */
  _trimAlloc() {
    if (this._byteLength === this._buffer.byteLength) {
      return;
    }
    var buf = new ArrayBuffer(this._byteLength);
    var dst = new Uint8Array(buf);
    var src = new Uint8Array(this._buffer, 0, dst.length);
    dst.set(src);
    this.buffer = buf;
  }


  // ========================================================================
  // Stream positioning
  // ========================================================================

  /**
   * Returns true if the KaitaiStream seek pointer is at the end of buffer and
   * there's no more data to read.
   *
   * @returns True if the seek pointer is at the end of the buffer.
   */
  isEof() {
    return this.pos >= this.size && this.bitsLeft === 0;
  };

  /**
   * Sets the KaitaiStream read/write position to given position.
   * Clamps between 0 and KaitaiStream length.
   *
   * @param pos Position to seek to.
   */
  seek(pos: number) {
    var npos = Math.max(0, Math.min(this.size, pos));
    this.pos = (isNaN(npos) || !isFinite(npos)) ? 0 : npos;
  };

  /**
   * Returns the byte length of the KaitaiStream object.
   * 
   * @returns The byte length.
   */
  get size() {
    return this._byteLength - this._byteOffset;
  }

  // ========================================================================
  // Integer numbers
  // ========================================================================

  // ------------------------------------------------------------------------
  // Signed
  // ------------------------------------------------------------------------

  /**
   * Reads an 8-bit signed int from the stream.
   *
   * @returns The read number.
   */
  readS1() {
    this.ensureBytesLeft(1);
    var v = this._dataView.getInt8(this.pos);
    this.pos += 1;
    return v;
  };

  // ........................................................................
  // Big-endian
  // ........................................................................

  /**
   * Reads a 16-bit big-endian signed int from the stream.
   *
   * @returns The read number.
   */
  readS2be() {
    this.ensureBytesLeft(2);
    var v = this._dataView.getInt16(this.pos);
    this.pos += 2;
    return v;
  };

  /**
   * Reads a 32-bit big-endian signed int from the stream.
   *
   * @returns The read number.
   */
  readS4be() {
    this.ensureBytesLeft(4);
    var v = this._dataView.getInt32(this.pos);
    this.pos += 4;
    return v;
  };

  /**
   * Reads a 64-bit big-endian unsigned int from the stream. Note that
   * JavaScript does not support 64-bit integers natively, so it will
   * automatically upgrade internal representation to use IEEE 754
   * double precision float.
   *
   * @returns The read number.
   */
  readS8be() {
    this.ensureBytesLeft(8);
    var v1 = this.readU4be();
    var v2 = this.readU4be();

    if ((v1 & 0x80000000) !== 0) {
      // negative number
      return -(0x100000000 * (v1 ^ 0xffffffff) + (v2 ^ 0xffffffff)) - 1;
    } else {
      return 0x100000000 * v1 + v2;
    }
  };

  // ........................................................................
  // Little-endian
  // ........................................................................

  /**
   * Reads a 16-bit little-endian signed int from the stream.
   *
   * @returns The read number.
   */
  readS2le() {
    this.ensureBytesLeft(2);
    var v = this._dataView.getInt16(this.pos, true);
    this.pos += 2;
    return v;
  };

  /**
   * Reads a 32-bit little-endian signed int from the stream.
   *
   * @returns The read number.
   */
  readS4le() {
    this.ensureBytesLeft(4);
    var v = this._dataView.getInt32(this.pos, true);
    this.pos += 4;
    return v;
  };

  /**
   * Reads a 64-bit little-endian unsigned int from the stream. Note that
   * JavaScript does not support 64-bit integers natively, so it will
   * automatically upgrade internal representation to use IEEE 754
   * double precision float.
   *
   * @returns The read number.
   */
  readS8le() {
    this.ensureBytesLeft(8);
    var v1 = this.readU4le();
    var v2 = this.readU4le();

    if ((v2 & 0x80000000) !== 0) {
      // negative number
      return -(0x100000000 * (v2 ^ 0xffffffff) + (v1 ^ 0xffffffff)) - 1;
    } else {
      return 0x100000000 * v2 + v1;
    }
  };

  // ------------------------------------------------------------------------
  // Unsigned
  // ------------------------------------------------------------------------

  /**
   * Reads an 8-bit unsigned int from the stream.
   *
   * @returns The read number.
   */
  readU1() {
    this.ensureBytesLeft(1);
    var v = this._dataView.getUint8(this.pos);
    this.pos += 1;
    return v;
  };

  // ........................................................................
  // Big-endian
  // ........................................................................

  /**
   * Reads a 16-bit big-endian unsigned int from the stream.
   *
   * @returns The read number.
   */
  readU2be() {
    this.ensureBytesLeft(2);
    var v = this._dataView.getUint16(this.pos);
    this.pos += 2;
    return v;
  };

  /**
   * Reads a 32-bit big-endian unsigned int from the stream.
   *
   * @returns The read number.
   */
  readU4be() {
    this.ensureBytesLeft(4);
    var v = this._dataView.getUint32(this.pos);
    this.pos += 4;
    return v;
  };

  /**
   * Reads a 64-bit big-endian unsigned int from the stream. Note that
   * JavaScript does not support 64-bit integers natively, so it will
   * automatically upgrade internal representation to use IEEE 754
   * double precision float.
   *
   * @returns The read number.
   */
  readU8be() {
    this.ensureBytesLeft(8);
    var v1 = this.readU4be();
    var v2 = this.readU4be();
    return 0x100000000 * v1 + v2;
  }

  // ........................................................................
  // Little-endian
  // ........................................................................

  /**
   * Reads a 16-bit little-endian unsigned int from the stream.
   *
   * @returns The read number.
   */
  readU2le() {
    this.ensureBytesLeft(2);
    var v = this._dataView.getUint16(this.pos, true);
    this.pos += 2;
    return v;
  }

  /**
   * Reads a 32-bit little-endian unsigned int from the stream.
   *
   * @returns The read number.
   */
  readU4le() {
    this.ensureBytesLeft(4);
    var v = this._dataView.getUint32(this.pos, true);
    this.pos += 4;
    return v;
  }

  /**
   * Reads a 64-bit little-endian unsigned int from the stream. Note that
   * JavaScript does not support 64-bit integers natively, so it will
   * automatically upgrade internal representation to use IEEE 754
   * double precision float.
   *
   * @returns The read number.
   */
  readU8le() {
    this.ensureBytesLeft(8);
    var v1 = this.readU4le();
    var v2 = this.readU4le();
    return 0x100000000 * v2 + v1;
  };


  // ========================================================================
  // Floating point numbers
  // ========================================================================

  // ------------------------------------------------------------------------
  // Big endian
  // ------------------------------------------------------------------------

  /**
   * Reads a 32-bit big-endian float from the stream.
   *
   * @returns The read number.
   */
  readF4be() {
    this.ensureBytesLeft(4);
    var v = this._dataView.getFloat32(this.pos);
    this.pos += 4;
    return v;
  };

  /**
   * Reads a 64-bit big-endian float from the stream.
   *
   * @returns The read number.
   */
  readF8be() {
    this.ensureBytesLeft(8);
    var v = this._dataView.getFloat64(this.pos);
    this.pos += 8;
    return v;
  };

  // ------------------------------------------------------------------------
  // Little endian
  // ------------------------------------------------------------------------

  /**
   * Reads a 32-bit little-endian float from the stream.
   *
   * @returns The read number.
   */
  readF4le() {
    this.ensureBytesLeft(4);
    var v = this._dataView.getFloat32(this.pos, true);
    this.pos += 4;
    return v;
  };

  /**
   * Reads a 64-bit little-endian float from the stream.
   *
   * @returns The read number.
   */
  readF8le() {
    this.ensureBytesLeft(8);
    var v = this._dataView.getFloat64(this.pos, true);
    this.pos += 8;
    return v;
  };

  // ------------------------------------------------------------------------
  // Unaligned bit values
  // ------------------------------------------------------------------------

  /**
   * Aligns bit reading to the byte boundry.
   */
  alignToByte() {
    this.bits = 0;
    this.bitsLeft = 0;
  };

  /**
   * @param n The number of bits to read.
   * @returns The read bits.
   * @throws {Error}
   */
  readBitsIntBe(n: number) {
    // JS only supports bit operations on 32 bits
    if (n > 32) {
      throw new Error(`readBitsIntBe: the maximum supported bit length is 32 (tried to read ${n} bits)`);
    }
    var bitsNeeded = n - this.bitsLeft;
    if (bitsNeeded > 0) {
      // 1 bit  => 1 byte
      // 8 bits => 1 byte
      // 9 bits => 2 bytes
      var bytesNeeded = Math.ceil(bitsNeeded / 8);
      var buf = this.readBytes(bytesNeeded);
      for (var i = 0; i < bytesNeeded; i++) {
        this.bits <<= 8;
        this.bits |= buf[i];
        this.bitsLeft += 8;
      }
    }

    // raw mask with required number of 1s, starting from lowest bit
    var mask = n === 32 ? 0xffffffff : (1 << n) - 1;
    // shift this.bits to align the highest bits with the mask & derive reading result
    var shiftBits = this.bitsLeft - n;
    var res = (this.bits >>> shiftBits) & mask;
    // clear top bits that we've just read => AND with 1s
    this.bitsLeft -= n;
    mask = (1 << this.bitsLeft) - 1;
    this.bits &= mask;

    return res;
  };

  /**
   * Unused since Kaitai Struct Compiler v0.9+ - compatibility with older versions.
   *
   * @deprecated Use {@link readBitsIntBe} instead.
   * @param n The number of bits to read.
   * @returns The read bits.
   */
  readBitsInt(n: number) {
    return this.readBitsIntBe(n);
  }

  /**
   * @param n The number of bits to read.
   * @returns The read bits.
   * @throws {Error}
   */
  readBitsIntLe(n: number) {
    // JS only supports bit operations on 32 bits
    if (n > 32) {
      throw new Error(`readBitsIntLe: the maximum supported bit length is 32 (tried to read ${n} bits)`);
    }
    var bitsNeeded = n - this.bitsLeft;
    if (bitsNeeded > 0) {
      // 1 bit  => 1 byte
      // 8 bits => 1 byte
      // 9 bits => 2 bytes
      var bytesNeeded = Math.ceil(bitsNeeded / 8);
      var buf = this.readBytes(bytesNeeded);
      for (var i = 0; i < bytesNeeded; i++) {
        this.bits |= (buf[i] << this.bitsLeft);
        this.bitsLeft += 8;
      }
    }

    // raw mask with required number of 1s, starting from lowest bit
    var mask = n === 32 ? 0xffffffff : (1 << n) - 1;
    // derive reading result
    var res = this.bits & mask;
    // remove bottom bits that we've just read by shifting
    this.bits >>>= n;
    this.bitsLeft -= n;

    return res;
  };

  /**
   * Native endianness. Either KaitaiStream.BIG_ENDIAN or KaitaiStream.LITTLE_ENDIAN
   * depending on the platform endianness.
   */
  static endianness = new Int8Array(new Int16Array([1]).buffer)[0] > 0;

  // ========================================================================
  // Byte arrays
  // ========================================================================

  /**
   * @param len The number of bytes to read.
   * @returns The read bytes.
   */
  readBytes(len: number) {
    return this.mapUint8Array(len);
  };

  /**
   * @returns The read bytes.
   */
  readBytesFull() {
    return this.mapUint8Array(this.size - this.pos);
  };

  /**
   * Reads bytes until the terminator byte is found.
   *
   * @param terminator The terminator byte.
   * @param include True if the terminator should be included with the returned bytes.
   * @param consume True if the terminator should be consumed from the input stream.
   * @param eosError True to throw an error if the end of stream is reached.
   * @returns The read bytes.
   * @throws {string}
   */
  readBytesTerm(terminator: number, include: boolean, consume: boolean, eosError: boolean) {
    var blen = this.size - this.pos;
    var u8 = new Uint8Array(this._buffer, this._byteOffset + this.pos);
    for (var i = 0; i < blen && u8[i] !== terminator; i++); // find first zero byte
    if (i === blen) {
      // we've read all the buffer and haven't found the terminator
      if (eosError) {
        throw "End of stream reached, but no terminator " + terminator + " found";
      } else {
        return this.mapUint8Array(i);
      }
    } else {
      var arr;
      if (include) {
        arr = this.mapUint8Array(i + 1);
      } else {
        arr = this.mapUint8Array(i);
      }
      if (consume) {
        this.pos += 1;
      }
      return arr;
    }
  };

  /**
   * Unused since Kaitai Struct Compiler v0.9+ - compatibility with older versions.
   * 
   * @param expected The expected bytes.
   * @returns The read bytes.
   * @throws {KaitaiStream.UnexpectedDataError}
   */
  ensureFixedContents(expected: ArrayLike<number>) {
    var actual = this.readBytes(expected.length);
    if (actual.length !== expected.length) {
      throw new KaitaiStream.UnexpectedDataError(expected, actual);
    }
    var actLen = actual.length;
    for (var i = 0; i < actLen; i++) {
      if (actual[i] !== expected[i]) {
        throw new KaitaiStream.UnexpectedDataError(expected, actual);
      }
    }
    return actual;
  };

  /**
   * @param data The data.
   * @param padByte The byte to strip.
   * @returns The stripped data.
   */
  static bytesStripRight(data: number[] | NodeJS.TypedArray, padByte: number) {
    var newLen = data.length;
    while (data[newLen - 1] === padByte) {
      newLen--;
    }
    return data.slice(0, newLen);
  };

  /**
   * @param data The data.
   * @param term The terminator.
   * @param include True if the returned bytes should include the terminator.
   * @returns The terminated bytes.
   */
  static bytesTerminate(data: number[] | NodeJS.TypedArray, term: number, include: boolean) {
    var newLen = 0;
    var maxLen = data.length;
    while (newLen < maxLen && data[newLen] !== term) {
      newLen++;
    }
    if (include && newLen < maxLen)
      newLen++;
    return data.slice(0, newLen);
  };

  /**
   * @param arr The bytes.
   * @param encoding The character encoding.
   * @returns The decoded string.
   */
  static bytesToStr(arr: Uint8Array, encoding: BufferEncoding) {
    if (encoding == null || encoding.toLowerCase() === "ascii") {
      return KaitaiStream.createStringFromArray(arr);
    } else {
      if (typeof TextDecoder === 'function') {
        // we're in the browser that supports TextDecoder
        return (new TextDecoder(encoding)).decode(arr);
      } else {
        // probably we're in node.js

        // check if it's supported natively by node.js Buffer
        // see https://github.com/nodejs/node/blob/master/lib/buffer.js#L187 for details
        switch (encoding.toLowerCase()) {
          case 'utf8':
          case 'utf-8':
          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            return Buffer.from(arr).toString(encoding);
          default:
            // unsupported encoding, we'll have to resort to iconv-lite
            if (typeof KaitaiStream.iconvlite === 'undefined')
              KaitaiStream.iconvlite = require('iconv-lite') as IconvLite;

            return KaitaiStream.iconvlite.decode(arr, encoding);
        }
      }
    }
  };

  // ========================================================================
  // Byte array processing
  // ========================================================================

  /**
   * @param data The input bytes.
   * @param key The key byte.
   * @returns The Xor'd bytes.
   */
  static processXorOne(data: ArrayLike<number>, key: number) {
    var r = new Uint8Array(data.length);
    var dl = data.length;
    for (var i = 0; i < dl; i++)
      r[i] = data[i] ^ key;
    return r;
  };

  /**
   * @param data The input bytes.
   * @param key The key bytes.
   * @returns The Xor'd bytes.
   */
  static processXorMany(data: ArrayLike<number>, key: ArrayLike<number>) {
    var dl = data.length;
    var r = new Uint8Array(dl);
    var kl = key.length;
    var ki = 0;
    for (var i = 0; i < dl; i++) {
      r[i] = data[i] ^ key[ki];
      ki++;
      if (ki >= kl)
        ki = 0;
    }
    return r;
  };

  /**
   * @param data The input bytes.
   * @param amount The number of bytes to rotate.
   * @param groupSize The number of bytes in each group.
   * @returns The rotated bytes.
   * @throws {string}
   */
  static processRotateLeft(data: ArrayLike<number>, amount: number, groupSize: number) {
    if (groupSize !== 1)
      throw ("unable to rotate group of " + groupSize + " bytes yet");

    var mask = groupSize * 8 - 1;
    var antiAmount = -amount & mask;

    var r = new Uint8Array(data.length);
    for (var i = 0; i < data.length; i++)
      r[i] = (data[i] << amount) & 0xff | (data[i] >> antiAmount);

    return r;
  };

  /**
   * @param buf The input bytes.
   * @returns The uncompressed bytes.
   */
  static processZlib(buf: Uint8Array) {
    if (typeof require !== 'undefined') {
      // require is available - we're running under node
      if (typeof KaitaiStream.zlib === 'undefined')
        KaitaiStream.zlib = require('zlib') as Zlib;
      // use node's zlib module API
      return (KaitaiStream.zlib as Zlib).inflateSync(
        Buffer.from(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength))
      );
    } else {
      // no require() - assume we're running as a web worker in browser.
      // user should have configured KaitaiStream.depUrls.zlib, if not
      // we'll throw.
      if (typeof KaitaiStream.zlib === 'undefined'
        && typeof KaitaiStream.depUrls.zlib !== 'undefined') {
        importScripts(KaitaiStream.depUrls.zlib);
        KaitaiStream.zlib = pako;
      }
      // use pako API
      return (KaitaiStream.zlib as Pako).inflate(buf);
    }
  };

  // ========================================================================
  // Misc runtime operations
  // ========================================================================

  /**
   * @param a The dividend.
   * @param b The divisor.
   * @returns The result of `a` mod `b`.
   * @throws {string}
   */
  static mod(a: number, b: number) {
    if (b <= 0)
      throw "mod divisor <= 0";
    var r = a % b;
    if (r < 0)
      r += b;
    return r;
  };

  /**
   * Gets the smallest value in an array.
   *
   * @param arr The input array.
   * @returns The smallest value.
   */
  static arrayMin(arr: ArrayLike<number>) {
    var min = arr[0];
    var x;
    for (var i = 1, n = arr.length; i < n; ++i) {
      x = arr[i];
      if (x < min) min = x;
    }
    return min;
  };

  /**
   * Gets the largest value in an array.
   *
   * @param arr The input array.
   * @returns The largest value.
   */
  static arrayMax(arr: ArrayLike<number>) {
    var max = arr[0];
    var x;
    for (var i = 1, n = arr.length; i < n; ++i) {
      x = arr[i];
      if (x > max) max = x;
    }
    return max;
  };

  /**
   * Compares two arrays of bytes from left to right.
   *
   * @param a The first array.
   * @param b The second array.
   * @returns `0` if the arrays are the equal, a positive number if `a` is greater than `b`, or a negative number if `a` is less than `b`.
   */
  static byteArrayCompare(a: ArrayLike<number>, b: ArrayLike<number>) {
    if (a === b)
      return 0;
    var al = a.length;
    var bl = b.length;
    var minLen = al < bl ? al : bl;
    for (var i = 0; i < minLen; i++) {
      var cmp = a[i] - b[i];
      if (cmp !== 0)
        return cmp;
    }

    // Reached the end of at least one of the arrays
    if (al === bl) {
      return 0;
    } else {
      return al - bl;
    }
  };

  // ========================================================================
  // Internal implementation details
  // ========================================================================

  static EOFError = class extends Error {
    name = "EOFError";
    bytesReq: number;
    bytesAvail: number;

    /**
     * @param bytesReq The number of bytes requested.
     * @param bytesAvail The number of bytes available.
     */
    constructor(bytesReq: number, bytesAvail: number) {
      super("requested " + bytesReq + " bytes, but only " + bytesAvail + " bytes available");
      // Workaround https://www.typescriptlang.org/docs/handbook/2/classes.html#inheriting-built-in-types
      Object.setPrototypeOf(this, KaitaiStream.EOFError.prototype);
      this.bytesReq = bytesReq;
      this.bytesAvail = bytesAvail;
    }
  }

  /**
   * Unused since Kaitai Struct Compiler v0.9+ - compatibility with older versions.
   */
  static UnexpectedDataError = class extends Error {
    name = "UnexpectedDataError";
    expected: any;
    actual: any;

    /**
     * @param expected The expected value.
     * @param actual The actual value.
     */
    constructor(expected: any, actual: any) {
      super("expected [" + expected + "], but got [" + actual + "]");
      // Workaround https://www.typescriptlang.org/docs/handbook/2/classes.html#inheriting-built-in-types
      Object.setPrototypeOf(this, KaitaiStream.UnexpectedDataError.prototype);
      this.expected = expected;
      this.actual = actual;
    }
  };

  static UndecidedEndiannessError = class extends Error {
    name = "UndecidedEndiannessError";

    constructor() {
      super();
      // Workaround https://www.typescriptlang.org/docs/handbook/2/classes.html#inheriting-built-in-types
      Object.setPrototypeOf(this, KaitaiStream.UndecidedEndiannessError.prototype);
    }
  };

  static ValidationNotEqualError = class extends Error {
    name = "ValidationNotEqualError";
    expected: any;
    actual: any;

    /**
     * @param expected The expected value.
     * @param actual The actual value.
     */
    constructor(expected: any, actual: any) {
      super("not equal, expected [" + expected + "], but got [" + actual + "]");
      // Workaround https://www.typescriptlang.org/docs/handbook/2/classes.html#inheriting-built-in-types
      Object.setPrototypeOf(this, KaitaiStream.ValidationNotEqualError.prototype);
      this.expected = expected;
      this.actual = actual;
    }
  };

  static ValidationLessThanError = class extends Error {
    name = "ValidationLessThanError";
    min: any;
    actual: any;

    /**
     * @param min The minimum allowed value.
     * @param actual The actual value.
     */
    constructor(min: any, actual: any) {
      super("not in range, min [" + min + "], but got [" + actual + "]");
      // Workaround https://www.typescriptlang.org/docs/handbook/2/classes.html#inheriting-built-in-types
      Object.setPrototypeOf(this, KaitaiStream.ValidationLessThanError.prototype);
      this.min = min;
      this.actual = actual;
    }
  };

  static ValidationGreaterThanError = class extends Error {
    name = "ValidationGreaterThanError";
    max: any;
    actual: any;

    /**
     * @param max The maximum allowed value.
     * @param actual The actual value.
     */
    constructor(max: any, actual: any) {
      super("not in range, max [" + max + "], but got [" + actual + "]");
      // Workaround https://www.typescriptlang.org/docs/handbook/2/classes.html#inheriting-built-in-types
      Object.setPrototypeOf(this, KaitaiStream.ValidationGreaterThanError.prototype);
      this.max = max;
      this.actual = actual;
    }
  };

  static ValidationNotAnyOfError = class extends Error {
    name = "ValidationNotAnyOfError";
    actual: any;

    /**
     * @param actual The actual value.
     */
    constructor(actual: any) {
      super("not any of the list, got [" + actual + "]");
      // Workaround https://www.typescriptlang.org/docs/handbook/2/classes.html#inheriting-built-in-types
      Object.setPrototypeOf(this, KaitaiStream.ValidationNotAnyOfError.prototype);
      this.actual = actual;
    }
  };

  static ValidationExprError = class extends Error {
    name = "ValidationExprError";
    actual: any;

    /**
     * @param actual The actual value.
     */
    constructor(actual: any) {
      super("not matching the expression, got [" + actual + "]");
      // Workaround https://www.typescriptlang.org/docs/handbook/2/classes.html#inheriting-built-in-types
      Object.setPrototypeOf(this, KaitaiStream.ValidationExprError.prototype);
      this.actual = actual;
    }
  };

  /**
   * Ensures that we have an least `length` bytes left in the stream.
   * If that's not true, throws an EOFError.
   *
   * @param length Number of bytes to require.
   * @throws {KaitaiStream.EOFError}
   */
  ensureBytesLeft(length: number) {
    if (this.pos + length > this.size) {
      throw new KaitaiStream.EOFError(length, this.size - this.pos);
    }
  };

  /**
   * Maps a Uint8Array into the KaitaiStream buffer.
   * Nice for quickly reading in data.
   *
   * @param length Number of elements to map.
   * @returns A Uint8Array to the KaitaiStream backing buffer.
   */
  mapUint8Array(length: number) {
    length |= 0;

    this.ensureBytesLeft(length);

    var arr = new Uint8Array(this._buffer, this.byteOffset + this.pos, length);
    this.pos += length;
    return arr;
  };

  /**
   * Creates an array from an array of character codes.
   * Uses String.fromCharCode in chunks for memory efficiency and then concatenates
   * the resulting string chunks.
   *
   * @param array Array of character codes.
   * @returns String created from the character codes.
   */
  static createStringFromArray = function (array: Array<number> | Uint8Array) {
    var chunk_size = 0x8000;
    var chunks = [];
    for (var i = 0; i < array.length; i += chunk_size) {
      const chunk = 'subarray' in array ? array.subarray(i, i + chunk_size) : array.slice(i, i + chunk_size)
      chunks.push(String.fromCharCode.apply(null, chunk));
    }
    return chunks.join("");
  };
}

export default KaitaiStream;
