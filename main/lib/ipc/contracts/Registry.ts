import * as Promise from 'bluebird';
import BaseContract from './BaseContract';

export default class Registry extends BaseContract {
    /**
     *
     * @param instance
     */
    constructor(instance: any) {
        super();
        this.contract = Promise.promisifyAll(instance);
        this.contract.getById.callAsync = Promise.promisify(this.contract.getById.call);
        this.contract.getByAddr.callAsync = Promise.promisify(this.contract.getByAddr.call);
    }

    /**
     *
     * @param username
     * @returns {any}
     */
    profileExists(username: string) {
        const transformed = this.gethInstance.web3.fromUtf8(username);
        return this.contract
            .getById
            .callAsync(transformed);
    }

    /**
     * Find a profile by contract address
     * @param address
     * @returns {any}
     */
    getByAddress(address: string) {
        return this.contract
            .getByAddr
            .callAsync(address);
    }

    /**
     * Get curre
     * @returns {any}
     */
    getMyProfile() {
        return this.contract
            .getMyProfileAsync();
    }

    /**
     * Register a new profile
     * @param username
     * @param ipfsHash
     * @param gas
     * @returns {PromiseLike<TResult>|Bluebird<U>|Promise<TResult>|Thenable<U>}
     */
    register(username: string, ipfsHash: string[], gas?: number) {
        const usernameTr = this.gethInstance.web3.fromUtf8(username);
        const ipfsHashTr = ipfsHash.map((v) => {
            return this.gethInstance.web3.fromUtf8(v);
        });
        return this.profileExists(usernameTr)
            .then((address: string) => {
                const exists = this.gethInstance.web3.toUtf8(address);

                if (exists) {
                    throw new Error(`${username} already taken`);
                }

                if (ipfsHashTr.length !== 2) {
                    throw new Error('Expected exactly 2 ipfs slices');
                }
                return this.contract
                    .registerAsync(usernameTr, ipfsHashTr, {gas});
            });
    }

}
