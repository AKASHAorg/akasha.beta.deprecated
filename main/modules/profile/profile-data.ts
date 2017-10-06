import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { getShortProfile, resolveProfile } from './ipfs';
import { BASE_URL, FULL_WAIT_TIME, generalSettings, SHORT_WAIT_TIME } from '../../config/settings';
import followingCount from './following-count';
import followersCount from './followers-count';
import { profileAddress } from './helpers';
import { encodeHash } from '../ipfs/helpers';
import { unpad } from 'ethereumjs-util';
import entryCountProfile from '../entry/entry-count-profile';
import schema from '../utils/jsonschema';

export const getProfileData = {
    'id': '/getProfileData',
    'type': 'object',
    'properties': {
        'akashaId': { 'type': 'string' },
        'short': { 'type': 'boolean' },
        'full': { 'type': 'boolean' },
        'resolveImages': { 'type': 'boolean' }
    },
    'required': ['akashaId']
};

/**
 * Get profile data for an akasha profile address
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: ProfileDataRequest) {
    const v = new schema.Validator();
    v.validate(data, getProfileData, { throwError: true });

    let profile;
    const ethAddress = yield profileAddress(data);
    const akashaIdHash = yield contracts.instance.ProfileRegistrar.hash(data.akashaId);
    const [, address, donationsEnabled,
        fn, digestSize, hash] = yield contracts.instance.ProfileResolver.resolve(akashaIdHash);
    const foCount = yield followingCount.execute({ ethAddress });
    const fwCount = yield followersCount.execute({ ethAddress });
    const entriesCount = yield entryCountProfile.execute({ ethAddress });
    const commentsCount = yield contracts.instance.Comments.totalCommentsOf(ethAddress);
    if (!!unpad(hash)) {
        const ipfsHash = encodeHash(fn, digestSize, hash);
        if (data.short) {
            profile = { ipfsHash };
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
    }

    return Object.assign(
        {
            akashaId: data.akashaId,
            ethAddress: address,
            donationsEnabled: donationsEnabled,
            followingCount: foCount.count,
            followersCount: fwCount.count,
            entriesCount: entriesCount.count,
            commentsCount: commentsCount.toString(10),
            [BASE_URL]: generalSettings.get(BASE_URL),
            profile: profileAddress
        },
        profile);

});

export default { execute, name: 'getProfileData' };
