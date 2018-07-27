import * as Promise from 'bluebird';
import { CORE_MODULE, ENTRY_MODULE, PROFILE_MODULE } from '@akashaproject/common/constants';

const buildFilterS = {
  id: '/buildFilter',
  type: 'object',
  properties: {
    limit: { type: 'number' },
    toBlock: { type: 'number' },
  },
  required: ['toBlock'],
};

export default function init(sp, getService) {
  const execute = Promise.coroutine(
    function* (data: {
      toBlock: number, limit?: number, author?: string, entryType?: number,
      multi: {
        authors: string[],
        entryTypes: number[],
        tags: string[],
      },
    }) {
      const v = new getService(CORE_MODULE.VALIDATOR_SCHEMA).Validator();
      v.validate(data, buildFilterS, { throwError: true });

      const collection = [];
      const maxResults = data.limit || 5;
      const contracts = getService(CORE_MODULE.CONTRACTS);
      const web3Api = getService(CORE_MODULE.WEB3_API);
      const resolve = getService(PROFILE_MODULE.resolveEthAddress);
      const fetched = yield contracts.fromEvent(
        contracts.instance.Entries.Publish,
        { author: data.author, entryType: data.entryType }, data.toBlock, maxResults, {});

      for (const event of fetched.results) {
        const tags = event.args.tagsPublished.map((tag) => {
          return web3Api.instance.toUtf8(tag);
        });
        const author = yield resolve.execute({ ethAddress: event.args.author });
        collection.push({
          tags,
          entryType: event.args.entryType.toNumber(),
          entryId: event.args.entryId,
          author,
        });
        if (collection.length === maxResults) {
          break;
        }
      }
      return { collection, lastBlock: fetched.fromBlock };
    });

  const buildFilter = { execute, name: 'buildFilter' };
  const service = function () {
    return buildFilter;
  };
  sp().service(ENTRY_MODULE.buildFilter, service);
  return buildFilter;
}
