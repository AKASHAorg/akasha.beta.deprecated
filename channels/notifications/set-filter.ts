import * as Promise from 'bluebird';
import { CORE_MODULE, NOTIFICATIONS_MODULE, PROFILE_MODULE } from '@akashaproject/common/constants';

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
        { configurable: true, writable: false, value: true, enumerable: true },
      );
    }
  },
};

export default function init(sp, getService) {

  const execute = Promise.coroutine(function* (
    data: { profiles: string[], exclude?: string[], blockNr?: number }) {
    const web3Api = getService(CORE_MODULE.WEB3_API);

    const blockNr = (data.blockNr) ?
      data.blockNr : yield web3Api.instance.eth.getBlockNumber();

    const myProfile = yield (getService(PROFILE_MODULE.getCurrentProfile)).execute();
    let objectFilter = {};
    let temp;
    filter.setBlockNr(blockNr);
    if (!data.profiles.length) {
      temp = yield (getService(PROFILE_MODULE.followingIterator))
        .execute({ lastBlock: blockNr, limit: 500 });

      data.profiles = temp.collection;

      (getService(CORE_MODULE.STASH))
        .mixed.setFull(PROFILE_MODULE.followingIterator, temp.collection);
    }
    data.profiles.forEach((profileAddress) => {
      if (data.exclude && data.exclude.indexOf(profileAddress) !== -1) {
        return;
      }
      Object.defineProperty(
        objectFilter, profileAddress,
        { configurable: true, writable: false, value: true, enumerable: true },
      );
    });
    Object.defineProperty(
      objectFilter, myProfile.profileAddress,
      { configurable: true, writable: false, value: true, enumerable: true },
    );
    filter.setMyAddress(myProfile.profileAddress);
    filter.setAddress(objectFilter);
    objectFilter = null;
    return { done: true, watching: data.profiles };
  });
  const setFilter = { execute, name: 'setFilter' };
  const service = function () {
    return setFilter;
  };
  sp().service(NOTIFICATIONS_MODULE.setFilter, service);
  return setFilter;
}
