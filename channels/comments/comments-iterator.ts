import * as Promise from 'bluebird';
import { COMMENTS_MODULE, CORE_MODULE } from '@akashaproject/common/constants';

const commentsIteratorS = {
  id: '/commentsIterator',
  type: 'object',
  properties: {
    limit: { type: 'number' },
    entryId: { type: 'string' },
    toBlock: { type: 'number' },
    parent: { type: 'string' },
    author: { type: 'string', format: 'address' },
    reversed: { type: 'boolean' },
  },
  required: ['entryId', 'toBlock'],
};

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* (data) {

    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    const contracts = getService(CORE_MODULE.CONTRACTS);
    const fetchComment = getService(COMMENTS_MODULE.getComment);
    v.validate(data, commentsIteratorS, { throwError: true });

    const collection = [];
    if (data.more) {
      return { collection, lastBlock: 0, lastIndex: 0 };
    }
    const commentsCount = yield contracts.instance.Comments.totalComments(data.entryId);
    const maxResults = commentsCount.toNumber();
    const fetched = yield contracts
      .fromEvent(
        contracts.instance.Comments.Publish, {
          entryId: data.entryId,
          author: data.author,
        },
        data.toBlock, maxResults, { lastIndex: data.lastIndex, reversed: data.reversed });
    for (const event of fetched.results) {
      const comment = yield fetchComment.execute({
        commentId: event.args.id,
        entryId: event.args.entryId,
        noResolve: true,
      });
      collection.push(Object.assign(
        {},
        comment,
        { commentId: event.args.id, parent: event.args.parent }));
    }

    return { collection, lastBlock: fetched.fromBlock, lastIndex: fetched.lastIndex };
  });

  const commentsIterator = { execute, name: 'commentsIterator' };
  const service = function () {
    return commentsIterator;
  };
  sp().service(COMMENTS_MODULE.commentsIterator, service);
  return commentsIterator;

}
