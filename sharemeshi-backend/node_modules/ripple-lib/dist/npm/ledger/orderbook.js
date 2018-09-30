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
const utils = require("./utils");
const orderbook_order_1 = require("./parse/orderbook-order");
const common_1 = require("../common");
function isSameIssue(a, b) {
    return a.currency === b.currency && a.counterparty === b.counterparty;
}
function directionFilter(direction, order) {
    return order.specification.direction === direction;
}
function flipOrder(order) {
    const specification = order.specification;
    const flippedSpecification = {
        quantity: specification.totalPrice,
        totalPrice: specification.quantity,
        direction: specification.direction === 'buy' ? 'sell' : 'buy'
    };
    const newSpecification = _.merge({}, specification, flippedSpecification);
    return _.merge({}, order, { specification: newSpecification });
}
function alignOrder(base, order) {
    const quantity = order.specification.quantity;
    return isSameIssue(quantity, base) ? order : flipOrder(order);
}
function formatBidsAndAsks(orderbook, offers) {
    // the "base" currency is the currency that you are buying or selling
    // the "counter" is the currency that the "base" is priced in
    // a "bid"/"ask" is an order to buy/sell the base, respectively
    // for bids: takerGets = totalPrice = counter, takerPays = quantity = base
    // for asks: takerGets = quantity = base, takerPays = totalPrice = counter
    // quality = takerPays / takerGets; price = totalPrice / quantity
    // for bids: lowest quality => lowest quantity/totalPrice => highest price
    // for asks: lowest quality => lowest totalPrice/quantity => lowest price
    // for both bids and asks, lowest quality is closest to mid-market
    // we sort the orders so that earlier orders are closer to mid-market
    const orders = _.sortBy(offers, 'quality').map(orderbook_order_1.parseOrderbookOrder);
    const alignedOrders = orders.map(_.partial(alignOrder, orderbook.base));
    const bids = alignedOrders.filter(_.partial(directionFilter, 'buy'));
    const asks = alignedOrders.filter(_.partial(directionFilter, 'sell'));
    return { bids, asks };
}
// account is to specify a "perspective", which affects which unfunded offers
// are returned
function makeRequest(api, taker, options, takerGets, takerPays) {
    return __awaiter(this, void 0, void 0, function* () {
        const orderData = utils.renameCounterpartyToIssuerInOrder({
            taker_gets: takerGets,
            taker_pays: takerPays
        });
        return api._requestAll('book_offers', {
            taker_gets: orderData.taker_gets,
            taker_pays: orderData.taker_pays,
            ledger_index: options.ledgerVersion || 'validated',
            limit: options.limit,
            taker
        });
    });
}
function getOrderbook(address, orderbook, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        // 1. Validate
        common_1.validate.getOrderbook({ address, orderbook, options });
        // 2. Make Request
        const [directOfferResults, reverseOfferResults] = yield Promise.all([
            makeRequest(this, address, options, orderbook.base, orderbook.counter),
            makeRequest(this, address, options, orderbook.counter, orderbook.base)
        ]);
        // 3. Return Formatted Response
        const directOffers = _.flatMap(directOfferResults, directOfferResult => directOfferResult.offers);
        const reverseOffers = _.flatMap(reverseOfferResults, reverseOfferResult => reverseOfferResult.offers);
        return formatBidsAndAsks(orderbook, [...directOffers, ...reverseOffers]);
    });
}
exports.default = getOrderbook;
//# sourceMappingURL=orderbook.js.map