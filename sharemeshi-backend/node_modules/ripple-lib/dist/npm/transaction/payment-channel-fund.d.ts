import { Instructions, Prepare } from './types';
export declare type PaymentChannelFund = {
    channel: string;
    amount: string;
    expiration?: string;
};
declare function preparePaymentChannelFund(address: string, paymentChannelFund: PaymentChannelFund, instructions?: Instructions): Promise<Prepare>;
export default preparePaymentChannelFund;
