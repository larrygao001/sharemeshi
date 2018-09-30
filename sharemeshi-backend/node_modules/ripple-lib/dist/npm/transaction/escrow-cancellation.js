"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const utils = require("./utils");
const validate = utils.common.validate;
function createEscrowCancellationTransaction(account, payment) {
    const txJSON = {
        TransactionType: 'EscrowCancel',
        Account: account,
        Owner: payment.owner,
        OfferSequence: payment.escrowSequence
    };
    if (payment.memos !== undefined) {
        txJSON.Memos = _.map(payment.memos, utils.convertMemo);
    }
    return txJSON;
}
function prepareEscrowCancellation(address, escrowCancellation, instructions = {}) {
    validate.prepareEscrowCancellation({ address, escrowCancellation, instructions });
    const txJSON = createEscrowCancellationTransaction(address, escrowCancellation);
    return utils.prepareTransaction(txJSON, this, instructions);
}
exports.default = prepareEscrowCancellation;
//# sourceMappingURL=escrow-cancellation.js.map