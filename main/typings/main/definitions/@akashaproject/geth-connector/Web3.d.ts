import { Socket } from 'net';
export declare class Web3 {
    web3Instance: any;
    constructor();
    web3: any;
    setProvider(gethIpc: string, socket: Socket): any;
    _adminProps(): {
        properties: any[];
    };
}
