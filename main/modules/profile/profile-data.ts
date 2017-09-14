import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { getShortProfile, resolveProfile } from './ipfs';
import { BASE_URL, FULL_WAIT_TIME, generalSettings, SHORT_WAIT_TIME } from '../../config/settings';
import followingCount from './following-count';
import followersCount from './followers-count';
import entryCountProfile from '../entry/entry-count-profile';
import subsCount from '../tags/subs-count';


/**
 * Get profile data for an akasha profile address
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: ProfileDataRequest) {
    let profile;
    const akashaId = (data.akashaId) ? data.akashaId : yield contracts.instance.profile.getId(data.profile);
    const profileAddress = (data.profile) ? data.profile : yield contracts.instance.registry.addressOf(data.akashaId);
    const ipfsHash = yield contracts.instance.profile.getIpfs(profileAddress);
    const foCount = yield followingCount.execute({ akashaId });
    const fwCount = yield followersCount.execute({ akashaId });
    const entriesCount = yield entryCountProfile.execute({ akashaId });
    const subscriptionsCount = yield subsCount.execute({ akashaId });

    if (data.short) {
        profile = { ipfsHash: ipfsHash };
    } else {
        profile = (data.full) ?
            yield resolveProfile(ipfsHash, data.resolveImages)
                .timeout(FULL_WAIT_TIME)
                .then((d) => d).catch((e) => null)
            :
            yield getShortProfile(ipfsHash, data.resolveImages)
                .timeout(SHORT_WAIT_TIME)
                .then((d) => d).catch((e) => null);
    }

    return Object.assign(
        {
            akashaId: akashaId,
            followingCount: foCount.count,
            followersCount: fwCount.count,
            entriesCount: entriesCount.count,
            subscriptionsCount: subscriptionsCount.count,
            [BASE_URL]: generalSettings.get(BASE_URL),
            profile: profileAddress
        },
        profile);

});

export default { execute, name: 'getProfileData' };
