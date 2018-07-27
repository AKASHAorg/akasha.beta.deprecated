import * as Promise from 'bluebird';
import { downvote as upvote } from './downvote-entry';
import { CORE_MODULE, ENTRY_MODULE } from '@akashaproject/common/constants';

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* (data, cb) {
    const v = new getService(CORE_MODULE.VALIDATOR_SCHEMA).Validator();
    v.validate(data, upvote, { throwError: true });

    if (data.weight < 1 || data.weight > 10) {
      throw new Error('Vote weight value must be between 1-10');
    }
    const contracts = getService(CORE_MODULE.CONTRACTS);
    const txData = contracts.instance.Votes.voteEntry
      .request(data.weight, data.entryId, false, data.ethAddress, { gas: 250000 });
    const transaction = yield contracts.send(txData, data.token, cb);
    return { tx: transaction.tx, receipt: transaction.receipt };
  });

  const upVote = { execute, name: 'upvote', hasStream: true };
  const service = function () {
    return upVote;
  };
  sp().service(ENTRY_MODULE.upVote, service);
  return upVote;
}
