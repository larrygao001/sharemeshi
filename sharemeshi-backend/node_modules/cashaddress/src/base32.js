'use strict'
let BigInteger = require('bigi')
let ALPHABET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l'

// pre-compute lookup table
let SEPARATOR = ':'
let CSLEN = 8
let ALPHABET_MAP = {}
for (let z = 0; z < ALPHABET.length; z++) {
    let x = ALPHABET.charAt(z)
    if (ALPHABET_MAP[x] !== undefined) {
        throw new TypeError(x + ' is ambiguous')
    }
    ALPHABET_MAP[x] = z
}

function polymodStep (pre) {
    let b = pre.shiftRight(35)
    let mask = BigInteger.fromHex('07ffffffff')

    let v = pre.and(mask).shiftLeft(new BigInteger('5'))

    if (b.and(new BigInteger('1')).intValue() > 0) {
        v = v.xor(BigInteger.fromHex('98f2bc8e61'))
    }
    if (b.and(new BigInteger('2')).intValue()) {
        v = v.xor(BigInteger.fromHex('79b76d99e2'))
    }
    if (b.and(new BigInteger('4')).intValue()) {
        v = v.xor(BigInteger.fromHex('f33e5fb3c4'))
    }
    if (b.and(new BigInteger('8')).intValue()) {
        v = v.xor(BigInteger.fromHex('ae2eabe2a8'))
    }
    if (b.and(new BigInteger('16')).intValue()) {
        v = v.xor(BigInteger.fromHex('1e4f43e470'))
    }

    return v
}

function prefixChk (prefix) {
    let chk = new BigInteger('1')
    for (let i = 0; i < prefix.length; ++i) {
        let c = prefix.charCodeAt(i)

        let mixwith = new BigInteger('' + (c & 0x1f))
        chk = polymodStep(chk).xor(mixwith)
    }

    chk = polymodStep(chk)
    return chk
}

function encode (prefix, words) {
    // too long?
    if ((prefix.length + CSLEN + 1 + words.length) > 90) {
        throw new TypeError('Exceeds Base32 maximum length')
    }

    prefix = prefix.toLowerCase()

    // determine chk mod
    let chk = prefixChk(prefix)
    let result = prefix + SEPARATOR
    for (let i = 0; i < words.length; ++i) {
        let x = words[i]
        if ((x >>> 5) !== 0) {
            throw new Error('Non 5-bit word')
        }

        chk = polymodStep(chk).xor(new BigInteger('' + x))
        result += ALPHABET.charAt(x)
    }

    for (let i = 0; i < CSLEN; ++i) {
        chk = polymodStep(chk)
    }
    chk = chk.xor(new BigInteger('1'))
    for (let i = 0; i < CSLEN; ++i) {
        let pos = 5 * (CSLEN - 1 - i)
        let v2 = chk.shiftRight(new BigInteger('' + pos)).and(BigInteger.fromHex('1f'))
        result += ALPHABET.charAt(v2.toString(10))
    }

    return result
}

function decode (str) {
    if (str.length < 8) {
        throw new TypeError(str + ' too short')
    }
    if (str.length > 90) {
        throw new TypeError(str + ' too long')
    }

    // don't allow mixed case
    let lowered = str.toLowerCase()
    let uppered = str.toUpperCase()
    if (str !== lowered && str !== uppered) {
        throw new Error('Mixed-case string ' + str)
    }

    str = lowered

    let split = str.lastIndexOf(SEPARATOR)
    if (split === -1) {
        throw new Error('No separator character for ' + str)
    }

    if (split === 0) {
        throw new Error('Missing prefix for ' + str)
    }

    let prefix = str.slice(0, split)
    let wordChars = str.slice(split + 1)
    if (wordChars.length < 6) {
        throw new Error('Data too short')
    }

    let chk = prefixChk(prefix)
    let words = []
    for (let i = 0; i < wordChars.length; ++i) {
        let c = wordChars.charAt(i)
        let v = ALPHABET_MAP[c]
        if (v === undefined) {
            throw new Error('Unknown character ' + c)
        }

        chk = polymodStep(chk).xor(new BigInteger('' + v))
        // not in the checksum?
        if (i + CSLEN >= wordChars.length) {
            continue
        }
        words.push(v)
    }

    if (chk.toString(10) !== '1') {
        throw new Error('Invalid checksum for ' + str)
    }

    return { prefix, words }
}

function convert (data, inBits, outBits, pad) {
    let value = 0
    let bits = 0
    let maxV = (1 << outBits) - 1

    let result = []
    for (let i = 0; i < data.length; ++i) {
        value = (value << inBits) | data[i]
        bits += inBits

        while (bits >= outBits) {
            bits -= outBits
            result.push((value >>> bits) & maxV)
        }
    }

    if (pad) {
        if (bits > 0) {
            result.push((value << (outBits - bits)) & maxV)
        }
    } else {
        if (bits >= inBits) {
            throw new Error('Excess padding')
        }
        if ((value << (outBits - bits)) & maxV) {
            throw new Error('Non-zero padding')
        }
    }

    return result
}

function toWords (bytes) {
    return convert(bytes, 8, 5, true)
}

function fromWords (words) {
    return convert(words, 5, 8, false)
}

module.exports = { decode, encode, toWords, fromWords }
