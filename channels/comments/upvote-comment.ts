import * as Promise from 'bluebird';
import { COMMENTS_MODULE, CORE_MODULE } from '@akashaproject/common/constants';

export const upvote = {
  id: '/upvote',
  type: 'object',
  properties: {
    entryId: { type: 'string' },
    token: { type: 'string' },
    commentId: { type: 'string' },
    weight: { type: 'number' },
  },
  required: ['entryId', 'token', 'commentId', 'weight'],
};

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* (data, cb) {

    const v = new getService(CORE_MODULE.VALIDATOR_SCHEMA).Validator();
    v.validate(data, upvote, { throwError: true });

    if (data.weight < 1 || data.weight > 10) {
      throw new Error('Vote weight value must be between 1-10');
    }
    const contracts = getService(CORE_MODULE.CONTRACTS);
    const txData = contracts.instance.Votes
    .voteComment.request(data.weight, data.entryId, data.commentId, false, { gas: 300000 });
    const transaction = yield contracts.send(txData, data.token, cb);

    return { tx: transaction.tx, receipt: transaction.receipt };
  });

  const upvote = { execute, name: 'upvote', hasStream: true };
  const service = function () {
    return upvote;
  };
  sp().service(COMMENTS_MODULE.upvote, service);
  return upvote;
}
