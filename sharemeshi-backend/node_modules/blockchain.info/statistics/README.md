# Blockchain Statistics Module

Get statistics and historical chart data for the bitcoin network. [View full API documentation](https://blockchain.info/api/charts_api).

## Importing

```js
var statistics = require('blockchain.info/statistics')
```

## Methods

All method options can include an `apiCode` property to prevent hitting request limits.

### get

Usage:

```js
statistics.get(options)
```

Responds with a json *object* containing an overview of many Bitcoin statistics unless the `stat` option is specified.
View an example response [here](https://api.blockchain.info/stats).

Options (optional):

  * `stat` - get only one specific stat, rather than the entire json object response, ex: `"n_btc_mined"` (*string*)

### getChartData

Usage:

```js
statistics.getChartData(chartType, options)
```

Responds with a json *object* that has a `values` property set to an *array* of chart coordinate objects in the form: {x:<*number*>,y:<*number*>}.

Parameters:

  * `chartType` - specifies which chart you want to get, ex: "total-bitcoins" (*string*, required)

Options:

  * `timespan` - interval for which to fetch data, can be set to `'all'` or a period of time formatted as `'<time><unit>'`, ex: `'2years'` or `'90d'` (*string*)
  * `rollingAverage` - duration over which the data should be averaged, can be set to a period of time formatted as `'<time><unit>'`, ex: `'2years'` or `'90d'` (*string*)

Values for `chartType` param:

  * `'total-bitcoins'`
  * `'market-price'`
  * `'market-cap'`
  * `'trade-volume'`
  * `'blocks-size'`
  * `'avg-block-size'`
  * `'n-orphaned-blocks'`
  * `'n-transactions-per-block'`
  * `'median-confirmation-time'`
  * `'bip-9-segwit'`
  * `'bitcoin-unlimited-share'`
  * `'nya-support'`
  * `'hash-rate'`
  * `'difficulty'`
  * `'miners-revenue'`
  * `'transaction-fees'`
  * `'transaction-fees-usd'`
  * `'cost-per-transaction-percent'`
  * `'cost-per-transaction'`
  * `'n-unique-addresses'`
  * `'n-transactions'`
  * `'n-transactions-total'`
  * `'transactions-per-second'`
  * `'mempool-count'`
  * `'mempool-growth'`
  * `'mempool-size'`
  * `'mempool-state-by-fee-level'`
  * `'utxo-count'`
  * `'n-transactions-excluding-popular'`
  * `'n-transactions-excluding-chains-longer-than-100'`
  * `'output-volume'`
  * `'estimated-transaction-volume'`
  * `'estimated-transaction-volume-usd'`
  * `'my-wallet-n-users'`

### getPoolData

Usage:

```js
statistics.getPoolData(options)
```

Responds with a json *object* containing mining pools and their total blocks mined in the last 4 days.
View an example response [here](https://api.blockchain.info/pools?&timespan=4days).

Options (optional):

  * `timespan` - duration over which the data is computed (maximum 10 days), ex: `8` (*number*)


[stats]: https://blockchain.info/api/charts_api
