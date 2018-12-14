import * as Promise from 'bluebird';
import { CORE_MODULE, SEARCH_MODULE } from '@akashaproject/common/constants';
import { dbs } from './indexes';

export const flushSchema = {
  id: '/flush',
  type: 'object',
  properties: {
    target: { type: 'string' },
  },
  required: ['target'],
};

const modules = ['entry', 'tags', 'profiles'];

export default function init(sp, getService) {
  const execute = Promise
  .coroutine(function* (data: { target: string }, cb) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, flushSchema, { throwError: true });

    if (modules.indexOf(data.target) === -1) {
      throw new Error('target is not recognized');
    }

    dbs[data.target].searchIndex.flush(function (err) {
      if (err) {
        return cb(err);
      }
      cb('', { done: true });
    });
    return { done: false };
  });

  const flush = { execute, name: 'flush', hasStream: true };
  const service = function () {
    return flush;
  };
  sp().service(SEARCH_MODULE.flush, service);

  return flush;
}
