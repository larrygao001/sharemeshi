import { Instructions, Prepare } from './types';
import { Memo } from '../common/types/objects';
export declare type EscrowCreation = {
    amount: string;
    destination: string;
    memos?: Array<Memo>;
    condition?: string;
    allowCancelAfter?: string;
    allowExecuteAfter?: string;
    sourceTag?: number;
    destinationTag?: number;
};
declare function prepareEscrowCreation(address: string, escrowCreation: EscrowCreation, instructions?: Instructions): Promise<Prepare>;
export default prepareEscrowCreation;
