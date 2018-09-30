"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const bignumber_js_1 = require("bignumber.js");
const { deriveKeypair } = require('ripple-keypairs');
function isValidSecret(secret) {
    try {
        deriveKeypair(secret);
        return true;
    }
    catch (err) {
        return false;
    }
}
exports.isValidSecret = isValidSecret;
function dropsToXrp(drops) {
    return (new bignumber_js_1.default(drops)).dividedBy(1000000.0).toString();
}
exports.dropsToXrp = dropsToXrp;
function xrpToDrops(xrp) {
    return (new bignumber_js_1.default(xrp)).times(1000000.0).floor().toString();
}
exports.xrpToDrops = xrpToDrops;
function toRippledAmount(amount) {
    if (amount.currency === 'XRP') {
        return xrpToDrops(amount.value);
    }
    return {
        currency: amount.currency,
        issuer: amount.counterparty ? amount.counterparty :
            (amount.issuer ? amount.issuer : undefined),
        value: amount.value
    };
}
exports.toRippledAmount = toRippledAmount;
function convertKeysFromSnakeCaseToCamelCase(obj) {
    if (typeof obj === 'object') {
        let newKey;
        return _.reduce(obj, (result, value, key) => {
            newKey = key;
            // taking this out of function leads to error in PhantomJS
            const FINDSNAKE = /([a-zA-Z]_[a-zA-Z])/g;
            if (FINDSNAKE.test(key)) {
                newKey = key.replace(FINDSNAKE, r => r[0] + r[2].toUpperCase());
            }
            result[newKey] = convertKeysFromSnakeCaseToCamelCase(value);
            return result;
        }, {});
    }
    return obj;
}
exports.convertKeysFromSnakeCaseToCamelCase = convertKeysFromSnakeCaseToCamelCase;
function removeUndefined(obj) {
    return _.omitBy(obj, _.isUndefined);
}
exports.removeUndefined = removeUndefined;
/**
 * @param {Number} rpepoch (seconds since 1/1/2000 GMT)
 * @return {Number} ms since unix epoch
 *
 */
function rippleToUnixTimestamp(rpepoch) {
    return (rpepoch + 0x386D4380) * 1000;
}
/**
 * @param {Number|Date} timestamp (ms since unix epoch)
 * @return {Number} seconds since ripple epoch ( 1/1/2000 GMT)
 */
function unixToRippleTimestamp(timestamp) {
    return Math.round(timestamp / 1000) - 0x386D4380;
}
function rippleTimeToISO8601(rippleTime) {
    return new Date(rippleToUnixTimestamp(rippleTime)).toISOString();
}
exports.rippleTimeToISO8601 = rippleTimeToISO8601;
function iso8601ToRippleTime(iso8601) {
    return unixToRippleTimestamp(Date.parse(iso8601));
}
exports.iso8601ToRippleTime = iso8601ToRippleTime;
//# sourceMappingURL=utils.js.map