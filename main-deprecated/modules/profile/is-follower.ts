import * as Promise from 'bluebird';
import { profileAddress } from './helpers';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';

export const isFollower = {
    'id': '/isFollower',
    'type': 'array',
    'items': {
        'type': 'object',
        'properties': {
            'ethAddressFollower': { 'type': 'string', 'format': 'address' },
            'ethAddressFollowing': { 'type': 'string', 'format': 'address' },
            'akashaIdFollower': { 'type': 'string' },
            'akashaIdFollowing': { 'type': 'string' }
        }
    },
    'minItems': 1
};
/**
 * Check if someone is follower
 * @type {Function}
 */
const execute = Promise.coroutine(
    /**
     *
     * @param data
     * @returns {{collection: any}}
     */
    function* (data: {
        ethAddressFollower?: string,
        ethAddressFollowing?: string,
        akashaIdFollower?: string,
        akashaIdFollowing?: string
    }[]) {
        const v = new schema.Validator();
        v.validate(data, isFollower, { throwError: true });

        const requests = data.map((req) => {
            let addressFollower, addressFollowing;
            return profileAddress({ akashaId: req.akashaIdFollower, ethAddress: req.ethAddressFollower })
                .then((data1) => {
                    addressFollower = data1;
                    return profileAddress({ akashaId: req.akashaIdFollowing, ethAddress: req.ethAddressFollowing });
                })
                .then((data1) => {
                    addressFollowing = data1;
                    return contracts.instance.Feed.follows(addressFollower, addressFollowing);
                })
                .then((result) => {
                    return { result, addressFollower, addressFollowing };
                });
        });

        const collection = yield Promise.all(requests);
        return { collection };
    });

export default { execute, name: 'isFollower' };
