import * as Promise from 'bluebird';
import { CORE_MODULE, ENTRY_MODULE } from '@akashaproject/common/constants';

const claimVoteS = {
  id: '/claimVote',
  type: 'object',
  properties: {
    entryId: { type: 'string' },
    token: { type: 'string' },
  },
  required: ['entryId', 'token'],
};

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* (data, cb) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, claimVoteS, { throwError: true });

    const contracts = getService(CORE_MODULE.CONTRACTS);
    const txData = contracts.instance.Votes.claimKarmaVote.request(data.entryId, { gas: 200000 });
    const transaction = yield contracts.send(txData, data.token, cb);
    return { tx: transaction.tx, receipt: transaction.receipt };
  });

  const claimVote = { execute, name: 'claimVote', hasStream: true };
  const service = function () {
    return claimVote;
  };
  sp().service(ENTRY_MODULE.claimVote, service);
  return claimVote;
}
