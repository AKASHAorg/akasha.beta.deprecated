import * as Promise from 'bluebird';
import { COMMON_MODULE, CORE_MODULE, PROFILE_MODULE } from '@akashaproject/common/constants';
import { getFollowersCountSchema } from './followers-count';

export default function init (sp, getService) {

  const execute = Promise.coroutine(function* (data) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, getFollowersCountSchema, { throwError: true });

    const address = yield (getService(COMMON_MODULE.profileHelpers)).profileAddress(data);
    const count = yield (getService(CORE_MODULE.CONTRACTS)).instance.Feed.totalFollowing(address);
    return { count: count.toString(10), akashaId: data.akashaId };
  });

  const followingCount = { execute, name: 'getFollowingCount' };
  const service = function () {
    return followingCount;
  };
  sp().service(PROFILE_MODULE.followingCount, service);
  return followingCount;
}
