"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const utils = require("./utils");
const validate = utils.common.validate;
function createOrderCancellationTransaction(account, orderCancellation) {
    const txJSON = {
        TransactionType: 'OfferCancel',
        Account: account,
        OfferSequence: orderCancellation.orderSequence
    };
    if (orderCancellation.memos !== undefined) {
        txJSON.Memos = _.map(orderCancellation.memos, utils.convertMemo);
    }
    return txJSON;
}
function prepareOrderCancellation(address, orderCancellation, instructions = {}) {
    validate.prepareOrderCancellation({ address, orderCancellation, instructions });
    const txJSON = createOrderCancellationTransaction(address, orderCancellation);
    return utils.prepareTransaction(txJSON, this, instructions);
}
exports.default = prepareOrderCancellation;
//# sourceMappingURL=ordercancellation.js.map