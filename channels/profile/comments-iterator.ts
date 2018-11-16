import * as Promise from 'bluebird';
import { COMMON_MODULE, CORE_MODULE, PROFILE_MODULE } from '@akashaproject/common/constants';
import { unpad } from 'ethereumjs-util';

export const commentsIteratorSchema = {
  id: '/commentsIterator',
  type: 'object',
  properties: {
    ethAddress: { type: 'string', format: 'address' },
    akashaId: { type: 'string' },
    lastBlock: { type: 'number' },
    lastIndex: { type: 'number' },
    limit: { type: 'number' },
    reversed: { type: 'boolean' },
  },
  required: ['lastBlock'],
};

export default function init(sp, getService) {

  const execute = Promise
    .coroutine(function* (data) {
      const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
      v.validate(data, commentsIteratorSchema, { throwError: true });

      const collection = [];
      const maxResults = data.limit || 5;
      const address = yield (getService(COMMON_MODULE.profileHelpers)).profileAddress(data);
      const toBlock = (!data.lastBlock) ?
        yield (getService(CORE_MODULE.WEB3_API))
          .instance.eth.getBlockNumber() : data.lastBlock;

      const contracts = getService(CORE_MODULE.CONTRACTS);
      const fetched = yield contracts.fromEvent(
        contracts.instance.Comments.Publish,
        { author: address },
        toBlock,
        maxResults,
        { lastIndex: data.lastIndex, reversed: data.reversed || false },
      );

      for (const event of fetched.results) {
        collection.push({
          author: event.args.author,
          entryId: event.args.entryId,
          parent: unpad(event.args.parent),
          commentId: event.args.id,
        });
      }
      return {
        collection,
        lastBlock: fetched.fromBlock,
        lastIndex: fetched.lastIndex,
        akashaId: data.akashaId,
        limit: maxResults,
      };
    });

  const commentsIterator = { execute, name: 'commentsIterator' };
  const service = function () {
    return commentsIterator;
  };
  sp().service(PROFILE_MODULE.commentsIterator, service);
  return commentsIterator;
}
