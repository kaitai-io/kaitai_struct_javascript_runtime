import KaitaiStream from "../src/index"
import type {KaitaiStreamIntegerReadingApi} from "../src/kaitai-api"

const signResults = {
  S: {
    1: -1,
    2: -1,
    4: -1,
    8: -1n,
  },
  U: {
    1: 0xff,
    2: 0xff_ff,
    4: 0xff_ff_ff_ff,
    8: 0xff_ff_ff_ff_ff_ff_ff_ffn,
  },
} as any

const floatBinary = {
  le: {
    2: new Uint8Array([0xc0, 0x40].reverse()),
    4: new Uint8Array([0xc0, 0x08, 0x00, 0x00].reverse()),
    8: new Uint8Array([0xc0, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00].reverse()),
  },
  be: {
    2: new Uint8Array([0xc0, 0x40]),
    4: new Uint8Array([0xc0, 0x08, 0x00, 0x00]),
    8: new Uint8Array([0xc0, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
  },
} as any

describe("number reading", function () {
  for (const sign of ["U", "S"]) {
    for (const length of [1, 2, 4, 8]) {
      for (const endian of ["le", "be"]) {
        const functionName = `read${sign}${length}${
          length === 1 ? "" : endian
        }` as keyof KaitaiStreamIntegerReadingApi
        describe(functionName, function () {
          it(`should read the correct sign`, function () {
            expect(
              new KaitaiStream(new Uint8Array(Array.from({length}, (_, i) => 0xff)))[functionName](),
            ).toStrictEqual(signResults[sign][length])
          })

          if (length !== 1) {
            it(`should read the correct endian`, function () {
              expect(
                new KaitaiStream(
                  new Uint8Array(
                    Array.from({length}, (_, i) => Number(endian === "le" ? i === 0 : i === length - 1)),
                  ),
                )[functionName](),
              ).toStrictEqual(length === 8 ? 1n : 1)
            })
          }
        })
      }
    }
  }

  for (const length of [2, 4, 8]) {
    for (const endian of ["le", "be"]) {
      const functionName = `readF${length}${endian}` as keyof KaitaiStreamIntegerReadingApi
      describe(functionName, function () {
        it("should read the correct number", function () {
          expect((new KaitaiStream(floatBinary[endian][length]) as any)[functionName]()).toStrictEqual(-2.125)
        })
      })
    }
  }
})
