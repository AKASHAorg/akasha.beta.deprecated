import * as Promise from 'bluebird';
import { COMMENTS_MODULE, CORE_MODULE } from '@akashaproject/common/constants';

const removeCommentS = {
  id: '/removeComment',
  type: 'object',
  properties: {
    ethAddress: { type: 'string', format: 'address' },
    commentId: { type: 'string' },
    entryId: { type: 'string' },
    token: { type: 'string' },
  },
  required: ['ethAddress', 'entryId', 'token', 'commentId'],
};

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* (data: any, cb) {
    const v = new getService(CORE_MODULE.VALIDATOR_SCHEMA).Validator();
    v.validate(data, removeCommentS, { throwError: true });
    const contracts = getService(CORE_MODULE.CONTRACTS);
    const txData = yield contracts.instance.Comments
    .deleteComment.request(data.entryId, data.ethAddress, data.commentId, { gas: 250000 });
    const transaction = yield contracts.send(txData, data.token, cb);
    return { tx: transaction.tx, receipt: transaction.receipt };
  });

  const removeComment = { execute, name: 'removeComment', hasStream: true };
  const service = function () {
    return removeComment;
  };
  sp().service(COMMENTS_MODULE.removeComment, service);
  return removeComment;
}
