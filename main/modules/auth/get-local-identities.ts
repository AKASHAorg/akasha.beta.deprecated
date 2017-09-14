import * as Promise from 'bluebird';
import contracts from '../../contracts/index';

const execute = Promise.coroutine(function* () {
    const profiles = yield contracts.instance.registry.getLocalProfiles();
    for (let profile of profiles) {
        profile['akashaId'] = (profile.profile) ? yield contracts.instance.profile.getId(profile.profile) : null;
    }
    return profiles;
});

export default { execute, name: 'getLocalIdentities' };
