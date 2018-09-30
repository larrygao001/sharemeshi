var API = require('../api')
var endpoints = require('./endpoints')

function MyWallet (guid, password, options) {
  options = options || {}
  if (!options.apiHost) throw new Error('Missing required option: apiHost')
  this.guid = guid
  this.api = new API(options.apiHost, endpoints)
  this.getParams = function () {
    return {
      password: password,
      second_password: options.secondPassword,
      api_code: options.apiCode
    }
  }
  return this
}

MyWallet.prototype.login = function () {
  var params = this.getParams()
  return this.api.post('login', { guid: this.guid }, params)
}

MyWallet.prototype.send = function (address, amount, options) {
  options = options || {}
  var params = this.getParams()
  params.to = address
  params.amount = amount
  params.from = options.from
  params.fee = options.fee
  params.fee_per_byte = options.feePerByte
  return this.api.post('payment', { guid: this.guid }, params)
}

MyWallet.prototype.sendMany = function (recipients, options) {
  options = options || {}
  var params = this.getParams()
  params.recipients = JSON.stringify(recipients)
  params.from = options.from
  params.fee = options.fee
  params.fee_per_byte = options.feePerByte
  return this.api.post('sendmany', { guid: this.guid }, params)
}

MyWallet.prototype.getBalance = function () {
  var params = this.getParams()
  return this.api.post('balance', { guid: this.guid }, params)
}

MyWallet.prototype.enableHD = function () {
  var params = this.getParams()
  return this.api.post('enableHD', { guid: this.guid }, params)
}

MyWallet.prototype.listAccounts = function () {
  var params = this.getParams()
  return this.api.post('listAccounts', { guid: this.guid }, params)
}

MyWallet.prototype.listXPubs = function () {
  var params = this.getParams()
  return this.api.post('listXPubs', { guid: this.guid }, params)
}

MyWallet.prototype.createAccount = function (options) {
  options = options || {}
  var params = this.getParams()
  params.label = options.label
  return this.api.post('createAccount', { guid: this.guid }, params)
}

MyWallet.prototype.getAccount = function (xpubOrIndex) {
  var params = this.getParams()
  return this.api.post('getAccount', { guid: this.guid, account: xpubOrIndex }, params)
}

MyWallet.prototype.getAccountReceiveAddress = function (xpubOrIndex) {
  var params = this.getParams()
  return this.api.post('getAccountReceiveAddress', { guid: this.guid, account: xpubOrIndex }, params)
}

MyWallet.prototype.getAccountBalance = function (xpubOrIndex) {
  var params = this.getParams()
  return this.api.post('getAccountBalance', { guid: this.guid, account: xpubOrIndex }, params)
}

MyWallet.prototype.archiveAccount = function (xpubOrIndex) {
  var params = this.getParams()
  return this.api.post('archiveAccount', { guid: this.guid, account: xpubOrIndex }, params)
}

MyWallet.prototype.unarchiveAccount = function (xpubOrIndex) {
  var params = this.getParams()
  return this.api.post('unarchiveAccount', { guid: this.guid, account: xpubOrIndex }, params)
}

MyWallet.prototype.listAddresses = function () {
  var params = this.getParams()
  return this.api.post('list', { guid: this.guid }, params)
}

MyWallet.prototype.getAddress = function (address, options) {
  options = options || {}
  var params = this.getParams()
  params.address = address
  return this.api.post('addrBalance', { guid: this.guid }, params)
}

MyWallet.prototype.newAddress = function (options) {
  options = options || {}
  var params = this.getParams()
  params.label = options.label
  return this.api.post('newAddress', { guid: this.guid }, params)
}

MyWallet.prototype.archiveAddress = function (address) {
  var params = this.getParams()
  params.address = address
  return this.api.post('archive', { guid: this.guid }, params)
}

MyWallet.prototype.unarchiveAddress = function (address) {
  var params = this.getParams()
  params.address = address
  return this.api.post('unarchive', { guid: this.guid }, params)
}

MyWallet.create = function (password, apiCode, options) {
  options = options || {}
  if (!options.apiHost) throw new Error('Missing required option: apiHost')
  var api = new API(options.apiHost, endpoints)
  var params = {
    password: password,
    api_code: apiCode,
    priv: options.priv,
    label: options.label,
    email: options.email,
    second_password: options.secondPassword,
    hd: options.hd
  }
  return api.post('create', {}, params).then(function (response) {
    var walletOptions = { apiCode: apiCode, apiHost: options.apiHost }
    return new MyWallet(response.guid, password, walletOptions)
  })
}

module.exports = MyWallet
