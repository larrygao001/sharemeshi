import { Instructions, Prepare } from './types';
import { Memo } from '../common/types/objects';
export declare type EscrowExecution = {
    owner: string;
    escrowSequence: number;
    memos?: Array<Memo>;
    condition?: string;
    fulfillment?: string;
};
declare function prepareEscrowExecution(address: string, escrowExecution: EscrowExecution, instructions?: Instructions): Promise<Prepare>;
export default prepareEscrowExecution;
