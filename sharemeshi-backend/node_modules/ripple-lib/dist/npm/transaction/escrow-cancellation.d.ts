import { Instructions, Prepare } from './types';
import { Memo } from '../common/types/objects';
export declare type EscrowCancellation = {
    owner: string;
    escrowSequence: number;
    memos?: Array<Memo>;
};
declare function prepareEscrowCancellation(address: string, escrowCancellation: EscrowCancellation, instructions?: Instructions): Promise<Prepare>;
export default prepareEscrowCancellation;
