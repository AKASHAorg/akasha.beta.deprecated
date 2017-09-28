import * as Promise from 'bluebird';
import { getShortProfile } from './ipfs';
import { SHORT_WAIT_TIME } from '../../config/settings';
import schema from '../utils/jsonschema';

export const resolveProfileIpfsHash = {
    'id': '/resolveProfileIpfsHash',
    'type': 'array',
    'items': {
        'type': 'object',
        'properties': {
            'ipfsHash': { 'type': 'string', 'format': 'multihash' }
        },
        'required': ['ipfsHash']
    },
    'uniqueItems': true,
    'minItems': 1
};

/**
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { ipfsHash: string[] }, cb: any) {
    const v = new schema.Validator();
    v.validate(data, resolveProfileIpfsHash, { throwError: true });

    data.ipfsHash.forEach((profileHash) => {
        getShortProfile(profileHash)
            .timeout(SHORT_WAIT_TIME)
            .then((profile) => {
                cb(null, { profile, ipfsHash: profileHash });
            })
            .catch((err) => {
                cb({ message: err.message, ipfsHash: profileHash });
            });
    });
    return {};
});

export default { execute, name: 'resolveProfileIpfsHash', hasStream: true };
