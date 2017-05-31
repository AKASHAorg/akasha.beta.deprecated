import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

const execute = Promise.coroutine(function*() {
    const profiles = contracts.instance.registry.getLocalProfiles();
    for (let profile of profiles) {
        profile.akashaId = yield contracts.instance.profile.getId(profile.profile);
    }
    return profiles;
});

export default { execute, name: 'getLocalIdentities' };