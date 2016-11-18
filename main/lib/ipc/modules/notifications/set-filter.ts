import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';

export const filter = {
    _address: {},
    _blockNr: 0,
    setBlockNr: (bNr: number) => {
        this._blockNr = bNr;
    },
    setAddress: (addresses) => {
        this._address = addresses;
    },
    hasAddress: (qAddress) => {
        return this._address.hasOwnProperty(qAddress);
    },
    getBlockNr: () => {
        return this._blockNr;
    }
};
/**
 * Set which profiles to watch for changes
 * @param data
 * @returns {Bluebird<{done: boolean, watching: any}>}
 */
const execute = Promise.coroutine(function*(data: { profiles: string[], blockNr?: number}) {
    const blockNr = (data.blockNr) ? data.blockNr : yield GethConnector.getInstance().web3.eth.getBlockNumberAsync();
    let objectFilter = {};
    filter.setBlockNr(blockNr);
    data.profiles.forEach((profileAddress) => {
        Object.defineProperty(objectFilter, profileAddress, { value: true });
    });
    filter.setAddress(objectFilter);
    objectFilter = null;
    return { done: true, watching: data.profiles };
});

export default { execute, name: 'setFilter' };
