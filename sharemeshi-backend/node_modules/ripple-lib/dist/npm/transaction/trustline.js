"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const bignumber_js_1 = require("bignumber.js");
const utils = require("./utils");
const validate = utils.common.validate;
const trustlineFlags = utils.common.txFlags.TrustSet;
function convertQuality(quality) {
    return (new bignumber_js_1.default(quality)).shift(9).truncated().toNumber();
}
function createTrustlineTransaction(account, trustline) {
    const limit = {
        currency: trustline.currency,
        issuer: trustline.counterparty,
        value: trustline.limit
    };
    const txJSON = {
        TransactionType: 'TrustSet',
        Account: account,
        LimitAmount: limit,
        Flags: 0
    };
    if (trustline.qualityIn !== undefined) {
        txJSON.QualityIn = convertQuality(trustline.qualityIn);
    }
    if (trustline.qualityOut !== undefined) {
        txJSON.QualityOut = convertQuality(trustline.qualityOut);
    }
    if (trustline.authorized === true) {
        txJSON.Flags |= trustlineFlags.SetAuth;
    }
    if (trustline.ripplingDisabled !== undefined) {
        txJSON.Flags |= trustline.ripplingDisabled ?
            trustlineFlags.NoRipple : trustlineFlags.ClearNoRipple;
    }
    if (trustline.frozen !== undefined) {
        txJSON.Flags |= trustline.frozen ?
            trustlineFlags.SetFreeze : trustlineFlags.ClearFreeze;
    }
    if (trustline.memos !== undefined) {
        txJSON.Memos = _.map(trustline.memos, utils.convertMemo);
    }
    return txJSON;
}
function prepareTrustline(address, trustline, instructions = {}) {
    validate.prepareTrustline({ address, trustline, instructions });
    const txJSON = createTrustlineTransaction(address, trustline);
    return utils.prepareTransaction(txJSON, this, instructions);
}
exports.default = prepareTrustline;
//# sourceMappingURL=trustline.js.map