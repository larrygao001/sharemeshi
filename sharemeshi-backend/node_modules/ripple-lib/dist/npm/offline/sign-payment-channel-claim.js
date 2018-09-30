"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common = require("../common");
const keypairs = require("ripple-keypairs");
const binary = require("ripple-binary-codec");
const { validate, xrpToDrops } = common;
function signPaymentChannelClaim(channel, amount, privateKey) {
    validate.signPaymentChannelClaim({ channel, amount, privateKey });
    const signingData = binary.encodeForSigningClaim({
        channel: channel,
        amount: xrpToDrops(amount)
    });
    return keypairs.sign(signingData, privateKey);
}
exports.default = signPaymentChannelClaim;
//# sourceMappingURL=sign-payment-channel-claim.js.map