import { RippleAPI } from '../api';
import { GetAccountObjectsOptions, AccountObjectsResponse } from '../common/types/commands/account_objects';
export default function getAccountObjects(this: RippleAPI, address: string, options?: GetAccountObjectsOptions): Promise<AccountObjectsResponse>;
