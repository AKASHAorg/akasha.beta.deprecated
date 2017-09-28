import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { profileAddress } from './helpers';
import schema from '../utils/jsonschema';

export const getFollowersCount = {
    'id': '/getFollowersCount',
    'type': 'object',
    'properties': {
        'ethAddress': { 'type': 'string', 'format': 'address' },
        'akashaId': { 'type': 'string' },
    }
};

/**
 * Get total number of followers
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: GetFollowerCountRequest) {
    const v = new schema.Validator();
    v.validate(data, getFollowersCount, { throwError: true });

    const address = yield profileAddress(data);
    const count = yield contracts.instance.Feed.totalFollowers(address);
    return { count: count.toString(10), akashaId: data.akashaId };
});

export default { execute, name: 'getFollowersCount' };
