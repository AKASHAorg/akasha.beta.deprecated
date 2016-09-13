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
    flattenIpfs(ipfsHash: string[]) {
        return this.gethInstance.web3.toUtf8(ipfsHash[0]) +
            this.gethInstance.web3.toUtf8(ipfsHash[1]);
    }

    /**
     * @returns {any}
     */
    getContract() {
        return this.contract;
    }

    /**
     *
     * @param method
     * @param params
     * @returns {any}
     */
    extractData(method: string, ...params: any[]) {
        const payload = this.contract[method].request(...params);
        return payload.params[0];
    }

    estimateGas(method: string, ...params: any[]) {
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

}
