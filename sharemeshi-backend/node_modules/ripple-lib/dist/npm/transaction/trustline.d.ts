import { Instructions, Prepare } from './types';
import { FormattedTrustlineSpecification } from '../common/types/objects/trustlines';
declare function prepareTrustline(address: string, trustline: FormattedTrustlineSpecification, instructions?: Instructions): Promise<Prepare>;
export default prepareTrustline;
