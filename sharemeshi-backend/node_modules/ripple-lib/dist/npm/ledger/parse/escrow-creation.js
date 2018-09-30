"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const amount_1 = require("./amount");
const utils_1 = require("./utils");
const common_1 = require("../../common");
function parseEscrowCreation(tx) {
    assert(tx.TransactionType === 'EscrowCreate');
    return common_1.removeUndefined({
        amount: amount_1.default(tx.Amount).value,
        destination: tx.Destination,
        memos: utils_1.parseMemos(tx),
        condition: tx.Condition,
        allowCancelAfter: utils_1.parseTimestamp(tx.CancelAfter),
        allowExecuteAfter: utils_1.parseTimestamp(tx.FinishAfter),
        sourceTag: tx.SourceTag,
        destinationTag: tx.DestinationTag
    });
}
exports.default = parseEscrowCreation;
//# sourceMappingURL=escrow-creation.js.map