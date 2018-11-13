import * as Promise from 'bluebird';
import { CORE_MODULE, PROFILE_MODULE } from '@akashaproject/common/constants';

export const cycleAethSchema = {
  id: '/cycleAeth',
  type: 'object',
  properties: {
    amount: { type: 'string' },
    token: { type: 'string' },
  },
  required: ['amount', 'token'],
};

export default function init(sp, getService) {

  const execute = Promise
  .coroutine(function* (data: { amount: string, token: string }, cb) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, cycleAethSchema, { throwError: true });

    const bnAmount = getService(CORE_MODULE.WEB3_API)
    .instance.toWei(data.amount, 'ether');

    const txData = getService(CORE_MODULE.CONTRACTS)
    .instance.AETH.cycleAeth.request(bnAmount, { gas: 160000 });

    const receipt = yield getService(CORE_MODULE.CONTRACTS)
    .send(txData, data.token, cb);

    return { receipt };
  });
  const cycleAeth = { execute, name: 'cycleAeth', hasStream: true };
  const service = function () {
    return cycleAeth;
  };
  sp().service(PROFILE_MODULE.cycleAeth, service);
  return cycleAeth;
}
