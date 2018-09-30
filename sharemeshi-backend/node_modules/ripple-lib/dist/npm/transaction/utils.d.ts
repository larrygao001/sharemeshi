import * as common from '../common';
import { Memo } from '../common/types/objects';
import { Instructions, Prepare } from './types';
import { RippleAPI } from '../api';
export declare type ApiMemo = {
    MemoData?: string;
    MemoType?: string;
    MemoFormat?: string;
};
declare function prepareTransaction(txJSON: any, api: RippleAPI, instructions: Instructions): Promise<Prepare>;
declare function convertStringToHex(string: string): string;
declare function convertMemo(memo: Memo): {
    Memo: ApiMemo;
};
export { convertStringToHex, convertMemo, prepareTransaction, common };
