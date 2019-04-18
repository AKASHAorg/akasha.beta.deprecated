import * as Promise from 'bluebird';
import { SEARCH_MODULE } from '@akashaproject/common/constants';
import { dbs } from './indexes';

export default function init (sp, getService) {
  const execute = Promise
    .coroutine(function* (data: { text: string, limit: number }, cb) {
      const collection = [];
      const pageSize = data.limit || 10;
      const options = {
        beginsWith: data.text,
        field: 'tagName',
        threshold: 1,
        limit: pageSize,
        type: 'simple',
      };

      dbs.tags
        .searchIndex
        .match(options)
        .on('data', (data) => {
          collection.push(data);
        })
        .on('end', () => {
          cb('', { collection });
        });
      return {};
    });

  const findTags = { execute, name: 'findTags', hasStream: true };
  const service = function () {
    return findTags;
  };
  sp().service(SEARCH_MODULE.findTags, service);
  return findTags;
}
