'use strict';

var BigInteger = require('bigi');
var ALPHABET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';

// pre-compute lookup table
var SEPARATOR = ':';
var CSLEN = 8;
var ALPHABET_MAP = {};
for (var z = 0; z < ALPHABET.length; z++) {
    var x = ALPHABET.charAt(z);
    if (ALPHABET_MAP[x] !== undefined) {
        throw new TypeError(x + ' is ambiguous');
    }
    ALPHABET_MAP[x] = z;
}

function polymodStep(pre) {
    var b = pre.shiftRight(35);
    var mask = BigInteger.fromHex('07ffffffff');

    var v = pre.and(mask).shiftLeft(new BigInteger('5'));

    if (b.and(new BigInteger('1')).intValue() > 0) {
        v = v.xor(BigInteger.fromHex('98f2bc8e61'));
    }
    if (b.and(new BigInteger('2')).intValue()) {
        v = v.xor(BigInteger.fromHex('79b76d99e2'));
    }
    if (b.and(new BigInteger('4')).intValue()) {
        v = v.xor(BigInteger.fromHex('f33e5fb3c4'));
    }
    if (b.and(new BigInteger('8')).intValue()) {
        v = v.xor(BigInteger.fromHex('ae2eabe2a8'));
    }
    if (b.and(new BigInteger('16')).intValue()) {
        v = v.xor(BigInteger.fromHex('1e4f43e470'));
    }

    return v;
}

function prefixChk(prefix) {
    var chk = new BigInteger('1');
    for (var i = 0; i < prefix.length; ++i) {
        var c = prefix.charCodeAt(i);

        var mixwith = new BigInteger('' + (c & 0x1f));
        chk = polymodStep(chk).xor(mixwith);
    }

    chk = polymodStep(chk);
    return chk;
}

function encode(prefix, words) {
    // too long?
    if (prefix.length + CSLEN + 1 + words.length > 90) {
        throw new TypeError('Exceeds Base32 maximum length');
    }

    prefix = prefix.toLowerCase();

    // determine chk mod
    var chk = prefixChk(prefix);
    var result = prefix + SEPARATOR;
    for (var i = 0; i < words.length; ++i) {
        var _x = words[i];
        if (_x >>> 5 !== 0) {
            throw new Error('Non 5-bit word');
        }

        chk = polymodStep(chk).xor(new BigInteger('' + _x));
        result += ALPHABET.charAt(_x);
    }

    for (var _i = 0; _i < CSLEN; ++_i) {
        chk = polymodStep(chk);
    }
    chk = chk.xor(new BigInteger('1'));
    for (var _i2 = 0; _i2 < CSLEN; ++_i2) {
        var pos = 5 * (CSLEN - 1 - _i2);
        var v2 = chk.shiftRight(new BigInteger('' + pos)).and(BigInteger.fromHex('1f'));
        result += ALPHABET.charAt(v2.toString(10));
    }

    return result;
}

function decode(str) {
    if (str.length < 8) {
        throw new TypeError(str + ' too short');
    }
    if (str.length > 90) {
        throw new TypeError(str + ' too long');
    }

    // don't allow mixed case
    var lowered = str.toLowerCase();
    var uppered = str.toUpperCase();
    if (str !== lowered && str !== uppered) {
        throw new Error('Mixed-case string ' + str);
    }

    str = lowered;

    var split = str.lastIndexOf(SEPARATOR);
    if (split === -1) {
        throw new Error('No separator character for ' + str);
    }

    if (split === 0) {
        throw new Error('Missing prefix for ' + str);
    }

    var prefix = str.slice(0, split);
    var wordChars = str.slice(split + 1);
    if (wordChars.length < 6) {
        throw new Error('Data too short');
    }

    var chk = prefixChk(prefix);
    var words = [];
    for (var i = 0; i < wordChars.length; ++i) {
        var c = wordChars.charAt(i);
        var v = ALPHABET_MAP[c];
        if (v === undefined) {
            throw new Error('Unknown character ' + c);
        }

        chk = polymodStep(chk).xor(new BigInteger('' + v));
        // not in the checksum?
        if (i + CSLEN >= wordChars.length) {
            continue;
        }
        words.push(v);
    }

    if (chk.toString(10) !== '1') {
        throw new Error('Invalid checksum for ' + str);
    }

    return { prefix: prefix, words: words };
}

function convert(data, inBits, outBits, pad) {
    var value = 0;
    var bits = 0;
    var maxV = (1 << outBits) - 1;

    var result = [];
    for (var i = 0; i < data.length; ++i) {
        value = value << inBits | data[i];
        bits += inBits;

        while (bits >= outBits) {
            bits -= outBits;
            result.push(value >>> bits & maxV);
        }
    }

    if (pad) {
        if (bits > 0) {
            result.push(value << outBits - bits & maxV);
        }
    } else {
        if (bits >= inBits) {
            throw new Error('Excess padding');
        }
        if (value << outBits - bits & maxV) {
            throw new Error('Non-zero padding');
        }
    }

    return result;
}

function toWords(bytes) {
    return convert(bytes, 8, 5, true);
}

function fromWords(words) {
    return convert(words, 5, 8, false);
}

module.exports = { decode: decode, encode: encode, toWords: toWords, fromWords: fromWords };