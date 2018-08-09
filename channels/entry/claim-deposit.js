"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const claimS = {
    id: '/claim',
    type: 'object',
    properties: {
        entryId: { type: 'string' },
        token: { type: 'string' },
    },
    required: ['entryId', 'token'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, claimS, { throwError: true });
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const txData = contracts.instance.Entries.claim.request(data.entryId, { gas: 200000 });
        const transaction = yield contracts.send(txData, data.token, cb);
        return { tx: transaction.tx, receipt: transaction.receipt };
    });
    const claim = { execute, name: 'claim', hasStream: true };
    const service = function () {
        return claim;
    };
    sp().service(constants_1.ENTRY_MODULE.claim, service);
    return claim;
}
exports.default = init;
//# sourceMappingURL=claim-deposit.js.map