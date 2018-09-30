const Address = require('./address');
const ADMIN = require('./admin');
const bitcoin = require('bitcoinjs-lib');
const ECPair = require('./ecPair');
const HDNode = require('./hdNode');
const OPS = require('./ops');
const script = require('./script');
const networks = require('./networks');
const Transaction = require('./transaction');
const _ = require('lodash');

const TransactionBuilder = function(network = networks.rmg, maximumFeeRate) {
  this.prevTxMap = {};
  this.network = network;

  // WARNING: This is __NOT__ to be relied on, its just another potential safety mechanism (safety in-depth)
  this.maximumFeeRate = maximumFeeRate || 1000;

  this.inputs = [];
  this.tx = new Transaction()
};
Object.assign(TransactionBuilder, bitcoin.TransactionBuilder);
TransactionBuilder.prototype.__proto__ = bitcoin.TransactionBuilder.prototype;

TransactionBuilder.ADMIN = ADMIN;

const expandInput = (scriptSig) => {
  const scriptSigChunks = bitcoin.script.decompile(scriptSig);

  const pubKeys = scriptSigChunks.filter((_, index) => { return index % 2 === 0; });
  const signatures = scriptSigChunks.filter((_, index) => { return index % 2 === 1; });

  return {
    pubKeys: pubKeys,
    signatures: signatures
  };
};

const buildInput = (input) => {
  const interlace = [];
  input.pubKeys.forEach((pubKey, index) => {
    interlace.push(pubKey, input.signatures[index]);
  });

  const scriptType = bitcoin.script.types.P2WSH;
  const script = bitcoin.script.compile(interlace);
  const witness = [];

  return {
    type: scriptType,
    script: script,
    witness: witness
  }
};

const determineKeyUpdateOpCode = (operation, keyType) => {
  const keyTypes = ADMIN.KEY_TYPES;
  switch (keyType) {
    case keyTypes.ROOT.ISSUANCE_KEY:
      if (operation === ADMIN.OPERATIONS.ADD_KEY) {
        return OPS.ADMIN_OP_ISSUEKEYADD;
      } else if (operation === ADMIN.OPERATIONS.REVOKE_KEY) {
        return OPS.ADMIN_OP_ISSUEKEYREVOKE;
      }
      break;
    case keyTypes.ROOT.PROVISIONING_KEY:
      if (operation === ADMIN.OPERATIONS.ADD_KEY) {
        return OPS.ADMIN_OP_PROVISIONKEYADD;
      } else if (operation === ADMIN.OPERATIONS.REVOKE_KEY) {
        return OPS.ADMIN_OP_PROVISIONKEYREVOKE;
      }
      break;
    case keyTypes.PROVISIONING.VALIDATOR_KEY:
      if (operation === ADMIN.OPERATIONS.ADD_KEY) {
        return OPS.ADMIN_OP_VALIDATEKEYADD;
      } else if (operation === ADMIN.OPERATIONS.REVOKE_KEY) {
        return OPS.ADMIN_OP_VALIDATEKEYREVOKE;
      }
      break;
    case keyTypes.PROVISIONING.ACCOUNT_SERVICE_PROVIDER_KEY:
      if (operation === ADMIN.OPERATIONS.ADD_KEY) {
        return OPS.ADMIN_OP_ASPKEYADD;
      } else if (operation === ADMIN.OPERATIONS.REVOKE_KEY) {
        return OPS.ADMIN_OP_ASPKEYREVOKE;
      }
      break;
  }
  throw new Error('invalid admin key type and operation combination');
};

TransactionBuilder.fromTransaction = function(transaction, network = networks.rmg) {
  const txb = new TransactionBuilder(network);

  // Copy transaction fields
  txb.setVersion(transaction.version);
  txb.setLockTime(transaction.locktime);

  // Copy outputs (done first to avoid signature invalidation)
  transaction.outs.forEach(function (txOut) {
    txb.addOutput(txOut.script, txOut.value);
  });

  // Copy inputs
  transaction.ins.forEach(function (txIn) {
    txb.__addInputUnsafe(txIn.hash, txIn.index, {
      sequence: txIn.sequence,
      script: txIn.script,
      witness: txIn.witness
    });
  });

  return txb;
};

/**
 * Admin Outputs can be either thread continuation outputs, or operation outputs
 * Creates an output delineating the thread
 * Operation outputs are broken down as follows:
 * - Issue and revoke keys (Root thread)
 *   - Provisioning keys (can issue and revoke validator and ASP keys)
 *   - Issuing keys (can issue and destroy funds)
 * - Provision non-root keys (Provisioning thread)
 *   - Validator keys (like mining)
 *   - Account Service Provider keys
 * - Issue funds (Issuing thread)
 */
TransactionBuilder.prototype.addAdminThreadOutput = function(thread) {
  const permissibleThreads = [
    ADMIN.THREADS.ROOT,
    ADMIN.THREADS.PROVISIONING,
    ADMIN.THREADS.ISSUANCE,
  ];
  if (permissibleThreads.indexOf(thread) === -1) {
    throw new Error('invalid admin thread');
  }
  const outputScript = script.compile([script.encodeNumber(thread), OPS.OP_CHECKTHREAD]);
  this.tx.addOutput(outputScript, 0);
};

/**
 * Determined the admin thread output index
 * @return {number}
 */
TransactionBuilder.prototype.getAdminThreadOutputIndex = function() {
  for (let i = 0; i < this.tx.outs.length; i++) {
    const { script } = this.tx.outs[i];
    if (script && script.length === 2 && script[1] === OPS.OP_CHECKTHREAD) {
      return i;
    }
  }
  return -1;
};

/**
 * Determined the admin thread output index
 * @return {number}
 */
TransactionBuilder.prototype.getAdminThreadOutputIndex = function() {
  for (let i = 0; i < this.tx.outs.length; i++) {
    const { script } = this.tx.outs[i];
    if (script && script.length === 2 && script[1] === OPS.OP_CHECKTHREAD) {
      return i;
    }
  }
  return -1;
};

/**
 * Auto-infers the thread based on keyType
 * @param operation (whether it's to provision or to revoke)
 * @param keyType
 * @param publicKey
 * @param keyID
 */
TransactionBuilder.prototype.addKeyUpdateOutput = function(operation, keyType, publicKey, keyID) {
  const permissibleOperations = [
    ADMIN.OPERATIONS.ADD_KEY,
    ADMIN.OPERATIONS.REVOKE_KEY
  ];
  if (permissibleOperations.indexOf(operation) === -1) {
    throw new Error('invalid admin key operation');
  }

  let opCode = determineKeyUpdateOpCode(operation, keyType);
  let bufferLength = 34;
  if (keyType === ADMIN.KEY_TYPES.PROVISIONING.ACCOUNT_SERVICE_PROVIDER_KEY) {
    // we add four bytes for the key id
    bufferLength += 4;
    if (!keyID) {
      throw new Error('key id must not be empty for ASP key provisioning');
    }
  }

  let publicKeyBuffer;
  if (Buffer.isBuffer(publicKey)) {
    publicKeyBuffer = publicKey;
  } else if (publicKey instanceof ECPair) {
    publicKeyBuffer = publicKey.getPublicKeyBuffer();
  } else if (publicKey instanceof HDNode) {
    publicKeyBuffer = publicKey.getPublicKeyBuffer();
  } else if (typeof publicKey === 'string') {
    if (publicKey.startsWith('xpub')) {
      const hdNode = HDNode.fromBase58(publicKey, this.network);
      publicKeyBuffer = hdNode.getPublicKeyBuffer();
    } else {
      const ecPair = ECPair.fromPublicKeyBuffer(Buffer.from(publicKey, 'hex'), this.network);
      publicKeyBuffer = ecPair.getPublicKeyBuffer();
    }
  } else {
    throw new Error('publicKey needs to be hex or xpub String, or instance of Buffer, ECPair, or HDNode');
  }

  const subScript = Buffer.alloc(bufferLength);
  subScript[0] = opCode;
  publicKeyBuffer.copy(subScript, 1);

  // the buffer length is longer by 4 bytes, totaling 38, for the key id
  if (bufferLength === 38 && keyID) {
    subScript.writeUInt32LE(keyID, 34);
  }

  const scripts = [OPS.OP_RETURN, subScript];
  const scriptBuffer = script.compile(scripts);

  this.tx.addOutput(scriptBuffer, 0);
};

TransactionBuilder.prototype.addFundDestructionOutput = function(amount) {
  this.tx.addOutput(script.compile([OPS.OP_RETURN]), amount);
};


TransactionBuilder.prototype.__addInputUnsafe = function(txHash, vout, options) {
  if (Transaction.isCoinbaseHash(txHash)) {
    throw new Error('coinbase inputs not supported')
  }

  const prevTxOut = txHash.toString('hex') + ':' + vout;
  if (this.prevTxMap[prevTxOut] !== undefined) {
    throw new Error('Duplicate TxOut: ' + prevTxOut);
  }

  let input = {};

  // derive what we can from the scriptSig
  if (options.script !== undefined) {
    input = expandInput(options.script, options.witness);
  }

  // if an input value was given, retain it
  if (options.value !== undefined) {
    input.value = options.value;
  }

  // derive what we can from the previous transactions output script
  if (!input.prevOutScript && options.prevOutScript) {
    let prevOutType;

    if (!input.pubKeys && !input.signatures) {
      const expanded = expandOutput(options.prevOutScript);

      if (expanded.pubKeys) {
        input.pubKeys = expanded.pubKeys;
        input.signatures = expanded.signatures;
      }

      prevOutType = expanded.scriptType;
    }

    input.prevOutScript = options.prevOutScript;
    input.prevOutType = prevOutType || bitcoin.script.classifyOutput(options.prevOutScript);
  }

  input.pubKeys = input.pubKeys || [];
  input.signatures = input.signatures || [];

  const vin = this.tx.addInput(txHash, vout, options.sequence, options.scriptSig);
  this.inputs[vin] = input;
  this.prevTxMap[prevTxOut] = vin;

  return vin;
};

TransactionBuilder.prototype.addOutput = function(scriptPubKey, value) {
  if (!this.__canModifyOutputs()) {
    throw new Error('No, this would invalidate signatures')
  }

  // Attempt to get a script if it's a base58 address string
  if (typeof scriptPubKey === 'string') {
    scriptPubKey = Address.fromBase58(scriptPubKey).toScript();
  } else if (scriptPubKey instanceof Address) {
    scriptPubKey = scriptPubKey.toScript();
  }

  return this.tx.addOutput(scriptPubKey, value)
};

TransactionBuilder.prototype.signWithTx = function(vin, keyPair, prevOutTx) {
  // ready to sign
  if (!(prevOutTx instanceof Transaction)) {
    throw new Error('prevOutTx needs to be instance of Transaction');
  }
  const currentIn = this.tx.ins[vin];
  const referencedTxId = Buffer.from(currentIn.hash).reverse().toString('hex');
  const actualTxId = prevOutTx.getId();
  if (referencedTxId !== actualTxId) {
    throw new Error('unexpected prevOutTx with id ' + actualTxId + ', as opposed to expected ' + referencedTxId);
  }
  const previousOutputIndex = currentIn.index;
  const prevOut = prevOutTx.outs[previousOutputIndex];
  const witnessValue = prevOut.value;

  return this.sign(vin, keyPair, null, witnessValue);
};

TransactionBuilder.prototype.sign = function(vin, keyPair, redeemScript, redeemValue) {
  if (!(keyPair instanceof ECPair)) {
    throw new Error('keyPair needs to be instance of ECPair');
  }
  if (!_.isEqual(keyPair.network, this.network)) {
    throw new Error('Inconsistent network');
  }
  if (!this.inputs[vin]) {
    throw new Error('No input at index: ' + vin);
  }
  const hashType = Transaction.SIGHASH_ALL;

  const input = this.inputs[vin];

  const kpPubKey = keyPair.getPublicKeyBuffer();

  const signatureHash = this.tx.hashForWitnessV0(vin, redeemScript, redeemValue, hashType);

  const signature = keyPair.sign(signatureHash).toScriptSignature(hashType);
  input.pubKeys.push(kpPubKey);
  input.signatures.push(signature);
};

TransactionBuilder.prototype.__build = function(allowIncomplete) {
  if (!allowIncomplete) {
    if (!this.tx.ins.length) {
      throw new Error('Transaction has no inputs');
    }
    if (!this.tx.outs.length) {
      throw new Error('Transaction has no outputs');
    }
  }

  const tx = this.tx.clone();
  // Create script signatures from inputs
  this.inputs.forEach((input, i) => {
    const isIncompleteAztec = ((input.pubKeys.length !== input.signatures.length) || input.signatures.length < 2);
    if (isIncompleteAztec && !allowIncomplete) {
      throw new Error('Transaction is not complete');
    }
    const result = buildInput(input, allowIncomplete);

    tx.setInputScript(i, result.script);
    tx.setWitness(i, result.witness);
  });

  if (!allowIncomplete) {
    // do not rely on this, its merely a last resort
    if (this.__overMaximumFees(tx.byteLength())) {
      throw new Error('Transaction has absurd fees');
    }
  }

  return tx;
};

module.exports = TransactionBuilder;
