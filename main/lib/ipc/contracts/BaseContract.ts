import { GethConnector } from '@akashaproject/geth-connector';
import * as Promise from 'bluebird';

export default class BaseContract {
    protected contract: any;
    protected gethInstance: GethConnector;

    /**
     *
     */
    constructor() {
        this.gethInstance = GethConnector.getInstance();
    }

    /**
     * Join ipfs hash slices
     * @param ipfsHash
     * @returns {any}
     */
    public flattenIpfs(ipfsHash: string[]) {
        return this.gethInstance.web3.toUtf8(ipfsHash[0]) +
            this.gethInstance.web3.toUtf8(ipfsHash[1]);
    }

    public splitIpfs(ipfsHash: string){
        const offset = Math.floor(ipfsHash.length / 2);
        return [
            this.gethInstance.web3.fromUtf8(ipfsHash.slice(0, offset)),
            this.gethInstance.web3.fromUtf8(ipfsHash.slice(offset))
        ];
    }

    /**
     * @returns {any}
     */
    public getContract() {
        return this.contract;
    }

    /**
     *
     * @param method
     * @param params
     * @returns {any}
     */
    public extractData(method: string, ...params: any[]) {
        const payload = this.contract[method].request(...params);
        return payload.params[0];
    }

    /**
     *
     * @param method
     * @param params
     * @returns {"~bluebird/bluebird".Bluebird}
     */
    public estimateGas(method: string, ...params: any[]) {
        return new Promise((resolve, reject) => {
            this.contract[method]
                .estimateGas(...params, (err: any, gas: number) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(gas);
                });
        });
    }

    public evaluateData(method: string, gas: number, ...params: any[]) {
        return this.estimateGas(method, ...params).then((estimatedGas) => {
            if (estimatedGas > gas) {
                throw new Error(`${method} GAS => { required: ${estimatedGas}, provided: ${gas} }`);
            }
            console.log('estimated gas for', method, estimatedGas);
            return this.extractData(method, ...params, { gas });
        });
    }

}
