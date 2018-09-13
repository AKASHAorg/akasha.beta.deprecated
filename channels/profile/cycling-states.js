"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const ramda_1 = require("ramda");
exports.cyclingStatesSchema = {
    id: '/cyclingStates',
    type: 'object',
    properties: {
        akashaId: { type: 'string' },
        ethAddress: { type: 'string', format: 'address' },
    },
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, exports.cyclingStatesSchema, { throwError: true });
        const address = yield getService(constants_1.COMMON_MODULE.profileHelpers)
            .profileAddress(data);
        const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const collection = [];
        let finished = false;
        let currentIndex = 0;
        while (!finished) {
            const [amount, unlockDate, index] = yield contracts.instance.AETH.getCyclingState(address, currentIndex);
            if (amount.toNumber() === 0) {
                finished = true;
                continue;
            }
            collection.push({
                amount: (web3Api.instance.fromWei(amount, 'ether')).toFormat(5),
                unlockDate: unlockDate.toNumber(),
            });
            currentIndex = index.toNumber() + 1;
        }
        const sorted = ramda_1.sortWith([ramda_1.ascend(ramda_1.prop('unlockDate')), ramda_1.ascend(ramda_1.prop('amount'))], collection);
        const now = new Date().getTime() / 1000;
        const rule = (state) => state.unlockDate < now;
        const available = ramda_1.filter(rule, sorted);
        const totalAvailable = available.reduce((acc, curr) => {
            return acc.plus(curr.amount);
        }, new web3Api.instance.BigNumber(0));
        const pending = ramda_1.difference(sorted, available);
        const totalPending = pending.reduce((acc, curr) => {
            return acc.plus(curr.amount);
        }, new web3Api.instance.BigNumber(0));
        return {
            available: { collection: available, total: totalAvailable.toFormat(5) },
            pending: { collection: pending, total: totalPending.toFormat(5) },
        };
    });
    const cyclingStates = { execute, name: 'cyclingStates' };
    const service = function () {
        return cyclingStates;
    };
    sp().service(constants_1.PROFILE_MODULE.cyclingStates, service);
    return cyclingStates;
}
exports.default = init;
//# sourceMappingURL=cycling-states.js.map