"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const voteEndPeriod = {
    id: '/voteEndPeriod',
    type: 'array',
    items: { type: 'string' },
    minItems: 1,
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, voteEndPeriod, { throwError: true });
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const collection = [];
        for (let i = 0; i < data.length; i++) {
            const record = yield contracts.instance.Votes.getRecord(data[i]);
            collection.push({ entryId: data[i], endDate: (record[2]).toNumber() });
        }
        return { collection };
    });
    const getVoteEndPeriod = { execute, name: 'getVoteEndPeriod' };
    const service = function () {
        return getVoteEndPeriod;
    };
    sp().service(constants_1.ENTRY_MODULE.getVoteEndPeriod, service);
    return getVoteEndPeriod;
}
exports.default = init;
//# sourceMappingURL=vote-endperiod.js.map