'use strict'
/** global: Buffer */
let tape = require('tape')
let fixtures = require('./fixtures/base32')
let base32 = require('../lib/base32')

let builds = [
    require('../lib/index'),
    require('../src/index'),
];

builds.map(function (CashAddress) {
    fixtures.base32.valid.forEach((f) => {
        let hash = Buffer.from(f.hex, "hex").slice(1);
        tape(`encode ${f.prefix} ${f.hex}`, (t) => {
            t.plan(1)

            t.strictEqual(CashAddress.encode(f.prefix, f.type, hash), f.string.toLowerCase())
        })

        tape(`decode ${f.string}`, (t) => {
            t.plan(1)

            let hash = Buffer.from(base32.fromWords(f.words).slice(1));
            t.same(CashAddress.decode(f.string), {
                version: f.type,
                prefix: f.prefix.toLowerCase(),
                hash: hash
            })
        })
    })

    fixtures.address.invalid.forEach((f) => {

        let string = f.string;

        tape(`decode fails for ${string} (${f.exception})`, (t) => {
            t.plan(1)
            t.throws(function () {
                CashAddress.decode(string)
            }, new RegExp(f.exception))
        })

    })

    tape(`encode requires a valid scriptType`, (t) => {
        t.plan(1)
        t.throws(function () {
            CashAddress.encode("bitcoincash", "segwit", Buffer.from("becausewecanthavenicethings"))
        }, new RegExp("Unsupported script type"))
    });

    tape(`encode requires a valid scriptType`, (t) => {
        t.plan(1)
        t.throws(function () {
            CashAddress.encode("bitcoincash", "pubkeyhash", "....")
        }, new RegExp("Hash should be passed as a Buffer"))
    });

    tape(`encode, with script & hash mismatch`, (t) => {
        t.plan(1)
        t.throws(function () {
            CashAddress.encode("bitcoincash", "pubkeyhash", Buffer.from("4242424242424242424242424242424242424242424242424242424242424242", "hex"))
        }, new RegExp("Invalid hash length for scriptType"))
    });
});
