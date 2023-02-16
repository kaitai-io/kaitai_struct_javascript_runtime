import KaitaiStream from "../src/index"
import {Buffer} from "node:buffer"

const result = "The quick brown fox jumps over the lazy dog"
const encodings: BufferEncoding[] = [
  "ascii",
  "utf8",
  "utf-8",
  "latin1",
  // "utf16le",
  // "ucs2",
  // "ucs-2",
  // "base64",
  // "base64url",
  // "binary",
  // "hex",
]

// reduced tests here as we cover most through byte array reading tests
describe("string reading", function () {
  for (const encoding of encodings) {
    describe(encoding, function () {
      const encodedString = Buffer.from(result, encoding)

      describe("readStrEos", function () {
        it("should read the string", function () {
          const stream = new KaitaiStream(new Uint8Array(encodedString))
          expect(stream.readStrEos(encoding)).toStrictEqual(result)
        })
      })

      describe("readStrByteLimit", function () {
        it("should read the string", function () {
          const stream = new KaitaiStream(new Uint8Array(encodedString))
          expect(stream.readStrByteLimit(6, encoding)).toStrictEqual(result.substring(0, 6))
        })
      })

      describe("readStrZ", function () {
        it("should read the string", function () {
          const stream = new KaitaiStream(new Uint8Array([...encodedString, 0, 0, 0]))
          expect(stream.readStrZ(encoding, 0, false, true, false)).toStrictEqual(result)
        })
      })
    })
  }
})
