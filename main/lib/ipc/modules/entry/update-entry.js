"use strict";
const index_1 = require("../auth/index");
const ipfs_1 = require("./ipfs");
const Promise = require("bluebird");
const index_2 = require("../../contracts/index");
const execute = Promise.coroutine(function* (data) {
    const ipfsEntry = new ipfs_1.default();
    const hash = yield ipfsEntry.create(data.content, data.tags);
    const txData = yield index_2.constructed.instance.entries.updateEntryContent(hash, data.entryId, data.gas);
    const tx = yield index_1.module.auth.signData(txData, data.token);
    return { tx };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'update' };
//# sourceMappingURL=update-entry.js.map