import * as Promise from 'bluebird';
import getProfileData from './profile-data';

/**
 *
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: ProfileDataRequest[], cb) {

    const pool = data.map((profile) => {
        return getProfileData.execute(profile).then((profileData) => cb(null, profileData));
    });
    yield Promise.all(pool);
    return { done: true };
});

export default { execute, name: 'getProfileList', hasStream: true };
