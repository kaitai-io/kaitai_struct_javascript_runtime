# Kaitai Struct: runtime library for JavaScript

[![npm@latest](https://img.shields.io/npm/v/kaitai-struct/latest)](https://www.npmjs.com/package/kaitai-struct/v/latest)
[![npm@next](https://img.shields.io/npm/v/kaitai-struct/next)](https://www.npmjs.com/package/kaitai-struct/v/next)
[![downloads](https://img.shields.io/npm/dw/kaitai-struct)](https://www.npmtrends.com/kaitai-struct)

This library implements Kaitai Struct API for JavaScript.

Kaitai Struct is a declarative language used for describe various binary
data structures, laid out in files or in memory: i.e. binary file
formats, network stream packet formats, etc.

Further reading:

- [About Kaitai Struct](http://kaitai.io/)
- [About API implemented in this library](http://doc.kaitai.io/stream_api.html)
- [JavaScript-specific notes](http://doc.kaitai.io/lang_javascript.html) - also includes Quick start guide

## Usage

### npm

```shell
npm i kaitai-struct
```

```ts
import KaitaiStream from "kaitai-stream"
```

Or

```js
const KaitaiStream = require("kaitai-stream")
```

### Browser

Include either `kaitai-stream.bundle.js` or `kaitai-stream-zlib.bundle.js`
depending on if you need zlib or not. You can also include the bundle
without zlib and provide pako to it by defining a global variable
"`pako`" [(get it here)](https://www.npmjs.com/package/pako)

## Licensing

Copyright 2012-2016 Ilmari Heikkinen\
Copyright 2016-2022 Kaitai Project

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
