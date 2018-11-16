import * as Promise from 'bluebird';
import { CORE_MODULE, ENTRY_MODULE } from '@akashaproject/common/constants';

const canClaimVoteS = {
  id: '/canClaim',
  type: 'object',
  properties: {
    ethAddress: { type: 'string', format: 'address' },
    entries: {
      type: 'array',
      items: {
        type: 'string',
      },
      uniqueItems: true,
      minItems: 1,
    },
  },
  required: ['ethAddress', 'entries'],
};

export default function init(sp, getService) {
  const execute = Promise.coroutine(
    function* (data: { entries: string[], ethAddress: string }) {
      const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
      v.validate(data, canClaimVoteS, { throwError: true });

      const timeStamp = new Date().getTime() / 1000;
      const contracts = getService(CORE_MODULE.CONTRACTS);
      const requests = data.entries.map((id) => {
        return contracts.instance.Votes
          .canClaimEntryVote(id, data.ethAddress, timeStamp)
          .then((status) => {
            return { status, entryId: id };
          });
      });
      const collection = yield Promise.all(requests);
      return { collection };
    });

  const canClaimVote = { execute, name: 'canClaimVote' };
  const service = function () {
    return canClaimVote;
  };
  sp().service(ENTRY_MODULE.canClaimVote, service);
  return canClaimVote;
}
