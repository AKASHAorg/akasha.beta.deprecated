import * as Promise from 'bluebird';
import { COMMON_MODULE, CORE_MODULE, NOTIFICATIONS_MODULE } from '@akashaproject/common/constants';

const watchDonate = {
  id: '/watchDonate',
  type: 'object',
  properties: {
    akashaId: { type: 'string' },
    ethAddress: { type: 'string', format: 'address' },
    fromBlock: { type: 'number' },
  },
};

const EVENT_TYPE = 'DONATION_EVENT';

export default function init(sp, getService) {
  const execute = Promise
  .coroutine(function* (data, cb) {

    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, watchDonate, { throwError: true });
    const ethAddress = yield (getService(COMMON_MODULE.profileHelpers)).profileAddress(data);
    const web3Api = getService(CORE_MODULE.WEB3_API);
    const contracts = getService(CORE_MODULE.CONTRACTS);
    const queue = getService(NOTIFICATIONS_MODULE.queue);
    const donateEvent = contracts
    .createWatcher(contracts.instance.AETH.Donate, { to: ethAddress }, data.fromBlock);

    donateEvent.watch((err, ev) => {
      if (!err) {
        queue.push(
          cb,
          {
            type: EVENT_TYPE,
            payload: {
              from: ev.args.from,
              aeth: (web3Api.instance.utils.fromWei(ev.args.aeth, 'ether')).toFormat(5),
              eth: (web3Api.instance.utils.fromWei(ev.args.eth, 'ether')).toFormat(5),
              message: ev.args.extraData,
            },
            blockNumber: ev.blockNumber,
          },
        );
      }
    });

    return donateEvent;
  });
  const service = function () {
    return execute;
  };
  sp().service(NOTIFICATIONS_MODULE.donations, service);

  return execute;
}
