import KaitaiStream from "../src/index"
import {EOFError} from "../src/errors/eor-error"

describe("stream positioning", function () {
  describe("eof", function () {
    it("should correctly report eof", function () {
      const stream = new KaitaiStream(new Uint8Array(0))

      expect(stream.eof()).toBe(true)
    })

    it("should not incorrectly report eof", function () {
      const stream = new KaitaiStream(new Uint8Array(16))

      expect(stream.eof()).toBe(false)
    })
  })

  describe("seek", function () {
    it("should seek the correct position", function () {
      const stream = new KaitaiStream(new Uint8Array([0, 1, 2, 3, 4]))

      stream.seek(2)
      expect(stream.position).toBe(2)
      expect(stream.readU1()).toBe(2)
      stream.seek(0)
      expect(stream.position).toBe(0)
      expect(stream.readU1()).toBe(0)
    })

    it("should clamp the position to the data size", function () {
      const stream = new KaitaiStream(new Uint8Array([0, 1, 2, 3, 4]))

      stream.seek(-4)
      expect(stream.position).toBe(0)
      stream.seek(20)
      expect(stream.position).toBe(4)
    })

    it("should replace NaN positions with 0", function () {
      const stream = new KaitaiStream(new Uint8Array([0, 1, 2, 3, 4]))

      stream.seek(Number.NaN)
      expect(stream.position).toBe(0)
    })

    it("should clamp non-finite positions", function () {
      const stream = new KaitaiStream(new Uint8Array([0, 1, 2, 3, 4]))

      stream.seek(Number.POSITIVE_INFINITY)
      expect(stream.position).toBe(4)
      stream.seek(Number.NEGATIVE_INFINITY)
      expect(stream.position).toBe(0)
    })
  })

  describe("pos", function () {
    it("should return the correct position", function () {
      const stream = new KaitaiStream(new Uint8Array([0, 1, 2, 3, 4]))

      stream.seek(3)
      expect(stream.pos()).toBe(3)
    })
  })

  describe("ensureBytesLeft", function () {
    it("should throw an eof error if no bytes are left", function () {
      const stream = new KaitaiStream(new Uint8Array([0, 1, 2, 3, 4]))

      expect(stream.readU8le).toThrowError(EOFError)
    })
  })
})
