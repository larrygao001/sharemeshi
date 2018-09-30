var blockexplorer = require('./index')
var nock = require('nock')
var expect = require('chai').expect
var blocksData = require('./blocks.json')

describe('blockexplorer', function () {
  describe('using implicit mainnet', () => {
    testWithExplorer(blockexplorer, 'https://blockchain.info')
  })

  describe('using explicit mainnet', () => {
    testWithExplorer(blockexplorer.usingNetwork(0), 'https://blockchain.info')
  })

  describe('using explicit testnet3', () => {
    testWithExplorer(blockexplorer.usingNetwork(3), 'https://testnet.blockchain.info')
  })
})

function testWithExplorer (explorer, url) {
  describe('.getBlockHeight()', function () {
    nock(url)
      .get('/block-height/85609').query(true).times(1)
      .reply(200, blocksData)

    it('should get a list containing a single block', function (done) {
      explorer.getBlockHeight(85609)
        .then(function (data) {
          expect(data.blocks.length).to.equal(1)
          expect(data.blocks[0].height).to.equal(85609)
          done()
        })
        .catch(done)
    })
  })
}
