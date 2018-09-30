'use strict'
/** global: Buffer */
let tape = require('tape')
let fixtures = require('./fixtures/base32')

let builds = [
    require('../src/base32'),
    require('../lib/base32'),
];

builds.map(function (base32) {
    fixtures.base32.valid.forEach((f) => {
        tape(`fromWords/toWords ${f.hex}`, (t) => {
            t.plan(2)

            let words = base32.toWords(Buffer.from(f.hex, 'hex'))
            let bytes = Buffer.from(base32.fromWords(f.words))
            t.same(words, f.words)
            t.same(bytes.toString('hex'), f.hex)
        })

        tape(`encode ${f.prefix} ${f.hex}`, (t) => {
            t.plan(1)

            t.strictEqual(base32.encode(f.prefix, f.words), f.string.toLowerCase())
        })

        tape(`decode ${f.string}`, (t) => {
            t.plan(1)

            t.same(base32.decode(f.string), {
                prefix: f.prefix.toLowerCase(),
                words: f.words
            })
        })

        tape(`fails for ${f.string} with 1 bit flipped`, (t) => {
            t.plan(1)

            let buffer = Buffer.from(f.string, 'utf8')
            buffer[f.string.lastIndexOf('1') + 1] ^= 0x1 // flip a bit, after the prefix
            let string = buffer.toString('utf8')
            t.throws(function () {
                base32.decode(string)
            }, new RegExp('Invalid checksum|Unknown character'))
        })
    })

    fixtures.base32.invalid.forEach((f) => {
        if (f.prefix !== undefined && f.words !== undefined) {
            tape(`encode fails with (${f.exception})`, (t) => {
                t.plan(1)

                t.throws(function () {
                    base32.encode(f.prefix, f.words)
                }, new RegExp(f.exception))
            })
        }

        if (f.string !== undefined || f.stringHex) {
            let string = f.string || Buffer.from(f.stringHex, 'hex').toString('binary')

            tape(`decode fails for ${string} (${f.exception})`, (t) => {
                t.plan(1)
                t.throws(function () {
                    base32.decode(string)
                }, new RegExp(f.exception))
            })
        }
    })

    fixtures.fromWords.invalid.forEach((f) => {
        tape(`fromWords fails with ${f.exception}`, (t) => {
            t.plan(1)
            t.throws(function () {
                base32.fromWords(f.words)
            }, new RegExp(f.exception))
        })
    })

    fixtures.encode.invalid.forEach((f) => {
        tape(`fromWords fails with ${f.exception}`, (t) => {
            t.plan(1)
            t.throws(function () {
                base32.encode(f.prefix, f.words)
            }, new RegExp(f.exception))
        })
    })

});
