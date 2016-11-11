"use strict";
const Promise = require('bluebird');
const index_1 = require('../../contracts/index');
const index_2 = require('../auth/index');
const execute = Promise.coroutine(function* (data) {
    const txData = yield index_1.constructed.instance.feed.follow(data.profileAddress, data.gas);
    const tx = yield index_2.module.auth.signData(txData, data.token);
    return { tx, profileAddress: data.profileAddress };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'followProfile' };
//# sourceMappingURL=follow-profile.js.map