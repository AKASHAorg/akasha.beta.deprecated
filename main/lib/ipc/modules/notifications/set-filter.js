"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const current_profile_1 = require("../registry/current-profile");
const following_list_1 = require("../profile/following-list");
const geth_connector_1 = require("@akashaproject/geth-connector");
const records_1 = require("../models/records");
const settings_1 = require("../../config/settings");
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
        records_1.mixed.setFull(settings_1.FOLLOWING_LIST, temp.collection);
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
exports.default = { execute, name: 'setFilter' };
//# sourceMappingURL=set-filter.js.map