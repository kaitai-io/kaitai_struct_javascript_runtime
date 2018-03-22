# Kaitai Struct: runtime library for JavaScript

This library implements Kaitai Struct API for JavaScript.

Kaitai Struct is a declarative language used for describe various binary
data structures, laid out in files or in memory: i.e. binary file
formats, network stream packet formats, etc.

Further reading:

* [About Kaitai Struct](http://kaitai.io/)
* [About API implemented in this library](http://doc.kaitai.io/stream_api.html)
* [JavaScript-specific notes](http://doc.kaitai.io/lang_javascript.html)

## Quick start 
 
### Node.js
 
Create an empty directory and install the [runtime from npm](https://www.npmjs.com/package/kaitai-struct) by running: 
 
```bash
npm i kaitai-struct 
``` 
 
Copy your compiled .ksy parser (eg. `Elf.js`) or download a [parser from the format gallery](http://formats.kaitai.io/) (eg. [Elf.js](http://formats.kaitai.io/elf/javascript.html)) to this directory. 
 
Create `index.js` with the following content: 
 
```javascript 
const fs = require("fs"); 
const Elf = require("./Elf"); 
const KaitaiStream = require('kaitai-struct/KaitaiStream'); 
 
const fileContent = fs.readFileSync("/bin/ls"); 
const parsedElf = new Elf(new KaitaiStream(fileContent)); 
console.log(parsedElf); 
``` 
 
Test the code by running `node index.js`. 

## Licensing

Copyright 2012-2016 Ilmari Heikkinen
Copyright 2016-2018 Kaitai Project

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
