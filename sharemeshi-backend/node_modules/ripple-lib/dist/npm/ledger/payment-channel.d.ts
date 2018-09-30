import { FormattedPaymentChannel } from './parse/payment-channel';
import { RippleAPI } from '../api';
declare function getPaymentChannel(this: RippleAPI, id: string): Promise<FormattedPaymentChannel>;
export default getPaymentChannel;
