import * as Promise from 'bluebird';
import contracts from '../../contracts/index';

/**
 * Resolve akashaId[] to a contract address
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: ProfileExistsRequest[]) {
    const batch = data.map(
        (profile) => {
            return contracts.instance.ProfileResolver.addr(profile.akashaId);
        }
    );
    const collection = yield Promise.all(batch);
    return { collection };
});

export default { execute, name: 'addressOf' };

