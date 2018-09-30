/// <reference types="node" />
import { EventEmitter } from 'events';
/**
 * Provides `EventEmitter` interface for native browser `WebSocket`,
 * same, as `ws` package provides.
 */
declare class WSWrapper extends EventEmitter {
    private _ws;
    static CONNECTING: number;
    static OPEN: number;
    static CLOSING: number;
    static CLOSED: number;
    constructor(url: any, _protocols: any, _websocketOptions: any);
    close(): void;
    send(message: any): void;
    readonly readyState: number;
}
export = WSWrapper;
