import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import { resolveProfile, getShortProfile } from './ipfs';
import { generalSettings, BASE_URL, SHORT_WAIT_TIME, FULL_WAIT_TIME } from '../../config/settings';
import followingCount from './following-count';
import followersCount from './followers-count';
import entryCountProfile from '../entry/entry-count-profile';
import subsCount from '../tags/subs-count';


/**
 * Get profile data for an akasha profile address
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: ProfileDataRequest) {
    const ipfsHash = yield contracts.instance.profile.getIpfs(data.profile);
    const profile = (data.full) ?
        yield resolveProfile(ipfsHash, data.resolveImages)
            .timeout(FULL_WAIT_TIME)
            .then((d) => d).catch((e) => null)
        :
        yield getShortProfile(ipfsHash, data.resolveImages)
            .timeout(SHORT_WAIT_TIME)
            .then((d) => d).catch((e) => null);

    const akashaId = yield contracts.instance.profile.getId(data.profile);
    const foCount = yield followingCount.execute({ akashaId });
    const fwCount = yield followersCount.execute({ akashaId });
    const entriesCount = yield entryCountProfile.execute({ akashaId });
    const subscriptionsCount = yield subsCount.execute({ akashaId });
    return Object.assign(
        {
            akashaId: akashaId,
            followingCount: foCount.count,
            followersCount: fwCount.count,
            entriesCount: entriesCount.count,
            subscriptionsCount: subscriptionsCount.count,
            [BASE_URL]: generalSettings.get(BASE_URL),
            profile: data.profile
        },
        profile);

});

export default { execute, name: 'getProfileData' };
