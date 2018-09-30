import { FormattedLedger } from './parse/ledger';
import { RippleAPI } from '../api';
export declare type GetLedgerOptions = {
    ledgerVersion?: number;
    includeAllData?: boolean;
    includeTransactions?: boolean;
    includeState?: boolean;
};
declare function getLedger(this: RippleAPI, options?: GetLedgerOptions): Promise<FormattedLedger>;
export default getLedger;
