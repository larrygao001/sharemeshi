module.exports = {
  rmg: {
    messagePrefix: '\x18RMG Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    rmg: 0x33, // starts with G
    wif: 0x80
  },
  rmgTest: {
    messagePrefix: '\x18RMG Test Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    rmg: 0x58, // starts with T
    wif: 0x80
  },
  litecoinTest: {
    magic: 0xd9b4bef9,
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x6f,
    scriptHash: 0x3a,
    wif: 0xb0,
    dustThreshold: 0, // https://github.com/litecoin-project/litecoin/blob/v0.8.7.2/src/main.cpp#L360-L365
    dustSoftThreshold: 100000, // https://github.com/litecoin-project/litecoin/blob/v0.8.7.2/src/main.h#L53
    feePerKb: 100000 // https://github.com/litecoin-project/litecoin/blob/v0.8.7.2/src/main.cpp#L56
  }
};
