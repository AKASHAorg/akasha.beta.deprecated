"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../auth/index");
const Promise = require("bluebird");
const index_2 = require("../../contracts/index");
const execute = Promise.coroutine(function* (data) {
    const txData = yield index_2.constructed.instance.subs.unSubscribe(data.tagName, data.gas);
    const tx = yield index_1.module.auth.signData(txData, data.token);
    return { tx, tagName: data.tagName };
});
exports.default = { execute, name: 'unSubscribe' };
//# sourceMappingURL=unsubscribe-tag.js.map