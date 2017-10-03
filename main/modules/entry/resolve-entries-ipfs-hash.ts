import * as Promise from 'bluebird';
import { getFullContent, getShortContent } from './ipfs';
import { SHORT_WAIT_TIME } from '../../config/settings';
import schema from '../utils/jsonschema';

export const resolveEntriesIpfsHash = {
    'id': '/resolveEntriesIpfsHash',
    'type': 'object',
    'properties': {
        'ipfsHash': {
            'type': 'array',
            'items': { 'type': 'string' },
            'uniqueItems': true,
            'minItems': 1
        },
        'full': { 'type': 'boolean' }
    },
    'required': ['ipfsHash']
};

/**
 * Fetch short content from an array of ipfs hashes
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { ipfsHash: string[], full?: string }, cb: any) {
    const v = new schema.Validator();
    v.validate(data, resolveEntriesIpfsHash, { throwError: true });

    const fetchData = (data.full) ? getFullContent : getShortContent;
    data.ipfsHash.forEach((ipfsHash) => {
        fetchData(ipfsHash)
            .timeout(SHORT_WAIT_TIME)
            .then((entry) => {
                cb(null, { entry, ipfsHash: ipfsHash });
            })
            .catch((err) => {
                cb({ message: err.message, ipfsHash: ipfsHash });
            });
    });
    return {};
});

export default { execute, name: 'resolveEntriesIpfsHash', hasStream: true };
