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
const utils_1 = require("./utils");
function formatBalanceSheet(balanceSheet) {
    const result = {};
    if (!_.isUndefined(balanceSheet.balances)) {
        result.balances = [];
        _.forEach(balanceSheet.balances, (balances, counterparty) => {
            _.forEach(balances, balance => {
                result.balances.push(Object.assign({ counterparty }, balance));
            });
        });
    }
    if (!_.isUndefined(balanceSheet.assets)) {
        result.assets = [];
        _.forEach(balanceSheet.assets, (assets, counterparty) => {
            _.forEach(assets, balance => {
                result.assets.push(Object.assign({ counterparty }, balance));
            });
        });
    }
    if (!_.isUndefined(balanceSheet.obligations)) {
        result.obligations = _.map(balanceSheet.obligations, (value, currency) => ({ currency, value }));
    }
    return result;
}
function getBalanceSheet(address, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        // 1. Validate
        common_1.validate.getBalanceSheet({ address, options });
        options = yield utils_1.ensureLedgerVersion.call(this, options);
        // 2. Make Request
        const response = yield this._request('gateway_balances', {
            account: address,
            strict: true,
            hotwallet: options.excludeAddresses,
            ledger_index: options.ledgerVersion
        });
        // 3. Return Formatted Response
        return formatBalanceSheet(response);
    });
}
exports.default = getBalanceSheet;
//# sourceMappingURL=balance-sheet.js.map