"use strict";
const Promise = require('bluebird');
const current_profile_1 = require('../registry/current-profile');
const following_list_1 = require('../profile/following-list');
const geth_connector_1 = require('@akashaproject/geth-connector');
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
    }
};
const execute = Promise.coroutine(function* (data) {
    const blockNr = (data.blockNr) ? data.blockNr : yield geth_connector_1.GethConnector.getInstance().web3.eth.getBlockNumberAsync();
    const myProfile = yield current_profile_1.default.execute();
    let objectFilter = {};
    let temp;
    exports.filter.setBlockNr(blockNr);
    if (!data.profiles.length) {
        temp = yield following_list_1.default.execute({ akashaId: myProfile.akashaId });
        data.profiles = temp.collection;
    }
    data.profiles.forEach((profileAddress) => {
        if (data.exclude && data.exclude.indexOf(profileAddress) !== -1) {
            return;
        }
        Object.defineProperty(objectFilter, profileAddress, { value: true });
    });
    Object.defineProperty(objectFilter, myProfile.profileAddress, { value: true });
    exports.filter.setMyAddress(myProfile.profileAddress);
    exports.filter.setAddress(objectFilter);
    objectFilter = null;
    return { done: true, watching: data.profiles };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'setFilter' };
//# sourceMappingURL=set-filter.js.map