import * as Promise from 'bluebird';
import { COMMON_MODULE, CORE_MODULE, PROFILE_MODULE } from '@akashaproject/common/constants';

export const updateProfileData = {
  id: '/updateProfileData',
  type: 'object',
  properties: {
    ipfs: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        avatar: { type: 'any' },
        backgroundImage: { type: 'any' },
        about: { type: 'string' },
        links: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              url: { type: 'string' },
              type: { type: 'string' },
              id: { type: 'number' },
            },
            required: ['title', 'url', 'type', 'id'],
          },
        },
      },
    },
    token: { type: 'string' },

  },
  required: ['ipfs', 'token'],
};

export default function init (sp, getService) {

  const execute = Promise.coroutine(function* (data, cb) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, updateProfileData, { throwError: true });

    const ipfsHash = yield (getService(COMMON_MODULE.profileHelpers))
      .ipfsCreateProfile(data.ipfs);

    console.log('mainipfsHash', ipfsHash);
    const decodedHash = getService(COMMON_MODULE.ipfsHelpers).decodeHash(ipfsHash);
    const currentProfile = yield getService(PROFILE_MODULE.getCurrentProfile).execute();
    if (!currentProfile.raw) {
      throw new Error('No profile found to update');
    }
    const contracts = getService(CORE_MODULE.CONTRACTS);
    const txData = contracts.instance.ProfileResolver
      .setHash.request(
        currentProfile.raw,
        ...decodedHash,
      );
    const receipt = yield contracts.send(txData, data.token, cb);
    return { receipt };
  });

  const updateProfileDatas = { execute, name: 'updateProfileData', hasStream: true };
  const service = function () {
    return updateProfileDatas;
  };
  sp().service(PROFILE_MODULE.updateProfileData, service);
  return updateProfileDatas;
}
