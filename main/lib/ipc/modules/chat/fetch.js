"use strict";
const Promise = require('bluebird');
const settings_1 = require('./settings');
const geth_connector_1 = require('@akashaproject/geth-connector');
const index_1 = require('../../contracts/index');
const settings_2 = require('../../config/settings');
const ipfs_1 = require('../profile/ipfs');
let chat;
const transform = Promise.coroutine(function* (data) {
    let obj, rootHash, userMedia;
    let response = {
        timeStamp: 0,
        profileAddress: '',
        messageHash: '',
        [settings_2.BASE_URL]: settings_2.generalSettings.get(settings_2.BASE_URL)
    };
    const utf = geth_connector_1.GethConnector.getInstance().web3.toUtf8(data.payload);
    try {
        obj = JSON.parse(utf);
    }
    catch (err) {
        obj = { message: '', akashaId: '' };
    }
    if (obj.akashaId) {
        response.profileAddress = yield index_1.constructed.instance.registry.addressOf(obj.akashaId);
        response.messageHash = data.hash;
        rootHash = yield index_1.constructed.instance.profile.getIpfs(response.profileAddress);
        userMedia = yield ipfs_1.getShortProfile(rootHash);
        response.timeStamp = data.sent;
    }
    return Object.assign({}, obj, response, userMedia);
});
const execute = Promise.coroutine(function* (data, cb) {
    if (data.stop) {
        if (chat) {
            chat.stopWatching(() => {
                chat = null;
            });
        }
        return { watching: false };
    }
    if (chat) {
        return { watching: true };
    }
    let current;
    const collection = [];
    const initial = yield Promise.fromCallback((cb) => {
        return (geth_connector_1.GethConnector.getInstance().web3.shh.filter({ topics: settings_1.TOPICS })).get(cb);
    });
    for (let i = 0; i < initial.length; i++) {
        if (initial[i].hasOwnProperty('payload')) {
            current = yield transform(initial[i]);
            collection.push(current);
        }
    }
    if (chat) {
        return { collection };
    }
    cb(null, { collection });
    chat = geth_connector_1.GethConnector.getInstance().web3.shh.filter({ topics: settings_1.TOPICS });
    chat.watch(function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.hasOwnProperty('payload')) {
            transform(data).then((resp) => {
                cb(null, resp);
            });
        }
    });
    return { watching: true };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'fetch' };
//# sourceMappingURL=fetch.js.map