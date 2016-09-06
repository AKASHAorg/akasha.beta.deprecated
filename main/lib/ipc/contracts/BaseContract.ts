import { GethConnector } from '@akashaproject/geth-connector';

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
        return this.contract[method]
            .request(params)
            .params[0];
    }

    estimateGas(method: string, ...params: any[]) {
        return this.contract[method]
            .estimateGas(params);
    }

}
