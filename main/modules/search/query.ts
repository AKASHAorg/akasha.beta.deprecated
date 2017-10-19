import * as Promise from 'bluebird';
import { dbs } from './indexes';
import schema from '../utils/jsonschema';

const querySchema = {
    'id': '/query',
    'type': 'object',
    'properties': {
        'text': { 'type': 'string' },
        'authors': {
            'type': 'array',
            'items': { 'type': 'string' },
            'uniqueItems': true,
            'minItems': 1
        },
        'pageSize': { 'type': 'number' },
        'offset': { 'type': 'number' }
    },
    'required': ['text']
};

const buildFilter = function (authors: string[], text: string) {
    const result = [];
    authors.forEach((ethAddress) => {
        result.push({ AND: { 'ethAddress': [ethAddress], 'title': [text] }, BOOST: 5 });
        result.push({ AND: { 'ethAddress': [ethAddress], 'excerpt': [text] } });
    });
    return result;
};

const execute = Promise.coroutine(function* (data: { text: string, authors?: string[], pageSize: number, offset: number }, cb) {
    const v = new schema.Validator();
    v.validate(data, querySchema, { throwError: true });

    const collection = [];
    const pageSize = data.pageSize || 20;
    const offset = data.offset || 0;
    const defaultQuery = [{ AND: { 'title': [data.text] }, BOOST: 5 }, { AND: { 'excerpt': [data.text] } }];
    const query = (data.authors && data.authors.length) ? buildFilter(data.authors, data.text) : defaultQuery;
    dbs.entry.searchIndex.totalHits({ query: query }, function (err, count) {
        dbs.entry.searchIndex.search({
            query: query,
            pageSize: pageSize,
            offset: offset
        })
            .on('data', (data) => {
                collection.push({
                    entryId: data.document.id,
                    ethAddress: data.document.ethAddress,
                    version: data.document.version
                });
            }).on('end', () => {
            cb('', { collection, totalHits: count, searching: false });
        });
    });
    return { searching: true };
});

export default { execute, name: 'query', hasStream: true };
