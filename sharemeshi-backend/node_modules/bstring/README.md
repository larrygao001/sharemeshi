# bstring

String encodings for javascript.

## Usage

``` js
const {base58, bech32} = require('bstring');

// Base58
const b58 = base58.encode(Buffer.from([1,2,3]);
assert(base58.test(b58));
const data = base58.decode(b58);
console.log(data);

// Bech32
const b32 = bech32.encode('bc', 0, Buffer.alloc(20, 0x10));
assert(bech32.test(b32));
const {hrp, version, hash} = bech32.decode(b32);
console.log([hrp, version, hash]);
```

## Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your code
to be distributed under the MIT license. You are also implicitly verifying that
all code is your original work. `</legalese>`

## License

- Copyright (c) 2017, Christopher Jeffrey (MIT License).

See LICENSE for more info.
