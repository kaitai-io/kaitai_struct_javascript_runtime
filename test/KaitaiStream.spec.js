"use strict";

let KaitaiStream = require("../KaitaiStream");

describe("KaitaiStream", () => {
  it("readS1", () => {
    let stream1 = new KaitaiStream(Uint8Array.of(0,1,2,3,4), 0);
    //                         Expected result: [ ]^
    expect(stream1.readS1()).toBe(0);
    expect(stream1.pos).toBe(1);

    let stream2 = new KaitaiStream(Uint8Array.of(0xFF,1,2,3,4), 0);
    //                         Expected result: [    ]^
    expect(stream2.readS1()).toBe(-1);
    expect(stream2.pos).toBe(1);
  });
  it("readU1", () => {
    let stream1 = new KaitaiStream(Uint8Array.of(0,1,2,3,4), 0);
    //                         Expected result: [ ]^
    expect(stream1.readU1()).toBe(0);
    expect(stream1.pos).toBe(1);

    let stream2 = new KaitaiStream(Uint8Array.of(0xFF,1,2,3,4), 0);
    //                         Expected result: [    ]^
    expect(stream2.readU1()).toBe(255);
    expect(stream2.pos).toBe(1);
  });

  it("readS2be", () => {
    let stream1 = new KaitaiStream(Uint8Array.of(0,1,2,3,4), 0);
    //                         Expected result: [   ]^
    expect(stream1.readS2be()).toBe(1);// 0x0001
    expect(stream1.pos).toBe(2);

    let stream2 = new KaitaiStream(Uint8Array.of(0xFF,1,2,3,4), 0);
    //                         Expected result: [      ]^
    expect(stream2.readS2be()).toBe(-255);// 0xFF01
    expect(stream2.pos).toBe(2);
  });
  it("readS2le", () => {
    let stream1 = new KaitaiStream(Uint8Array.of(0,1,2,3,4), 0);
    //                         Expected result: [   ]^
    expect(stream1.readS2le()).toBe(256);// 0x0100
    expect(stream1.pos).toBe(2);

    let stream2 = new KaitaiStream(Uint8Array.of(0,0xFF,2,3,4), 0);
    //                         Expected result: [      ]^
    expect(stream2.readS2le()).toBe(-256);// 0xFF00
    expect(stream2.pos).toBe(2);
  });
  it("readU2be", () => {
    let stream1 = new KaitaiStream(Uint8Array.of(0,1,2,3,4), 0);
    //                         Expected result: [   ]^
    expect(stream1.readU2be()).toBe(1);// 0x0001
    expect(stream1.pos).toBe(2);

    let stream2 = new KaitaiStream(Uint8Array.of(0xFF,1,2,3,4), 0);
    //                         Expected result: [      ]^
    expect(stream2.readU2be()).toBe(65281);// 0xFF01
    expect(stream2.pos).toBe(2);
  });
  it("readU2le", () => {
    let stream1 = new KaitaiStream(Uint8Array.of(0,1,2,3,4), 0);
    //                         Expected result: [   ]^
    expect(stream1.readU2le()).toBe(256);// 0x0100
    expect(stream1.pos).toBe(2);

    let stream2 = new KaitaiStream(Uint8Array.of(0,0xFF,2,3,4), 0);
    //                         Expected result: [      ]^
    expect(stream2.readU2le()).toBe(65280);// 0xFF00
    expect(stream2.pos).toBe(2);
  });

  it("readS4be", () => {
    let stream1 = new KaitaiStream(Uint8Array.of(0,1,2,3,4), 0);
    //                         Expected result: [       ]^
    expect(stream1.readS4be()).toBe(66051);// 0x00010203
    expect(stream1.pos).toBe(4);

    let stream2 = new KaitaiStream(Uint8Array.of(0xFF,1,2,3,4), 0);
    //                         Expected result: [          ]^
    expect(stream2.readS4be()).toBe(-16711165);// 0xFF010203
    expect(stream2.pos).toBe(4);
  });
  it("readS4le", () => {
    let stream1 = new KaitaiStream(Uint8Array.of(0,1,2,3,4), 0);
    //                         Expected result: [       ]^
    expect(stream1.readS4le()).toBe(50462976);// 0x03020100
    expect(stream1.pos).toBe(4);

    let stream2 = new KaitaiStream(Uint8Array.of(0,1,2,0xFF,4), 0);
    //                         Expected result: [          ]^
    expect(stream2.readS4le()).toBe(-16645888);// 0xFF020100
    expect(stream2.pos).toBe(4);
  });
  it("readU4be", () => {
    let stream1 = new KaitaiStream(Uint8Array.of(0,1,2,3,4), 0);
    //                         Expected result: [       ]^
    expect(stream1.readU4be()).toBe(66051);// 0x00010203
    expect(stream1.pos).toBe(4);

    let stream2 = new KaitaiStream(Uint8Array.of(0xFF,1,2,3,4), 0);
    //                         Expected result: [          ]^
    expect(stream2.readU4be()).toBe(4278256131);// 0xFF010203
    expect(stream2.pos).toBe(4);
  });
  it("readU4le", () => {
    let stream1 = new KaitaiStream(Uint8Array.of(0,1,2,3,4), 0);
    //                         Expected result: [       ]^
    expect(stream1.readU4le()).toBe(50462976);// 0x03020100
    expect(stream1.pos).toBe(4);

    let stream2 = new KaitaiStream(Uint8Array.of(0,1,2,0xFF,4), 0);
    //                         Expected result: [          ]^
    expect(stream2.readU4le()).toBe(4278321408);// 0xFF020100
    expect(stream2.pos).toBe(4);
  });

  // Actually, precision of JS numbers is not enough to represent some of test
  // values (marked with (*)), but the read methods should return the values
  // truncated in the same manner
  // TODO: In the future may be use bigint literals (numbers with suffix `n`)?
  it("readS8be", () => {
    let stream1 = new KaitaiStream(Uint8Array.of(0,1,2,3,4,5,6,7,8), 0);
    //                         Expected result: [               ]^
    expect(stream1.readS8be()).toBe(283686952306183);// 0x0001020304050607
    expect(stream1.pos).toBe(8);

    let stream2 = new KaitaiStream(Uint8Array.of(0xFF,1,2,3,4,5,6,7,8), 0);
    //                         Expected result: [                  ]^
    expect(stream2.readS8be()).toBe(-71773907085621753);// 0xFF01020304050607 (*)
    expect(stream2.pos).toBe(8);
  });
  it("readS8le", () => {
    let stream1 = new KaitaiStream(Uint8Array.of(0,1,2,3,4,5,6,7,8), 0);
    //                         Expected result: [               ]^
    expect(stream1.readS8le()).toBe(506097522914230528);// 0x0706050403020100 (*)
    expect(stream1.pos).toBe(8);

    let stream2 = new KaitaiStream(Uint8Array.of(0,1,2,3,4,5,6,0xFF,8), 0);
    //                         Expected result: [                  ]^
    expect(stream2.readS8le()).toBe(-70363229389192960);// 0xFF06050403020100 (*)
    expect(stream2.pos).toBe(8);
  });
  it("readU8be", () => {
    let stream1 = new KaitaiStream(Uint8Array.of(0,1,2,3,4,5,6,7,8), 0);
    //                         Expected result: [               ]^
    expect(stream1.readU8be()).toBe(283686952306183);// 0x0001020304050607
    expect(stream1.pos).toBe(8);

    let stream2 = new KaitaiStream(Uint8Array.of(0xFF,1,2,3,4,5,6,7,8), 0);
    //                         Expected result: [                  ]^
    expect(stream2.readU8be()).toBe(18374970166623929863);// 0xFF01020304050607 (*)
    expect(stream2.pos).toBe(8);
  });
  it("readU8le", () => {
    let stream1 = new KaitaiStream(Uint8Array.of(0,1,2,3,4,5,6,7,8), 0);
    //                         Expected result: [               ]^
    expect(stream1.readU8le()).toBe(506097522914230528);// 0x0706050403020100 (*)
    expect(stream1.pos).toBe(8);

    let stream2 = new KaitaiStream(Uint8Array.of(0,1,2,3,4,5,6,0xFF,8), 0);
    //                         Expected result: [                  ]^
    expect(stream2.readU8le()).toBe(18376380844320358656);// 0xFF060504030201 (*)
    expect(stream2.pos).toBe(8);
  });

  describe("readBytesTerm", () => {
    describe("when terminator is present in an input", () => {
      it("include = false, consume = false, eosError = false", () => {
        let stream = new KaitaiStream(Uint8Array.of(0,1,2,3,4), 0);
        //                        Expected result: [   ]^
        expect(stream.readBytesTerm(2, false, false, false)).toStrictEqual(Uint8Array.of(0,1));
        expect(stream.pos).toBe(2);
      });
      it("include = false, consume = false, eosError =  true", () => {
        let stream = new KaitaiStream(Uint8Array.of(0,1,2,3,4), 0);
        //                        Expected result: [   ]^
        expect(stream.readBytesTerm(2, false, false, true)).toStrictEqual(Uint8Array.of(0,1));
        expect(stream.pos).toBe(2);
      });

      it("include = false, consume =  true, eosError = false", () => {
        let stream = new KaitaiStream(Uint8Array.of(0,1,2,3,4), 0);
        //                        Expected result: [   ]  ^
        expect(stream.readBytesTerm(2, false, true, false)).toStrictEqual(Uint8Array.of(0,1));
        expect(stream.pos).toBe(3);
      });
      it("include = false, consume =  true, eosError =  true", () => {
        let stream = new KaitaiStream(Uint8Array.of(0,1,2,3,4), 0);
        //                        Expected result: [   ]  ^
        expect(stream.readBytesTerm(2, false, true, true)).toStrictEqual(Uint8Array.of(0,1));
        expect(stream.pos).toBe(3);
      });

      it("include =  true, consume = false, eosError = false", () => {
        let stream = new KaitaiStream(Uint8Array.of(0,1,2,3,4), 0);
        //                        Expected result: [    ^]
        expect(stream.readBytesTerm(2, true, false, false)).toStrictEqual(Uint8Array.of(0,1,2));
        expect(stream.pos).toBe(2);
      });
      it("include =  true, consume = false, eosError =  true", () => {
        let stream = new KaitaiStream(Uint8Array.of(0,1,2,3,4), 0);
        //                        Expected result: [    ^]
        expect(stream.readBytesTerm(2, true, false, true)).toStrictEqual(Uint8Array.of(0,1,2));
        expect(stream.pos).toBe(2);
      });

      it("include =  true, consume =  true, eosError = false", () => {
        let stream = new KaitaiStream(Uint8Array.of(0,1,2,3,4), 0);
        //                        Expected result: [     ]^
        expect(stream.readBytesTerm(2, true, true, false)).toStrictEqual(Uint8Array.of(0,1,2));
        expect(stream.pos).toBe(3);
      });
      it("include =  true, consume =  true, eosError =  true", () => {
        let stream = new KaitaiStream(Uint8Array.of(0,1,2,3,4), 0);
        //                        Expected result: [     ]^
        expect(stream.readBytesTerm(2, true, true, true)).toStrictEqual(Uint8Array.of(0,1,2));
        expect(stream.pos).toBe(3);
      });
    });

    describe("when terminator does not present in an input", () => {
      it("include = false, consume = false, eosError = false", () => {
        let stream = new KaitaiStream(Uint8Array.of(0,1,2,3,4), 0);
        //                        Expected result: [         ]^
        expect(stream.readBytesTerm(5, false, false, false)).toStrictEqual(Uint8Array.of(0,1,2,3,4));
        expect(stream.pos).toBe(5);
      });
      it("include = false, consume = false, eosError =  true", () => {
        let stream = new KaitaiStream(Uint8Array.of(0,1,2,3,4), 0);
        expect(() => stream.readBytesTerm(5, false, false, true)).toThrow();
        expect(stream.pos).toBe(0);
      });

      it("include = false, consume =  true, eosError = false", () => {
        let stream = new KaitaiStream(Uint8Array.of(0,1,2,3,4), 0);
        //                        Expected result: [         ]^
        expect(stream.readBytesTerm(5, false, true, false)).toStrictEqual(Uint8Array.of(0,1,2,3,4));
        expect(stream.pos).toBe(5);
      });
      it("include = false, consume =  true, eosError =  true", () => {
        let stream = new KaitaiStream(Uint8Array.of(0,1,2,3,4), 0);
        expect(() => stream.readBytesTerm(5, false, true, true)).toThrow();
        expect(stream.pos).toBe(0);
      });

      it("include =  true, consume = false, eosError = false", () => {
        let stream = new KaitaiStream(Uint8Array.of(0,1,2,3,4), 0);
        //                        Expected result: [         ]^
        expect(stream.readBytesTerm(5, true, false, false)).toStrictEqual(Uint8Array.of(0,1,2,3,4));
        expect(stream.pos).toBe(5);
      });
      it("include =  true, consume = false, eosError =  true", () => {
        let stream = new KaitaiStream(Uint8Array.of(0,1,2,3,4), 0);
        expect(() => stream.readBytesTerm(5, true, false, true)).toThrow();
        expect(stream.pos).toBe(0);
      });

      it("include =  true, consume =  true, eosError = false", () => {
        let stream = new KaitaiStream(Uint8Array.of(0,1,2,3,4), 0);
        //                        Expected result: [         ]^
        expect(stream.readBytesTerm(5, true, true, false)).toStrictEqual(Uint8Array.of(0,1,2,3,4));
        expect(stream.pos).toBe(5);
      });
      it("include =  true, consume =  true, eosError =  true", () => {
        let stream = new KaitaiStream(Uint8Array.of(0,1,2,3,4), 0);
        expect(() => stream.readBytesTerm(5, true, true, true)).toThrow();
        expect(stream.pos).toBe(0);
      });
    });
  });
});
