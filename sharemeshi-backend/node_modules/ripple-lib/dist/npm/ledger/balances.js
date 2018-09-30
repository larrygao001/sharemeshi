"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("./utils");
const common_1 = require("../common");
function getTrustlineBalanceAmount(trustline) {
    return {
        currency: trustline.specification.currency,
        counterparty: trustline.specification.counterparty,
        value: trustline.state.balance
    };
}
function formatBalances(options, balances) {
    const result = balances.trustlines.map(getTrustlineBalanceAmount);
    if (!(options.counterparty ||
        (options.currency && options.currency !== 'XRP'))) {
        const xrpBalance = {
            currency: 'XRP',
            value: balances.xrp
        };
        result.unshift(xrpBalance);
    }
    if (options.limit && result.length > options.limit) {
        const toRemove = result.length - options.limit;
        result.splice(-toRemove, toRemove);
    }
    return result;
}
function getLedgerVersionHelper(connection, optionValue) {
    if (optionValue !== undefined && optionValue !== null) {
        return Promise.resolve(optionValue);
    }
    return connection.getLedgerVersion();
}
function getBalances(address, options = {}) {
    common_1.validate.getTrustlines({ address, options });
    return Promise.all([
        getLedgerVersionHelper(this.connection, options.ledgerVersion).then(ledgerVersion => utils.getXRPBalance(this.connection, address, ledgerVersion)),
        this.getTrustlines(address, options)
    ]).then(results => formatBalances(options, { xrp: results[0], trustlines: results[1] }));
}
exports.default = getBalances;
//# sourceMappingURL=balances.js.map