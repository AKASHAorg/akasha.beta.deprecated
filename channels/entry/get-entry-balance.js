"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.getEntryBalanceS = {
    id: '/getEntryBalance',
    type: 'object',
    properties: {
        list: {
            type: 'array',
            items: {
                type: 'string',
            },
            uniqueItems: true,
            minItems: 1,
        },
    },
    required: ['list'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, exports.getEntryBalanceS, { throwError: true });
        const collection = [];
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
        const requests = data.list.map((id) => {
            return contracts.instance.Votes.getRecord(id).then((result) => {
                const [totalVotes, score, endPeriod, totalKarma, claimed] = result;
                collection.push({
                    entryId: id,
                    totalVotes: totalVotes.toString(10),
                    score: score.toString(10),
                    endPeriod: (new Date(endPeriod.toNumber() * 1000)).toISOString(),
                    totalKarma: (web3Api.instance.fromWei(totalKarma, 'ether')).toString(10),
                    claimed,
                });
            });
        });
        yield Promise.all(requests);
        return { collection };
    });
    const getEntryBalance = { execute, name: 'getEntryBalance' };
    const service = function () {
        return getEntryBalance;
    };
    sp().service(constants_1.ENTRY_MODULE.getEntryBalance, service);
    return getEntryBalance;
}
exports.default = init;
//# sourceMappingURL=get-entry-balance.js.map