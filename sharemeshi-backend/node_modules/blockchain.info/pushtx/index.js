var API = require('../api')
var UrlPattern = require('url-pattern')

var endpoints = {
  pushtx: new UrlPattern('/pushtx')
}

module.exports = createWithApi(API.createUsingNetwork(0, endpoints))

module.exports.usingNetwork = function (network) {
  return createWithApi(API.createUsingNetwork(network, endpoints))
}

function createWithApi (api) {
  return {
    pushtx: pushtx.bind(null, api)
  }
}

function pushtx (api, txHex, options) {
  options = options || {}
  var body = { tx: txHex, api_code: options.apiCode }
  return api.post('pushtx', {}, body)
}
