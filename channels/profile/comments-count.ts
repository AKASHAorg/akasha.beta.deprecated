import * as Promise from 'bluebird';
import { COMMON_MODULE, CORE_MODULE, PROFILE_MODULE } from '@akashaproject/common/constants';

export const getCommentsCountSchema = {
  id: '/getCommentsCount',
  type: 'object',
  properties: {
    ethAddress: { type: 'string', format: 'address' },
    akashaId: { type: 'string' },
  },
};

export default function init(sp, getService) {

  const execute = Promise.coroutine(function* (data) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, getCommentsCountSchema, { throwError: true });

    const address = yield getService(COMMON_MODULE.profileHelpers)
    .profileAddress(data);

    const count = yield getService(CORE_MODULE.CONTRACTS)
    .instance.Comments.totalCommentsOf(address);

    return { count: count.toString(10), akashaId: data.akashaId };
  });
  const commentsCount = { execute, name: 'getCommentsCount' };
  const service = function () {
    return commentsCount;
  };
  sp().service(PROFILE_MODULE.getCommentsCount, service);
  return commentsCount;
}
