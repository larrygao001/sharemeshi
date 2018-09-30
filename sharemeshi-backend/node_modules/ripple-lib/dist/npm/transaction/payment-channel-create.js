"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("./utils");
const common_1 = require("../common");
function createPaymentChannelCreateTransaction(account, paymentChannel) {
    const txJSON = {
        Account: account,
        TransactionType: 'PaymentChannelCreate',
        Amount: common_1.xrpToDrops(paymentChannel.amount),
        Destination: paymentChannel.destination,
        SettleDelay: paymentChannel.settleDelay,
        PublicKey: paymentChannel.publicKey.toUpperCase()
    };
    if (paymentChannel.cancelAfter !== undefined) {
        txJSON.CancelAfter = common_1.iso8601ToRippleTime(paymentChannel.cancelAfter);
    }
    if (paymentChannel.sourceTag !== undefined) {
        txJSON.SourceTag = paymentChannel.sourceTag;
    }
    if (paymentChannel.destinationTag !== undefined) {
        txJSON.DestinationTag = paymentChannel.destinationTag;
    }
    return txJSON;
}
function preparePaymentChannelCreate(address, paymentChannelCreate, instructions = {}) {
    common_1.validate.preparePaymentChannelCreate({ address, paymentChannelCreate, instructions });
    const txJSON = createPaymentChannelCreateTransaction(address, paymentChannelCreate);
    return utils.prepareTransaction(txJSON, this, instructions);
}
exports.default = preparePaymentChannelCreate;
//# sourceMappingURL=payment-channel-create.js.map