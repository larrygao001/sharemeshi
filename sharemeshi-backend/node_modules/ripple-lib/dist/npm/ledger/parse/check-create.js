"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const utils_1 = require("./utils");
const common_1 = require("../../common");
const amount_1 = require("./amount");
function parseCheckCreate(tx) {
    assert(tx.TransactionType === 'CheckCreate');
    return common_1.removeUndefined({
        destination: tx.Destination,
        sendMax: amount_1.default(tx.SendMax),
        destinationTag: tx.DestinationTag,
        expiration: tx.Expiration && utils_1.parseTimestamp(tx.Expiration),
        invoiceID: tx.InvoiceID
    });
}
exports.default = parseCheckCreate;
//# sourceMappingURL=check-create.js.map