import * as Promise from 'bluebird';
import { CORE_MODULE, ENTRY_MODULE } from '@akashaproject/common/constants';

export const downvote = {
  id: '/downvote',
  type: 'object',
  properties: {
    entryId: { type: 'string' },
    token: { type: 'string' },
    ethAddress: { type: 'string', format: 'address' },
    weight: { type: 'number' },
  },
  required: ['entryId', 'token', 'ethAddress', 'weight'],
};

export default function init (sp, getService) {
  const execute = Promise.coroutine(function* (data, cb) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, downvote, { throwError: true });

    if (data.weight < 1 || data.weight > 10) {
      throw new Error('Vote weight value must be between 1-10');
    }
    const contracts = getService(CORE_MODULE.CONTRACTS);
    const txData = contracts.instance.Votes
      .voteEntry.request(data.weight, data.entryId, true, data.ethAddress, { gas: 250000 });
    const receipt = yield contracts.send(txData, data.token, cb);
    return { receipt };
  });
  const downVote = { execute, name: 'downvote', hasStream: true };
  const service = function () {
    return downVote;
  };
  sp().service(ENTRY_MODULE.downVote, service);
  return downVote;
}
