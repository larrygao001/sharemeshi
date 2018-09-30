import Connection from './connection';
export declare type GetServerInfoResponse = {
    buildVersion: string;
    completeLedgers: string;
    hostID: string;
    ioLatencyMs: number;
    load?: {
        jobTypes: Array<Object>;
        threads: number;
    };
    lastClose: {
        convergeTimeS: number;
        proposers: number;
    };
    loadFactor: number;
    peers: number;
    pubkeyNode: string;
    pubkeyValidator?: string;
    serverState: string;
    validatedLedger: {
        age: number;
        baseFeeXRP: string;
        hash: string;
        reserveBaseXRP: string;
        reserveIncrementXRP: string;
        ledgerVersion: number;
    };
    validationQuorum: number;
};
declare function getServerInfo(connection: Connection): Promise<GetServerInfoResponse>;
declare function getFee(connection: Connection, cushion: number): Promise<string>;
export { getServerInfo, getFee };
