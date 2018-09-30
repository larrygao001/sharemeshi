import { Instructions, Prepare } from './types';
export declare type CheckCancel = {
    checkID: string;
};
declare function prepareCheckCancel(address: string, checkCancel: CheckCancel, instructions?: Instructions): Promise<Prepare>;
export default prepareCheckCancel;
