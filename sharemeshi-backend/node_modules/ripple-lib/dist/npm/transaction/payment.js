"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const utils = require("./utils");
const validate = utils.common.validate;
const toRippledAmount = utils.common.toRippledAmount;
const paymentFlags = utils.common.txFlags.Payment;
const ValidationError = utils.common.errors.ValidationError;
function isMaxAdjustment(source) {
    return source.maxAmount !== undefined;
}
function isMinAdjustment(destination) {
    return destination.minAmount !== undefined;
}
function isXRPToXRPPayment(payment) {
    const { source, destination } = payment;
    const sourceCurrency = isMaxAdjustment(source)
        ? source.maxAmount.currency : source.amount.currency;
    const destinationCurrency = isMinAdjustment(destination)
        ? destination.minAmount.currency : destination.amount.currency;
    return sourceCurrency === 'XRP' && destinationCurrency === 'XRP';
}
function isIOUWithoutCounterparty(amount) {
    return amount && amount.currency !== 'XRP'
        && amount.counterparty === undefined;
}
function applyAnyCounterpartyEncoding(payment) {
    // Convert blank counterparty to sender or receiver's address
    //   (Ripple convention for 'any counterparty')
    // https://ripple.com/build/transactions/
    //    #special-issuer-values-for-sendmax-and-amount
    // https://ripple.com/build/ripple-rest/#counterparties-in-payments
    _.forEach([payment.source, payment.destination], adjustment => {
        _.forEach(['amount', 'minAmount', 'maxAmount'], key => {
            if (isIOUWithoutCounterparty(adjustment[key])) {
                adjustment[key].counterparty = adjustment.address;
            }
        });
    });
}
function createMaximalAmount(amount) {
    const maxXRPValue = '100000000000';
    const maxIOUValue = '9999999999999999e80';
    const maxValue = amount.currency === 'XRP' ? maxXRPValue : maxIOUValue;
    return _.assign({}, amount, { value: maxValue });
}
function createPaymentTransaction(address, paymentArgument) {
    const payment = _.cloneDeep(paymentArgument);
    applyAnyCounterpartyEncoding(payment);
    if (address !== payment.source.address) {
        throw new ValidationError('address must match payment.source.address');
    }
    if ((isMaxAdjustment(payment.source) && isMinAdjustment(payment.destination))
        ||
            (!isMaxAdjustment(payment.source) && !isMinAdjustment(payment.destination))) {
        throw new ValidationError('payment must specify either (source.maxAmount '
            + 'and destination.amount) or (source.amount and destination.minAmount)');
    }
    const destinationAmount = isMinAdjustment(payment.destination)
        ? payment.destination.minAmount : payment.destination.amount;
    const sourceAmount = isMaxAdjustment(payment.source)
        ? payment.source.maxAmount : payment.source.amount;
    // when using destination.minAmount, rippled still requires that we set
    // a destination amount in addition to DeliverMin. the destination amount
    // is interpreted as the maximum amount to send. we want to be sure to
    // send the whole source amount, so we set the destination amount to the
    // maximum possible amount. otherwise it's possible that the destination
    // cap could be hit before the source cap.
    const amount = (isMinAdjustment(payment.destination) && !isXRPToXRPPayment(payment))
        ? createMaximalAmount(destinationAmount) : destinationAmount;
    const txJSON = {
        TransactionType: 'Payment',
        Account: payment.source.address,
        Destination: payment.destination.address,
        Amount: toRippledAmount(amount),
        Flags: 0
    };
    if (payment.invoiceID !== undefined) {
        txJSON.InvoiceID = payment.invoiceID;
    }
    if (payment.source.tag !== undefined) {
        txJSON.SourceTag = payment.source.tag;
    }
    if (payment.destination.tag !== undefined) {
        txJSON.DestinationTag = payment.destination.tag;
    }
    if (payment.memos !== undefined) {
        txJSON.Memos = _.map(payment.memos, utils.convertMemo);
    }
    if (payment.noDirectRipple === true) {
        txJSON.Flags |= paymentFlags.NoRippleDirect;
    }
    if (payment.limitQuality === true) {
        txJSON.Flags |= paymentFlags.LimitQuality;
    }
    if (!isXRPToXRPPayment(payment)) {
        // Don't set SendMax for XRP->XRP payment
        // temREDUNDANT_SEND_MAX removed in:
        // https://github.com/ripple/rippled/commit/
        //  c522ffa6db2648f1d8a987843e7feabf1a0b7de8/
        if (payment.allowPartialPayment || isMinAdjustment(payment.destination)) {
            txJSON.Flags |= paymentFlags.PartialPayment;
        }
        txJSON.SendMax = toRippledAmount(sourceAmount);
        if (isMinAdjustment(payment.destination)) {
            txJSON.DeliverMin = toRippledAmount(destinationAmount);
        }
        if (payment.paths !== undefined) {
            txJSON.Paths = JSON.parse(payment.paths);
        }
    }
    else if (payment.allowPartialPayment === true) {
        throw new ValidationError('XRP to XRP payments cannot be partial payments');
    }
    return txJSON;
}
function preparePayment(address, payment, instructions = {}) {
    validate.preparePayment({ address, payment, instructions });
    const txJSON = createPaymentTransaction(address, payment);
    return utils.prepareTransaction(txJSON, this, instructions);
}
exports.default = preparePayment;
//# sourceMappingURL=payment.js.map