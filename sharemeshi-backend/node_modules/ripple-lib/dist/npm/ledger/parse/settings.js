"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const assert = require("assert");
const common_1 = require("../../common");
const AccountFlags = common_1.constants.AccountFlags;
const fields_1 = require("./fields");
function getAccountRootModifiedNode(tx) {
    const modifiedNodes = tx.meta.AffectedNodes.filter(node => node.ModifiedNode.LedgerEntryType === 'AccountRoot');
    assert(modifiedNodes.length === 1);
    return modifiedNodes[0].ModifiedNode;
}
function parseFlags(tx) {
    const settings = {};
    if (tx.TransactionType !== 'AccountSet') {
        return settings;
    }
    const node = getAccountRootModifiedNode(tx);
    const oldFlags = _.get(node.PreviousFields, 'Flags');
    const newFlags = _.get(node.FinalFields, 'Flags');
    if (oldFlags !== undefined && newFlags !== undefined) {
        const changedFlags = oldFlags ^ newFlags;
        const setFlags = newFlags & changedFlags;
        const clearedFlags = oldFlags & changedFlags;
        _.forEach(AccountFlags, (flagValue, flagName) => {
            if (setFlags & flagValue) {
                settings[flagName] = true;
            }
            else if (clearedFlags & flagValue) {
                settings[flagName] = false;
            }
        });
    }
    // enableTransactionIDTracking requires a special case because it
    // does not affect the Flags field; instead it adds/removes a field called
    // "AccountTxnID" to/from the account root.
    const oldField = _.get(node.PreviousFields, 'AccountTxnID');
    const newField = _.get(node.FinalFields, 'AccountTxnID');
    if (newField && !oldField) {
        settings.enableTransactionIDTracking = true;
    }
    else if (oldField && !newField) {
        settings.enableTransactionIDTracking = false;
    }
    return settings;
}
function parseSettings(tx) {
    const txType = tx.TransactionType;
    assert(txType === 'AccountSet' || txType === 'SetRegularKey' ||
        txType === 'SignerListSet');
    return _.assign({}, parseFlags(tx), fields_1.default(tx));
}
exports.default = parseSettings;
//# sourceMappingURL=settings.js.map