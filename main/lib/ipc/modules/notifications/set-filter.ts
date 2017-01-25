import * as Promise from 'bluebird';
import currentProfile from '../registry/current-profile';
import getFollowingList from '../profile/following-list';
import { GethConnector } from '@akashaproject/geth-connector';
import { wild } from '../models/records';
import { FOLLOWING_LIST } from '../../config/settings';
export const filter = {
    _address: {},
    _blockNr: 0,
    _currentAddress: '',
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
    },
    setMyAddress: (address) => {
        this._currentAddress = address;
    },
    getMyAddress: () => {
        return this._currentAddress;
    },
    removeAddress: (rAddress) => {
        if (filter.hasAddress(rAddress)) {
            delete this._address[rAddress];
        }
    },
    appendAddress: (aAddress) => {
        if (!filter.hasAddress(aAddress)) {
            Object.defineProperty(
                this._address,
                aAddress,
                { configurable: true, writable: false, value: true, enumerable: true }
            );
        }
    }
};
/**
 * Set which profiles to watch for changes
 * @param data
 * @returns {Bluebird<{done: boolean, watching: any}>}
 */
const execute = Promise.coroutine(function*(data: { profiles: string[], exclude?: string[], blockNr?: number }) {
    const blockNr = (data.blockNr) ? data.blockNr : yield GethConnector.getInstance().web3.eth.getBlockNumberAsync();
    const myProfile = yield currentProfile.execute();
    let objectFilter = {};
    let temp;
    filter.setBlockNr(blockNr);
    if (!data.profiles.length) {
        temp = yield getFollowingList.execute({ akashaId: myProfile.akashaId });
        data.profiles = temp.collection;
        wild.setFull(FOLLOWING_LIST, temp.collection);
    }
    data.profiles.forEach((profileAddress) => {
        if (data.exclude && data.exclude.indexOf(profileAddress) !== -1) {
            return;
        }
        Object.defineProperty(objectFilter, profileAddress,
            { configurable: true, writable: false, value: true, enumerable: true }
        );
    });
    Object.defineProperty(objectFilter, myProfile.profileAddress,
        { configurable: true, writable: false, value: true, enumerable: true }
    );
    filter.setMyAddress(myProfile.profileAddress);
    filter.setAddress(objectFilter);
    objectFilter = null;
    return { done: true, watching: data.profiles };
});

export default { execute, name: 'setFilter' };
