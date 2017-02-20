/// <reference types="bluebird" />
import BaseContract from './BaseContract';
import * as Promise from 'bluebird';
export default class Profile extends BaseContract {
    constructor(instance: any);
    getIpfs(address: string): Promise<any>;
    getId(address: string): Promise<any>;
    updateHash(hash: string, address: string, gas?: number): Promise<any>;
    sendTip(receiver: string, value: string, unit?: string, gas?: number): Promise<any>;
}
