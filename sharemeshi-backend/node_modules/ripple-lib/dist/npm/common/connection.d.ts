/// <reference types="node" />
/// <reference types="ws" />
import { EventEmitter } from 'events';
import * as WebSocket from 'ws';
export interface ConnectionOptions {
    trace?: boolean;
    proxy?: string;
    proxyAuthorization?: string;
    authorization?: string;
    trustedCertificates?: string[];
    key?: string;
    passphrase?: string;
    certificate?: string;
    timeout?: number;
}
declare class Connection extends EventEmitter {
    private _url;
    private _trace;
    private _console?;
    private _proxyURL?;
    private _proxyAuthorization?;
    private _authorization?;
    private _trustedCertificates?;
    private _key?;
    private _passphrase?;
    private _certificate?;
    private _timeout;
    private _isReady;
    private _ws;
    protected _ledgerVersion: null | number;
    private _availableLedgerVersions;
    private _nextRequestID;
    private _retry;
    private _retryTimer;
    private _onOpenErrorBound;
    private _onUnexpectedCloseBound;
    private _fee_base;
    private _fee_ref;
    constructor(url: any, options?: ConnectionOptions);
    _updateLedgerVersions(data: any): void;
    _updateFees(data: any): void;
    _parseMessage(message: any): [string, Object] | ['error', string, string, Object];
    _onMessage(message: any): void;
    readonly _state: number;
    readonly _shouldBeConnected: boolean;
    isConnected(): boolean;
    _onUnexpectedClose(beforeOpen: any, resolve: any, reject: any, code: any): void;
    _calculateTimeout(retriesCount: any): number;
    _retryConnect(): void;
    _clearReconnectTimer(): void;
    _onOpen(): Promise<never>;
    _rebindOnUnxpectedClose(): void;
    _unbindOnUnxpectedClose(): void;
    _onOpenError(reject: any, error: any): void;
    _createWebSocket(): WebSocket;
    connect(): Promise<{}>;
    disconnect(): Promise<{}>;
    _disconnect(calledByUser: any): Promise<{}>;
    reconnect(): Promise<{}>;
    _whenReady<T>(promise: Promise<T>): Promise<T>;
    getLedgerVersion(): Promise<number>;
    hasLedgerVersions(lowLedgerVersion: any, highLedgerVersion: any): Promise<boolean>;
    hasLedgerVersion(ledgerVersion: any): Promise<boolean>;
    getFeeBase(): Promise<number>;
    getFeeRef(): Promise<number>;
    _send(message: string): Promise<void>;
    request(request: any, timeout?: number): Promise<any>;
}
export default Connection;
