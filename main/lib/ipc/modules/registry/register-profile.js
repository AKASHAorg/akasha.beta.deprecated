"use strict";
const index_1 = require("../auth/index");
const ipfs_1 = require("../profile/ipfs");
const Promise = require("bluebird");
const index_2 = require("../../contracts/index");
const execute = Promise.coroutine(function* (data) {
    const ipfsHash = yield ipfs_1.create(data.ipfs);
    const txData = yield index_2.constructed.instance.registry.register(data.akashaId, ipfsHash, data.gas);
    const tx = yield index_1.module.auth.signData(txData, data.token);
    return { tx };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'registerProfile' };
//# sourceMappingURL=register-profile.js.map