import KaitaiStream from "../src/index"

describe("KaitaiStream", function () {
  it("should accept an array buffer", function () {
    const stream = new KaitaiStream(new Uint8Array(20).buffer)

    expect(stream.dataView).toBeDefined()
    expect(stream.buffer.byteLength).toBe(20)
  })

  it("should accept a data view", function () {
    const stream = new KaitaiStream(new DataView(new Uint8Array(20).buffer))

    expect(stream.dataView).toBeDefined()
    expect(stream.buffer.byteLength).toBe(20)
  })
})
