"use strict";
const Promise = require("bluebird");
const index_1 = require("../auth/index");
const ipfs_1 = require("./ipfs");
const index_2 = require("../../contracts/index");
const execute = Promise.coroutine(function* (data) {
    const active = yield index_2.constructed.instance.entries.isMutable(data.entryId);
    if (!active) {
        throw new Error('This entry can no longer be edited.');
    }
    let ipfsEntry = new ipfs_1.default();
    const entryEth = yield index_2.constructed.instance.entries.getEntry(data.entryId);
    const hash = yield ipfsEntry.edit(data.content, data.tags, entryEth.ipfsHash);
    const txData = yield index_2.constructed.instance.entries.updateEntryContent(hash, data.entryId, data.gas);
    const tx = yield index_1.module.auth.signData(txData, data.token);
    ipfsEntry = null;
    return { tx, entryId: data.entryId };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'editEntry' };
//# sourceMappingURL=edit-entry.js.map