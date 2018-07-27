import * as Promise from 'bluebird';
import { CORE_MODULE, ENTRY_MODULE } from '@akashaproject/common/constants';

const getTagEntriesCountS = {
  id: '/getTagEntriesCount',
  type: 'array',
  items: {
    type: 'string',
  },
  uniqueItems: true,
  minItems: 1,
};

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* (data) {
    const v = new getService(CORE_MODULE.VALIDATOR_SCHEMA).Validator();
    v.validate(data, getTagEntriesCountS, { throwError: true });

    const contracts = getService(CORE_MODULE.CONTRACTS);
    const requests = data.map((tag) => {
      return contracts.instance.Tags
        .totalEntries(tag)
        .then((count) => {
          return { count: count.toString(10), tag };
        });
    });
    const collection = yield Promise.all(requests);
    return { collection };
  });

  const getTagEntriesCount = { execute, name: 'getTagEntriesCount' };
  const service = function () {
    return getTagEntriesCount;
  };
  sp().service(ENTRY_MODULE.getTagEntriesCount, service);
  return getTagEntriesCount;
}
