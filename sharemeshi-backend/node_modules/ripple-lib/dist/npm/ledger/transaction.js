"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const utils = require("./utils");
const transaction_1 = require("./parse/transaction");
const common_1 = require("../common");
function attachTransactionDate(connection, tx) {
    if (tx.date) {
        return Promise.resolve(tx);
    }
    const ledgerVersion = tx.ledger_index || tx.LedgerSequence;
    if (!ledgerVersion) {
        return new Promise(() => {
            throw new common_1.errors.NotFoundError('ledger_index and LedgerSequence not found in tx');
        });
    }
    const request = {
        command: 'ledger',
        ledger_index: ledgerVersion
    };
    return connection.request(request).then(data => {
        if (typeof data.ledger.close_time === 'number') {
            return _.assign({ date: data.ledger.close_time }, tx);
        }
        throw new common_1.errors.UnexpectedError('Ledger missing close_time');
    }).catch(error => {
        if (error instanceof common_1.errors.UnexpectedError) {
            throw error;
        }
        throw new common_1.errors.NotFoundError('Transaction ledger not found');
    });
}
function isTransactionInRange(tx, options) {
    return (!options.minLedgerVersion
        || tx.ledger_index >= options.minLedgerVersion)
        && (!options.maxLedgerVersion
            || tx.ledger_index <= options.maxLedgerVersion);
}
function convertError(connection, options, error) {
    const _error = (error.message === 'txnNotFound') ?
        new common_1.errors.NotFoundError('Transaction not found') : error;
    if (_error instanceof common_1.errors.NotFoundError) {
        return utils.hasCompleteLedgerRange(connection, options.minLedgerVersion, options.maxLedgerVersion).then(hasCompleteLedgerRange => {
            if (!hasCompleteLedgerRange) {
                return utils.isPendingLedgerVersion(connection, options.maxLedgerVersion)
                    .then(isPendingLedgerVersion => {
                    return isPendingLedgerVersion ?
                        new common_1.errors.PendingLedgerVersionError() :
                        new common_1.errors.MissingLedgerHistoryError();
                });
            }
            return _error;
        });
    }
    return Promise.resolve(_error);
}
function formatResponse(options, tx) {
    if (tx.validated !== true || !isTransactionInRange(tx, options)) {
        throw new common_1.errors.NotFoundError('Transaction not found');
    }
    return transaction_1.default(tx);
}
function getTransaction(id, options = {}) {
    common_1.validate.getTransaction({ id, options });
    const request = {
        command: 'tx',
        transaction: id,
        binary: false
    };
    return utils.ensureLedgerVersion.call(this, options).then(_options => {
        return this.connection.request(request).then((tx) => attachTransactionDate(this.connection, tx)).then(_.partial(formatResponse, _options))
            .catch(error => {
            return convertError(this.connection, _options, error).then(_error => {
                throw _error;
            });
        });
    });
}
exports.default = getTransaction;
//# sourceMappingURL=transaction.js.map