"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const utils_1 = require("./utils");
const amount_1 = require("./amount");
const common_1 = require("../../common");
const flags = common_1.txFlags.OfferCreate;
function parseOrder(tx) {
    assert(tx.TransactionType === 'OfferCreate');
    const direction = (tx.Flags & flags.Sell) === 0 ? 'buy' : 'sell';
    const takerGetsAmount = amount_1.default(tx.TakerGets);
    const takerPaysAmount = amount_1.default(tx.TakerPays);
    const quantity = (direction === 'buy') ? takerPaysAmount : takerGetsAmount;
    const totalPrice = (direction === 'buy') ? takerGetsAmount : takerPaysAmount;
    return common_1.removeUndefined({
        direction: direction,
        quantity: quantity,
        totalPrice: totalPrice,
        passive: ((tx.Flags & flags.Passive) !== 0) || undefined,
        immediateOrCancel: ((tx.Flags & flags.ImmediateOrCancel) !== 0)
            || undefined,
        fillOrKill: ((tx.Flags & flags.FillOrKill) !== 0) || undefined,
        expirationTime: utils_1.parseTimestamp(tx.Expiration)
    });
}
exports.default = parseOrder;
//# sourceMappingURL=order.js.map