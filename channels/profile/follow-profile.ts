import * as Promise from 'bluebird';
import { COMMON_MODULE, CORE_MODULE, PROFILE_MODULE } from '@akashaproject/common/constants';

export const followProfileSchema = {
  id: '/followProfile',
  type: 'object',
  properties: {
    ethAddress: { type: 'string', format: 'address' },
    akashaId: { type: 'string' },
    token: { type: 'string' },
  },
  required: ['token'],
};

export default function init(sp, getService) {

  const execute = Promise.coroutine(function* (data, cb) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, followProfileSchema, { throwError: true });

    const address = yield getService(COMMON_MODULE.profileHelpers).profileAddress(data);
    const contracts = getService(CORE_MODULE.CONTRACTS);
    const txData = contracts.instance.Feed.follow.request(address, { gas: 400000 });
    const transaction = yield contracts.send(txData, data.token, cb);
    getService(CORE_MODULE.STASH).mixed.flush();
    return { tx: transaction.tx, receipt: transaction.receipt };
  });
  const followProfile = { execute, name: 'followProfile', hasStream: true };
  const service = function () {
    return followProfile;
  };
  sp().service(PROFILE_MODULE.followProfile, service);
  return followProfile;
}
