"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common = require("../common");
function isConnected() {
    return this.connection.isConnected();
}
exports.isConnected = isConnected;
function getLedgerVersion() {
    return this.connection.getLedgerVersion();
}
exports.getLedgerVersion = getLedgerVersion;
function connect() {
    return this.connection.connect();
}
exports.connect = connect;
function disconnect() {
    return this.connection.disconnect();
}
exports.disconnect = disconnect;
function getServerInfo() {
    return common.serverInfo.getServerInfo(this.connection);
}
exports.getServerInfo = getServerInfo;
function getFee() {
    const cushion = this._feeCushion || 1.2;
    return common.serverInfo.getFee(this.connection, cushion);
}
exports.getFee = getFee;
function formatLedgerClose(ledgerClose) {
    return {
        baseFeeXRP: common.dropsToXrp(ledgerClose.fee_base),
        ledgerHash: ledgerClose.ledger_hash,
        ledgerVersion: ledgerClose.ledger_index,
        ledgerTimestamp: common.rippleTimeToISO8601(ledgerClose.ledger_time),
        reserveBaseXRP: common.dropsToXrp(ledgerClose.reserve_base),
        reserveIncrementXRP: common.dropsToXrp(ledgerClose.reserve_inc),
        transactionCount: ledgerClose.txn_count,
        validatedLedgerVersions: ledgerClose.validated_ledgers
    };
}
exports.formatLedgerClose = formatLedgerClose;
//# sourceMappingURL=server.js.map