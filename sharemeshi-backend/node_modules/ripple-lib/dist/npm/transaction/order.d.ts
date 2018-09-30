import { Instructions, Prepare } from './types';
import { FormattedOrderSpecification } from '../common/types/objects/index';
declare function prepareOrder(address: string, order: FormattedOrderSpecification, instructions?: Instructions): Promise<Prepare>;
export default prepareOrder;
