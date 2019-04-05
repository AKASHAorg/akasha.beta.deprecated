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
            balance: (web3Api.instance.utils.toBN(balance)).toNumber(),
            [symbol]: {
                total: (web3Api.instance.utils.toBN(fromWei(web3Api.instance.utils.toBN(totalAeth)))).toNumber(),
                free: (web3Api.instance.utils.toBN(fromWei(web3Api.instance.utils.toBN(free)))).toNumber(),
                bonded: (web3Api.instance.utils.toBN(fromWei(web3Api.instance.utils.toBN(bonded)))).toNumber(),
                cycling: (web3Api.instance.utils.toBN(fromWei(web3Api.instance.utils.toBN(cycling)))).toNumber(),
            },
            mana: {
                total: (web3Api.instance.utils.toBN(fromWei(web3Api.instance.utils.toBN(manaTotal)))).toNumber(),
                spent: (web3Api.instance.utils.toBN(fromWei(web3Api.instance.utils.toBN(manaSpent)))).toNumber(),
                remaining: (web3Api.instance.utils.toBN(fromWei(web3Api.instance.utils.toBN(manaRemaining)))).toNumber(),
            },
            karma: { total: (web3Api.instance.utils.toBN(fromWei(web3Api.instance.utils.toBN(karma)))).toNumber() },
            essence: {
                total: (web3Api.instance.utils.toBN(fromWei(web3Api.instance.utils.toBN(essence)))).toNumber(),
                aethValue: (web3Api.instance.utils.toBN(fromWei(web3Api.instance.utils.toBN(essenceValue)))).toNumber(),
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