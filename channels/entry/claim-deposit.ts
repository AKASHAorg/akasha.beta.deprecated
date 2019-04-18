import * as Promise from 'bluebird';
import { CORE_MODULE, ENTRY_MODULE } from '@akashaproject/common/constants';

const claimS = {
  id: '/claim',
  type: 'object',
  properties: {
    entryId: { type: 'string' },
    token: { type: 'string' },
  },
  required: ['entryId', 'token'],
};

export default function init (sp, getService) {
  const execute = Promise.coroutine(function* (data, cb) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, claimS, { throwError: true });
    const contracts = getService(CORE_MODULE.CONTRACTS);
    const txData = contracts.instance.Entries.claim.request(data.entryId, { gas: 200000 });
    const receipt = yield contracts.send(txData, data.token, cb);
    return { receipt };
  });

  const claim = { execute, name: 'claim', hasStream: true };
  const service = function () {
    return claim;
  };
  sp().service(ENTRY_MODULE.claim, service);
  return claim;
}
