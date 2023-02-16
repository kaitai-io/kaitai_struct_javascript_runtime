import {NumberReader} from "./traits/number-reader"

import {applyMixins} from "./util/mixin"
import {DataViewDelegate} from "./traits/data-view-delegate"
import {KaitaiStreamBase} from "./kaitai-stream-base"
import {SequentialReader} from "./traits/sequential-reader"
import {ArrayReader} from "./traits/array-reader"
import {ByteReader} from "./traits/byte-reader"
import {BitReader} from "./traits/bit-reader"
import {ZlibProcessor} from "./traits/zlib-processor"
import {BitOpsProcessor} from "./traits/bit-ops-processor"

/**
 * KaitaiStream is an implementation of Kaitai Struct API for JavaScript.
 * Based on DataStream - https://github.com/kig/DataStream.js
 */
const KaitaiStream = applyMixins(
  KaitaiStreamBase,
  DataViewDelegate,
  SequentialReader,
  NumberReader,
  ArrayReader,
  ByteReader,
  BitReader,
  ZlibProcessor,
  BitOpsProcessor,
)

export default KaitaiStream
