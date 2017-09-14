import * as Promise from 'bluebird';
import getProfileData from './profile-data';

/**
 *
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: ProfileDataRequest[]) {

    const pool = data.map((profile) => {
        return getProfileData.execute(profile);
    });
    const collection = yield Promise.all(pool);
    return { collection: collection, resolve: data };
});

export default { execute, name: 'getProfileList' };
