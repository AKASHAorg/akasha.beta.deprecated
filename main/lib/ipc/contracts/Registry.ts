import BaseContract from "./BaseContract";
import * as Promise from "bluebird";
import { unpad } from "ethereumjs-util";

export default class Registry extends BaseContract {
    /**
     *
     * @param instance
     */
    constructor(instance: any) {
        super();
        this.contract = Promise.promisifyAll(instance);
        this.contract.addressOf.callAsync = Promise.promisify(this.contract.addressOf.call);
        this.contract.addressOfKey.callAsync = Promise.promisify(this.contract.addressOfKey.call);
        this.contract.isRegistered.callAsync = Promise.promisify(this.contract.isRegistered.call);
        this.contract.check_format.callAsync = Promise.promisify(this.contract.check_format.call);
    }

    /**
     *
     * @param id
     * @returns {any}
     */
    public profileExists(id: string) {
        return this.contract
            .addressOf
            .callAsync(id)
            .then((exists) => {
                return !!unpad(exists);
            });
    }

    /**
     *
     * @param id
     * @returns {any}
     */
    public addressOf(id: string) {
        return this.contract
            .addressOf
            .callAsync(id)
    }

    /**
     * Find a profile by eth address
     * @param address
     * @returns {any}
     */
    public getByAddress(address: string) {
        return this.contract
            .addressOfKey
            .callAsync(address)
            .then((profileAddress) => {
                if (!!unpad(profileAddress)) {
                    return profileAddress;
                }
                return '';
            });
    }

    public checkFormat(id: string) {
        return this.contract
            .check_format
            .callAsync(id)
    }

    /**
     *
     * @returns {any}
     */
    public getLocalProfiles() {
        let keyList: string[];
        const profileList: { key: string, profile: string }[] = [];
        return this.gethInstance
            .web3
            .eth
            .getAccountsAsync()
            .then((list: string[]) => {
                if (!list) {
                    return Promise.resolve([]);
                }
                list.sort();
                const checkForProfile = list.map((val: string) => {
                    return this.getByAddress(val);
                });
                keyList = list;
                return Promise.all(checkForProfile);
            })
            .then((addrList: string[]) => {
                addrList.forEach((val: string, index: number) => {
                    if (val) {
                        profileList.push({ key: keyList[index], profile: val });
                    }
                });
                keyList = null;
                return profileList;
            });
    }

    /**
     *
     * @param id
     * @param ipfsHash
     * @param gas
     * @returns {PromiseLike<TResult>|Promise<TResult>|Thenable<U>|Bluebird<U>}
     */
    public register(id: string, ipfsHash: string, gas: number = 2000000) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        const ipfsHashTr = this.splitIpfs(ipfsHash);
        return this.profileExists(idTr)
            .then((address: string) => {
                const exists = unpad(address);
                if (exists) {
                    throw new Error(`${id} already taken`);
                }

                if (ipfsHashTr.length !== 2) {
                    throw new Error('Expected exactly 2 ipfs slices');
                }
                return this.contract
                    .check_format
                    .callAsync(id);
            }).then((isOK) => {
                if (!isOK) {
                    throw new Error(`${id} has illegal characters`);
                }

                return this.evaluateData('register', gas, idTr, ipfsHashTr);
            })
    }

    /**
     *
     * @param id
     * @param gas
     * @returns {Bluebird<U>}
     */
    public unregister(id: string, gas: number = 2000000) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.evaluateData('unregister', gas, idTr);
    }

    /**
     *
     * @param filter
     * @returns {Bluebird<T>|any}
     */
    public getRegistered(filter: { index: {}, fromBlock: string, toBlock?: string, address?: string }) {
        const { fromBlock, toBlock, address } = filter;
        const Registered = this.contract.Register(filter.index, { fromBlock, toBlock, address });
        Registered.getAsync = Promise.promisify(Registered.get);
        return Registered.getAsync();
    }

}
