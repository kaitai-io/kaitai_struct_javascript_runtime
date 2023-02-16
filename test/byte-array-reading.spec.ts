import KaitaiStream from "../src/index"
import {EOFError} from "../src/errors/eor-error"

describe("byte array reading", function () {
  describe("readBytes", function () {
    it("should read exactly n bytes from the stream", function () {
      const stream = new KaitaiStream(new Uint8Array([0, 1, 2, 3, 4, 5, 6]))

      stream.seek(1)
      expect(stream.readBytes(4)).toStrictEqual(new Uint8Array([1, 2, 3, 4]))
    })

    it("should throw an error when reading outside the stream", function () {
      const stream = new KaitaiStream(new Uint8Array([0, 1]))

      expect(() => stream.readBytes(4)).toThrow(EOFError)
    })
  })

  describe("readBytesFull", function () {
    it("should read all remaining bytes", function () {
      const stream = new KaitaiStream(new Uint8Array([0, 1, 2, 3, 4, 5, 6]))

      stream.seek(1)
      expect(stream.readBytesFull()).toStrictEqual(new Uint8Array([1, 2, 3, 4, 5, 6]))
    })
  })

  describe("readBytesTerm", function () {
    for (const include of [true, false]) {
      for (const consume of [true, false]) {
        for (const eofError of [true, false]) {
          describe(`include: ${include}, consume: ${consume}, eofError: ${eofError}`, function () {
            it(`should ${include ? "" : "not"} include term byte when specified`, function () {
              const stream = new KaitaiStream(new Uint8Array([0, 1, 2, 3, 4, 5, 6]))

              stream.seek(1)
              expect(stream.readBytesTerm(4, include, consume, eofError)).toStrictEqual(
                new Uint8Array(include ? [1, 2, 3, 4] : [1, 2, 3]),
              )
            })

            it(`should ${consume ? "" : "not"} consume the term`, function () {
              const stream = new KaitaiStream(new Uint8Array([0, 1, 2, 3, 4, 5, 6]))

              stream.seek(1)
              stream.readBytesTerm(4, include, consume, eofError)

              expect(stream.pos()).toStrictEqual(consume ? 5 : 4)
            })

            it(`should ${eofError ? "" : "not"} throw an eofError when reading outside`, function () {
              const stream = new KaitaiStream(new Uint8Array([0, 1, 2, 3, 4, 5, 6]))

              if (eofError) {
                expect(() => stream.readBytesTerm(7, include, consume, eofError)).toThrow(EOFError)
              } else {
                expect(() => stream.readBytesTerm(7, include, consume, eofError)).not.toThrow(EOFError)
              }
            })
          })
        }
      }
    }
  })
})
