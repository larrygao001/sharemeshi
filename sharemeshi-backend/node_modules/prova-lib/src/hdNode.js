const base58check = require('bs58check');
const BigInteger = require('bigi');
const bitcoin = require('bitcoinjs-lib');
const crypto = require('crypto');
const ECPair = require('./ecPair');
const ecurve = require('ecurve');
const curve = ecurve.getCurveByName('secp256k1');
const NETWORKS = require('./networks');
const typeforce = require('typeforce');
const types = require('./types');

let secp256k1;
try {
  secp256k1 = require('secp256k1');
} catch (err) {
  console.log('running without secp256k1 acceleration');
}

const HDNode = function HDNode(keyPair, chainCode) {
  try {
    typeforce(types.tuple('ECPair', types.BufferN(32)), arguments);
  } catch (e) {
    throw new Error(e.message);
  }

  if (!keyPair.compressed) throw new TypeError('BIP32 only allows compressed keyPairs');

  this.keyPair = keyPair;
  this.chainCode = chainCode;
  this.depth = 0;
  this.index = 0;
  this.parentFingerprint = 0x00000000;
};
Object.assign(HDNode, bitcoin.HDNode);
HDNode.prototype.__proto__ = bitcoin.HDNode.prototype;

const inferredNetworks = [
  NETWORKS.rmg,
  NETWORKS.rmgTest,
  bitcoin.networks.bitcoin,
  bitcoin.networks.testnet,
  bitcoin.networks.litecoin,
  NETWORKS.litecoinTest
];

HDNode.prototype.neutered = function() {
  const neuteredKeyPair = new ECPair(null, this.keyPair.Q, {
    network: this.keyPair.network
  });

  const neutered = new HDNode(neuteredKeyPair, this.chainCode);
  neutered.depth = this.depth;
  neutered.index = this.index;
  neutered.parentFingerprint = this.parentFingerprint;

  return neutered;
};

HDNode.prototype.getKey = function(overrideNetwork) {
  try {
    typeforce(types.maybe(types.Network), overrideNetwork);
  } catch (e) {
    throw new Error(e.message);
  }

  const k = this.keyPair;
  const network = overrideNetwork || this.keyPair.network || NETWORKS.rmg;
  const result = new ECPair(k.d, k.d ? null : k.Q, { network: network, compressed: k.compressed });
  // Creating Q from d takes ~25ms, so if it's not created, use native bindings to pre-compute
  if (!result.__Q && secp256k1) {
    result.__Q = ecurve.Point.decodeFrom(curve, secp256k1.publicKeyCreate(k.d.toBuffer(32), false));
  }
  return result;
};

/**
 *  Derive a BIP32 path, given a root key
 *  We cache keys at each level of hierarchy we derive, to avoid re-deriving (approx 25ms per derivation)
 * @param path the path, e.g. 'm/0/0/0/1'
 * @returns {*} the derived hd key
 */
HDNode.prototype.hdPath = function() {
  const cache = {};
  const cachedDerive = (path) => {
    const components = path.split('/').filter((c) => {
      return c !== '';
    });
    // strip any extraneous / characters
    const canonicalPath = components.join('/');
    if (cache[canonicalPath]) {
      return cache[canonicalPath];
    }
    const len = components.length;
    if (len === 0 || len === 1 && components[0] === 'm') {
      return this;
    }
    const parentPath = components.slice(0, len - 1).join('/');
    const parentKey = cachedDerive(parentPath);
    const el = components[len - 1];

    let hardened = false;
    if (el[el.length - 1] === "'") {
      hardened = true;
    }
    const index = parseInt(el);
    let derived;
    if (hardened) {
      derived = parentKey.deriveHardened(index);
    } else {
      derived = parentKey.derive(index);
    }
    cache[canonicalPath] = derived;
    return derived;
  };

  const deriveKey = (path) => {
    return cachedDerive(path).getKey();
  };

  return {
    derive: cachedDerive,
    deriveKey: deriveKey
  };
};

HDNode.prototype.deriveSlow = function(index) {
  try {
    typeforce(types.UInt32, index);
  } catch (e) {
    throw new Error(e.message);
  }

  const isHardened = index >= HDNode.HIGHEST_BIT;
  const data = new Buffer(37);

  // Hardened child
  if (isHardened) {
    if (this.isNeutered()) {
      throw new TypeError('Could not derive hardened child key');
    }

    // data = 0x00 || ser256(kpar) || ser32(index)
    data[0] = 0x00;
    this.keyPair.d.toBuffer(32).copy(data, 1);
    data.writeUInt32BE(index, 33);

    // Normal child
  } else {
    // data = serP(point(kpar)) || ser32(index)
    //      = serP(Kpar) || ser32(index)
    this.keyPair.getPublicKeyBuffer().copy(data, 0);
    data.writeUInt32BE(index, 33);
  }

  const I = crypto.createHmac('sha512', this.chainCode).update(data).digest();
  const IL = I.slice(0, 32);
  const IR = I.slice(32);

  const pIL = BigInteger.fromBuffer(IL);

  // In case parse256(IL) >= n, proceed with the next value for i
  if (pIL.compareTo(curve.n) >= 0) {
    return this.derive(index + 1);
  }

  // Private parent key -> private child key
  let derivedKeyPair;
  if (!this.isNeutered()) {
    // ki = parse256(IL) + kpar (mod n)
    const ki = pIL.add(this.keyPair.d).mod(curve.n);

    // In case ki == 0, proceed with the next value for i
    if (ki.signum() === 0) {
      return this.derive(index + 1);
    }

    derivedKeyPair = new ECPair(ki, null, {
      network: this.keyPair.network
    });

    // Public parent key -> public child key
  } else {
    // Ki = point(parse256(IL)) + Kpar
    //    = G*IL + Kpar
    const Ki = curve.G.multiply(pIL).add(this.keyPair.Q);

    // In case Ki is the point at infinity, proceed with the next value for i
    if (curve.isInfinity(Ki)) {
      return this.derive(index + 1);
    }

    derivedKeyPair = new ECPair(null, Ki, {
      network: this.keyPair.network
    });
  }

  const hd = new HDNode(derivedKeyPair, IR);
  hd.depth = this.depth + 1;
  hd.index = index;
  hd.parentFingerprint = this.getFingerprint().readUInt32BE(0);

  return hd;
};

/**
 * Derive a child HDNode from a parent HDNode and index. Uses secp256k1 to speed
 * up public key derivations by 100x vs. bitcoinjs-lib implementation.
 *
 * @param   {Number} index   child index
 * @returns {HDNode}         derived HDNode
 */
HDNode.prototype.derive = function(index) {
  // no fast path for private key derivations -- delegate to standard method
  if (!secp256k1 || this.keyPair.d) {
    return this.deriveSlow(index);
  }

  const isHardened = index >= HDNode.HIGHEST_BIT;
  if (isHardened) {
    throw new Error('cannot derive hardened key from public key');
  }

  const indexBuffer = new Buffer(4);
  indexBuffer.writeUInt32BE(index, 0);

  const data = Buffer.concat([
    this.keyPair.getPublicKeyBuffer(),
    indexBuffer
  ]);

  const I = crypto.createHmac('sha512', this.chainCode).update(data).digest();
  const IL = I.slice(0, 32);
  const IR = I.slice(32);

  const pIL = BigInteger.fromBuffer(IL);

  // In case parse256(IL) >= n, proceed with the next value for i
  if (pIL.compareTo(curve.n) >= 0) {
    return this.derive(index + 1);
  }

  // The expensive op is the point multiply -- use secp256k1 lib to do that
  const Ki = ecurve.Point.decodeFrom(curve, secp256k1.publicKeyCreate(IL, false)).add(this.keyPair.Q);

  // In case Ki is the point at infinity, proceed with the next value for i
  if (curve.isInfinity(Ki)) {
    return this.derive(index + 1);
  }

  const keyPair = new ECPair(null, Ki, { network: this.keyPair.network });
  const hd = new HDNode(keyPair, IR);

  hd.depth = this.depth + 1;
  hd.index = index;
  hd.parentFingerprint = this.getFingerprint().readUInt32BE(0);

  return hd;
};

HDNode.fromBase58 = function(string, networks = inferredNetworks) {
  const buffer = base58check.decode(string);
  if (buffer.length !== 78) {
    throw new Error('Invalid buffer length');
  }

  // 4 bytes: version bytes
  const version = buffer.readUInt32BE(0);
  let network;

  // list of networks?
  if (Array.isArray(networks)) {
    network = networks.filter((network) => {
      return version === network.bip32.private ||
      version === network.bip32.public
    }).pop();

    if (!network) {
      throw new Error('Unknown network version');
    }

    // otherwise, assume a network object (or default to rmg)
  } else {
    try {
      typeforce(types.maybe(types.Network), networks);
    } catch (e) {
      throw new Error(e.message);
    }
    network = networks || NETWORKS.rmg;
  }

  if (version !== network.bip32.private && version !== network.bip32.public) {
    throw new Error('Invalid network version');
  }

  // 1 byte: depth: 0x00 for master nodes, 0x01 for level-1 descendants, ...
  const depth = buffer[4];

  // 4 bytes: the fingerprint of the parent's key (0x00000000 if master key)
  const parentFingerprint = buffer.readUInt32BE(5);
  if (depth === 0) {
    if (parentFingerprint !== 0x00000000) {
      throw new Error('Invalid parent fingerprint');
    }
  }

  // 4 bytes: child number. This is the number i in xi = xpar/i, with xi the key being serialized.
  // This is encoded in MSB order. (0x00000000 if master key)
  const index = buffer.readUInt32BE(9);
  if (depth === 0 && index !== 0) {
    throw new Error('Invalid index');
  }

  // 32 bytes: the chain code
  const chainCode = buffer.slice(13, 45);
  let keyPair;

  // 33 bytes: private key data (0x00 + k)
  if (version === network.bip32.private) {
    if (buffer.readUInt8(45) !== 0x00) {
      throw new Error('Invalid private key');
    }

    const d = BigInteger.fromBuffer(buffer.slice(46, 78));
    keyPair = new ECPair(d, null, { network: network });

    // 33 bytes: public key data (0x02 + X or 0x03 + X)
  } else {
    const Q = ecurve.Point.decodeFrom(curve, buffer.slice(45, 78));
    // Q.compressed is assumed, if somehow this assumption is broken, `new HDNode` will throw

    // Verify that the X coordinate in the public point corresponds to a point on the curve.
    // If not, the extended public key is invalid.
    curve.validate(Q);

    keyPair = new ECPair(null, Q, { network: network });
  }

  const hd = new HDNode(keyPair, chainCode);
  hd.depth = depth;
  hd.index = index;
  hd.parentFingerprint = parentFingerprint;

  return hd;
};

HDNode.fromSeedBuffer = function(seed, network = NETWORKS.rmg) {
  try {
    typeforce(types.tuple(types.Buffer, types.maybe(types.Network)), arguments);
  } catch (e) {
    throw new Error(e.message);
  }

  if (seed.length < 16) {
    throw new TypeError('Seed should be at least 128 bits');
  }
  if (seed.length > 64) {
    throw new TypeError('Seed should be at most 512 bits');
  }

  const I = crypto.createHmac('sha512', HDNode.MASTER_SECRET).update(seed).digest();
  const IL = I.slice(0, 32);
  const IR = I.slice(32);

  // In case IL is 0 or >= n, the master key is invalid
  // This is handled by the ECPair constructor
  const pIL = BigInteger.fromBuffer(IL);
  const keyPair = new ECPair(pIL, null, {
    network: network
  });

  return new HDNode(keyPair, IR);
};

module.exports = HDNode;
