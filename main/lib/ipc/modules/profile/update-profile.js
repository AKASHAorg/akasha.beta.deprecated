"use strict";
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const current_profile_1 = require("../registry/current-profile");
const ipfs_1 = require("./ipfs");
const index_2 = require("../auth/index");
const execute = Promise.coroutine(function* (data) {
    const ipfsHash = yield ipfs_1.create(data.ipfs);
    const currentProfile = yield current_profile_1.default.execute();
    if (!currentProfile.profileAddress) {
        throw new Error('No profile found to update');
    }
    const txData = yield index_1.constructed.instance.profile
        .updateHash(ipfsHash, currentProfile.profileAddress, data.gas);
    const tx = yield index_2.module.auth.signData(txData, data.token);
    return { tx };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'updateProfileData' };
//# sourceMappingURL=update-profile.js.map