import * as Promise from 'bluebird';
import schema from '../utils/jsonschema';
import { fetchFromPublish } from './helpers';

const allStreamIterator = {
    'id': '/allStreamIterator',
    'type': 'object',
    'properties': {
        'limit': { 'type': 'number' },
        'toBlock': { 'type': 'number' },
        'lastIndex': {'type': 'number'}
    },
    'required': ['toBlock']
};

/**
 * Get a tags created
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { toBlock: number, limit?: number, lastIndex?: number }) {
    const v = new schema.Validator();
    v.validate(data, allStreamIterator, { throwError: true });

    const maxResults = data.limit || 5;
    return fetchFromPublish(Object.assign({}, data, { limit: maxResults, args: {} }));
});

export default { execute, name: 'allStreamIterator' };
