"use strict";
const index_1 = require('../auth/index');
const ipfs_1 = require('./ipfs');
const ramda_1 = require('ramda');
const Promise = require('bluebird');
const index_2 = require('../../contracts/index');
const execute = Promise.coroutine(function* (data) {
    let ipfsEntry = new ipfs_1.default();
    data.tags = ramda_1.uniq(data.tags);
    const hash = yield ipfsEntry.create(data.content, data.tags);
    const txData = yield index_2.constructed.instance.entries.publish(hash, data.tags, data.gas);
    const tx = yield index_1.module.auth.signData(txData, data.token);
    ipfsEntry = null;
    return { tx };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'publish' };
//# sourceMappingURL=publish-entry.js.map