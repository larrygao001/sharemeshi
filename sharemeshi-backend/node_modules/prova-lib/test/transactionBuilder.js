const assert = require('assert');
const bitcoin = require('bitcoinjs-lib');
const prova = require('../index');
const should = require('should');

describe('Transaction Builder', function() {
  it('should sign unsigned transaction', function() {
    const txHex = '01000000018ff8476a60aaf5af8fb9fcf76430e07d53c8d3be512c78ebd42456711dddf9a60000000000ffffffff0100f2052a010000001d521435dbbf04bca061e49dace08f858d8775c0a57c8e030000015153ba00000000';
    const transaction = prova.Transaction.fromHex(txHex);
    const txid = transaction.getId();
    assert.strictEqual(txid, 'dae902f2224fce1d0c482b1d0c65b29d3e36c419d15e2a714d163edce7b10280');
    const builder = prova.TransactionBuilder.fromTransaction(transaction, prova.networks.rmg);
    assert.strictEqual(builder.inputs.length, 1);
    const input = builder.inputs[0];
    assert.strictEqual(input.pubKeys.length, 0);
    assert.strictEqual(input.signatures.length, 0);
    // obtain signing prerequisites
    const keyPair1 = prova.ECPair.fromPrivateKeyBuffer(new Buffer('eaf02ca348c524e6392655ba4d29603cd1a7347d9d65cfe93ce1ebffdca22694', 'hex'), prova.networks.rmg);
    const coinbase = prova.Transaction.fromHex('01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0d510b2f503253482f627463642fffffffff0200f2052a010000001d521435dbbf04bca061e49dace08f858d8775c0a57c8e030000015153ba0000000000000000026a5100000000');
    builder.signWithTx(0, keyPair1, coinbase);
    // signatures should now be extended
    assert.strictEqual(input.pubKeys.length, 1);
    assert.strictEqual(input.signatures.length, 1);
    assert.strictEqual(input.pubKeys[0].length, 33);
    assert.strictEqual(input.signatures[0].length, 71);
    const halfSignedHex = '01000000018ff8476a60aaf5af8fb9fcf76430e07d53c8d3be512c78ebd42456711dddf9a6000000006a21025ceeba2ab4a635df2c0301a3d773da06ac5a18a7c3e0d09a795d7e57d233edf14730440220419c3c5f24da5709f946de50844bc3209f1bb0c6e916b9217795d0602b2cfe82022047e94c4ebe2fdc199c947ec577603ea8885f654f8c07b2aeb224ed0e075e7c1a01ffffffff0100f2052a010000001d521435dbbf04bca061e49dace08f858d8775c0a57c8e030000015153ba00000000';
    const incompleteTx = builder.buildIncomplete();
    assert.strictEqual(incompleteTx.getId(), txid);
    assert.strictEqual(incompleteTx.toHex(), halfSignedHex);

    // should verify first signature
    const sigScript = incompleteTx.ins[0].script;
    const scriptComponents = prova.script.decompile(sigScript);
    const signature = scriptComponents[1];
    const signatureHash = transaction.hashForWitnessV0(0, null, coinbase.outs[0].value, prova.Transaction.SIGHASH_ALL);
    const isValidSignature = keyPair1.verify(signatureHash, signature);
    assert.strictEqual(isValidSignature, true);

    // add second signature
    const keyPair2 = prova.ECPair.fromPrivateKeyBuffer(new Buffer('2b8c52b77b327c755b9b375500d3f4b2da9b0a1ff65f6891d311fe94295bc26a', 'hex'), prova.networks.rmg);
    builder.signWithTx(0, keyPair2, coinbase);
    // signatures should now be extended
    assert.strictEqual(input.pubKeys.length, 2);
    assert.strictEqual(input.signatures.length, 2);
    assert.strictEqual(input.pubKeys[1].length, 33);
    assert.strictEqual(input.signatures[1].length, 72);
    const fullySignedHex = '01000000018ff8476a60aaf5af8fb9fcf76430e07d53c8d3be512c78ebd42456711dddf9a600000000d521025ceeba2ab4a635df2c0301a3d773da06ac5a18a7c3e0d09a795d7e57d233edf14730440220419c3c5f24da5709f946de50844bc3209f1bb0c6e916b9217795d0602b2cfe82022047e94c4ebe2fdc199c947ec577603ea8885f654f8c07b2aeb224ed0e075e7c1a0121038ef4a121bcaf1b1f175557a12896f8bc93b095e84817f90e9a901cd2113a8202483045022100cf6591cec506de7293ee31e91f6dcc2836daff8b38730234b776dd2496708a980220047b14829e565656a69cbd6f7dadd4b6c7eda010a0dee1ec68c3c6ac93d6f52601ffffffff0100f2052a010000001d521435dbbf04bca061e49dace08f858d8775c0a57c8e030000015153ba00000000';
    assert.strictEqual(builder.build().toHex(), fullySignedHex);
  });


  it('should half-sign and recover unsigned transaction with padding-optional HDNode', function() {
    const txHex = '01000000018ff8476a60aaf5af8fb9fcf76430e07d53c8d3be512c78ebd42456711dddf9a60000000000ffffffff0100f2052a010000001d521435dbbf04bca061e49dace08f858d8775c0a57c8e030000015153ba00000000';
    const transaction = prova.Transaction.fromHex(txHex);
    const builder = prova.TransactionBuilder.fromTransaction(transaction, prova.networks.rmg);
    assert.strictEqual(builder.inputs.length, 1);
    const input = builder.inputs[0];
    assert.strictEqual(input.pubKeys.length, 0);
    assert.strictEqual(input.signatures.length, 0);
    // obtain signing prerequisites
    const keyPair1 = prova.HDNode.fromBase58('xprv9s21ZrQH143K2wzTkqpwwJguJVpxDqq78RCRmq8aVtmPVLd1BZTx2jqEDdu5Xnd9532qefTXYeZFoJN3zBDn7ipkHtL9accNqQP1Nrwgndn', prova.networks.rmg)
    .getKey();
    const coinbase = prova.Transaction.fromHex('01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0d510b2f503253482f627463642fffffffff0200f2052a010000001d521435dbbf04bca061e49dace08f858d8775c0a57c8e030000015153ba0000000000000000026a5100000000');
    builder.signWithTx(0, keyPair1, coinbase);
    // signatures should now be extended
    assert.strictEqual(input.pubKeys.length, 1);
    assert.strictEqual(input.signatures.length, 1);
    assert.strictEqual(input.pubKeys[0].length, 33);
    assert.strictEqual(input.signatures[0].length, 71);
    const halfSignedHex = '01000000018ff8476a60aaf5af8fb9fcf76430e07d53c8d3be512c78ebd42456711dddf9a6000000006a2103b9b9b2045f7fb10b26e9047f7cbe392be7dad7e5633ecbb4b12944f1d430938c47304402201bcbeedda20d454b79fab03dec1ce2e41adf52a6fdb031a3d54c10f811747b0d02202f4a0c58bea219678ed58dd7039803ed2bdaf8b2ac6aa1e5f126468c05ac1c5601ffffffff0100f2052a010000001d521435dbbf04bca061e49dace08f858d8775c0a57c8e030000015153ba00000000';
    assert.strictEqual(builder.buildIncomplete().toHex(), halfSignedHex);

    const recoveredTx = prova.Transaction.fromHex(halfSignedHex);
    const recoveredBuilder = prova.TransactionBuilder.fromTransaction(recoveredTx);
    assert.strictEqual(recoveredBuilder.inputs.length, 1);
    assert.strictEqual(recoveredBuilder.inputs[0].pubKeys.length, 1);
    assert.strictEqual(recoveredBuilder.inputs[0].signatures.length, 1);
    assert.strictEqual(recoveredBuilder.inputs[0].pubKeys[0].toString('hex'), keyPair1.getPublicKeyBuffer()
    .toString('hex'));
  });

  it('should build a transaction from scratch', function() {
    const builder = new prova.TransactionBuilder(prova.networks.rmg);
    const coinbase = prova.Transaction.fromHex('01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0d510b2f503253482f627463642fffffffff0200f2052a010000001d521435dbbf04bca061e49dace08f858d8775c0a57c8e030000015153ba0000000000000000026a5100000000');
    builder.addInput(coinbase.getId(), 0, 0xffffffff);
    builder.addOutput('GDLPrZnvGXwGcrAZgMWnfXbTnfnboo7kAs9xeHBRafcCS', 5000000000);
    const unsignedHex = '01000000018ff8476a60aaf5af8fb9fcf76430e07d53c8d3be512c78ebd42456711dddf9a60000000000ffffffff0100f2052a010000001d521435dbbf04bca061e49dace08f858d8775c0a57c8e030000015153ba00000000';
    assert.strictEqual(builder.buildIncomplete().toHex(), unsignedHex);
    // obtain signing prerequisites
    const keyPair1 = prova.ECPair.fromPrivateKeyBuffer(new Buffer('eaf02ca348c524e6392655ba4d29603cd1a7347d9d65cfe93ce1ebffdca22694', 'hex'), prova.networks.rmg);
    builder.signWithTx(0, keyPair1, coinbase);
    const halfSignedHex = '01000000018ff8476a60aaf5af8fb9fcf76430e07d53c8d3be512c78ebd42456711dddf9a6000000006a21025ceeba2ab4a635df2c0301a3d773da06ac5a18a7c3e0d09a795d7e57d233edf14730440220419c3c5f24da5709f946de50844bc3209f1bb0c6e916b9217795d0602b2cfe82022047e94c4ebe2fdc199c947ec577603ea8885f654f8c07b2aeb224ed0e075e7c1a01ffffffff0100f2052a010000001d521435dbbf04bca061e49dace08f858d8775c0a57c8e030000015153ba00000000';
    assert.strictEqual(builder.buildIncomplete().toHex(), halfSignedHex);
  });

  describe('Compatibility', function(){
    it('should not overwrite bitcoinjs-lib methods', function(){
      const txHex = '01000000018ff8476a60aaf5af8fb9fcf76430e07d53c8d3be512c78ebd42456711dddf9a60000000000ffffffff0100f2052a010000001d521435dbbf04bca061e49dace08f858d8775c0a57c8e030000015153ba00000000';
      const transaction = bitcoin.Transaction.fromHex(txHex);

      const bitcoinBuilder = bitcoin.TransactionBuilder.fromTransaction(transaction);
      bitcoinBuilder.network.should.not.equal(prova.networks.rmg);
      bitcoinBuilder.network.should.not.equal(prova.networks.rmgTest);
    });
  });
});
