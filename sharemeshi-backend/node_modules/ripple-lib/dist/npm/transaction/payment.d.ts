import { Instructions, Prepare } from './types';
import { Adjustment, MaxAdjustment, MinAdjustment, Memo } from '../common/types/objects';
export interface Payment {
    source: Adjustment | MaxAdjustment;
    destination: Adjustment | MinAdjustment;
    paths?: string;
    memos?: Array<Memo>;
    invoiceID?: string;
    allowPartialPayment?: boolean;
    noDirectRipple?: boolean;
    limitQuality?: boolean;
}
declare function preparePayment(address: string, payment: Payment, instructions?: Instructions): Promise<Prepare>;
export default preparePayment;
