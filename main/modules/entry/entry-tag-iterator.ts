import * as Promise from 'bluebird';
import schema from '../utils/jsonschema';
import { fetchFromTagIndex } from './helpers';

const entryTagIterator = {
    'id': '/entryTagIterator',
    'type': 'object',
    'properties': {
        'limit': { 'type': 'number' },
        'toBlock': { 'type': 'number' },
        'tagName': { 'type': 'string', 'minLength': 1, 'maxLength': 32 },
        'reversed': {'type': 'boolean'}
    },
    'required': ['toBlock', 'tagName']
};

/**
 * Get a tags created
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { toBlock: number, limit?: number,
    tagName: string, lastIndex?: number, reversed?: boolean }) {
    const v = new schema.Validator();
    v.validate(data, entryTagIterator, { throwError: true });

    const maxResults = data.limit || 5;
    return fetchFromTagIndex(Object.assign({}, data, { limit: maxResults, args: { tagName: data.tagName }, reversed: data.reversed || false }));
});

export default { execute, name: 'entryTagIterator' };

