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
const common_1 = require("../common");
const account_trustline_1 = require("./parse/account-trustline");
function currencyFilter(currency, trustline) {
    return currency === null || trustline.specification.currency === currency;
}
function getTrustlines(address, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        // 1. Validate
        common_1.validate.getTrustlines({ address, options });
        const ledgerVersion = yield this.getLedgerVersion();
        // 2. Make Request
        const responses = yield this._requestAll('account_lines', {
            account: address,
            ledger_index: ledgerVersion,
            limit: options.limit,
            peer: options.counterparty
        });
        // 3. Return Formatted Response
        const trustlines = _.flatMap(responses, response => response.lines);
        return trustlines.map(account_trustline_1.default).filter(trustline => {
            return currencyFilter(options.currency || null, trustline);
        });
    });
}
exports.default = getTrustlines;
//# sourceMappingURL=trustlines.js.map