"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("./utils");
const common_1 = require("../common");
function createCheckCancelTransaction(account, cancel) {
    const txJSON = {
        Account: account,
        TransactionType: 'CheckCancel',
        CheckID: cancel.checkID
    };
    return txJSON;
}
function prepareCheckCancel(address, checkCancel, instructions = {}) {
    common_1.validate.prepareCheckCancel({ address, checkCancel, instructions });
    const txJSON = createCheckCancelTransaction(address, checkCancel);
    return utils.prepareTransaction(txJSON, this, instructions);
}
exports.default = prepareCheckCancel;
//# sourceMappingURL=check-cancel.js.map