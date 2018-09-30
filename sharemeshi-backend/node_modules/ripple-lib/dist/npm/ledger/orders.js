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
const account_order_1 = require("./parse/account-order");
function formatResponse(address, responses) {
    let orders = [];
    for (const response of responses) {
        const offers = response.offers.map(offer => {
            return account_order_1.parseAccountOrder(address, offer);
        });
        orders = orders.concat(offers);
    }
    return _.sortBy(orders, order => order.properties.sequence);
}
function getOrders(address, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        // 1. Validate
        common_1.validate.getOrders({ address, options });
        // 2. Make Request
        const responses = yield this._requestAll('account_offers', {
            account: address,
            ledger_index: options.ledgerVersion || (yield this.getLedgerVersion()),
            limit: options.limit
        });
        // 3. Return Formatted Response
        return formatResponse(address, responses);
    });
}
exports.default = getOrders;
//# sourceMappingURL=orders.js.map