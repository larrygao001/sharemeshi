const bitcoin = require('bitcoinjs-lib');
const OPS = require('bitcoin-ops');
const OP_INT_BASE = OPS.OP_RESERVED; // OP_1 - 1

const script = Object.assign({}, bitcoin.script);

script.encodeNumber = function(number) {
  if (Buffer.isBuffer(number)) return number;
  if (number === OPS.OP_0) return new Buffer(0);
  if (number <= 16) {
    return number + OP_INT_BASE;
  }
  return script.number.encode(number);
};

script.decodeNumber = function(number) {
  if (Buffer.isBuffer(number)) {
    if (number.equals(Buffer(0))) {
      return 0;
    }
    return script.number.decode(number);
  } else {
    if (number === 0) {
      return 0;
    }
    return number - OP_INT_BASE;
  }
};

module.exports = script;
