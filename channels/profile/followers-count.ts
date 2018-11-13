import * as Promise from 'bluebird';
import { COMMON_MODULE, CORE_MODULE, PROFILE_MODULE } from '@akashaproject/common/constants';

export const getFollowersCountSchema = {
  id: '/getFollowersCount',
  type: 'object',
  properties: {
    ethAddress: { type: 'string', format: 'address' },
    akashaId: { type: 'string' },
  },
};

export default function init(sp, getService) {

  const execute = Promise.coroutine(function* (data) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, getFollowersCountSchema, { throwError: true });

    const address = yield (getService(COMMON_MODULE.profileHelpers))
    .profileAddress(data);

    const count = yield (getService(CORE_MODULE.CONTRACTS)).instance
    .Feed.totalFollowers(address);

    return { count: count.toString(10), akashaId: data.akashaId };
  });

  const followersCount = { execute, name: 'getFollowersCount' };
  const service = function () {
    return followersCount;
  };
  sp().service(PROFILE_MODULE.followersCount, service);

  return followersCount;
}
