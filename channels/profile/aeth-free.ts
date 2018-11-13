import * as Promise from 'bluebird';
import { CORE_MODULE, PROFILE_MODULE } from '@akashaproject/common/constants';

export const freeAethSchema = {
  id: '/freeAeth',
  type: 'object',
  properties: {
    token: { type: 'string' },
  },
  required: ['token'],
};

export default function init(sp, getService) {

  const execute = Promise
  .coroutine(function* (data: { token: string }, cb) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, freeAethSchema, { throwError: true });

    const txData = getService(CORE_MODULE.CONTRACTS)
    .instance.AETH.freeAeth.request({ gas: 1000000 });

    const receipt = yield getService(CORE_MODULE.CONTRACTS)
    .send(txData, data.token, cb);

    return { receipt };
  });
  const freeAeth = { execute, name: 'freeAeth', hasStream: true };
  const service = function () {
    return freeAeth;
  };
  sp().service(PROFILE_MODULE.freeAeth, service);
  return freeAeth;
}
