"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const amount_1 = require("./amount");
function parsePaths(paths) {
    return paths.map(steps => steps.map(step => _.omit(step, ['type', 'type_hex'])));
}
function removeAnyCounterpartyEncoding(address, amount) {
    return amount.counterparty === address ?
        _.omit(amount, 'counterparty') : amount;
}
function createAdjustment(address, adjustmentWithoutAddress) {
    const amountKey = _.keys(adjustmentWithoutAddress)[0];
    const amount = adjustmentWithoutAddress[amountKey];
    return _.set({ address: address }, amountKey, removeAnyCounterpartyEncoding(address, amount));
}
function parseAlternative(sourceAddress, destinationAddress, destinationAmount, alternative) {
    // we use "maxAmount"/"minAmount" here so that the result can be passed
    // directly to preparePayment
    const amounts = (alternative.destination_amount !== undefined) ?
        { source: { amount: amount_1.default(alternative.source_amount) },
            destination: { minAmount: amount_1.default(alternative.destination_amount) } } :
        { source: { maxAmount: amount_1.default(alternative.source_amount) },
            destination: { amount: amount_1.default(destinationAmount) } };
    return {
        source: createAdjustment(sourceAddress, amounts.source),
        destination: createAdjustment(destinationAddress, amounts.destination),
        paths: JSON.stringify(parsePaths(alternative.paths_computed))
    };
}
function parsePathfind(pathfindResult) {
    const sourceAddress = pathfindResult.source_account;
    const destinationAddress = pathfindResult.destination_account;
    const destinationAmount = pathfindResult.destination_amount;
    return pathfindResult.alternatives.map(alt => parseAlternative(sourceAddress, destinationAddress, destinationAmount, alt));
}
exports.default = parsePathfind;
//# sourceMappingURL=pathfind.js.map