"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const bignumber_js_1 = require("bignumber.js");
const common_1 = require("../../common");
const AccountFields = common_1.constants.AccountFields;
function parseField(info, value) {
    if (info.encoding === 'hex' && !info.length) { // e.g. "domain"
        return new Buffer(value, 'hex').toString('ascii');
    }
    if (info.shift) {
        return (new bignumber_js_1.default(value)).shift(-info.shift).toNumber();
    }
    return value;
}
function parseFields(data) {
    const settings = {};
    for (const fieldName in AccountFields) {
        const fieldValue = data[fieldName];
        if (fieldValue !== undefined) {
            const info = AccountFields[fieldName];
            settings[info.name] = parseField(info, fieldValue);
        }
    }
    if (data.RegularKey) {
        settings.regularKey = data.RegularKey;
    }
    // Since an account can own at most one SignerList,
    // this array must have exactly one member if it is present.
    if (data.signer_lists && data.signer_lists.length === 1) {
        settings.signers = {};
        if (data.signer_lists[0].SignerQuorum) {
            settings.signers.threshold = data.signer_lists[0].SignerQuorum;
        }
        if (data.signer_lists[0].SignerEntries) {
            settings.signers.weights = _.map(data.signer_lists[0].SignerEntries, (entry) => {
                return {
                    address: entry.SignerEntry.Account,
                    weight: entry.SignerEntry.SignerWeight
                };
            });
        }
    }
    return settings;
}
exports.default = parseFields;
//# sourceMappingURL=fields.js.map