import * as Promise from 'bluebird';
import BaseContract from './BaseContract';

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
     * @returns {"~bluebird/bluebird".Bluebird}
     */
    getIpfs(address: string) {
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
     * @returns {"~bluebird/bluebird".Bluebird}
     */
    getTippingAddress(address: string) {
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
     * @returns {"~bluebird/bluebird".Bluebird}
     */
    updateHash(hash: string[], address: string, gas?: number) {
        return new Promise((resolve, reject) => {
            if (hash.length !== 2) {
                return reject(new Error('Expected exactly 2 ipfs slices'));
            }
            this.contract
                .at(address)
                .setHash(hash, { gas }, (err: Error, tx: string) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(tx);
                });
        });
    }

    /**
     *
     * @param address
     * @param tippingAddress
     * @param gas
     * @returns {"~bluebird/bluebird".Bluebird}
     */
    setTippingAddress(address: string, tippingAddress: string, gas?: number) {
        return new Promise((resolve, reject) => {
           this.contract
               .at(address)
               .setEthAddress(tippingAddress, {gas}, (err: Error, tx: string) => {
                   if (err) {
                       return reject(err);
                   }
                   return resolve(tx);
               });
        });
    }

    /**
     * Remove profile
     * @param address
     * @param gas
     * @returns {"~bluebird/bluebird".Bluebird}
     */
    unregister(address: string, gas?: number) {
        return new Promise((resolve, reject) => {
           this.contract
               .at(address)
               .destroy({gas}, (err: Error, tx: string) => {
                   if (err) {
                       return reject(err);
                   }
                   return resolve(tx);
               });
        });
    }

}
