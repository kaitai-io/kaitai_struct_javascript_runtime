import KaitaiStream from "../src"
import {NotImplementedError} from "../src/errors/not-implemented-error"
import pako from "pako"

jest.mock("pako")

describe("processing", function () {
  describe("processXor", function () {
    it("should process single", function () {
      const stream = new KaitaiStream(new Uint8Array(1))
      expect(stream.processXorOne(new Uint8Array([0x0f, 0x0f]), 0xf0)).toStrictEqual(
        new Uint8Array([0xff, 0xff]),
      )
    })

    it("should process many", function () {
      const stream = new KaitaiStream(new Uint8Array(1))
      expect(stream.processXorMany(new Uint8Array([0x0f, 0x0f]), new Uint8Array([0xf0, 0x0f]))).toStrictEqual(
        new Uint8Array([0xff, 0x00]),
      )
    })
  })

  describe("processRotateLeft", function () {
    it("should throw for group sizes other than 1", function () {
      const stream = new KaitaiStream(new Uint8Array(1))

      expect(() => stream.processRotateLeft(new Uint8Array(), 0, 8)).toThrow(NotImplementedError)
    })

    it("should rotate bitwise", function () {
      const stream = new KaitaiStream(new Uint8Array(1))

      expect(stream.processRotateLeft(new Uint8Array([0b0010_1111, 0b1111_0000]), 2, 1)).toStrictEqual(
        new Uint8Array([0b1011_1100, 0b1100_0011]),
      )
    })
  })

  describe("processZlib", function () {
    it("should call pako", function () {
      // @ts-expect-error mock
      pako.inflateRaw.mockImplementation(() => new Uint8Array([4, 5, 6]))

      const stream = new KaitaiStream(new Uint8Array(1))
      expect(stream.processZlib(new Uint8Array([1, 2, 3]))).toStrictEqual(new Uint8Array([4, 5, 6]))
    })
  })
})
