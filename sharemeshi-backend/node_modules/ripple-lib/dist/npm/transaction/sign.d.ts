import { SignOptions, KeyPair } from './types';
declare function sign(txJSON: string, secret?: any, options?: SignOptions, keypair?: KeyPair): {
    signedTransaction: string;
    id: string;
};
export default sign;
