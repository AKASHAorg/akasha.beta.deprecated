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
import resolveEthAddress from '../registry/resolve-ethaddress';
import schema from '../utils/jsonschema';
import { GethConnector } from '@akashaproject/geth-connector';
import { dbs } from '../search/indexes';

export const getProfileData1 = {
    'id': '/getProfileData',
    'type': 'object',
    'properties': {
        'akashaId': { 'type': 'string' },
        'ethAddress': { 'type': 'string', 'format': 'address' },
        'short': { 'type': 'boolean' },
        'full': { 'type': 'boolean' },
        'resolveImages': { 'type': 'boolean' }
    }
};

/**
 * Get profile data for an akasha profile address
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: ProfileDataRequest) {
    const v = new schema.Validator();
    v.validate(data, getProfileData1, { throwError: true });

    let profile, akashaId;
    const ethAddress = yield profileAddress(data);
    if (data.ethAddress) {
        const resolved = yield resolveEthAddress.execute({ ethAddress: data.ethAddress });
        akashaId = resolved.akashaId;
    }
    akashaId = akashaId || data.akashaId;
    const akashaIdHash = yield contracts.instance.ProfileRegistrar.hash(akashaId || '');
    const [, , donationsEnabled,
        fn, digestSize, hash] = yield contracts.instance.ProfileResolver.resolve(akashaIdHash);
    const foCount = yield followingCount.execute({ ethAddress });
    const fwCount = yield followersCount.execute({ ethAddress });
    const entriesCount = yield entryCountProfile.execute({ ethAddress });
    const commentsCount = yield contracts.instance.Comments.totalCommentsOf(ethAddress);
    const [karma, essence] = yield contracts.instance.Essence.getCollected(ethAddress);
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

        dbs.profiles.searchIndex.concurrentAdd({}, [{
            akashaId: akashaId,
            id: ethAddress
        }], (err) => { if (err) { console.warn('error storing PROFILE index', err); } });
    }

    return Object.assign(
        {
            akashaId: akashaId,
            ethAddress: ethAddress,
            donationsEnabled: donationsEnabled,
            followingCount: foCount.count,
            followersCount: fwCount.count,
            entriesCount: entriesCount.count,
            commentsCount: commentsCount.toString(10),
            [BASE_URL]: generalSettings.get(BASE_URL),
            profile: profileAddress,
            karma: (GethConnector.getInstance().web3.fromWei(karma, 'ether')).toFormat(5),
            essence: (GethConnector.getInstance().web3.fromWei(essence, 'ether')).toFormat(5)
        },
        profile);

});

export default { execute, name: 'getProfileData' };
