import BaseContract from './BaseContract';
import * as Promise from 'bluebird';

export default class Profile extends BaseContract {
    /**
     *
     * @param instance
     */
    constructor(instance: any) {
        super();
        this.contract = instance;
    }

    /**
     * Get ipfs hash for profile at address
     * @param address
     * @returns {Bluebird<U>}
     */
    public getIpfs(address: string) {
        const profile = this.contract.at(address);
        const first = Promise.fromCallback(
            (cb) => {
                profile._hash.call(0, cb);
            });

        const second = Promise.fromCallback(
            (cb) => {
                profile._hash.call(1, cb);
            });
        return Promise.all([first, second]).then((parts) => this.flattenIpfs(parts));
    }

    /**
     *
     * @param address
     * @returns {Bluebird<U>}
     */
    public getId(address: string) {
        const profile = this.contract.at(address);
        return Promise.fromCallback(
            (cb) => {
                profile._id.call(cb);
            }
        ).then((id) => this.gethInstance.web3.toUtf8(id));
    }

    /**
     *
     * @param hash
     * @param address
     * @param gas
     * @returns {Bluebird<R>}
     */
    public updateHash(hash: string, address: string, gas?: number) {
        const hashTr = this.splitIpfs(hash);
        const profile = this.contract.at(address);
        const extracted = profile.setHash.request(hashTr, { gas });
        return Promise.resolve(extracted.params[0]);
    }

    /**
     *
     * @param receiver
     * @param value
     * @param unit
     * @param gas
     * @returns {Bluebird<R>}
     */
    public sendTip(receiver: string, value: string, unit: string = 'ether', gas: number = 500000) {
        const profile = this.contract.at(receiver);
        const weiValue = this.gethInstance.web3.toWei(value, unit);
        const extract = profile['sendTip'].request({ gas, value: weiValue });
        return Promise.resolve(extract.params[0]);
    }

}
