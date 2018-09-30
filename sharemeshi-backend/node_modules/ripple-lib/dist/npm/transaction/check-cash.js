"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("./utils");
const ValidationError = utils.common.errors.ValidationError;
const toRippledAmount = utils.common.toRippledAmount;
const common_1 = require("../common");
function createCheckCashTransaction(account, checkCash) {
    if (checkCash.amount && checkCash.deliverMin) {
        throw new ValidationError('"amount" and "deliverMin" properties on '
            + 'CheckCash are mutually exclusive');
    }
    const txJSON = {
        Account: account,
        TransactionType: 'CheckCash',
        CheckID: checkCash.checkID
    };
    if (checkCash.amount !== undefined) {
        txJSON.Amount = toRippledAmount(checkCash.amount);
    }
    if (checkCash.deliverMin !== undefined) {
        txJSON.DeliverMin = toRippledAmount(checkCash.deliverMin);
    }
    return txJSON;
}
function prepareCheckCash(address, checkCash, instructions = {}) {
    common_1.validate.prepareCheckCash({ address, checkCash, instructions });
    const txJSON = createCheckCashTransaction(address, checkCash);
    return utils.prepareTransaction(txJSON, this, instructions);
}
exports.default = prepareCheckCash;
//# sourceMappingURL=check-cash.js.map