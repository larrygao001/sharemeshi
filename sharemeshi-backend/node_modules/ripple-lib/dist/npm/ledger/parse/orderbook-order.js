"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const utils_1 = require("./utils");
const common_1 = require("../../common");
const flags_1 = require("./flags");
const amount_1 = require("./amount");
function parseOrderbookOrder(data) {
    const direction = (data.Flags & flags_1.orderFlags.Sell) === 0 ? 'buy' : 'sell';
    const takerGetsAmount = amount_1.default(data.TakerGets);
    const takerPaysAmount = amount_1.default(data.TakerPays);
    const quantity = (direction === 'buy') ? takerPaysAmount : takerGetsAmount;
    const totalPrice = (direction === 'buy') ? takerGetsAmount : takerPaysAmount;
    // note: immediateOrCancel and fillOrKill orders cannot enter the order book
    // so we can omit those flags here
    const specification = common_1.removeUndefined({
        direction: direction,
        quantity: quantity,
        totalPrice: totalPrice,
        passive: ((data.Flags & flags_1.orderFlags.Passive) !== 0) || undefined,
        expirationTime: utils_1.parseTimestamp(data.Expiration)
    });
    const properties = {
        maker: data.Account,
        sequence: data.Sequence,
        makerExchangeRate: utils_1.adjustQualityForXRP(data.quality, takerGetsAmount.currency, takerPaysAmount.currency)
    };
    const takerGetsFunded = data.taker_gets_funded ?
        amount_1.default(data.taker_gets_funded) : undefined;
    const takerPaysFunded = data.taker_pays_funded ?
        amount_1.default(data.taker_pays_funded) : undefined;
    const available = common_1.removeUndefined({
        fundedAmount: takerGetsFunded,
        priceOfFundedAmount: takerPaysFunded
    });
    const state = _.isEmpty(available) ? undefined : available;
    return common_1.removeUndefined({ specification, properties, state, data });
}
exports.parseOrderbookOrder = parseOrderbookOrder;
//# sourceMappingURL=orderbook-order.js.map