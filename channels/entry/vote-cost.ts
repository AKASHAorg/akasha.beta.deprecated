import * as Promise from 'bluebird';
import { CORE_MODULE, ENTRY_MODULE } from '@akashaproject/common/constants';

export const voteCostS = {
  id: '/voteCost',
  type: 'array',
  items: { type: 'number' },
  uniqueItems: true,
  minItems: 1,
};

export default function init(sp, getService) {
  const execute = Promise.coroutine(
    function* (data: number[]) {
      const v = new getService(CORE_MODULE.VALIDATOR_SCHEMA).Validator();
      v.validate(data, voteCostS, { throwError: true });
      const contracts = getService(CORE_MODULE.CONTRACTS);
      const web3Api = getService(CORE_MODULE.WEB3_API);
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
  sp().service(ENTRY_MODULE.voteCost, service);
  return voteCost;
}
