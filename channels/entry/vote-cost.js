"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.voteCostS = {
    id: '/voteCost',
    type: 'array',
    items: { type: 'number' },
    uniqueItems: true,
    minItems: 1,
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, exports.voteCostS, { throwError: true });
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
        const requests = data.map((w) => {
            return contracts.instance.Votes.getEssenceCost(w)
                .then((cost) => {
                const ethCost = web3Api.instance.fromWei(cost, 'ether');
                return { cost: ethCost.toString(10), weight: w };
            });
        });
        const collection = yield Promise.all(requests);
        return { collection };
    });
    const voteCost = { execute, name: 'voteCost' };
    const service = function () {
        return voteCost;
    };
    sp().service(constants_1.ENTRY_MODULE.voteCost, service);
    return voteCost;
}
exports.default = init;
//# sourceMappingURL=vote-cost.js.map