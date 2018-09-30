"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const utils = require("./utils");
const validate = utils.common.validate;
const ValidationError = utils.common.errors.ValidationError;
function createEscrowExecutionTransaction(account, payment) {
    const txJSON = {
        TransactionType: 'EscrowFinish',
        Account: account,
        Owner: payment.owner,
        OfferSequence: payment.escrowSequence
    };
    if (Boolean(payment.condition) !== Boolean(payment.fulfillment)) {
        throw new ValidationError('"condition" and "fulfillment" fields on'
            + ' EscrowFinish must only be specified together.');
    }
    if (payment.condition !== undefined) {
        txJSON.Condition = payment.condition;
    }
    if (payment.fulfillment !== undefined) {
        txJSON.Fulfillment = payment.fulfillment;
    }
    if (payment.memos !== undefined) {
        txJSON.Memos = _.map(payment.memos, utils.convertMemo);
    }
    return txJSON;
}
function prepareEscrowExecution(address, escrowExecution, instructions = {}) {
    validate.prepareEscrowExecution({ address, escrowExecution, instructions });
    const txJSON = createEscrowExecutionTransaction(address, escrowExecution);
    return utils.prepareTransaction(txJSON, this, instructions);
}
exports.default = prepareEscrowExecution;
//# sourceMappingURL=escrow-execution.js.map