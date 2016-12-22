import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Resolve akashaId[] to a contract address
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: ProfileExistsRequest[]) {
    const batch = data.map(
        (profile) => {
            return contracts.instance.registry.addressOf(profile.akashaId);
        }
    );
    const collection = yield Promise.all(batch);
    return { collection, request: data };
});

export default { execute, name: 'addressOf' };

