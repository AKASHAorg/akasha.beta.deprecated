"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../auth/index");
const ipfs_1 = require("./ipfs");
const Promise = require("bluebird");
const index_2 = require("../../contracts/index");
const execute = Promise.coroutine(function* (data) {
    const hash = yield ipfs_1.create(data.content);
    const txData = yield index_2.constructed.instance.comments.comment(data.entryId, hash, data.gas, data.parent);
    const tx = yield index_1.module.auth.signData(txData, data.token);
    return { tx };
});
exports.default = { execute, name: 'comment' };
//# sourceMappingURL=add-comment.js.map