import { FormattedAccountOrder } from './parse/account-order';
import { RippleAPI } from '../api';
export declare type GetOrdersOptions = {
    limit?: number;
    ledgerVersion?: number;
};
export default function getOrders(this: RippleAPI, address: string, options?: GetOrdersOptions): Promise<FormattedAccountOrder[]>;
