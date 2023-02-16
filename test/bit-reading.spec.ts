import KaitaiStream from "../src/index"

const input: number = 0x695a_116d
const arrayBe = [0x69, 0x5a, 0x11, 0x6d]
const arrayLe = [0x6d, 0x11, 0x5a, 0x69]

describe("bit reader", function () {
  for (const endian of ["Be", "Le"] as const) {
    const functionName = `readBitsInt${endian}` as const

    describe(functionName, function () {
      for (const bits of Array.from({length: 32}, (_, i) => i + 1)) {
        it(`should read ${bits} bit${bits > 1 ? "s" : ""}`, function () {
          const stream = new KaitaiStream(new Uint8Array(endian === "Le" ? arrayLe : arrayBe))
          if (endian === "Le") stream[functionName](32 - bits)
          expect(stream[functionName](bits)).toStrictEqual(input >>> (32 - bits))
        })
      }

      it("should throw a range error for over 32 bit", function () {
        const stream = new KaitaiStream(new Uint8Array(8))
        expect(() => stream[functionName](33)).toThrow(RangeError)
      })
    })
  }
})
