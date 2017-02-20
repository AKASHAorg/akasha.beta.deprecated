/// <reference types="bluebird" />
import BaseContract from './BaseContract';
import * as Promise from 'bluebird';
export default class Faucet extends BaseContract {
    constructor(instance: any);
    claim(gas?: number): Promise<any>;
    getLastClaim(idAddress: string): void;
    canClaim(idAddress: string): void;
}
