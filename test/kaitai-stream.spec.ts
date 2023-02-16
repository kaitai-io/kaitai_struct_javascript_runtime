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

  it("should take a new data view", function () {
    const stream = new KaitaiStream(new DataView(new Uint8Array(1).buffer))

    stream.buffer = new Uint8Array([23]).buffer
    expect(stream.readU1()).toStrictEqual(23)
  })

  it("should take a new data offset", function () {
    const stream = new KaitaiStream(new DataView(new Uint8Array([23, 24]).buffer))

    stream.byteOffset = 1
    expect(stream.dataView.byteOffset).toStrictEqual(1)
    expect(stream.readU1()).toStrictEqual(24)
    expect(stream.eof()).toStrictEqual(true)
  })

  it("should take a new data length", function () {
    const stream = new KaitaiStream(new DataView(new Uint8Array([23, 24]).buffer))

    stream.byteLength = 1
    expect(stream.readU1()).toStrictEqual(23)
    expect(stream.eof()).toStrictEqual(true)
  })
})
