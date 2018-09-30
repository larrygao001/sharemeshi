import { Instructions, Prepare } from './types';
declare function prepareOrderCancellation(address: string, orderCancellation: Object, instructions?: Instructions): Promise<Prepare>;
export default prepareOrderCancellation;
