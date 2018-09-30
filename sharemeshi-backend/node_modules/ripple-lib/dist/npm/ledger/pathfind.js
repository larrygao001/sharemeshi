"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const bignumber_js_1 = require("bignumber.js");
const utils_1 = require("./utils");
const common_1 = require("../common");
const pathfind_1 = require("./parse/pathfind");
const NotFoundError = common_1.errors.NotFoundError;
const ValidationError = common_1.errors.ValidationError;
function addParams(request, result) {
    return _.defaults(_.assign({}, result, {
        source_account: request.source_account,
        source_currencies: request.source_currencies
    }), { destination_amount: request.destination_amount });
}
function requestPathFind(connection, pathfind) {
    const destinationAmount = _.assign({ value: '-1' }, pathfind.destination.amount);
    const request = {
        command: 'ripple_path_find',
        source_account: pathfind.source.address,
        destination_account: pathfind.destination.address,
        destination_amount: common_1.toRippledAmount(destinationAmount)
    };
    if (typeof request.destination_amount === 'object'
        && !request.destination_amount.issuer) {
        // Convert blank issuer to sender's address
        // (Ripple convention for 'any issuer')
        // https://ripple.com/build/transactions/
        //     #special-issuer-values-for-sendmax-and-amount
        // https://ripple.com/build/ripple-rest/#counterparties-in-payments
        request.destination_amount.issuer = request.destination_account;
    }
    if (pathfind.source.currencies && pathfind.source.currencies.length > 0) {
        request.source_currencies = pathfind.source.currencies.map(amount => utils_1.renameCounterpartyToIssuer(amount));
    }
    if (pathfind.source.amount) {
        if (pathfind.destination.amount.value !== undefined) {
            throw new ValidationError('Cannot specify both source.amount'
                + ' and destination.amount.value in getPaths');
        }
        request.send_max = common_1.toRippledAmount(pathfind.source.amount);
        if (typeof request.send_max !== 'string' && !request.send_max.issuer) {
            request.send_max.issuer = pathfind.source.address;
        }
    }
    return connection.request(request).then(paths => addParams(request, paths));
}
function addDirectXrpPath(paths, xrpBalance) {
    // Add XRP "path" only if the source acct has enough XRP to make the payment
    const destinationAmount = paths.destination_amount;
    // @ts-ignore: destinationAmount can be a currency amount object! Fix!
    if ((new bignumber_js_1.default(xrpBalance)).greaterThanOrEqualTo(destinationAmount)) {
        paths.alternatives.unshift({
            paths_computed: [],
            source_amount: paths.destination_amount
        });
    }
    return paths;
}
function isRippledIOUAmount(amount) {
    // rippled XRP amounts are specified as decimal strings
    return (typeof amount === 'object') &&
        amount.currency && (amount.currency !== 'XRP');
}
function conditionallyAddDirectXRPPath(connection, address, paths) {
    if (isRippledIOUAmount(paths.destination_amount)
        || !_.includes(paths.destination_currencies, 'XRP')) {
        return Promise.resolve(paths);
    }
    return utils_1.getXRPBalance(connection, address, undefined).then(xrpBalance => addDirectXrpPath(paths, xrpBalance));
}
function filterSourceFundsLowPaths(pathfind, paths) {
    if (pathfind.source.amount &&
        pathfind.destination.amount.value === undefined && paths.alternatives) {
        paths.alternatives = _.filter(paths.alternatives, alt => !!alt.source_amount &&
            !!pathfind.source.amount &&
            // TODO: Returns false when alt.source_amount is a string. Fix?
            typeof alt.source_amount !== 'string' &&
            new bignumber_js_1.default(alt.source_amount.value).eq(pathfind.source.amount.value));
    }
    return paths;
}
function formatResponse(pathfind, paths) {
    if (paths.alternatives && paths.alternatives.length > 0) {
        return pathfind_1.default(paths);
    }
    if (paths.destination_currencies !== undefined &&
        !_.includes(paths.destination_currencies, pathfind.destination.amount.currency)) {
        throw new NotFoundError('No paths found. ' +
            'The destination_account does not accept ' +
            pathfind.destination.amount.currency + ', they only accept: ' +
            paths.destination_currencies.join(', '));
    }
    else if (paths.source_currencies && paths.source_currencies.length > 0) {
        throw new NotFoundError('No paths found. Please ensure' +
            ' that the source_account has sufficient funds to execute' +
            ' the payment in one of the specified source_currencies. If it does' +
            ' there may be insufficient liquidity in the network to execute' +
            ' this payment right now');
    }
    else {
        throw new NotFoundError('No paths found.' +
            ' Please ensure that the source_account has sufficient funds to' +
            ' execute the payment. If it does there may be insufficient liquidity' +
            ' in the network to execute this payment right now');
    }
}
function getPaths(pathfind) {
    common_1.validate.getPaths({ pathfind });
    const address = pathfind.source.address;
    return requestPathFind(this.connection, pathfind).then(paths => conditionallyAddDirectXRPPath(this.connection, address, paths))
        .then(paths => filterSourceFundsLowPaths(pathfind, paths))
        .then(paths => formatResponse(pathfind, paths));
}
exports.default = getPaths;
//# sourceMappingURL=pathfind.js.map