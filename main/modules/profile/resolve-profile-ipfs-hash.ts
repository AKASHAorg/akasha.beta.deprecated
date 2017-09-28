import * as Promise from 'bluebird';
import { getShortProfile, resolveProfile } from './ipfs';
import { SHORT_WAIT_TIME } from '../../config/settings';
import schema from '../utils/jsonschema';

export const resolveProfileIpfsHash = {
    'id': '/resolveProfileIpfsHash',
    'type': 'object',
    'properties': {
        'ipfsHash': {
            'type': 'array',
            'items': { 'type': 'string', 'format': 'multihash' },
            'uniqueItems': true,
            'minItems': 1
        },
        'full': {
            'type': 'boolean'
        }
    },
    'required': ['ipfsHash']
};

/**
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { ipfsHash: string[], full?: boolean }, cb: any) {
    const v = new schema.Validator();
    v.validate(data, resolveProfileIpfsHash, { throwError: true });

    const resolve = (data.full) ? resolveProfile : getShortProfile;
    data.ipfsHash.forEach((profileHash) => {
        resolve(profileHash)
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
