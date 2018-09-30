# Blockchain Push Transaction Module

Broadcast raw transactions to the bitcoin network.

## Importing

```js
var pushtx = require('blockchain.info/pushtx')
```

### Usage with Testnet

```js
// import using testnet 3 network
var pushtx = require('blockchain.info/pushtx').usingNetwork(3)
```

## Methods

All method options can include an `apiCode` property to prevent hitting request limits.

### pushtx

Usage:

```js
pushtx.pushtx(transaction, options)
```

Manually broadcasts a transaction over the bitcoin network.

Parameters:

  * `transaction` - raw transaction in *hex* format (*string*)
