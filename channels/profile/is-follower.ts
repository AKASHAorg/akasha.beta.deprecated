import * as Promise from 'bluebird';
import { COMMON_MODULE, CORE_MODULE, PROFILE_MODULE } from '@akashaproject/common/constants';

export const isFollowerSchema = {
  id: '/isFollower',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      ethAddressFollower: { type: 'string', format: 'address' },
      ethAddressFollowing: { type: 'string', format: 'address' },
      akashaIdFollower: { type: 'string' },
      akashaIdFollowing: { type: 'string' },
    },
  },
  minItems: 1,
};

export default function init(sp, getService) {

  const execute = Promise.coroutine(
    function* (data) {
      const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
      v.validate(data, isFollowerSchema, { throwError: true });
      const profileHelpers = getService(COMMON_MODULE.profileHelpers);
      const requests = data.map((req) => {
        let addressFollower;
        let addressFollowing;
        return profileHelpers
          .profileAddress(
            { akashaId: req.akashaIdFollower, ethAddress: req.ethAddressFollower })
          .then((data1) => {
            addressFollower = data1;
            return profileHelpers.profileAddress(
              { akashaId: req.akashaIdFollowing, ethAddress: req.ethAddressFollowing });
          })
          .then((data1) => {
            addressFollowing = data1;
            return getService(CORE_MODULE.CONTRACTS)
              .instance.Feed.follows(addressFollower, addressFollowing);

          })
          .then((result) => {
            return { result, addressFollower, addressFollowing };
          });
      });

      const collection = yield Promise.all(requests);
      return { collection };
    });
  const isFollower = { execute, name: 'isFollower' };
  const service = function () {
    return isFollower;
  };
  sp().service(PROFILE_MODULE.isFollower, service);

  return isFollower;
}
