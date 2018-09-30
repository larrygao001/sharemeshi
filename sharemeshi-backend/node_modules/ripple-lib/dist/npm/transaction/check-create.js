"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("./utils");
const toRippledAmount = utils.common.toRippledAmount;
const common_1 = require("../common");
function createCheckCreateTransaction(account, check) {
    const txJSON = {
        Account: account,
        TransactionType: 'CheckCreate',
        Destination: check.destination,
        SendMax: toRippledAmount(check.sendMax)
    };
    if (check.destinationTag !== undefined) {
        txJSON.DestinationTag = check.destinationTag;
    }
    if (check.expiration !== undefined) {
        txJSON.Expiration = common_1.iso8601ToRippleTime(check.expiration);
    }
    if (check.invoiceID !== undefined) {
        txJSON.InvoiceID = check.invoiceID;
    }
    return txJSON;
}
function prepareCheckCreate(address, checkCreate, instructions = {}) {
    common_1.validate.prepareCheckCreate({ address, checkCreate, instructions });
    const txJSON = createCheckCreateTransaction(address, checkCreate);
    return utils.prepareTransaction(txJSON, this, instructions);
}
exports.default = prepareCheckCreate;
//# sourceMappingURL=check-create.js.map