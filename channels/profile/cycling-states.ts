import * as Promise from 'bluebird';
import { COMMON_MODULE, CORE_MODULE, PROFILE_MODULE } from '@akashaproject/common/constants';
import { ascend, difference, filter, prop, sortWith } from 'ramda';

export const cyclingStatesSchema = {
  id: '/cyclingStates',
  type: 'object',
  properties: {
    akashaId: { type: 'string' },
    ethAddress: { type: 'string', format: 'address' },
  },
};

export default function init(sp, getService) {

  const execute = Promise.coroutine(function* (data) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, cyclingStatesSchema, { throwError: true });

    const address = yield (getService(COMMON_MODULE.profileHelpers))
    .profileAddress(data);

    const web3Api = getService(CORE_MODULE.WEB3_API);
    const contracts = getService(CORE_MODULE.CONTRACTS);
    console.log("contracts", contracts);
    const collection = [];
    let finished = false;
    let currentIndex = 0;
    while (!finished) {
      const [
        amount,
        unlockDate,
        index] = yield contracts.instance.AETH.getCyclingState(address, currentIndex);
      if (amount.toNumber() === 0) {
        finished = true;
        continue;
      }
      collection.push({
        amount: (web3Api.instance.utils.toBN(
          web3Api.instance.utils.fromWei(web3Api.instance.utils.toBN(amount), 'ether'))
        ).toNumber(),
        unlockDate: unlockDate.toNumber(),
      });
      currentIndex = index.toNumber() + 1;
    }

    const sorted = sortWith([ascend(prop('unlockDate')), ascend(prop('amount'))], collection);
    const now = new Date().getTime() / 1000;
    const rule = state => state.unlockDate < now;
    const available = filter(rule, sorted);
    const totalAvailable = available.reduce(
      (acc, curr) => {
        return acc.plus(curr.amount);
      },
      new web3Api.instance.BigNumber(0));

    const pending = difference(sorted, available);
    const totalPending = pending.reduce(
      (acc, curr) => {
        return acc.plus(curr.amount);
      },
      new web3Api.instance.utils.toBN(0));
    return {
      available: { collection: available, total: (web3Api.instance.utils
          .toBN(totalAvailable)).toNumber() },
      pending: { collection: pending, total: (web3Api.instance.utils
          .toBN(totalPending)).toNumber() },
    };
  });
  const cyclingStates = { execute, name: 'cyclingStates' };
  const service = function () {
    return cyclingStates;
  };
  sp().service(PROFILE_MODULE.cyclingStates, service);
  return cyclingStates;
}
