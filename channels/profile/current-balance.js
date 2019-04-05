import * as Promise from 'bluebird';
import { CORE_MODULE, PROFILE_MODULE } from '@akashaproject/common/constants';
export const getBalanceSchema = {
    id: '/getBalance',
    type: 'object',
    properties: {
        ethAddress: { type: 'string', format: 'address' },
        unit: { type: 'string' },
    },
};
export default function init(sp, getService) {
    const execute = Promise
        .coroutine(function* (data) {
        const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, getBalanceSchema, { throwError: true });
        const web3Api = getService(CORE_MODULE.WEB3_API);
        const contracts = getService(CORE_MODULE.CONTRACTS);
        const etherBase = (data.ethAddress) ?
            data.ethAddress : web3Api.instance.eth.defaultAccount;
        const unit = (data.unit) ? data.unit : 'ether';
        const fromWei = web3Api.instance.utils.fromWei;
        const weiAmount = yield web3Api.instance.eth.getBalance(etherBase);
        const [free, bonded, cycling] = yield contracts
            .instance.AETH.getTokenRecords(etherBase);
        const [manaTotal, manaSpent, manaRemaining] = yield contracts.instance.Essence.mana(etherBase);
        const [karma, essence] = yield contracts.instance.Essence.getCollected(etherBase);
        const essenceValue = yield contracts.instance.Essence.aethValueFrom(essence);
        const symbol = 'AETH';
        const totalAeth = free.plus(bonded).plus(cycling);
        const balance = fromWei(web3Api.instance.utils.toBN(weiAmount), unit);
        return {
            balance: balance.toFormat(5),
            [symbol]: {
                total: (fromWei(web3Api.instance.utils.toBN(totalAeth))).toFormat(7),
                free: (fromWei(web3Api.instance.utils.toBN(free))).toFormat(5),
                bonded: (fromWei(web3Api.instance.utils.toBN(bonded))).toFormat(5),
                cycling: (fromWei(web3Api.instance.utils.toBN(cycling))).toFormat(5),
            },
            mana: {
                total: (fromWei(web3Api.instance.utils.toBN(manaTotal))).toFormat(5),
                spent: (fromWei(web3Api.instance.utils.toBN(manaSpent))).toFormat(5),
                remaining: (fromWei(web3Api.instance.utils.toBN(manaRemaining))).toFormat(5),
            },
            karma: { total: (fromWei(web3Api.instance.utils.toBN(karma))).toFormat(5) },
            essence: {
                total: (fromWei(web3Api.instance.utils.toBN(essence))).toFormat(5),
                aethValue: (fromWei(web3Api.instance.utils.toBN(essenceValue))).toFormat(5),
            },
            unit, etherBase,
        };
    });
    const currentBalance = { execute, name: 'getBalance' };
    const service = function () {
        return currentBalance;
    };
    sp().service(PROFILE_MODULE.getBalance, service);
    return currentBalance;
}
//# sourceMappingURL=current-balance.js.map