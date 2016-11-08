"use strict";
const index_1 = require('../auth/index');
const index_2 = require('../profile/index');
const Promise = require('bluebird');
const index_3 = require('../../contracts/index');
const execute = Promise.coroutine(function* (data) {
    const ipfsHash = yield index_2.module.helpers.create(data.ipfs);
    const txData = yield index_3.constructed.instance.registry.register(data.akashaId, ipfsHash, data.gas);
    const tx = yield index_1.module.auth.signData(txData, data.token);
    return { tx };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'registerProfile' };
//# sourceMappingURL=register-profile.js.map