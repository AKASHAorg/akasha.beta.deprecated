"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.getBalanceSchema = {
    id: '/getBalance',
    type: 'object',
    properties: {
        ethAddress: { type: 'string', format: 'address' },
        unit: { type: 'string' },
    },
};
function init(sp, getService) {
    const execute = Promise
        .coroutine(function* (data) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, exports.getBalanceSchema, { throwError: true });
        const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const etherBase = (data.ethAddress) ?
            data.ethAddress : web3Api.instance.eth.defaultAccount;
        const unit = (data.unit) ? data.unit : 'ether';
        const fromWei = web3Api.instance.fromWei;
        const weiAmount = yield web3Api.instance.eth.getBalanceAsync(etherBase);
        const [free, bonded, cycling] = yield contracts
            .instance.AETH.getTokenRecords(etherBase);
        const [manaTotal, manaSpent, manaRemaining] = yield contracts.instance.Essence.mana(etherBase);
        const [karma, essence] = yield contracts.instance.Essence.getCollected(etherBase);
        const essenceValue = yield contracts.instance.Essence.aethValueFrom(essence);
        const symbol = 'AETH';
        const totalAeth = free.plus(bonded).plus(cycling);
        const balance = fromWei(weiAmount, unit);
        return {
            balance: balance.toFormat(5),
            [symbol]: {
                total: (fromWei(totalAeth)).toFormat(7),
                free: (fromWei(free)).toFormat(5),
                bonded: (fromWei(bonded)).toFormat(5),
                cycling: (fromWei(cycling)).toFormat(5),
            },
            mana: {
                total: (fromWei(manaTotal)).toFormat(5),
                spent: (fromWei(manaSpent)).toFormat(5),
                remaining: (fromWei(manaRemaining)).toFormat(5),
            },
            karma: { total: (fromWei(karma)).toFormat(5) },
            essence: {
                total: (fromWei(essence)).toFormat(5),
                aethValue: (fromWei(essenceValue)).toFormat(5),
            },
            unit, etherBase,
        };
    });
    const currentBalance = { execute, name: 'getBalance' };
    const service = function () {
        return currentBalance;
    };
    sp().service(constants_1.PROFILE_MODULE.getBalance, service);
    return currentBalance;
}
exports.default = init;
//# sourceMappingURL=current-balance.js.map