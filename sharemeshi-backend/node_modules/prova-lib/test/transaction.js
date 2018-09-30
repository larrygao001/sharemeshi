const assert = require('assert');
const prova = require('../index');
const bitcoin = require('bitcoinjs-lib');

describe('Transaction', function() {
  describe('Transaction IDs', function() {
    it('should calculate Coinbase ID', function(){
      const txHex = '01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0d510b2f503253482f627463642fffffffff0200f2052a010000001d521435dbbf04bca061e49dace08f858d8775c0a57c8e030000015153ba0000000000000000026a5100000000';
      const transaction = prova.Transaction.fromHex(txHex);
      const transactionId = transaction.getId();
      assert.strictEqual(transactionId, 'a6f9dd1d715624d4eb782c51bed3c8537de03064f7fcb98faff5aa606a47f88f');
    });
    it('should calculate regular spend ID', function(){
      const txHex = '01000000018ff8476a60aaf5af8fb9fcf76430e07d53c8d3be512c78ebd42456711dddf9a600000000d521025ceeba2ab4a635df2c0301a3d773da06ac5a18a7c3e0d09a795d7e57d233edf14730440220419c3c5f24da5709f946de50844bc3209f1bb0c6e916b9217795d0602b2cfe82022047e94c4ebe2fdc199c947ec577603ea8885f654f8c07b2aeb224ed0e075e7c1a0121038ef4a121bcaf1b1f175557a12896f8bc93b095e84817f90e9a901cd2113a8202483045022100cf6591cec506de7293ee31e91f6dcc2836daff8b38730234b776dd2496708a980220047b14829e565656a69cbd6f7dadd4b6c7eda010a0dee1ec68c3c6ac93d6f52601ffffffff0100f2052a010000001d521435dbbf04bca061e49dace08f858d8775c0a57c8e030000015153ba00000000';
      const transaction = prova.Transaction.fromHex(txHex);
      const transactionId = transaction.getId();
      assert.strictEqual(transactionId, 'dae902f2224fce1d0c482b1d0c65b29d3e36c419d15e2a714d163edce7b10280');
    });
  });

  describe('Parse RMG Transactions', function() {
    it('should parse an unsigned transaction spending a coinbase output', function() {
      const txHex = '01000000018ff8476a60aaf5af8fb9fcf76430e07d53c8d3be512c78ebd42456711dddf9a60000000000ffffffff0100f2052a010000001d521435dbbf04bca061e49dace08f858d8775c0a57c8e030000015153ba00000000';
      const transaction = prova.Transaction.fromHex(txHex);
      assert.strictEqual(transaction.ins.length, 1);
      assert.strictEqual(transaction.outs.length, 1);
      const input = transaction.ins[0];
      const output = transaction.outs[0];
      assert.strictEqual(input.hash.toString('hex'), '8ff8476a60aaf5af8fb9fcf76430e07d53c8d3be512c78ebd42456711dddf9a6');
      assert.strictEqual(input.script.length, 0);
      assert.strictEqual(output.script.length, 29);
    });

    it('should parse a half-signed transaction spending a coinbase output', function() {
      const txHex = '01000000018ff8476a60aaf5af8fb9fcf76430e07d53c8d3be512c78ebd42456711dddf9a6000000006a21025ceeba2ab4a635df2c0301a3d773da06ac5a18a7c3e0d09a795d7e57d233edf14730440220419c3c5f24da5709f946de50844bc3209f1bb0c6e916b9217795d0602b2cfe82022047e94c4ebe2fdc199c947ec577603ea8885f654f8c07b2aeb224ed0e075e7c1a01ffffffff0100f2052a010000001d521435dbbf04bca061e49dace08f858d8775c0a57c8e030000015153ba00000000';
      const transaction = prova.Transaction.fromHex(txHex);
      assert.strictEqual(transaction.ins.length, 1);
      assert.strictEqual(transaction.outs.length, 1);
      const input = transaction.ins[0];
      const output = transaction.outs[0];
      assert.strictEqual(input.hash.toString('hex'), '8ff8476a60aaf5af8fb9fcf76430e07d53c8d3be512c78ebd42456711dddf9a6');
      assert.strictEqual(input.script.length, 106);
      assert.strictEqual(output.script.length, 29);
      // let's break down the input script
      const inputScript = bitcoin.script.decompile(input.script);
      // public key and signature
      assert.strictEqual(inputScript.length, 2);
      assert.strictEqual(inputScript[0].length, 33);
      assert.strictEqual(inputScript[1].length, 71);
    });

    it('should parse a fully signed transaction spending a coinbase output', function() {
      const txHex = '01000000018ff8476a60aaf5af8fb9fcf76430e07d53c8d3be512c78ebd42456711dddf9a600000000d521025ceeba2ab4a635df2c0301a3d773da06ac5a18a7c3e0d09a795d7e57d233edf14730440220419c3c5f24da5709f946de50844bc3209f1bb0c6e916b9217795d0602b2cfe82022047e94c4ebe2fdc199c947ec577603ea8885f654f8c07b2aeb224ed0e075e7c1a0121038ef4a121bcaf1b1f175557a12896f8bc93b095e84817f90e9a901cd2113a8202483045022100cf6591cec506de7293ee31e91f6dcc2836daff8b38730234b776dd2496708a980220047b14829e565656a69cbd6f7dadd4b6c7eda010a0dee1ec68c3c6ac93d6f52601ffffffff0100f2052a010000001d521435dbbf04bca061e49dace08f858d8775c0a57c8e030000015153ba00000000';
      const transaction = prova.Transaction.fromHex(txHex);
      assert.strictEqual(transaction.ins.length, 1);
      assert.strictEqual(transaction.outs.length, 1);
      const input = transaction.ins[0];
      const output = transaction.outs[0];
      assert.strictEqual(input.hash.toString('hex'), '8ff8476a60aaf5af8fb9fcf76430e07d53c8d3be512c78ebd42456711dddf9a6');
      assert.strictEqual(input.script.length, 213);
      assert.strictEqual(output.script.length, 29);
      // let's break down the input script
      const inputScript = bitcoin.script.decompile(input.script);
      // public key and signature and public key and signature
      assert.strictEqual(inputScript.length, 4);
      assert.strictEqual(inputScript[0].length, 33);
      assert.strictEqual(inputScript[1].length, 71);
      assert.strictEqual(inputScript[2].length, 33);
      assert.strictEqual(inputScript[3].length, 72);
    });
  });
});
