const assert = require('assert');
const bitcoin = require('bitcoinjs-lib');
const prova = require('../index');
const should = require('should');

describe('ECPair', function() {
  it('from private key hex', function() {
    const ecPair = prova.ECPair.fromPrivateKeyBuffer(new Buffer('cda581325f479030593b10dedd9c9337b508ebb302b6a8693f5d5fe05d42a08b', 'hex'));

    const pubHex = ecPair.getPublicKeyBuffer().toString('hex');
    const prvHex = ecPair.getPrivateKeyBuffer().toString('hex');

    pubHex.should.eql('03e074dfee36563d83eaf4c4cf54f31daf92f976a45fa0258778828d7ee36ef7ce');
    prvHex.should.eql('cda581325f479030593b10dedd9c9337b508ebb302b6a8693f5d5fe05d42a08b');
    assert(ecPair.__Q);
  });

  it('should be able to generate both xpub and xprv', function() {
    const ecPair = prova.ECPair.makeRandom();

    ecPair.getPrivateKeyBuffer().length.should.eql(32);
    ecPair.getPublicKeyBuffer().length.should.eql(33);

    const prvHex = ecPair.getPrivateKeyBuffer().toString('hex');
    const pubHex = ecPair.getPublicKeyBuffer().toString('hex');

    prvHex.length.should.be.greaterThan(60);
    pubHex.length.should.be.greaterThan(60);
    assert(ecPair.__Q);
  });

  it('lengths should be zero padded', function() {
    const xprv = 'xprv9s21ZrQH143K2wzTkqpwwJguJVpxDqq78RCRmq8aVtmPVLd1BZTx2jqEDdu5Xnd9532qefTXYeZFoJN3zBDn7ipkHtL9accNqQP1Nrwgndn';

    const hdNode = prova.HDNode.fromBase58(xprv);
    const ecKey = hdNode.getKey();

    ecKey.getPrivateKeyBuffer().length.should.eql(32);
    ecKey.getPublicKeyBuffer().length.should.eql(33);
    const prvHex = ecKey.getPrivateKeyBuffer().toString('hex');
    const pubHex = ecKey.getPublicKeyBuffer().toString('hex');
    assert(ecKey.__Q);
  });

  it('test public key length', function() {
    for (let i = 0; i < 50; i++) {
      const ecPair = prova.ECPair.makeRandom();
      const publicKey = ecPair.getPublicKeyBuffer();
      if (publicKey.length !== 33) {
        throw new Error('invalid public key buffer length');
      }
    }
  });
});
