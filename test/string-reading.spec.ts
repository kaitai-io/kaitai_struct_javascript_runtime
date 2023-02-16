import KaitaiStream from "../src/index"

const result = "The quick brown fox jumps over the lazy dog"
const encodedString = new TextEncoder().encode(result)

// reduced tests here as we cover most through byte array reading tests
describe("string reading", function () {
  describe("readStrEos", function () {
    it("should read the string", function () {
      const stream = new KaitaiStream(encodedString)
      expect(stream.readStrEos("utf-8")).toStrictEqual(result)
    })
  })

  describe("readStrByteLimit", function () {
    it("should read the string", function () {
      const stream = new KaitaiStream(encodedString)
      expect(stream.readStrByteLimit(6, "utf-8")).toStrictEqual(result.substring(0, 6))
    })
  })

  describe("readStrZ", function () {
    it("should read the string", function () {
      const stream = new KaitaiStream(new Uint8Array([...encodedString, 0, 0, 0]))
      expect(stream.readStrZ("utf-8", 0, false, true, false)).toStrictEqual(result)
    })
  })
})
