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
     * @returns {"bluebird".Bluebird}
     */
    public getIpfs(address: string) {
        return new Promise((resolve, reject) => {
            this.contract
                .at(address)
                .getIpfs
                .call(
                    (err: Error, hash: string[]) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve(this.flattenIpfs(hash));
                    }
                );
        });

    }

    /**
     * Get tipping address for a specific profile
     * @param address
     * @returns {"bluebird".Bluebird}
     */
    public getTippingAddress(address: string) {
        return new Promise((resolve, reject) => {
            this.contract
                .at(address)
                .getCollector
                .call((err: Error, data: string) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(data);
                });
        });
    }

    /**
     *
     * @param hash
     * @param address
     * @param gas
     * @returns {any}
     */
    public updateHash(hash: string, address: string, gas?: number) {
        const hashTr = this.splitIpfs(hash);
        const extracted = this.contract.at(address).setHash.request(hashTr, { gas });
        return Promise.resolve(extracted.params[0]);
    }

    /**
     *
     * @param address
     * @param tippingAddress
     * @param gas
     * @returns {Bluebird<R>}
     */
    public setTippingAddress(address: string, tippingAddress: string, gas?: number) {
        const extracted = this.contract
            .at(address)
            .setEthAddress
            .request(tippingAddress, { gas });
        return Promise.resolve(extracted.params[0]);
    }

    /**
     *
     * @param address
     * @param gas
     * @returns {Bluebird<R>}
     */
    public unregister(address: string, gas?: number) {
        const extracted = this.contract
            .at(address)
            .destroy
            .request({ gas });
        return Promise.resolve(extracted.params[0]);
    }

}
