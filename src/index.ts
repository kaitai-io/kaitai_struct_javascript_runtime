import {NumberReader} from "./traits/number-reader"

import {DataViewDelegate} from "./traits/data-view-delegate"
import {KaitaiStreamBase} from "./kaitai-stream-base"
import {SequentialReader} from "./traits/sequential-reader"
import {ArrayReader} from "./traits/array-reader"
import {ByteReader} from "./traits/byte-reader"
import {BitReader} from "./traits/bit-reader"
import {ZlibProcessor} from "./traits/zlib-processor"
import {BitOpsProcessor} from "./traits/bit-ops-processor"
import {StringReader} from "./traits/string-reader"
import type {KaitaiStreamApi, KaitaiStreamPositioningApi, KaitaiStreamReadingApi} from "./kaitai-api"
import {Constructor} from "./util/mixin"

const DataStream = SequentialReader(
  DataViewDelegate(KaitaiStreamBase),
) satisfies Constructor<KaitaiStreamPositioningApi>

const Reader = StringReader(
  BitReader(ByteReader(NumberReader(ArrayReader(DataStream)))),
) satisfies Constructor<KaitaiStreamReadingApi>

/**
 * KaitaiStream is an implementation of Kaitai Struct API for JavaScript.
 * Based on DataStream - https://github.com/kig/DataStream.js
 */
const KaitaiStream = BitOpsProcessor(ZlibProcessor(Reader)) satisfies Constructor<KaitaiStreamApi>

export default KaitaiStream
