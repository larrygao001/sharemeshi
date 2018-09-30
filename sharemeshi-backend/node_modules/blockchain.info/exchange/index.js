var API = require('../api')
var UrlPattern = require('url-pattern')

var endpoints = {
  ticker: new UrlPattern('/ticker(?api_code=:apiCode)'),
  frombtc: new UrlPattern('/frombtc?value=:value&currency=:currency(&time=:time)(&api_code=:apiCode)'),
  tobtc: new UrlPattern('/tobtc?value=:value&currency=:currency(&api_code=:apiCode)')
}

var api = new API('https://blockchain.info', endpoints)

module.exports = {
  getTicker: getTicker,
  fromBTC: fromBTC,
  toBTC: toBTC
}

function getTicker (options) {
  options = options || {}
  return api.request('ticker', { apiCode: options.apiCode })
    .then(function (data) { return data[options.currency] || data })
}

function fromBTC (amount, currency, options) {
  options = options || {}
  return api.request('frombtc', { value: amount, time: options.time, currency: currency, apiCode: options.apiCode })
    .then(toFloat)
}

function toBTC (amount, currency, options) {
  options = options || {}
  return api.request('tobtc', { value: amount, currency: currency, apiCode: options.apiCode })
    .then(toFloat)
}

function toFloat (rvalue) {
  return parseFloat(rvalue.toString().replace(/,/g, ''))
}
