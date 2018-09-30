import { GetTrustlinesOptions } from './trustlines';
export declare type Balance = {
    value: string;
    currency: string;
    counterparty?: string;
};
export declare type GetBalances = Array<Balance>;
declare function getBalances(address: string, options?: GetTrustlinesOptions): Promise<GetBalances>;
export default getBalances;
