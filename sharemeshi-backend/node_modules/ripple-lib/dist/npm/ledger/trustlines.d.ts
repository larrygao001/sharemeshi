import { RippleAPI } from '../api';
import { FormattedTrustline } from '../common/types/objects/trustlines';
export declare type GetTrustlinesOptions = {
    counterparty?: string;
    currency?: string;
    limit?: number;
    ledgerVersion?: number;
};
declare function getTrustlines(this: RippleAPI, address: string, options?: GetTrustlinesOptions): Promise<FormattedTrustline[]>;
export default getTrustlines;
