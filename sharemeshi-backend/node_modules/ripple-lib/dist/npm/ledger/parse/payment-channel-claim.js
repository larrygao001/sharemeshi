"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const common_1 = require("../../common");
const amount_1 = require("./amount");
const claimFlags = common_1.txFlags.PaymentChannelClaim;
function parsePaymentChannelClaim(tx) {
    assert(tx.TransactionType === 'PaymentChannelClaim');
    return common_1.removeUndefined({
        channel: tx.Channel,
        balance: tx.Balance && amount_1.default(tx.Balance).value,
        amount: tx.Amount && amount_1.default(tx.Amount).value,
        signature: tx.Signature,
        publicKey: tx.PublicKey,
        renew: Boolean(tx.Flags & claimFlags.Renew) || undefined,
        close: Boolean(tx.Flags & claimFlags.Close) || undefined
    });
}
exports.default = parsePaymentChannelClaim;
//# sourceMappingURL=payment-channel-claim.js.map