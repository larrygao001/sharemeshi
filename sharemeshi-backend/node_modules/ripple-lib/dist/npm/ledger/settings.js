"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const fields_1 = require("./parse/fields");
const common_1 = require("../common");
const AccountFlags = common_1.constants.AccountFlags;
function parseFlags(value) {
    const settings = {};
    for (const flagName in AccountFlags) {
        if (value & AccountFlags[flagName]) {
            settings[flagName] = true;
        }
    }
    return settings;
}
function formatSettings(response) {
    const data = response.account_data;
    const parsedFlags = parseFlags(data.Flags);
    const parsedFields = fields_1.default(data);
    return _.assign({}, parsedFlags, parsedFields);
}
function getSettings(address, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        // 1. Validate
        common_1.validate.getSettings({ address, options });
        // 2. Make Request
        const response = yield this._request('account_info', {
            account: address,
            ledger_index: options.ledgerVersion || 'validated',
            signer_lists: true
        });
        // 3. Return Formatted Response
        return formatSettings(response);
    });
}
exports.default = getSettings;
//# sourceMappingURL=settings.js.map