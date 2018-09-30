import { Amount } from '../common/types/objects';
import { RippleAPI } from '../api';
export declare type BalanceSheetOptions = {
    excludeAddresses?: Array<string>;
    ledgerVersion?: number;
};
export declare type GetBalanceSheet = {
    balances?: Array<Amount>;
    assets?: Array<Amount>;
    obligations?: Array<{
        currency: string;
        value: string;
    }>;
};
declare function getBalanceSheet(this: RippleAPI, address: string, options?: BalanceSheetOptions): Promise<GetBalanceSheet>;
export default getBalanceSheet;
