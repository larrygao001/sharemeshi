"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const common_1 = require("../../common");
function parseCheckCancel(tx) {
    assert(tx.TransactionType === 'CheckCancel');
    return common_1.removeUndefined({
        checkID: tx.CheckID
    });
}
exports.default = parseCheckCancel;
//# sourceMappingURL=check-cancel.js.map