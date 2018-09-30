import { Instructions, Prepare } from './types';
import { FormattedSettings } from '../common/types/objects';
declare function prepareSettings(address: string, settings: FormattedSettings, instructions?: Instructions): Promise<Prepare>;
export default prepareSettings;
