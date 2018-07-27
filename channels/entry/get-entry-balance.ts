import * as Promise from 'bluebird';
import { CORE_MODULE, ENTRY_MODULE } from '@akashaproject/common/constants';

export const getEntryBalanceS = {
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
export default function init(sp, getService) {

  const execute = Promise.coroutine(
    function* (data: { list: string[] }) {
      const v = new getService(CORE_MODULE.VALIDATOR_SCHEMA).Validator();
      v.validate(data, getEntryBalanceS, { throwError: true });

      const collection = [];
      const contracts = getService(CORE_MODULE.CONTRACTS);
      const web3Api = getService(CORE_MODULE.WEB3_API);
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
  sp().service(ENTRY_MODULE.getEntryBalance, service);
  return getEntryBalance;
}
