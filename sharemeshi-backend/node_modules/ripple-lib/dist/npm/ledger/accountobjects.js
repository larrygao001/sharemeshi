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
function getAccountObjects(address, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        // Don't validate the options so that new types can be passed
        // through to rippled. rippled validates requests.
        // Make Request
        const response = yield this._request('account_objects', common_1.removeUndefined({
            account: address,
            type: options.type,
            ledger_hash: options.ledgerHash,
            ledger_index: options.ledgerIndex,
            limit: options.limit,
            marker: options.marker
        }));
        // Return Response
        return response;
    });
}
exports.default = getAccountObjects;
//# sourceMappingURL=accountobjects.js.map