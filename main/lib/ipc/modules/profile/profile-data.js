"use strict";
const Promise = require('bluebird');
const index_1 = require('../../contracts/index');
const ipfs_1 = require('./ipfs');
const settings_1 = require('../../config/settings');
const execute = Promise.coroutine(function* (data) {
    const ipfsHash = yield index_1.constructed.instance.profile.getIpfs(data.profile);
    const profile = (data.full) ? yield ipfs_1.resolveProfile(ipfsHash, data.resolveImages) :
        yield ipfs_1.getShortProfile(ipfsHash, data.resolveImages);
    const akashaId = yield index_1.constructed.instance.profile.getId(data.profile);
    return Object.assign({
        akashaId: akashaId,
        [settings_1.BASE_URL]: settings_1.generalSettings.get(settings_1.BASE_URL),
        profile: data.profile
    }, profile);
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'getProfileData' };
//# sourceMappingURL=profile-data.js.map