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
const common_1 = require("../common");
const ledger_1 = require("./parse/ledger");
function getLedger(options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        // 1. Validate
        common_1.validate.getLedger({ options });
        // 2. Make Request
        const response = yield this._request('ledger', {
            ledger_index: options.ledgerVersion || 'validated',
            expand: options.includeAllData,
            transactions: options.includeTransactions,
            accounts: options.includeState
        });
        // 3. Return Formatted Response
        return ledger_1.parseLedger(response.ledger);
    });
}
exports.default = getLedger;
//# sourceMappingURL=ledger.js.map