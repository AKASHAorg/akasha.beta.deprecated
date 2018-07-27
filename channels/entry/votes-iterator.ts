import * as Promise from 'bluebird';
import { CORE_MODULE, ENTRY_MODULE, PROFILE_MODULE } from '@akashaproject/common/constants';

const votesIteratorS = {
  id: '/tagIterator',
  type: 'object',
  properties: {
    limit: { type: 'number' },
    toBlock: { type: 'number' },
    lastIndex: { type: 'number' },
    entryId: { type: 'string' },
    ethAddress: { type: 'string', format: 'address' },
    akashaId: { type: 'string' },
    reversed: { type: 'boolean' },
  },
  required: ['toBlock'],
};

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* (data) {

    const v = new getService(CORE_MODULE.VALIDATOR_SCHEMA).Validator();
    v.validate(data, votesIteratorS, { throwError: true });
    const collection = [];
    const sourceId = data.entryId || data.commentId;
    const contracts = getService(CORE_MODULE.CONTRACTS);
    const record = yield contracts.instance.Votes.getRecord(sourceId);
    let maxResults = record[0].toString() === '0' ? 0 : data.limit || 5;
    if (maxResults > record[0].toNumber()) {
      maxResults = record[0].toNumber();
    }
    if (record[0].toNumber() <= data.totalLoaded) {
      return { collection: [], lastBlock: 0 };
    }
    if (data.totalLoaded) {
      const nextTotal = data.totalLoaded + maxResults;
      if (nextTotal > record[0].toNumber()) {
        maxResults = record[0].toNumber() - data.totalLoaded;
      }
    }
    const filter = { target: data.entryId || data.commentId, voteType: data.entryId ? 0 : 1 };
    const fetched = yield contracts.fromEvent(
      contracts.instance.Votes.Vote, filter, data.toBlock, maxResults,
      { lastIndex: data.lastIndex, reversed: data.reversed || false });
    const resolve = getService(PROFILE_MODULE.resolveEthAddress);
    for (const event of fetched.results) {
      const weight = (event.args.weight).toString(10);
      const author = yield resolve.execute({ ethAddress: event.args.voter });

      collection.push(Object.assign(
        { weight: event.args.negative ? '-' + weight : weight }, author));
      if (collection.length === maxResults) {
        break;
      }
    }

    return { collection, lastBlock: fetched.fromBlock, lastIndex: fetched.lastIndex };
  });

  const votesIterator = { execute, name: 'votesIterator' };
  const service = function () {
    return votesIterator;
  };
  sp().service(ENTRY_MODULE.votesIterator, service);
}
