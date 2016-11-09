"use strict";
const Promise = require('bluebird');
const index_1 = require('../../contracts/index');
const ipfs_1 = require('./ipfs');
const settings_1 = require('../../config/settings');
const execute = Promise.coroutine(function* (data) {
    const entryEth = yield index_1.constructed.instance.entries.getEntry(data.entryId);
    const content = (data.full) ? yield ipfs_1.getFullContent(entryEth.ipfsHash) : yield ipfs_1.getShortContent(entryEth.ipfsHash);
    return { [settings_1.BASE_URL]: settings_1.generalSettings.get(settings_1.BASE_URL), content, entryEth, entryId: data.entryId };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'getEntry' };
//# sourceMappingURL=get-entry.js.map