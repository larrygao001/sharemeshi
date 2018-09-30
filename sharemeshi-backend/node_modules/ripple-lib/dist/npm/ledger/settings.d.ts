import { FormattedSettings } from '../common/types/objects';
import { RippleAPI } from '../api';
export declare type SettingsOptions = {
    ledgerVersion?: number;
};
declare function getSettings(this: RippleAPI, address: string, options?: SettingsOptions): Promise<FormattedSettings>;
export default getSettings;
