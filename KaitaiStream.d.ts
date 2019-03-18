export = KaitaiStream.KaitaiStream;

export as namespace KaitaiStream;

declare namespace KaitaiStream {
  class EOFError extends Error {
    bytesReq: number;
    bytesAvail: number;
    constructor(bytesReq: number, bytesAvail: number);
  }

  class UnexpectedDataError extends Error {
    expected: any;
    actual: any;
    constructor(expected: any, actual: any);
  }

  class UndecidedEndiannessError extends Error {
    constructor();
  }

  class KaitaiStream {
      pos: number;
      bits: number;
      bitsLeft: number;
      /**
        KaitaiStream is an implementation of Kaitai Struct API for JavaScript.
        Based on DataStream - https://github.com/kig/DataStream.js
    
        @param arrayBuffer ArrayBuffer to read from.
        @param byteOffset Offset from arrayBuffer beginning for the KaitaiStream.
        */
      constructor(arrayBuffer: ArrayBufferLike, byteOffset?: number);
      /**
        Dependency configuration data. Holds urls for (optional) dynamic loading
        of code dependencies from a remote server. For use by (static) processing functions.
    
        Caller should the supported keys to the asset urls as needed.
        NOTE: `depUrls` is a static property of KaitaiStream (the factory),like the various
              processing functions. It is NOT part of the prototype of instances.
        */
      static depUrls: {
          zlib: string;
      };
      /**
        Virtual byte length of the KaitaiStream backing buffer.
        Updated to be max of original buffer size and last written size.
        If dynamicSize is false is set to buffer size.
        */
      _byteLength: number;
      /**
        Set/get the backing ArrayBuffer of the KaitaiStream object.
        The setter updates the DataView to point to the new buffer.
        */
      buffer: ArrayBuffer;
      /**
        Set/get the byteOffset of the KaitaiStream object.
        The setter updates the DataView to point to the new byteOffset.
        */
      byteOffset: number;
      /**
        Set/get the backing DataView of the KaitaiStream object.
        The setter updates the buffer and byteOffset to point to the DataView values.
        */
      dataView: DataView;
      /**
        Returns true if the KaitaiStream seek pointer is at the end of buffer and
        there's no more data to read.
    
        @return True if the seek pointer is at the end of the buffer.
        */
      isEof(): boolean;
      /**
        Sets the KaitaiStream read/write position to given position.
        Clamps between 0 and KaitaiStream length.
    
        @param pos Position to seek to.
        */
      seek(pos: number): void;
      /**
        Returns the byte length of the KaitaiStream object.
        */
      readonly size: number;
      /**
        Reads an 8-bit signed int from the stream.
        @return The read number.
      */
      readS1(): number;
      /**
        Reads a 16-bit big-endian signed int from the stream.
        @return The read number.
      */
      readS2be(): number;
      /**
        Reads a 32-bit big-endian signed int from the stream.
        @return The read number.
      */
      readS4be(): number;
      /**
        Reads a 64-bit big-endian unsigned int from the stream. Note that
        JavaScript does not support 64-bit integers natively, so it will
        automatically upgrade internal representation to use IEEE 754
        double precision float.
        @return The read number.
      */
      readS8be(): number;
      /**
        Reads a 16-bit little-endian signed int from the stream.
        @return The read number.
      */
      readS2le(): number;
      /**
        Reads a 32-bit little-endian signed int from the stream.
        @return The read number.
      */
      readS4le(): number;
      /**
        Reads a 64-bit little-endian unsigned int from the stream. Note that
        JavaScript does not support 64-bit integers natively, so it will
        automatically upgrade internal representation to use IEEE 754
        double precision float.
        @return The read number.
      */
      readS8le(): number;
      /**
        Reads an 8-bit unsigned int from the stream.
        @return {number} The read number.
      */
      readU1(): number;
      /**
        Reads a 16-bit big-endian unsigned int from the stream.
        @return The read number.
      */
      readU2be(): number;
      /**
        Reads a 32-bit big-endian unsigned int from the stream.
        @return The read number.
      */
      readU4be(): number;
      /**
        Reads a 64-bit big-endian unsigned int from the stream. Note that
        JavaScript does not support 64-bit integers natively, so it will
        automatically upgrade internal representation to use IEEE 754
        double precision float.
        @return The read number.
      */
      readU8be(): number;
      /**
        Reads a 16-bit little-endian unsigned int from the stream.
        @return The read number.
      */
      readU2le(): number;
      /**
        Reads a 32-bit little-endian unsigned int from the stream.
        @return The read number.
      */
      readU4le(): number;
      /**
        Reads a 64-bit little-endian unsigned int from the stream. Note that
        JavaScript does not support 64-bit integers natively, so it will
        automatically upgrade internal representation to use IEEE 754
        double precision float.
        @return The read number.
      */
      readU8le(): number;
      readF4be(): number;
      readF8be(): number;
      readF4le(): number;
      readF8le(): number;
      alignToByte(): void;
      readBitsInt(n: number): number;
      /**
        Native endianness. Either KaitaiStream.BIG_ENDIAN or KaitaiStream.LITTLE_ENDIAN
        depending on the platform endianness.
      */
      static endianness: boolean;
      readBytes(len: number): Uint8Array;
      readBytesFull(): Uint8Array;
      readBytesTerm(terminator: any, include: any, consume: any, eosError: any): any;
      ensureFixedContents(expected: any): Uint8Array;
      static bytesStripRight(data: any, padByte: any): any;
      static bytesTerminate(data: any, term: any, include: any): any;
      static bytesToStr(arr: Uint8Array, encoding: string): any;
      static processXorOne(data: any, key: any): Uint8Array;
      static processXorMany(data: any, key: any): Uint8Array;
      static processRotateLeft(data: any, amount: any, groupSize: any): Uint8Array;
      static processZlib(buf: Uint8Array): any;
      static mod(a: any, b: any): number;
      static arrayMin(arr: any): any;
      static arrayMax(arr: any): any;
      static byteArrayCompare(a: any, b: any): number;
      /**
        Maps a Uint8Array into the KaitaiStream buffer.
    
        Nice for quickly reading in data.
    
        @param length Number of elements to map.
        @return Uint8Array to the KaitaiStream backing buffer.
        */
      mapUint8Array(length: number): Uint8Array;
      /**
        Creates an array from an array of character codes.
        Uses String.fromCharCode in chunks for memory efficiency and then concatenates
        the resulting string chunks.
    
        @param array Array of character codes.
        @return String created from the character codes.
      **/
      static createStringFromArray(array: Uint8Array): string;
      
      static EOFError: typeof EOFError;
      static UnexpectedDataError: typeof UnexpectedDataError;
      static UndecidedEndiannessError: typeof UndecidedEndiannessError;
  }
}

