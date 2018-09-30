"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const keypairs = require("ripple-keypairs");
const common = require("../common");
const { errors, validate } = common;
function generateAddress(options) {
    const secret = keypairs.generateSeed(options);
    const keypair = keypairs.deriveKeypair(secret);
    const address = keypairs.deriveAddress(keypair.publicKey);
    return { secret, address };
}
function generateAddressAPI(options) {
    validate.generateAddress({ options });
    try {
        return generateAddress(options);
    }
    catch (error) {
        throw new errors.UnexpectedError(error.message);
    }
}
exports.generateAddressAPI = generateAddressAPI;
//# sourceMappingURL=generate-address.js.map