"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const utils_1 = require("./utils");
const common_1 = require("../../common");
function parseEscrowCancellation(tx) {
    assert(tx.TransactionType === 'EscrowCancel');
    return common_1.removeUndefined({
        memos: utils_1.parseMemos(tx),
        owner: tx.Owner,
        escrowSequence: tx.OfferSequence
    });
}
exports.default = parseEscrowCancellation;
//# sourceMappingURL=escrow-cancellation.js.map