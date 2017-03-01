"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const index_2 = require("../auth/index");
const execute = Promise.coroutine(function* (data) {
    const txData = yield index_1.constructed.instance.entries.claimDeposit(data.entryId, data.gas);
    const tx = yield index_2.module.auth.signData(txData, data.token);
    return { tx, entryId: data.entryId };
});
exports.default = { execute, name: 'claim' };
//# sourceMappingURL=claim-deposit.js.map