
# Blockchain MyWallet Module

Programmatically interact with your Blockchain.info wallet. [View full API documentation](https://blockchain.info/api/blockchain_wallet_api).

## Opening a wallet

Importing:

```js
var MyWallet = require('blockchain.info/MyWallet')
```

An instance of a wallet needs to be initialized before it can be used:

```js
var wallet = new MyWallet(identifier, password, options)
```

Options:

  * `secondPassword` - second wallet password (required only if wallet is double-encrypted)
  * `apiCode` - Blockchain.info api code (will be automatically included in all further requests to the wallet)
  * `apiHost` - set the host for the api calls (required)

## Wallet API v2 Compatibility

This module requires the [Wallet API v2 service](https://github.com/blockchain/service-my-wallet-v3). To use the wallet service for api calls, set the `apiHost` option to point to where the service is running.

Example:

```js
var options = { apiCode: 'myAPICode', apiHost: 'http://localhost:3000' }
var wallet = new MyWallet('myIdentifier', 'myPassword123', options)
wallet.getBalance().then(function (response) { console.log('My balance is %d!', response.balance); })
```

## Response objects

Payment Response Object Properties:

  * `to` - payment destinations (*[string|number]*)
  * `amounts` - payment amounts (*[number]*)
  * `from` - from account / address (*string|number*)
  * `fee` - final fee paid in satoshi (*number*)
  * `message` - message confirming the transaction (*string*)
  * `tx_hash` - the hash of the transaction (*string*)
  * `notice` - notice, not always returned (*string*)

Address Object Properties:

  * `address` - the address name (*string*)
  * `balance` - the address balance in satoshi (*number*)
  * `label` - the address label (*string* or *null*)
  * `total_received` - the total satoshi ever received by the address (*number*)

Account Object Properties:

  * `balance` - the account balance in satoshi (*number*)
  * `label` - the account label (*string*)
  * `index` - the account index (*number*)
  * `archived` - indicates if the account is archived or not (*boolean*)
  * `extendedPublicKey` - account xpub (*string*)
  * `extendedPrivateKey` - account xpriv (*string*)
  * `receiveIndex` - current account receive index (*number*)
  * `lastUsedReceiveIndex` - the last used receive index (*number*)
  * `receivingAddressLabels` - receive address labels (*[{number: string}]*)
  * `receiveAddress` - current receive address (*string*)

## Class Methods

### create

Usage:

```js
MyWallet.create(password, apiCode, options)
```

Create a new Blockchain Wallet. Responds with an instance of MyWallet, which will adopt the same api code used to create the wallet. If you are using the Wallet API v2 service, remember to set the `apiHost` option to wherever the service is running.

Parameters:

  * `password` - password to set for the wallet (required, must be greater than 10 characters)
  * `apiCode` - Blockchain.info api code (required)

Options:

  * `priv` - private key to use for the wallet's first bitcoin address (*string*)
  * `label` - label to give to the wallet's first bitcoin address (*string*)
  * `email` - email to associate with the new Blockchain Wallet (*string*)
  * `hd` - create the new wallet as an hd wallet (*boolean*, recommended)
  * `apiHost` - set the host for the api calls to the newly created wallet (*string*, required)

## Instance Methods

The API code passed into the MyWallet constructor is automatically included in all requests to the wallet.

### Send Bitcoin

Usage:

```js
wallet.send(address, amount, options)
```

Sends bitcoin from the wallet to a given address. Responds with a Payment Response Object.

Parameters:

  * `address` - bitcoin address to send to
  * `amount` - amount **in satoshi** to send
  * `from` - send from a specific Bitcoin address or account index (*string*|*number*, required when sending from an account)

Options (optional):

  * `fee` - transaction fee value **in satoshi** (*number*, defaults to 0.0001btc)
  * `feePerByte` - transaction fee **in satoshi per byte** (*number*, recommended)

### Send to multiple addresses

Usage:

```js
wallet.sendMany(recipients, options)
```

Sends bitcoin to multiple addresses. Responds with a Payment Response Object.

Parameters:

  * `recipients` - *object* with properties/values in the format: "receivingAddress":amount (required)
  * `from` - send from a specific Bitcoin address or account index (*string*|*number*, required when sending from an account)

Options (optional):

  * `fee` - transaction fee value **in satoshi** (*number*, defaults to 0.0001btc)
  * `feePerByte` - transaction fee **in satoshi per byte** (*number*, recommended)

### Get wallet balance

Usage:

```js
wallet.getBalance()
```

Responds with the entire balance of a wallet, as a number, **in satoshi**.

### Upgrade to HD wallet

Usage:

```js
wallet.enableHD()
```

Upgrades a legacy wallet to an HD wallet. Responds with an account object (the first account in the new HD wallet).

### List HD accounts

Usage:

```js
wallet.listAccounts()
```

Lists wallet HD accounts. Responds with an *array* of account objects.

### List account xpubs

Usage:

```js
wallet.listXPubs()
```

Lists wallet account xpubs. Responds with an *array* of xpub strings.

### Create new HD account

Usage:

```js
wallet.createAccount(options)
```

Creates a new HD account at the next unused account index. Responds with an account object.

Options (optional)

  * `label` - label to give the new account (*string*)

### Get HD account

Usage:

```js
wallet.getAccount(xpubOrIndex)
```

Gets a single HD account. Responds with an account object.

Parameters:

  * `xpubOrIndex` - the account xpub or index (*string*|*number*, required)

### Get HD account receive address

Usage:

```js
wallet.getAccountReceiveAddress(xpubOrIndex)
```

Gets the next unused receive address for an HD account. Responds with an *object* containing an **address** property.

Parameters:

  * `xpubOrIndex` - the account xpub or index (*string*|*number*, required)

### Get HD account balance

Usage:

```js
wallet.getAccountBalance(xpubOrIndex)
```

Gets the balance of an HD account. Responds with an *object* containing a **balance** property.

Parameters:

  * `xpubOrIndex` - the account xpub or index (*string*|*number*, required)

### Archive HD account

Usage:

```js
wallet.archiveAccount(xpubOrIndex)
```

Archives an HD account. Responds with an account object.

Parameters:

  * `xpubOrIndex` - the account xpub or index (*string*|*number*, required)

### Unarchive HD account

Usage:

```js
wallet.unarchiveAccount(xpubOrIndex)
```

Unarchives an HD account. Responds with an account object.

Parameters:

  * `xpubOrIndex` - the account xpub or index (*string*|*number*, required)

### List wallet addresses

Usage:

```js
wallet.listAddresses()
```

Responds with an *object* that has an **addresses** property. This property is an **array** of Address Objects.

### Get address

Usage:

```
wallet.getAddress(address, options)
```

Responds with an address object of the specified address.

Parameters:

  * `address` - the name of the address (*string*)

### Create new address

Usage:

```js
wallet.newAddress(options)
```

Creates a new address. Responds with a partial Address Object (contains just the **address** property, also contains the **label** property if a label parameter was passed).

Options (optional):

  * `label` - automatically set the label of the new address (*string*)

### Archive address

Usage:

```js
wallet.archiveAddress(address)
```

Archives a specific address. Responds with an object that has the property **archived**, which is set to the name of the archived address (*string*).

Parameters:

  * `address` - the name of the address to archive (*string*)

### Unarchive address

Usage:

```js
wallet.unarchiveAddress(address)
```

Unarchives a specific address. Responds with an object that has the property **active**, which is set to the name of the unarchived address (*string*).

Parameters:

  * `address` - the name of the address to unarchive (*string*)
