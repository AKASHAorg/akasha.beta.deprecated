"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const execute = Promise.coroutine(function* (data) {
    const entryFund = yield index_1.constructed.instance.entries.getEntryFund(data.entryId);
    const active = yield index_1.constructed.instance.entries.isMutable(data.entryId);
    return { canClaim: !!(entryFund && !active), entryId: data.entryId };
});
exports.default = { execute, name: 'canClaim' };
//# sourceMappingURL=can-claim.js.map