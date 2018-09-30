const typeforce = require('typeforce');

const SATOSHI_MAX = 21 * 1e14;
const Satoshi = (value) => {
  return typeforce.UInt53(value) && value <= SATOSHI_MAX;
};

// external dependent types
const ECPoint = typeforce.quacksLike('Point');

// exposed, external API
const Network = typeforce.compile({
  messagePrefix: typeforce.oneOf(typeforce.Buffer, typeforce.String),
  bip32: {
    public: typeforce.UInt32,
    private: typeforce.UInt32
  },
  pubKeyHash: typeforce.maybe(typeforce.UInt8),
  rmg: typeforce.maybe(typeforce.UInt8),
  scriptHash: typeforce.maybe(typeforce.UInt8),
  wif: typeforce.maybe(typeforce.UInt8)
});

// extend typeforce types with ours
const types = {
  ECPoint: ECPoint,
  Network: Network,
  Satoshi: Satoshi
};

for (let typeName in typeforce) {
  types[typeName] = typeforce[typeName];
}

module.exports = types;
