import { Instructions, Prepare } from './types';
export declare type PaymentChannelCreate = {
    amount: string;
    destination: string;
    settleDelay: number;
    publicKey: string;
    cancelAfter?: string;
    sourceTag?: number;
    destinationTag?: number;
};
declare function preparePaymentChannelCreate(address: string, paymentChannelCreate: PaymentChannelCreate, instructions?: Instructions): Promise<Prepare>;
export default preparePaymentChannelCreate;
