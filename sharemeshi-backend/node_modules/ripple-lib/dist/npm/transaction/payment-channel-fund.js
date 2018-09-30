"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("./utils");
const common_1 = require("../common");
function createPaymentChannelFundTransaction(account, fund) {
    const txJSON = {
        Account: account,
        TransactionType: 'PaymentChannelFund',
        Channel: fund.channel,
        Amount: common_1.xrpToDrops(fund.amount)
    };
    if (fund.expiration !== undefined) {
        txJSON.Expiration = common_1.iso8601ToRippleTime(fund.expiration);
    }
    return txJSON;
}
function preparePaymentChannelFund(address, paymentChannelFund, instructions = {}) {
    common_1.validate.preparePaymentChannelFund({ address, paymentChannelFund, instructions });
    const txJSON = createPaymentChannelFundTransaction(address, paymentChannelFund);
    return utils.prepareTransaction(txJSON, this, instructions);
}
exports.default = preparePaymentChannelFund;
//# sourceMappingURL=payment-channel-fund.js.map