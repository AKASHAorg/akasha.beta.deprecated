/// <reference types="bluebird" />
import BaseContract from './BaseContract';
import * as Promise from 'bluebird';
export default class Registry extends BaseContract {
    constructor(instance: any);
    profileExists(id: string): any;
    addressOf(id: string): any;
    getByAddress(address: string): any;
    checkFormat(id: string): any;
    getLocalProfiles(): any;
    register(id: string, ipfsHash: string, gas?: number): any;
    unregister(id: string, gas?: number): Promise<any>;
    getRegistered(filter: {
        index: {};
        fromBlock: string;
        toBlock?: string;
        address?: string;
    }): any;
}
