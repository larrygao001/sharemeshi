import { FormattedTransactionType } from '../transaction/types';
export declare type TransactionOptions = {
    minLedgerVersion?: number;
    maxLedgerVersion?: number;
};
declare function getTransaction(id: string, options?: TransactionOptions): Promise<FormattedTransactionType>;
export default getTransaction;
