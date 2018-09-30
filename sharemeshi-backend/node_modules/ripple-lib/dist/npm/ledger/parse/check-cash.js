"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const common_1 = require("../../common");
const amount_1 = require("./amount");
function parseCheckCash(tx) {
    assert(tx.TransactionType === 'CheckCash');
    return common_1.removeUndefined({
        checkID: tx.CheckID,
        amount: tx.Amount && amount_1.default(tx.Amount),
        deliverMin: tx.DeliverMin && amount_1.default(tx.DeliverMin)
    });
}
exports.default = parseCheckCash;
//# sourceMappingURL=check-cash.js.map