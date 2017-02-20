/// <reference types="bluebird" />
import { GethConnector } from '@akashaproject/geth-connector';
import * as Promise from 'bluebird';
export default class BaseContract {
    protected contract: any;
    protected gethInstance: GethConnector;
    constructor();
    flattenIpfs(ipfsHash: string[]): any;
    splitIpfs(ipfsHash: string): any[];
    getContract(): any;
    extractData(method: string, ...params: any[]): any;
    estimateGas(method: string, ...params: any[]): Promise<{}>;
    evaluateData(method: string, gas: number, ...params: any[]): Promise<any>;
}
