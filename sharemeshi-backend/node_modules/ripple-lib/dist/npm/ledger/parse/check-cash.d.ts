import { Amount } from '../../common/types/objects';
export declare type FormattedCheckCash = {
    checkID: string;
    amount: Amount;
    deliverMin: Amount;
};
declare function parseCheckCash(tx: any): FormattedCheckCash;
export default parseCheckCash;
