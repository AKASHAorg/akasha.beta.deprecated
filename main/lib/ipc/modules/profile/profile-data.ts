import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import { resolveProfile, getShortProfile } from './ipfs';
import { generalSettings, BASE_URL } from '../../config/settings';

/**
 * Get profile data for an akasha profile address
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: ProfileDataRequest) {
    const ipfsHash = yield contracts.instance.profile.getIpfs(data.profile);
    const profile = (data.full) ? yield resolveProfile(ipfsHash, data.resolveImages) :
        yield getShortProfile(ipfsHash, data.resolveImages);

    const akashaId = yield contracts.instance.profile.getId(data.profile);
    return Object.assign(
        {
            akashaId: akashaId,
            [BASE_URL]: generalSettings.get(BASE_URL),
            profile: data.profile
        },
        profile);

});

export default { execute, name: 'getProfileData' };
