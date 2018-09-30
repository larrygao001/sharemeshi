import { RippleAPI } from './api';
declare class RippleAPIBroadcast extends RippleAPI {
    ledgerVersion: number | undefined;
    private _apis;
    constructor(servers: any, options: any);
    onLedgerEvent(ledger: any): void;
    getMethodNames(): string[];
}
export { RippleAPIBroadcast };
