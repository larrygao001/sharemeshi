"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const binary = require("ripple-binary-codec");
const { computeTransactionHash } = require('ripple-hashes');
const utils = require("./utils");
const transaction_1 = require("./parse/transaction");
const transaction_2 = require("./transaction");
const common_1 = require("../common");
function parseBinaryTransaction(transaction) {
    const tx = binary.decode(transaction.tx_blob);
    tx.hash = computeTransactionHash(tx);
    tx.ledger_index = transaction.ledger_index;
    return {
        tx: tx,
        meta: binary.decode(transaction.meta),
        validated: transaction.validated
    };
}
function parseAccountTxTransaction(tx) {
    const _tx = tx.tx_blob ? parseBinaryTransaction(tx) : tx;
    // rippled uses a different response format for 'account_tx' than 'tx'
    return transaction_1.default(_.assign({}, _tx.tx, { meta: _tx.meta, validated: _tx.validated }));
}
function counterpartyFilter(filters, tx) {
    if (tx.address === filters.counterparty) {
        return true;
    }
    const specification = tx.specification;
    if (specification && ((specification.destination &&
        specification.destination.address === filters.counterparty) ||
        (specification.counterparty === filters.counterparty))) {
        return true;
    }
    return false;
}
function transactionFilter(address, filters, tx) {
    if (filters.excludeFailures && tx.outcome.result !== 'tesSUCCESS') {
        return false;
    }
    if (filters.types && !_.includes(filters.types, tx.type)) {
        return false;
    }
    if (filters.initiated === true && tx.address !== address) {
        return false;
    }
    if (filters.initiated === false && tx.address === address) {
        return false;
    }
    if (filters.counterparty && !counterpartyFilter(filters, tx)) {
        return false;
    }
    return true;
}
function orderFilter(options, tx) {
    return !options.startTx || (options.earliestFirst ?
        utils.compareTransactions(tx, options.startTx) > 0 :
        utils.compareTransactions(tx, options.startTx) < 0);
}
function formatPartialResponse(address, options, data) {
    return {
        marker: data.marker,
        results: data.transactions
            .filter(tx => tx.validated)
            .map(parseAccountTxTransaction)
            .filter(_.partial(transactionFilter, address, options))
            .filter(_.partial(orderFilter, options))
    };
}
function getAccountTx(connection, address, options, marker, limit) {
    const request = {
        command: 'account_tx',
        account: address,
        // -1 is equivalent to earliest available validated ledger
        ledger_index_min: options.minLedgerVersion || -1,
        // -1 is equivalent to most recent available validated ledger
        ledger_index_max: options.maxLedgerVersion || -1,
        forward: options.earliestFirst,
        binary: options.binary,
        limit: utils.clamp(limit, 10, 400),
        marker: marker
    };
    return connection.request(request).then(response => formatPartialResponse(address, options, response));
}
function checkForLedgerGaps(connection, options, transactions) {
    let { minLedgerVersion, maxLedgerVersion } = options;
    // if we reached the limit on number of transactions, then we can shrink
    // the required ledger range to only guarantee that there are no gaps in
    // the range of ledgers spanned by those transactions
    if (options.limit && transactions.length === options.limit) {
        if (options.earliestFirst) {
            maxLedgerVersion = _.last(transactions).outcome.ledgerVersion;
        }
        else {
            minLedgerVersion = _.last(transactions).outcome.ledgerVersion;
        }
    }
    return utils.hasCompleteLedgerRange(connection, minLedgerVersion, maxLedgerVersion).then(hasCompleteLedgerRange => {
        if (!hasCompleteLedgerRange) {
            throw new common_1.errors.MissingLedgerHistoryError();
        }
    });
}
function formatResponse(connection, options, transactions) {
    const compare = options.earliestFirst ? utils.compareTransactions :
        _.rearg(utils.compareTransactions, 1, 0);
    const sortedTransactions = transactions.sort(compare);
    return checkForLedgerGaps(connection, options, sortedTransactions).then(() => sortedTransactions);
}
function getTransactionsInternal(connection, address, options) {
    const getter = _.partial(getAccountTx, connection, address, options);
    const format = _.partial(formatResponse, connection, options);
    return utils.getRecursive(getter, options.limit).then(format);
}
function getTransactions(address, options = {}) {
    common_1.validate.getTransactions({ address, options });
    const defaults = { maxLedgerVersion: -1 };
    if (options.start) {
        return transaction_2.default.call(this, options.start).then(tx => {
            const ledgerVersion = tx.outcome.ledgerVersion;
            const bound = options.earliestFirst ?
                { minLedgerVersion: ledgerVersion } : { maxLedgerVersion: ledgerVersion };
            const startOptions = _.assign({}, defaults, options, { startTx: tx }, bound);
            return getTransactionsInternal(this.connection, address, startOptions);
        });
    }
    const newOptions = _.assign({}, defaults, options);
    return getTransactionsInternal(this.connection, address, newOptions);
}
exports.default = getTransactions;
//# sourceMappingURL=transactions.js.map