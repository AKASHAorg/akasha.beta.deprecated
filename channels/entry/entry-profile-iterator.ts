import * as Promise from 'bluebird';
import { COMMON_MODULE, CORE_MODULE, ENTRY_MODULE } from '@akashaproject/common/constants';

const entryProfileIteratorS = {
  id: '/entryProfileIterator',
  type: 'object',
  properties: {
    limit: { type: 'number' },
    toBlock: { type: 'number' },
    akashaId: { type: 'string' },
    ethAddress: { type: 'string', format: 'address' },
    reversed: { type: 'boolean' },
    totalLoaded: { type: 'number' },
  },
  required: ['toBlock'],
};

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* (data) {

    const v = new getService(CORE_MODULE.VALIDATOR_SCHEMA).Validator();
    v.validate(data, entryProfileIteratorS, { throwError: true });
    const address = yield getService(COMMON_MODULE.profileHelpers).profileAddress(data);
    const entryCount = yield getService(CORE_MODULE.CONTRACTS)
      .instance.Entries.getEntryCount(address);

    let maxResults = entryCount.toNumber() === 0 ? 0 : data.limit || 5;
    if (maxResults > entryCount.toNumber()) {
      maxResults = entryCount.toNumber();
    }
    if (!address || entryCount <= data.totalLoaded) {
      return { collection: [], lastBlock: 0 };
    }
    if (data.totalLoaded) {
      const nextTotal = data.totalLoaded + maxResults;
      if (nextTotal > entryCount) {
        maxResults = entryCount - data.totalLoaded;
      }
    }

    return getService(ENTRY_MODULE.helpers).fetchFromPublish(Object.assign({}, data, {
      limit: maxResults,
      args: { author: address },
      reversed: data.reversed || false,
    }));
  });

  const entryProfileIterator = { execute, name: 'entryProfileIterator' };
  const service = function () {
    return entryProfileIterator;
  };
  sp().service(ENTRY_MODULE.entryProfileIterator, service);
  return entryProfileIterator;
}
