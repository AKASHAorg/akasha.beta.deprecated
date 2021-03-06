import * as Promise from 'bluebird';
import schema from '../utils/jsonschema';
import { fetchFromPublish } from './helpers';
import { profileAddress } from '../profile/helpers';
import contracts from '../../contracts';

const entryProfileIterator = {
    'id': '/entryProfileIterator',
    'type': 'object',
    'properties': {
        'limit': { 'type': 'number' },
        'toBlock': { 'type': 'number' },
        'akashaId': { 'type': 'string' },
        'ethAddress': { 'type': 'string', 'format': 'address' },
        'reversed': {'type': 'boolean'},
        'totalLoaded': { 'type': 'number' },
        'entryType': {'type': 'number'}
    },
    'required': ['toBlock']
};
/**
 * Get entries indexed by publisher
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { toBlock: number, limit?: number,
    lastIndex?: number, ethAddress?: string, akashaId?: string,
    reversed?: boolean, totalLoaded?: number, entryType?: number }) {

    const v = new schema.Validator();
    v.validate(data, entryProfileIterator, { throwError: true });
    const address = yield profileAddress(data);
    const entryCount = yield contracts.instance.Entries.getEntryCount(address);

    let maxResults = entryCount.toNumber() === 0 ? 0 : data.limit || 5;
    if (maxResults > entryCount.toNumber()) {
        maxResults = entryCount.toNumber();
    }
    if (!address || entryCount <= data.totalLoaded) {
        return { collection: [], lastBlock: 0 };
    }
    if (data.totalLoaded) {
        const nextTotal = data.totalLoaded + maxResults;
        if (nextTotal > entryCount) {
            maxResults = entryCount - data.totalLoaded;
        }
    }

    return fetchFromPublish(Object.assign({}, data, { limit: maxResults, args: { author: address }, reversed: data.reversed || false }));
});

export default { execute, name: 'entryProfileIterator' };

