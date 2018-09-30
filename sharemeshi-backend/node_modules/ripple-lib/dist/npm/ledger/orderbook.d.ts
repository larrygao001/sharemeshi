import { FormattedOrderbookOrder } from './parse/orderbook-order';
import { Issue } from '../common/types/objects';
import { RippleAPI } from '../api';
export declare type FormattedOrderbook = {
    bids: FormattedOrderbookOrder[];
    asks: FormattedOrderbookOrder[];
};
export declare type GetOrderbookOptions = {
    limit?: number;
    ledgerVersion?: number;
};
export declare type OrderbookInfo = {
    base: Issue;
    counter: Issue;
};
export default function getOrderbook(this: RippleAPI, address: string, orderbook: OrderbookInfo, options?: GetOrderbookOptions): Promise<FormattedOrderbook>;
