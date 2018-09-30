const assert = require('assert');
const prova = require('../index');
const bitcoin = require('bitcoinjs-lib');
const _ = require('lodash');

describe('Address', function() {

  const keyIDs = [33554432, 16777216];

  it('validates p2pk uncompressed', function() {
    const network = 0;
    const publicKey = new Buffer([0x04, 0x11, 0xdb, 0x93, 0xe1, 0xdc, 0xdb, 0x8a, 0x01, 0x6b,
      0x49, 0x84, 0x0f, 0x8c, 0x53, 0xbc, 0x1e, 0xb6, 0x8a, 0x38,
      0x2e, 0x97, 0xb1, 0x48, 0x2e, 0xca, 0xd7, 0xb1, 0x48, 0xa6,
      0x90, 0x9a, 0x5c, 0xb2, 0xe0, 0xea, 0xdd, 0xfb, 0x84, 0xcc,
      0xf9, 0x74, 0x44, 0x64, 0xf8, 0x2e, 0x16, 0x0b, 0xfa, 0x9b,
      0x8b, 0x64, 0xf9, 0xd4, 0xc0, 0x3f, 0x99, 0x9b, 0x86, 0x43,
      0xf6, 0x56, 0xb4, 0x12, 0xa3]);
    const address = '12cbQLTFMXRnSzktFkuoG3eHoMeFtpTu3S';

    // serialize public key (compressed vs uncompressed)
    const keyPair = prova.ECPair.fromPublicKeyBuffer(publicKey, prova.networks.rmg);
    const publicKeyHash = bitcoin.crypto.hash160(keyPair.getPublicKeyBuffer());

    const base58Output = bitcoin.address.toBase58Check(publicKeyHash, network);
    assert.strictEqual(address, base58Output);
  });

  it('validates mainnet p2sh', function() {
    const network = 0x05;
    const script = new Buffer([0x52, 0x41, 0x04, 0x91, 0xbb, 0xa2, 0x51, 0x09, 0x12, 0xa5,
      0xbd, 0x37, 0xda, 0x1f, 0xb5, 0xb1, 0x67, 0x30, 0x10, 0xe4,
      0x3d, 0x2c, 0x6d, 0x81, 0x2c, 0x51, 0x4e, 0x91, 0xbf, 0xa9,
      0xf2, 0xeb, 0x12, 0x9e, 0x1c, 0x18, 0x33, 0x29, 0xdb, 0x55,
      0xbd, 0x86, 0x8e, 0x20, 0x9a, 0xac, 0x2f, 0xbc, 0x02, 0xcb,
      0x33, 0xd9, 0x8f, 0xe7, 0x4b, 0xf2, 0x3f, 0x0c, 0x23, 0x5d,
      0x61, 0x26, 0xb1, 0xd8, 0x33, 0x4f, 0x86, 0x41, 0x04, 0x86,
      0x5c, 0x40, 0x29, 0x3a, 0x68, 0x0c, 0xb9, 0xc0, 0x20, 0xe7,
      0xb1, 0xe1, 0x06, 0xd8, 0xc1, 0x91, 0x6d, 0x3c, 0xef, 0x99,
      0xaa, 0x43, 0x1a, 0x56, 0xd2, 0x53, 0xe6, 0x92, 0x56, 0xda,
      0xc0, 0x9e, 0xf1, 0x22, 0xb1, 0xa9, 0x86, 0x81, 0x8a, 0x7c,
      0xb6, 0x24, 0x53, 0x2f, 0x06, 0x2c, 0x1d, 0x1f, 0x87, 0x22,
      0x08, 0x48, 0x61, 0xc5, 0xc3, 0x29, 0x1c, 0xcf, 0xfe, 0xf4,
      0xec, 0x68, 0x74, 0x41, 0x04, 0x8d, 0x24, 0x55, 0xd2, 0x40,
      0x3e, 0x08, 0x70, 0x8f, 0xc1, 0xf5, 0x56, 0x00, 0x2f, 0x1b,
      0x6c, 0xd8, 0x3f, 0x99, 0x2d, 0x08, 0x50, 0x97, 0xf9, 0x97,
      0x4a, 0xb0, 0x8a, 0x28, 0x83, 0x8f, 0x07, 0x89, 0x6f, 0xba,
      0xb0, 0x8f, 0x39, 0x49, 0x5e, 0x15, 0xfa, 0x6f, 0xad, 0x6e,
      0xdb, 0xfb, 0x1e, 0x75, 0x4e, 0x35, 0xfa, 0x1c, 0x78, 0x44,
      0xc4, 0x1f, 0x32, 0x2a, 0x18, 0x63, 0xd4, 0x62, 0x13, 0x53,
      0xae]);
    const ripemdHash = bitcoin.crypto.hash160(script);

    const address = '3QJmV3qfvL9SuYo34YihAf3sRCW3qSinyC';
    const base58Output = bitcoin.address.toBase58Check(ripemdHash, network);
    assert.strictEqual(address, base58Output);
  });

  it('validates mainnet p2pk from compressed form', function() {
    const network = 0;
    const publicKey = new Buffer([0x02, 0x19, 0x2d, 0x74, 0xd0, 0xcb, 0x94, 0x34, 0x4c, 0x95,
      0x69, 0xc2, 0xe7, 0x79, 0x01, 0x57, 0x3d, 0x8d, 0x79, 0x03,
      0xc3, 0xeb, 0xec, 0x3a, 0x95, 0x77, 0x24, 0x89, 0x5d, 0xca,
      0x52, 0xc6, 0xb4]);

    const keyPair = prova.ECPair.fromPublicKeyBuffer(publicKey, prova.networks.rmg);

    const encodedPublicKey = keyPair.__Q.getEncoded(true);
    const encodedUncompressedPublicKey = keyPair.__Q.getEncoded(false);

    const publicKeyHash = bitcoin.crypto.hash160(encodedPublicKey);

    const address = '13CG6SJ3yHUXo4Cr2RY4THLLJrNFuG3gUg';
    const base58Output = bitcoin.address.toBase58Check(publicKeyHash, network);
    assert.strictEqual(address, base58Output);
  });

  it('validates p2pk compressed', function() {
    const network = 0;
    const publicKey = new Buffer([0x02, 0x19, 0x2d, 0x74, 0xd0, 0xcb, 0x94, 0x34, 0x4c, 0x95,
      0x69, 0xc2, 0xe7, 0x79, 0x01, 0x57, 0x3d, 0x8d, 0x79, 0x03,
      0xc3, 0xeb, 0xec, 0x3a, 0x95, 0x77, 0x24, 0x89, 0x5d, 0xca,
      0x52, 0xc6, 0xb4]);
    const address = '13CG6SJ3yHUXo4Cr2RY4THLLJrNFuG3gUg';

    // serialize public key (compressed vs uncompressed)
    const keyPair = prova.ECPair.fromPublicKeyBuffer(publicKey, prova.networks.rmg);

    const encodedPublicKey = keyPair.__Q.getEncoded(true);

    const publicKeyHash = bitcoin.crypto.hash160(encodedPublicKey);

    const base58Output = bitcoin.address.toBase58Check(publicKeyHash, network);
    assert.strictEqual(address, base58Output);
  });

  it('validates simple base58 p2pkh', function() {
    const network = 0;
    const hash = new Buffer([0, 248, 21, 176, 54, 217, 187, 188, 229, 233, 242, 160, 10, 189, 27, 243, 220, 145, 233, 85]);
    const address = '1168CEFoizsV7JXqPsQ83fJ9bVvkDWGy8s';
    const base58Output = bitcoin.address.toBase58Check(hash, network);
    assert.strictEqual(address, base58Output);
  });

  it('validates simple base58 p2sh', function() {
    const network = 5;
    const hash = new Buffer([0, 248, 21, 176, 54, 217, 187, 188, 229, 233, 242, 160, 10, 189, 27, 243, 220, 145, 233, 85]);
    const address = '31n97mkFGuBsCUEGWy4iUHf5k2DTkCp7XD';
    const base58Output = bitcoin.address.toBase58Check(hash, network);
    assert.strictEqual(address, base58Output);
  });

  it('validates p2sh', function() {
    const script = new Buffer([
      0x52, 0x41, 0x04, 0x91, 0xbb, 0xa2, 0x51, 0x09, 0x12, 0xa5,
      0xbd, 0x37, 0xda, 0x1f, 0xb5, 0xb1, 0x67, 0x30, 0x10, 0xe4,
      0x3d, 0x2c, 0x6d, 0x81, 0x2c, 0x51, 0x4e, 0x91, 0xbf, 0xa9,
      0xf2, 0xeb, 0x12, 0x9e, 0x1c, 0x18, 0x33, 0x29, 0xdb, 0x55,
      0xbd, 0x86, 0x8e, 0x20, 0x9a, 0xac, 0x2f, 0xbc, 0x02, 0xcb,
      0x33, 0xd9, 0x8f, 0xe7, 0x4b, 0xf2, 0x3f, 0x0c, 0x23, 0x5d,
      0x61, 0x26, 0xb1, 0xd8, 0x33, 0x4f, 0x86, 0x41, 0x04, 0x86,
      0x5c, 0x40, 0x29, 0x3a, 0x68, 0x0c, 0xb9, 0xc0, 0x20, 0xe7,
      0xb1, 0xe1, 0x06, 0xd8, 0xc1, 0x91, 0x6d, 0x3c, 0xef, 0x99,
      0xaa, 0x43, 0x1a, 0x56, 0xd2, 0x53, 0xe6, 0x92, 0x56, 0xda,
      0xc0, 0x9e, 0xf1, 0x22, 0xb1, 0xa9, 0x86, 0x81, 0x8a, 0x7c,
      0xb6, 0x24, 0x53, 0x2f, 0x06, 0x2c, 0x1d, 0x1f, 0x87, 0x22,
      0x08, 0x48, 0x61, 0xc5, 0xc3, 0x29, 0x1c, 0xcf, 0xfe, 0xf4,
      0xec, 0x68, 0x74, 0x41, 0x04, 0x8d, 0x24, 0x55, 0xd2, 0x40,
      0x3e, 0x08, 0x70, 0x8f, 0xc1, 0xf5, 0x56, 0x00, 0x2f, 0x1b,
      0x6c, 0xd8, 0x3f, 0x99, 0x2d, 0x08, 0x50, 0x97, 0xf9, 0x97,
      0x4a, 0xb0, 0x8a, 0x28, 0x83, 0x8f, 0x07, 0x89, 0x6f, 0xba,
      0xb0, 0x8f, 0x39, 0x49, 0x5e, 0x15, 0xfa, 0x6f, 0xad, 0x6e,
      0xdb, 0xfb, 0x1e, 0x75, 0x4e, 0x35, 0xfa, 0x1c, 0x78, 0x44,
      0xc4, 0x1f, 0x32, 0x2a, 0x18, 0x63, 0xd4, 0x62, 0x13, 0x53,
      0xae
    ]);

    // calculate the script's ripemd160(sha256())
    const ripemdHash = bitcoin.crypto.hash160(script);
    const base58Output = bitcoin.address.toBase58Check(ripemdHash, 5);
    const address = '3QJmV3qfvL9SuYo34YihAf3sRCW3qSinyC';
    assert.strictEqual(address, base58Output);
  });

  it('assembles Prova address', function() {
    const keyHash = new Buffer([0, 248, 21, 176, 54, 217, 187, 188, 229, 233, 242, 160, 10, 189, 27, 243, 220, 145, 233, 85]);
    const network = prova.networks.rmg;
    const inputBuffer = new Buffer(2 * 4 + 20); // keyID is 4, and key hash is 20
    inputBuffer.fill(0);
    keyHash.copy(inputBuffer, 0);
    inputBuffer.writeUInt32LE(keyIDs[0], 20);
    inputBuffer.writeUInt32LE(keyIDs[1], 24);
    const address = 'G9mwJwfrhveVw4kjLYaQymjxiH3xXp9VdzXdW5QeyFcTy';
    const aztecAddress = prova.Address.fromBuffer(inputBuffer, network);
    const base58Output = aztecAddress.toString();
    assert.strictEqual(address, base58Output);
  });

  it('assembles Prova address from function', function() {
    const publicKey = new Buffer([0x02, 0x19, 0x2d, 0x74, 0xd0, 0xcb, 0x94, 0x34, 0x4c, 0x95,
      0x69, 0xc2, 0xe7, 0x79, 0x01, 0x57, 0x3d, 0x8d, 0x79, 0x03,
      0xc3, 0xeb, 0xec, 0x3a, 0x95, 0x77, 0x24, 0x89, 0x5d, 0xca,
      0x52, 0xc6, 0xb4]);

    const aztecAddress = new prova.Address(publicKey, keyIDs, prova.networks.rmg);
    const addressString = 'GBL76k8VZUsqrLgomr3sY657AF4Bk5qm836nH266nv1yY';
    assert.strictEqual(addressString, aztecAddress.toString());
  });

  it('constructor bad args', function() {
    assert.throws(function() { new prova.Address(null, null) });
    assert.throws(function() { new prova.Address(null, []) });
    assert.throws(function() { new prova.Address(null, [1]) });
    assert.throws(function() { new prova.Address(null, _.range(0, 20)) });
    assert.throws(function() { new prova.Address(null, [-1, -2]) });
    assert.throws(function() { new prova.Address(null, [0, 'a']) });
  });

  it('assembles maximal Prova address', function() {
    const k = prova.ECPair.fromPublicKeyBuffer(new Buffer('02b62b464b50898b00ac470eb9ef2f68531b78322c9510ea71b9e6c69ac610d273', 'hex'));
    const address = new prova.Address(k, _.range(0, 19));
    assert.strictEqual(address.toString(), '9ubeG9ULdd1M9QY7zUjFBPwAQiwFzBh2o9hjg3ezZnbGzm1pqvHTj2cSSaiku9txCyLmBoSWrmoGpyq1VbNRZ6QVPzweS7s1LoeGbdtwe5BcdC8tzeXmg8NYQ4d7z5iY28mT85Sqxk');
    const addr2 = prova.Address.fromBase58('9ubeG9ULdd1M9QY7zUjFBPwAQiwFzBh2o9hjg3ezZnbGzm1pqvHTj2cSSaiku9txCyLmBoSWrmoGpyq1VbNRZ6QVPzweS7s1LoeGbdtwe5BcdC8tzeXmg8NYQ4d7z5iY28mT85Sqxk');
    assert.strictEqual(address.publicKeyHash.toString('hex'), addr2.publicKeyHash.toString('hex'));
    assert.strictEqual(addr2.toString(), address.toString());
  });

  it('fails to assemble irregular maximal Prova address', function() {
    const k = prova.ECPair.fromPublicKeyBuffer(new Buffer('02b62b464b50898b00ac470eb9ef2f68531b78322c9510ea71b9e6c69ac610d273', 'hex'));
    const address = new prova.Address(k, _.range(0, 19));
    address.signatureCount = 5;
    assert.throws(() => {
      address.toString();
    });

    // should be able to generate output script
    const script = address.toScript();
    const recoveredAddress = prova.Address.fromScript(script);
    assert.strictEqual(recoveredAddress.getNeededSignatureCount(), 5);
    const newScript = recoveredAddress.toScript();
    assert.strictEqual(script.toString('hex'), newScript.toString('hex'));
  });

  it('assembles Prova address with HDNode', function() {
    const hdNode = prova.HDNode.fromSeedBuffer(new Buffer('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz'), prova.networks.rmg);
    const aztecAddress = new prova.Address(hdNode, keyIDs, prova.networks.rmg);
    const addressString = 'GCpCNnjoNyt9TPo9Rfu6MLtNDX47ELbqdDU6z5joF7nhS';
    assert.strictEqual(addressString, aztecAddress.toString());
  });

  it('assembles Prova address with HDNode from base58', function() {
    const xpub = 'xpub661MyMwAqRbcFXFu3j49biFNZYZmPALfK3yPei94zrJfyZy38yNs6VmWy65VouoMMAiQ5ZyS131M7i4RWXa88VUdTfduuH3FFRxNMpPfTSY';
    const hdNode = prova.HDNode.fromBase58(xpub);
    const aztecAddress = new prova.Address(hdNode, keyIDs, prova.networks.rmg);
    const addressString = 'GFDFqYMcz4MhzeQvaosNDVKazDx9yQ8TzqtianpbN1SFc';
    assert.strictEqual(addressString, aztecAddress.toString());
  });

  it('assembles Prova address with xpub', function() {
    const xpub = 'xpub661MyMwAqRbcFXFu3j49biFNZYZmPALfK3yPei94zrJfyZy38yNs6VmWy65VouoMMAiQ5ZyS131M7i4RWXa88VUdTfduuH3FFRxNMpPfTSY';
    const aztecAddress = new prova.Address(xpub, keyIDs, prova.networks.rmg);
    const addressString = 'GFDFqYMcz4MhzeQvaosNDVKazDx9yQ8TzqtianpbN1SFc';
    assert.strictEqual(addressString, aztecAddress.toString());
  });

  it('assembles Prova address with xpub and xprv', function() {
    const xprv = 'xprv9s21ZrQH143K3YbWtKTYyi6qx9FT14u5wowHU13pxS12jT84hhA8gNdZHL28iyfSAkd4sAiRanRwzJ3bRykUvmwDMAKp9gFwRAAmLuBpULA';
    const xpub = 'xpub661MyMwAqRbcG2fyzLzZLr3aWB5wQXcwK2rtGPTSWmY1cFTDFEUPEAx38dBg9TxiKxEQQTAr3Nfyy25VqYFzg5d2E5J95D9XxVbVq5BsF3Z';
    const aztecAddress1 = new prova.Address(xpub, keyIDs, prova.networks.rmg);
    const aztecAddress2 = new prova.Address(xprv, keyIDs, prova.networks.rmg);
    const addressString = 'GHhkNgqmMjwUjVYmsRjW281HhFRXuSX5cuFQc4C88Esyi';
    assert.strictEqual(aztecAddress1.toString(), aztecAddress2.toString());
    assert.strictEqual(addressString, aztecAddress1.toString());
  });

  it('assembles Prova address with ECPair from private and public keys', function() {
    const xprv = 'xprv9s21ZrQH143K3YbWtKTYyi6qx9FT14u5wowHU13pxS12jT84hhA8gNdZHL28iyfSAkd4sAiRanRwzJ3bRykUvmwDMAKp9gFwRAAmLuBpULA';
    const xpub = 'xpub661MyMwAqRbcG2fyzLzZLr3aWB5wQXcwK2rtGPTSWmY1cFTDFEUPEAx38dBg9TxiKxEQQTAr3Nfyy25VqYFzg5d2E5J95D9XxVbVq5BsF3Z';
    const ecPairPrivate = prova.HDNode.fromBase58(xprv).getKey();
    const rebuiltEcPairPrivate = prova.ECPair.fromPrivateKeyBuffer(Buffer.from('e274570fe47739cf9d72f4753926c2aecc7208cd5e418e14876a292b789e2362', 'hex'));
    const ecPairPublic = prova.HDNode.fromBase58(xpub).getKey();
    const aztecAddress1 = new prova.Address(ecPairPrivate, keyIDs, prova.networks.rmg);
    const aztecAddress2 = new prova.Address(rebuiltEcPairPrivate, keyIDs, prova.networks.rmg);
    const aztecAddress3 = new prova.Address(ecPairPublic, keyIDs, prova.networks.rmg);
    const addressString = 'GHhkNgqmMjwUjVYmsRjW281HhFRXuSX5cuFQc4C88Esyi';
    assert.strictEqual(addressString, aztecAddress1.toString());
    assert.strictEqual(aztecAddress1.toString(), aztecAddress2.toString());
    assert.strictEqual(aztecAddress2.toString(), aztecAddress3.toString());
  });

  it('reassembles Prova address from string', function() {
    const addressString = 'THkSaYyczf2X3EgGcoxnyNHYsYQpaBNncBRTa3fNxjxqH';
    const aztecAddress = prova.Address.fromBase58(addressString);
    assert.strictEqual(aztecAddress.publicKeyHash.toString('hex'), '7ef3c5b03eb6a485ff34a31da7266c0a0e180daf');
    assert.strictEqual(aztecAddress.toString(), 'THkSaYyczf2X3EgGcoxnyNHYsYQpaBNncBRTa3fNxjxqH');
  });

  it('assembles Prova address from odd script', function() {
    const script = Buffer.from('5214ddaa0c1d6a65f5c38444a1b5bf6779d00d2b4fc4005153ba', 'hex');
    const aztecAddress = prova.Address.fromScript(script);
    const addressString = aztecAddress.toString(prova.networks.rmgTest);
    const expectedString = 'TQ8A7DEjwUfTsdPnLbbQX3xqekfWpN42hPsdDDskR4h3K';
    const restoredScript = prova.Address.fromBase58(addressString).toScript();
    assert.strictEqual(addressString, expectedString);
    assert.strictEqual(script.toString('hex'), restoredScript.toString('hex'));
  });

  it('validates Prova address', function() {
    // const addressString = 'GHhkNgqmMjwUjVYmsRjW281HhFRXuSX5cuFQc4C88Esyi';
    const addressString = 'THkSaYyczf2X3EgGcoxnyNHYsYQpaBNncBRTa3fNxjxqH';
    assert.strictEqual(prova.Address.validateBase58(addressString, prova.networks.rmgTest), true);
  });

  it('validates wrong network Prova address', function() {
    // const addressString = 'GHhkNgqmMjwUjVYmsRjW281HhFRXuSX5cuFQc4C88Esyi';
    const addressString = 'THkSaYyczf2X3EgGcoxnyNHYsYQpaBNncBRTa3fNxjxqH';
    assert.strictEqual(prova.Address.validateBase58(addressString, prova.networks.rmg), false);
  });

  it('validates fake Prova address', function() {
    const addressString = 'BY2gSkDjm3BgSNEFBnvfH2UTMFXEjXBx7AS9QHTJiejCe';
    assert.strictEqual(prova.Address.validateBase58(addressString, prova.networks.rmgTest), false);
  });
  it('validates fake Prova address', function() {
    const addressString = 'BY2gSkDjm3BgSNEFBnvfH2UTMFXEjXBx7AS9QHTJiejCi';
    assert.strictEqual(prova.Address.validateBase58(addressString, prova.networks.rmgTest), false);
  });
});
