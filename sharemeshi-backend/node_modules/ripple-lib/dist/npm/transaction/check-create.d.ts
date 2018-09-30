import { Instructions, Prepare } from './types';
import { Amount } from '../common/types/objects';
export declare type CheckCreate = {
    destination: string;
    sendMax: Amount;
    destinationTag?: number;
    expiration?: string;
    invoiceID?: string;
};
declare function prepareCheckCreate(address: string, checkCreate: CheckCreate, instructions?: Instructions): Promise<Prepare>;
export default prepareCheckCreate;
