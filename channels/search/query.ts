import * as Promise from 'bluebird';
import { CORE_MODULE, SEARCH_MODULE } from '@akashaproject/common/constants';
import { dbs } from './indexes';

const querySchema = {
  id: '/query',
  type: 'object',
  properties: {
    text: { type: 'string' },
    authors: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      minItems: 1,
    },
    pageSize: { type: 'number' },
    offset: { type: 'number' },
  },
  required: ['text'],
};

const buildFilter = function (authors: string[], text: string) {
  const result = [];
  authors.forEach((ethAddress) => {
    result.push({ AND: { ethAddress: [ethAddress], title: [text] }, BOOST: 5 });
    result.push({ AND: { ethAddress: [ethAddress], excerpt: [text] } });
  });
  return result;
};

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* (data, cb) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, querySchema, { throwError: true });

    const collection = [];
    const pageSize = data.pageSize || 20;
    const offset = data.offset || 0;
    const defaultQuery = [{ AND: { title: [data.text] }, BOOST: 5 }, { AND: { excerpt: [data.text] } }];
    const query = (data.authors && data.authors.length) ?
      buildFilter(data.authors, data.text) : defaultQuery;
    dbs.entry.searchIndex.totalHits({ query }, function (err, count) {
      dbs.entry.searchIndex.search({
          query,
          pageSize,
          offset,
        })
        .on('data', (data) => {
          collection.push({
            entryId: data.document.id,
            ethAddress: data.document.ethAddress,
            version: data.document.version,
          });
        }).on('end', () => {
        cb('', { collection, totalHits: count, searching: false });
      });
    });
    return { searching: true };
  });

  const query = { execute, name: 'query', hasStream: true };
  const service = function () {
    return query;
  };
  sp().service(SEARCH_MODULE.query, service);

  return query;
}
