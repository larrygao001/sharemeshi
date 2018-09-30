import { Instructions, Prepare } from './types';
export declare type PaymentChannelClaim = {
    channel: string;
    balance?: string;
    amount?: string;
    signature?: string;
    publicKey?: string;
    renew?: boolean;
    close?: boolean;
};
declare function preparePaymentChannelClaim(address: string, paymentChannelClaim: PaymentChannelClaim, instructions?: Instructions): Promise<Prepare>;
export default preparePaymentChannelClaim;
