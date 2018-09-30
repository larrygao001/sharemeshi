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
const events_1 = require("events");
const common_1 = require("./common");
const server_1 = require("./server/server");
const transaction_1 = require("./ledger/transaction");
const transactions_1 = require("./ledger/transactions");
const trustlines_1 = require("./ledger/trustlines");
const balances_1 = require("./ledger/balances");
const balance_sheet_1 = require("./ledger/balance-sheet");
const pathfind_1 = require("./ledger/pathfind");
const orders_1 = require("./ledger/orders");
const orderbook_1 = require("./ledger/orderbook");
const settings_1 = require("./ledger/settings");
const accountinfo_1 = require("./ledger/accountinfo");
const accountobjects_1 = require("./ledger/accountobjects");
const payment_channel_1 = require("./ledger/payment-channel");
const payment_1 = require("./transaction/payment");
const trustline_1 = require("./transaction/trustline");
const order_1 = require("./transaction/order");
const ordercancellation_1 = require("./transaction/ordercancellation");
const escrow_creation_1 = require("./transaction/escrow-creation");
const escrow_execution_1 = require("./transaction/escrow-execution");
const escrow_cancellation_1 = require("./transaction/escrow-cancellation");
const payment_channel_create_1 = require("./transaction/payment-channel-create");
const payment_channel_fund_1 = require("./transaction/payment-channel-fund");
const payment_channel_claim_1 = require("./transaction/payment-channel-claim");
const check_create_1 = require("./transaction/check-create");
const check_cancel_1 = require("./transaction/check-cancel");
const check_cash_1 = require("./transaction/check-cash");
const settings_2 = require("./transaction/settings");
const sign_1 = require("./transaction/sign");
const combine_1 = require("./transaction/combine");
const submit_1 = require("./transaction/submit");
const generate_address_1 = require("./offline/generate-address");
const ledgerhash_1 = require("./offline/ledgerhash");
const sign_payment_channel_claim_1 = require("./offline/sign-payment-channel-claim");
const verify_payment_channel_claim_1 = require("./offline/verify-payment-channel-claim");
const ledger_1 = require("./ledger/ledger");
const rangeset_1 = require("./common/rangeset");
const ledgerUtils = require("./ledger/utils");
const schemaValidator = require("./common/schema-validator");
const utils_1 = require("./ledger/utils");
/**
 * Get the response key / property name that contains the listed data for a
 * command. This varies from command to command, but we need to know it to
 * properly count across many requests.
 */
function getCollectKeyFromCommand(command) {
    switch (command) {
        case 'account_offers':
        case 'book_offers':
            return 'offers';
        case 'account_lines':
            return 'lines';
        default:
            return undefined;
    }
}
// prevent access to non-validated ledger versions
class RestrictedConnection extends common_1.Connection {
    request(request, timeout) {
        const ledger_index = request.ledger_index;
        if (ledger_index !== undefined && ledger_index !== 'validated') {
            if (!_.isNumber(ledger_index) || ledger_index > this._ledgerVersion) {
                return Promise.reject(new common_1.errors.LedgerVersionError(`ledgerVersion ${ledger_index} is greater than server\'s ` +
                    `most recent validated ledger: ${this._ledgerVersion}`));
            }
        }
        return super.request(request, timeout);
    }
}
exports.RestrictedConnection = RestrictedConnection;
class RippleAPI extends events_1.EventEmitter {
    constructor(options = {}) {
        super();
        this.connect = server_1.connect;
        this.disconnect = server_1.disconnect;
        this.isConnected = server_1.isConnected;
        this.getServerInfo = server_1.getServerInfo;
        this.getFee = server_1.getFee;
        this.getLedgerVersion = server_1.getLedgerVersion;
        this.getTransaction = transaction_1.default;
        this.getTransactions = transactions_1.default;
        this.getTrustlines = trustlines_1.default;
        this.getBalances = balances_1.default;
        this.getBalanceSheet = balance_sheet_1.default;
        this.getPaths = pathfind_1.default;
        this.getOrders = orders_1.default;
        this.getOrderbook = orderbook_1.default;
        this.getSettings = settings_1.default;
        this.getAccountInfo = accountinfo_1.default;
        this.getAccountObjects = accountobjects_1.default;
        this.getPaymentChannel = payment_channel_1.default;
        this.getLedger = ledger_1.default;
        this.preparePayment = payment_1.default;
        this.prepareTrustline = trustline_1.default;
        this.prepareOrder = order_1.default;
        this.prepareOrderCancellation = ordercancellation_1.default;
        this.prepareEscrowCreation = escrow_creation_1.default;
        this.prepareEscrowExecution = escrow_execution_1.default;
        this.prepareEscrowCancellation = escrow_cancellation_1.default;
        this.preparePaymentChannelCreate = payment_channel_create_1.default;
        this.preparePaymentChannelFund = payment_channel_fund_1.default;
        this.preparePaymentChannelClaim = payment_channel_claim_1.default;
        this.prepareCheckCreate = check_create_1.default;
        this.prepareCheckCash = check_cash_1.default;
        this.prepareCheckCancel = check_cancel_1.default;
        this.prepareSettings = settings_2.default;
        this.sign = sign_1.default;
        this.combine = combine_1.default;
        this.submit = submit_1.default;
        this.generateAddress = generate_address_1.generateAddressAPI;
        this.computeLedgerHash = ledgerhash_1.default;
        this.signPaymentChannelClaim = sign_payment_channel_claim_1.default;
        this.verifyPaymentChannelClaim = verify_payment_channel_claim_1.default;
        this.errors = common_1.errors;
        common_1.validate.apiOptions(options);
        this._feeCushion = options.feeCushion || 1.2;
        const serverURL = options.server;
        if (serverURL !== undefined) {
            this.connection = new RestrictedConnection(serverURL, options);
            this.connection.on('ledgerClosed', message => {
                this.emit('ledger', server_1.formatLedgerClose(message));
            });
            this.connection.on('error', (errorCode, errorMessage, data) => {
                this.emit('error', errorCode, errorMessage, data);
            });
            this.connection.on('connected', () => {
                this.emit('connected');
            });
            this.connection.on('disconnected', code => {
                this.emit('disconnected', code);
            });
        }
        else {
            // use null object pattern to provide better error message if user
            // tries to call a method that requires a connection
            this.connection = new RestrictedConnection(null, options);
        }
    }
    /**
     * Makes a request to the API with the given command and
     * additional request body parameters.
     *
     * NOTE: This command is under development.
     */
    _request(command, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connection.request(Object.assign({}, params, { command }));
        });
    }
    _requestAll(command, params = {}, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // The data under collection is keyed based on the command. Fail if command
            // not recognized and collection key not provided.
            const collectKey = options.collect || getCollectKeyFromCommand(command);
            if (!collectKey) {
                throw new common_1.errors.ValidationError(`no collect key for command ${command}`);
            }
            // If limit is not provided, fetches all data over multiple requests.
            // NOTE: This may return much more than needed. Set limit when possible.
            const countTo = (params.limit !== undefined) ? params.limit : Infinity;
            let count = 0;
            let marker = params.marker;
            let lastBatchLength;
            const results = [];
            do {
                const countRemaining = utils_1.clamp(countTo - count, 10, 400);
                const repeatProps = Object.assign({}, params, { limit: countRemaining, marker });
                // NOTE: We have to generalize the `this._request()` function signature
                // here until we add support for unknown commands (since command is some
                // unknown string).
                const singleResult = yield this._request(command, repeatProps);
                const collectedData = singleResult[collectKey];
                marker = singleResult.marker;
                results.push(singleResult);
                // Make sure we handle when no data (not even an empty array) is returned.
                const isExpectedFormat = Array.isArray(collectedData);
                if (isExpectedFormat) {
                    count += collectedData.length;
                    lastBatchLength = collectedData.length;
                }
                else {
                    lastBatchLength = 0;
                }
            } while (!!marker && count < countTo && lastBatchLength !== 0);
            return results;
        });
    }
}
// these are exposed only for use by unit tests; they are not part of the API.
RippleAPI._PRIVATE = {
    validate: common_1.validate,
    RangeSet: rangeset_1.default,
    ledgerUtils,
    schemaValidator
};
exports.RippleAPI = RippleAPI;
//# sourceMappingURL=api.js.map