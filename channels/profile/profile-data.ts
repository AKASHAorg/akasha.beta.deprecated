import * as Promise from 'bluebird';
import { COMMON_MODULE, CORE_MODULE, GENERAL_SETTINGS, PROFILE_MODULE } from '@akashaproject/common/constants';
import { unpad } from 'ethereumjs-util';

export const getProfileDataSchema = {
  id: '/getProfileData',
  type: 'object',
  properties: {
    akashaId: { type: 'string' },
    ethAddress: { type: 'string', format: 'address' },
    short: { type: 'boolean' },
    full: { type: 'boolean' },
    resolveImages: { type: 'boolean' },
  },
};

export default function init(sp, getService) {

  const execute: any = Promise.coroutine(function* (data: any, cb) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, getProfileDataSchema, { throwError: true });

    let profile;
    let akashaId;
    const web3Api = getService(CORE_MODULE.WEB3_API);
    const contracts = getService(CORE_MODULE.CONTRACTS);
    const settings = getService(CORE_MODULE.SETTINGS);
    const dbIndex = getService(CORE_MODULE.DB_INDEX);
    const followingCount = getService(PROFILE_MODULE.followingCount);
    const followersCount = getService(PROFILE_MODULE.followersCount);
    const resolveEthAddress = getService(PROFILE_MODULE.resolveEthAddress);
    const entryCountProfile = getService(PROFILE_MODULE.entryCountProfile);
    const resolveProfile = getService(PROFILE_MODULE.resolveProfile);
    const getShortProfile = getService(PROFILE_MODULE.getShortProfile);

    const ethAddress = yield getService(COMMON_MODULE.profileHelpers).profileAddress(data);
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
    const partialProfile = {
      akashaId,
      ethAddress,
      donationsEnabled,
      followingCount: foCount.count,
      followersCount: fwCount.count,
      entriesCount: entriesCount.count,
      commentsCount: commentsCount.toString(10),
      [GENERAL_SETTINGS.BASE_URL]: settings.get(GENERAL_SETTINGS.BASE_URL),
      karma: (web3Api.instance.fromWei(karma, 'ether')).toFormat(5),
      essence: (web3Api.instance.fromWei(essence, 'ether')).toFormat(5),
    };
    cb('', partialProfile);
    if (!!unpad(hash)) {
      const ipfsHash = getService(COMMON_MODULE.ipfsHelpers).encodeHash(fn, digestSize, hash);
      if (data.short) {
        profile = { ipfsHash };
      } else {
        profile = (data.full) ?
          yield resolveProfile(ipfsHash, data.resolveImages)
          .timeout(settings.get(GENERAL_SETTINGS.FULL_WAIT_TIME) || 25000)
          .then((d) => d).catch((e) => null)
          :
          yield getShortProfile(ipfsHash, data.resolveImages)
          .timeout(settings.get(GENERAL_SETTINGS.OP_WAIT_TIME) || 15000)
          .then((d) => d).catch((e) => null);
      }

      dbIndex.profiles.searchIndex.concurrentAdd(
        {},
        [{ akashaId, id: ethAddress }],
        (err) => {
          if (err) {
            console.warn('error storing PROFILE index', err);
          }
        });
    }

    return Object.assign({}, partialProfile, profile);

  });

  const profileData = { execute, name: 'getProfileData', hasStream: true };
  const service = function () {
    return profileData;
  };
  sp().service(PROFILE_MODULE.profileData, service);
  return profileData;

}
