import * as Promise from 'bluebird';
import { unpad } from 'ethereumjs-util';
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
        return this.contract
            .getById
            .callAsync(username);
    }

    /**
     * Find a profile by eth address
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
     *
     * @returns {PromiseLike<{key: string, profile: string}[]>|Thenable<{key: string, profile: string}[]>|Bluebird<{key: string, profile: string}[]>}
     */
    getLocalProfiles() {
        let keyList: string[];
        const profileList: {key: string, profile: string}[] = [];
        return this.gethInstance
            .web3
            .eth
            .getAccountsAsync()
            .then((list: string[]) => {
                list.sort();
               const checkForProfile = list.map((val: string) => {
                  return this.getByAddress(val);
               });
                keyList = list;
                return Promise.all(checkForProfile);
            })
            .then((addrList: string[]) => {
                addrList.forEach((val: string, index: number) => {
                    const valTr = unpad(val);
                    if (valTr) {
                        profileList.push({key: keyList[index], profile: val});
                    }
                });
                keyList = null;
                return profileList;
            });
    }

    /**
     *
     * @param username
     * @param ipfsHash
     * @param gas
     * @returns {PromiseLike<TResult>|Promise<TResult>|Thenable<U>|Bluebird<U>}
     */
    register(username: string, ipfsHash: string, gas: number = 90000) {
        const usernameTr = this.gethInstance.web3.fromUtf8(username);
        const ipfsHashTr = [ipfsHash.slice(0, 23), ipfsHash.slice(23)].map((v) => {
            return this.gethInstance.web3.fromUtf8(v);
        });
        return this.profileExists(usernameTr)
            .then((address: string) => {
                const exists = unpad(address);
                if (exists) {
                    throw new Error(`${username} already taken`);
                }

                if (ipfsHashTr.length !== 2) {
                    throw new Error('Expected exactly 2 ipfs slices');
                }

                return this.estimateGas('register', usernameTr, ipfsHashTr)
                    .then((estimatedGas) => {
                        if (estimatedGas > gas) {
                            throw new Error(`Gas required: ${estimatedGas}, Gas provided: ${gas}`);
                        }
                        return this.extractData('register', usernameTr, ipfsHashTr, {gas});
                    });
            });
    }

}
