import * as Promise from 'bluebird';
import { COMMON_MODULE, CORE_MODULE, PROFILE_MODULE } from '@akashaproject/common/constants';
import { followProfileSchema } from './follow-profile';

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* (data, cb) {
    const v = new getService(CORE_MODULE.VALIDATOR_SCHEMA).Validator();
    v.validate(data, followProfileSchema, { throwError: true });
    const contracts = getService(CORE_MODULE.CONTRACTS);

    const address = yield getService(COMMON_MODULE.profileHelpers)
    .profileAddress(data);

    const txData = contracts.instance.Feed
    .unFollow.request(address, { gas: 400000 });

    const transaction = yield contracts.send(txData, data.token, cb);
    getService(CORE_MODULE.STASH).mixed.flush();
    return { tx: transaction.tx, receipt: transaction.receipt, akashaId: data.akashaId };
  });

  const unFollowProfile = { execute, name: 'unFollowProfile', hasStream: true };
  const service = function () {
    return unFollowProfile;
  };
  sp().service(PROFILE_MODULE.unFollowProfile, service);

  return unFollowProfile;
}
