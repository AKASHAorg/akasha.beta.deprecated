import * as Promise from 'bluebird';
import schema from '../utils/jsonschema';
import { fetchFromTagIndex } from './helpers';
import contracts from '../../contracts';

const entryTagIterator = {
    'id': '/entryTagIterator',
    'type': 'object',
    'properties': {
        'limit': { 'type': 'number' },
        'toBlock': { 'type': 'number' },
        'tagName': { 'type': 'string', 'minLength': 1, 'maxLength': 32 },
        'reversed': { 'type': 'boolean' },
        'entryType': {'type': 'number'}
    },
    'required': ['toBlock', 'tagName']
};

/**
 * Get a tags created
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: {
    toBlock: number, limit?: number,
    tagName: string, lastIndex?: number, reversed?: boolean, totalLoaded?: number, entryType?: number
}) {
    const v = new schema.Validator();
    v.validate(data, entryTagIterator, { throwError: true });

    const entryCount = yield contracts.instance.Tags.totalEntries(data.tagName);

    let maxResults = entryCount.toNumber() === 0 ? 0 : data.limit || 5;
    if (maxResults > entryCount.toNumber()) {
        maxResults = entryCount.toNumber();
    }
    if (!data.tagName || entryCount <= data.totalLoaded) {
        return { collection: [], lastBlock: 0 };
    }
    if (data.totalLoaded) {
        const nextTotal = data.totalLoaded + maxResults;
        if (nextTotal > entryCount) {
            maxResults = entryCount - data.totalLoaded;
        }
    }
    return fetchFromTagIndex(Object.assign(
        {},
        data,
        { limit: maxResults, args: { tagName: data.tagName }, reversed: data.reversed || false })
    );
});

export default { execute, name: 'entryTagIterator' };

