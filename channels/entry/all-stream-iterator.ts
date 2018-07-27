import * as Promise from 'bluebird';
import { CORE_MODULE, ENTRY_MODULE } from '@akashaproject/common/constants';

const allStreamIteratorS = {
  id: '/allStreamIterator',
  type: 'object',
  properties: {
    limit: { type: 'number' },
    toBlock: { type: 'number' },
    lastIndex: { type: 'number' },
    reversed: { type: 'boolean' },
  },
  required: ['toBlock'],
};

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* (data) {
    const v = new getService(CORE_MODULE.VALIDATOR_SCHEMA).Validator();
    v.validate(data, allStreamIteratorS, { throwError: true });

    const maxResults = data.limit || 5;
    return getService(ENTRY_MODULE.helpers).fetchFromPublish(Object.assign({}, data, {
      limit: maxResults,
      args: {},
      reversed: data.reversed || false,
    }));
  });
  const allStreamIterator = { execute, name: 'allStreamIterator' };
  const service = function () {
    return allStreamIterator;
  };
  sp().service(ENTRY_MODULE.allStreamIterator, service);
  return allStreamIterator;
}
