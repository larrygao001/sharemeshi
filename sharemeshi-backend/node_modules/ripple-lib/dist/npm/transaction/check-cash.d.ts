import { Instructions, Prepare } from './types';
import { Amount } from '../common/types/objects';
export declare type CheckCash = {
    checkID: string;
    amount?: Amount;
    deliverMin?: Amount;
};
declare function prepareCheckCash(address: string, checkCash: CheckCash, instructions?: Instructions): Promise<Prepare>;
export default prepareCheckCash;
