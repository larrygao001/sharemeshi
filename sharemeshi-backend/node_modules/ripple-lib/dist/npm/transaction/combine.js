"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const binary = require("ripple-binary-codec");
const utils = require("./utils");
const bignumber_js_1 = require("bignumber.js");
const ripple_address_codec_1 = require("ripple-address-codec");
const common_1 = require("../common");
const ripple_hashes_1 = require("ripple-hashes");
function addressToBigNumber(address) {
    const hex = (new Buffer(ripple_address_codec_1.decodeAddress(address))).toString('hex');
    return new bignumber_js_1.default(hex, 16);
}
function compareSigners(a, b) {
    return addressToBigNumber(a.Signer.Account)
        .comparedTo(addressToBigNumber(b.Signer.Account));
}
function combine(signedTransactions) {
    common_1.validate.combine({ signedTransactions });
    // TODO: signedTransactions is an array of strings in the documentation, but
    // tests and this code handle it as an array of objects. Fix!
    const txs = _.map(signedTransactions, binary.decode);
    const tx = _.omit(txs[0], 'Signers');
    if (!_.every(txs, _tx => _.isEqual(tx, _.omit(_tx, 'Signers')))) {
        throw new utils.common.errors.ValidationError('txJSON is not the same for all signedTransactions');
    }
    const unsortedSigners = _.reduce(txs, (accumulator, _tx) => accumulator.concat(_tx.Signers || []), []);
    const signers = unsortedSigners.sort(compareSigners);
    const signedTx = _.assign({}, tx, { Signers: signers });
    const signedTransaction = binary.encode(signedTx);
    const id = ripple_hashes_1.computeBinaryTransactionHash(signedTransaction);
    return { signedTransaction, id };
}
exports.default = combine;
//# sourceMappingURL=combine.js.map