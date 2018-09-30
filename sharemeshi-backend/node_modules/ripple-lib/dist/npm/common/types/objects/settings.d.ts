import { Memo } from './memos';
export declare type WeightedSigner = {
    address: string;
    weight: number;
};
export declare type Signers = {
    threshold?: number;
    weights: WeightedSigner[];
};
export declare type FormattedSettings = {
    passwordSpent?: boolean;
    requireDestinationTag?: boolean;
    requireAuthorization?: boolean;
    disallowIncomingXRP?: boolean;
    disableMasterKey?: boolean;
    enableTransactionIDTracking?: boolean;
    noFreeze?: boolean;
    globalFreeze?: boolean;
    defaultRipple?: boolean;
    emailHash?: string | null;
    messageKey?: string;
    domain?: string;
    transferRate?: number | null;
    regularKey?: string;
    signers?: Signers;
    memos?: Memo[];
};
