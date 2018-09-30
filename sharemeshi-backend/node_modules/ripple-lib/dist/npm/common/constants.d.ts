declare const AccountFlags: {
    passwordSpent: number;
    requireDestinationTag: number;
    requireAuthorization: number;
    depositAuth: number;
    disallowIncomingXRP: number;
    disableMasterKey: number;
    noFreeze: number;
    globalFreeze: number;
    defaultRipple: number;
};
declare const AccountFlagIndices: {
    requireDestinationTag: number;
    requireAuthorization: number;
    depositAuth: number;
    disallowIncomingXRP: number;
    disableMasterKey: number;
    enableTransactionIDTracking: number;
    noFreeze: number;
    globalFreeze: number;
    defaultRipple: number;
};
declare const AccountFields: {
    EmailHash: {
        name: string;
        encoding: string;
        length: number;
        defaults: string;
    };
    MessageKey: {
        name: string;
    };
    Domain: {
        name: string;
        encoding: string;
    };
    TransferRate: {
        name: string;
        defaults: number;
        shift: number;
    };
};
export { AccountFields, AccountFlagIndices, AccountFlags };
