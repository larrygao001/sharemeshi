'use strict'
/** global: Buffer */

let base32 = require('./base32')

let P2SH = "scripthash";
let P2PKH = "pubkeyhash";

let hashBitMap = {};
hashBitMap[160] = 0;
hashBitMap[192] = 1;
hashBitMap[224] = 2;
hashBitMap[256] = 3;
hashBitMap[320] = 4;
hashBitMap[384] = 5;
hashBitMap[448] = 6;
hashBitMap[512] = 7;

let versionBitMap = {};
versionBitMap[P2PKH] = 0;
versionBitMap[P2SH] = 1;

function checkMap(mapObj, value) {
    let keys = Object.keys(mapObj);
    for (let i = 0; i < keys.length; i++) {
        if (mapObj[keys[i]] === value) {
            return keys[i];
        }
    }

    return null;
}

function createVersion(scriptType, hashLengthBits) {
    if ((scriptType === P2PKH || scriptType === P2SH) && hashLengthBits !== 160) {
        throw new Error("Invalid hash length for scriptType");
    }

    return (versionBitMap[scriptType] << 3) | hashBitMap[hashLengthBits];
}

function encodePayload(scriptType, hash) {
    let hashLength = hash.length
    let version = createVersion(scriptType, hashLength * 8)
    let payload = Buffer.allocUnsafe(1 + hash.length)
    payload.writeUInt8(version, 0)
    hash.copy(payload, 1)
    return payload
}

function decodeVersion (version) {
    let last = (version >>> 7);
    if (last & 1 || last > 0) {
        throw new Error("Invalid version, most significant bit is reserved");
    }

    let scriptType = checkMap(versionBitMap, (version >> 3) & 0x0f)
    if (scriptType === null) {
        throw new Error("Invalid script type");
    }
    // all possible values return
    let hashSize = parseInt(checkMap(hashBitMap, version & 0x07), 10);
    if ((scriptType === P2PKH || scriptType === P2SH) && hashSize !== 160) {
        throw new Error("Mismatch between script type and hash length");
    }

    return {scriptType, hashSize}
}

function encode (prefix, scriptType, hash) {
    if (!(hash instanceof Buffer)) {
        throw new Error("Hash should be passed as a Buffer")
    }

    if (!(scriptType in versionBitMap)) {
        throw new Error("Unsupported script type")
    }

    return base32.encode(
        prefix,
        base32.toWords(encodePayload(scriptType, hash))
    )
}

function decode(address) {
    let result = base32.decode(address)
    let data = base32.fromWords(result.words)
    if (data.length < 1) {
        throw new Error("Empty payload in address")
    }

    let versionInfo = decodeVersion(data[0])
    if (1 + (versionInfo.hashSize / 8) !== data.length) {
        throw new Error('Hash length does not match version')
    }

    return {
        version: versionInfo.scriptType,
        prefix: result.prefix,
        hash: Buffer.from(data.slice(1))
    }
}

module.exports = { decode: decode, encode: encode };
