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
     *
     * @returns {PromiseLike<TResult>|Bluebird<U>|Thenable<U>}
     */
    getLocalProfiles() {
        let keyList: string[];
        const profileList: [string[]] = [[]];
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
                    val = this.gethInstance.web3.toUtf8(val);
                    if (val !== '') {
                        profileList.push([keyList[index], val]);
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
    register(username: string, ipfsHash: string[], gas: number = 90000) {
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

                const estimatedGas = this.estimateGas('register', usernameTr, ipfsHashTr);
                if (estimatedGas > gas) {
                    throw new Error(`Gas required: ${estimatedGas}, Gas provided: ${gas}`);
                }
                return this.extractData('register', usernameTr, ipfsHashTr, {gas});
            });
    }

}
