import * as Promise from 'bluebird';
import { COMMON_MODULE, CORE_MODULE, NOTIFICATIONS_MODULE } from '@akashaproject/common/constants';

const watchFollow = {
  id: '/watchFollow',
  type: 'object',
  properties: {
    akashaId: { type: 'string' },
    ethAddress: { type: 'string', format: 'address' },
    fromBlock: { type: 'number' },
  },
};

const EVENT_TYPE = 'FOLLOWING_EVENT';

export default function init(sp, getService) {

  const execute = Promise.coroutine(function* (data, cb) {

    const v = new getService(CORE_MODULE.VALIDATOR_SCHEMA).Validator();
    v.validate(data, watchFollow, { throwError: true });
    const ethAddress = yield getService(COMMON_MODULE.profileHelpers).profileAddress(data);
    const contracts = getService(CORE_MODULE.CONTRACTS);
    const queue = getService(NOTIFICATIONS_MODULE.queue);
    const followEvent = contracts
    .createWatcher(contracts.instance.Feed.Follow, { followed: ethAddress }, data.fromBlock);

    followEvent.watch((err, ev) => {
      if (!err) {
        queue.push(cb, { type: EVENT_TYPE, payload: ev.args, blockNumber: ev.blockNumber });
      }
    });

    return followEvent;
  });
  const service = function () {
    return execute;
  };
  sp().service(NOTIFICATIONS_MODULE.feed, service);

  return execute;
}
