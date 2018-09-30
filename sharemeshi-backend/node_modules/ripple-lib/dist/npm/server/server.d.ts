import { GetServerInfoResponse } from '../common/serverinfo';
declare function isConnected(): boolean;
declare function getLedgerVersion(): Promise<number>;
declare function connect(): Promise<void>;
declare function disconnect(): Promise<void>;
declare function getServerInfo(): Promise<GetServerInfoResponse>;
declare function getFee(): Promise<string>;
declare function formatLedgerClose(ledgerClose: any): Object;
export { connect, disconnect, isConnected, getServerInfo, getFee, getLedgerVersion, formatLedgerClose };
