"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.filter = {
    _address: {},
    _blockNr: 0,
    _currentAddress: '',
    setBlockNr: (bNr) => {
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
        if (exports.filter.hasAddress(rAddress)) {
            delete this._address[rAddress];
        }
    },
    appendAddress: (aAddress) => {
        if (!exports.filter.hasAddress(aAddress)) {
            Object.defineProperty(this._address, aAddress, { configurable: true, writable: false, value: true, enumerable: true });
        }
    },
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
        const blockNr = (data.blockNr) ?
            data.blockNr : yield web3Api.instance.eth.getBlockNumber();
        const myProfile = yield (getService(constants_1.PROFILE_MODULE.getCurrentProfile)).execute();
        let objectFilter = {};
        let temp;
        exports.filter.setBlockNr(blockNr);
        if (!data.profiles.length) {
            temp = yield (getService(constants_1.PROFILE_MODULE.followingIterator))
                .execute({ lastBlock: blockNr, limit: 500 });
            data.profiles = temp.collection;
            (getService(constants_1.CORE_MODULE.STASH))
                .mixed.setFull(constants_1.PROFILE_MODULE.followingIterator, temp.collection);
        }
        data.profiles.forEach((profileAddress) => {
            if (data.exclude && data.exclude.indexOf(profileAddress) !== -1) {
                return;
            }
            Object.defineProperty(objectFilter, profileAddress, { configurable: true, writable: false, value: true, enumerable: true });
        });
        Object.defineProperty(objectFilter, myProfile.profileAddress, { configurable: true, writable: false, value: true, enumerable: true });
        exports.filter.setMyAddress(myProfile.profileAddress);
        exports.filter.setAddress(objectFilter);
        objectFilter = null;
        return { done: true, watching: data.profiles };
    });
    const setFilter = { execute, name: 'setFilter' };
    const service = function () {
        return setFilter;
    };
    sp().service(constants_1.NOTIFICATIONS_MODULE.setFilter, service);
    return setFilter;
}
exports.default = init;
//# sourceMappingURL=set-filter.js.map