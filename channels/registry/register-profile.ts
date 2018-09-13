import * as Promise from 'bluebird';
import {
  COMMON_MODULE,
  CORE_MODULE,
  IMG_SIZE_SCHEMA,
  PROFILE_SCHEMA,
  REGISTRY_MODULE,
} from '@akashaproject/common/constants';

export const registerProfileSchema = {
  id: '/registerProfile',
  type: 'object',
  properties: {
    akashaId: { type: 'string', minLength: 2 },
    ethAddress: { type: 'string', format: 'address' },
    donationsEnabled: { type: 'boolean' },
    ipfs: { $ref: '/profileSchema' },
    token: { type: 'string' },

  },
  required: ['akashaId', 'ethAddress', 'donationsEnabled', 'ipfs', 'token'],
};

export default function init(sp, getService) {

  //
  const execute = Promise.coroutine(function* (data, cb) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.addSchema(IMG_SIZE_SCHEMA, '/imgSize');
    v.addSchema(PROFILE_SCHEMA, '/profileSchema');
    v.validate(data, registerProfileSchema, { throwError: true });
    const normalisedId = getService(COMMON_MODULE.profileHelpers).normaliseId(data.akashaId);
    const check = yield getService(REGISTRY_MODULE.checkIdFormat)
    .execute({ akashaId: normalisedId });

    if (!check.idValid) {
      throw new Error('Invalid akashaId');
    }

    const ipfsHash = yield getService(COMMON_MODULE.profileHelpers)
    .ipfsCreateProfile(data.ipfs);

    const [hash, fn, digest] = getService(COMMON_MODULE.ipfsHelpers).decodeHash(ipfsHash);

    const txData = getService(CORE_MODULE.CONTRACTS).instance
    .ProfileRegistrar
    .register.request(normalisedId, data.donationsEnabled, hash, fn, digest, {
      gas: 400000,
      from: data.ethAddress,
    });

    const transaction = yield getService(CORE_MODULE.CONTRACTS)
    .send(txData, data.token, cb);

    return { tx: transaction.tx, receipt: transaction.receipt };
  });

  const registerProfile = { execute, name: 'registerProfile', hasStream: true };
  const service = function () {
    return registerProfile;
  };
  sp().service(REGISTRY_MODULE.registerProfile, service);

  return registerProfile;
}
