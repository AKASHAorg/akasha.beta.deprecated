import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Check if provided `akashaId` is taken
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: ProfileExistsRequest) {
    const exists = yield contracts.instance.registry.profileExists(data.akashaId);
    return { exists, akashaId: data.akashaId };
});

export default { execute, name: 'profileExists'};

