import * as Promise from 'bluebird';
import { COMMENTS_MODULE, COMMON_MODULE, CORE_MODULE } from '@akashaproject/common/constants';

const commentS = {
  id: '/comment',
  type: 'object',
  properties: {
    ethAddress: { type: 'string', format: 'address' },
    parent: { type: 'string' },
    entryId: { type: 'string' },
    token: { type: 'string' },
  },
  required: ['ethAddress', 'entryId', 'token'],
};

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* (data: any, cb) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, commentS, { throwError: true });

    const contracts = getService(CORE_MODULE.CONTRACTS);
    const ipfsHash = yield getService(COMMENTS_MODULE.commentIpfs).create(data.content);
    const decodedHash = getService(COMMON_MODULE.ipfsHelpers).decodeHash(ipfsHash);
    const replyTo = data.parent || '0';
    const txData = contracts.instance
    .Comments.publish.request(
      data.entryId, data.ethAddress, replyTo, ...decodedHash, { gas: 250000 });

    const transaction = yield contracts.send(txData, data.token, cb);
    let commentId = null;
    const receipt = transaction.receipt;
    // in the future extract this should be dynamic @TODO
    if (receipt.logs && receipt.logs.length > 1) {
      const log = receipt.logs[receipt.logs.length - 1];
      commentId = log.topics.length > 3 ? log.data : null;
    }
    return { tx: transaction.tx, receipt: transaction.receipt, commentId, entryId: data.entryId };
  });

  const comment = { execute, name: 'comment', hasStream: true };
  const service = function () {
    return comment;
  };
  sp().service(COMMENTS_MODULE.comment, service);
  return comment;
}
