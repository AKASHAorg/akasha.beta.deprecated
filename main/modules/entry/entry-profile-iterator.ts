import * as Promise from 'bluebird';
import schema from '../utils/jsonschema';
import { fetchFromPublish } from './helpers';
import { profileAddress } from '../profile/helpers';

const entryProfileIterator = {
    'id': '/entryProfileIterator',
    'type': 'object',
    'properties': {
        'limit': { 'type': 'number' },
        'toBlock': { 'type': 'number' },
        'akashaId': { 'type': 'string' },
        'ethAddress': { 'type': 'string', 'format': 'address' }
    },
    'required': ['toBlock']
};
/**
 * Get entries indexed by publisher
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { toBlock: number, limit?: number,
    lastIndex?: number, ethAddress?: string, akashaId?: string }) {

    const v = new schema.Validator();
    v.validate(data, entryProfileIterator, { throwError: true });

    const address = yield profileAddress(data);
    const maxResults = data.limit || 5;
    return fetchFromPublish(Object.assign({}, data, { limit: maxResults, args: { author: address } }));
});

export default { execute, name: 'entryProfileIterator' };

