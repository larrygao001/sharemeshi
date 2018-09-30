/// <reference types="node" />
import { EventEmitter } from 'events';
import { Connection, errors, validate } from './common';
import { connect, disconnect, isConnected, getServerInfo, getFee, getLedgerVersion } from './server/server';
import getTransaction from './ledger/transaction';
import getTransactions from './ledger/transactions';
import getTrustlines from './ledger/trustlines';
import getBalances from './ledger/balances';
import getBalanceSheet from './ledger/balance-sheet';
import getPaths from './ledger/pathfind';
import getOrders from './ledger/orders';
import getOrderbook from './ledger/orderbook';
import getSettings from './ledger/settings';
import getAccountInfo from './ledger/accountinfo';
import getAccountObjects from './ledger/accountobjects';
import getPaymentChannel from './ledger/payment-channel';
import preparePayment from './transaction/payment';
import prepareTrustline from './transaction/trustline';
import prepareOrder from './transaction/order';
import prepareOrderCancellation from './transaction/ordercancellation';
import prepareEscrowCreation from './transaction/escrow-creation';
import prepareEscrowExecution from './transaction/escrow-execution';
import prepareEscrowCancellation from './transaction/escrow-cancellation';
import preparePaymentChannelCreate from './transaction/payment-channel-create';
import preparePaymentChannelFund from './transaction/payment-channel-fund';
import preparePaymentChannelClaim from './transaction/payment-channel-claim';
import prepareCheckCreate from './transaction/check-create';
import prepareCheckCancel from './transaction/check-cancel';
import prepareCheckCash from './transaction/check-cash';
import prepareSettings from './transaction/settings';
import sign from './transaction/sign';
import combine from './transaction/combine';
import submit from './transaction/submit';
import { generateAddressAPI } from './offline/generate-address';
import computeLedgerHash from './offline/ledgerhash';
import signPaymentChannelClaim from './offline/sign-payment-channel-claim';
import verifyPaymentChannelClaim from './offline/verify-payment-channel-claim';
import getLedger from './ledger/ledger';
import { AccountObjectsRequest, AccountObjectsResponse, AccountOffersRequest, AccountOffersResponse, AccountInfoRequest, AccountInfoResponse, AccountLinesRequest, AccountLinesResponse, BookOffersRequest, BookOffersResponse, GatewayBalancesRequest, GatewayBalancesResponse, LedgerRequest, LedgerResponse, LedgerEntryRequest, LedgerEntryResponse } from './common/types/commands';
import RangeSet from './common/rangeset';
import * as ledgerUtils from './ledger/utils';
import * as schemaValidator from './common/schema-validator';
export declare type APIOptions = {
    server?: string;
    feeCushion?: number;
    trace?: boolean;
    proxy?: string;
    timeout?: number;
};
export declare class RestrictedConnection extends Connection {
    request(request: any, timeout?: number): Promise<any>;
}
declare class RippleAPI extends EventEmitter {
    _feeCushion: number;
    connection: RestrictedConnection;
    static _PRIVATE: {
        validate: typeof validate;
        RangeSet: typeof RangeSet;
        ledgerUtils: typeof ledgerUtils;
        schemaValidator: typeof schemaValidator;
    };
    constructor(options?: APIOptions);
    _request(command: 'account_info', params: AccountInfoRequest): Promise<AccountInfoResponse>;
    _request(command: 'account_lines', params: AccountLinesRequest): Promise<AccountLinesResponse>;
    /**
     * Returns objects owned by an account.
     * For an account's trust lines and balances,
     * see `getTrustlines` and `getBalances`.
     */
    _request(command: 'account_objects', params: AccountObjectsRequest): Promise<AccountObjectsResponse>;
    _request(command: 'account_offers', params: AccountOffersRequest): Promise<AccountOffersResponse>;
    _request(command: 'book_offers', params: BookOffersRequest): Promise<BookOffersResponse>;
    _request(command: 'gateway_balances', params: GatewayBalancesRequest): Promise<GatewayBalancesResponse>;
    _request(command: 'ledger', params: LedgerRequest): Promise<LedgerResponse>;
    _request(command: 'ledger_entry', params: LedgerEntryRequest): Promise<LedgerEntryResponse>;
    /**
     * Makes multiple paged requests to the API to return a given number of
     * resources. _requestAll() will make multiple requests until the `limit`
     * number of resources is reached (if no `limit` is provided, a single request
     * will be made).
     *
     * If the command is unknown, an additional `collect` property is required to
     * know which response key contains the array of resources.
     *
     * NOTE: This command is under development and should not yet be relied
     * on by external consumers.
     */
    _requestAll(command: 'account_offers', params: AccountOffersRequest): Promise<AccountOffersResponse[]>;
    _requestAll(command: 'book_offers', params: BookOffersRequest): Promise<BookOffersResponse[]>;
    _requestAll(command: 'account_lines', params: AccountLinesRequest): Promise<AccountLinesResponse[]>;
    connect: typeof connect;
    disconnect: typeof disconnect;
    isConnected: typeof isConnected;
    getServerInfo: typeof getServerInfo;
    getFee: typeof getFee;
    getLedgerVersion: typeof getLedgerVersion;
    getTransaction: typeof getTransaction;
    getTransactions: typeof getTransactions;
    getTrustlines: typeof getTrustlines;
    getBalances: typeof getBalances;
    getBalanceSheet: typeof getBalanceSheet;
    getPaths: typeof getPaths;
    getOrders: typeof getOrders;
    getOrderbook: typeof getOrderbook;
    getSettings: typeof getSettings;
    getAccountInfo: typeof getAccountInfo;
    getAccountObjects: typeof getAccountObjects;
    getPaymentChannel: typeof getPaymentChannel;
    getLedger: typeof getLedger;
    preparePayment: typeof preparePayment;
    prepareTrustline: typeof prepareTrustline;
    prepareOrder: typeof prepareOrder;
    prepareOrderCancellation: typeof prepareOrderCancellation;
    prepareEscrowCreation: typeof prepareEscrowCreation;
    prepareEscrowExecution: typeof prepareEscrowExecution;
    prepareEscrowCancellation: typeof prepareEscrowCancellation;
    preparePaymentChannelCreate: typeof preparePaymentChannelCreate;
    preparePaymentChannelFund: typeof preparePaymentChannelFund;
    preparePaymentChannelClaim: typeof preparePaymentChannelClaim;
    prepareCheckCreate: typeof prepareCheckCreate;
    prepareCheckCash: typeof prepareCheckCash;
    prepareCheckCancel: typeof prepareCheckCancel;
    prepareSettings: typeof prepareSettings;
    sign: typeof sign;
    combine: typeof combine;
    submit: typeof submit;
    generateAddress: typeof generateAddressAPI;
    computeLedgerHash: typeof computeLedgerHash;
    signPaymentChannelClaim: typeof signPaymentChannelClaim;
    verifyPaymentChannelClaim: typeof verifyPaymentChannelClaim;
    errors: typeof errors;
}
export { RippleAPI };
