import * as Promise from 'bluebird';
import { COMMON_MODULE, CORE_MODULE, ENTRY_MODULE } from '@akashaproject/common/constants';

const getProfileEntriesCountS = {
  id: '/getProfileEntriesCount',
  type: 'object',
  properties: {
    akashaId: { type: 'string' },
    ethAddress: { type: 'string', format: 'address' },
  },
};

export default function init(sp, getService) {
  const execute = Promise
  .coroutine(function* (data: { ethAddress?: string, akashaId?: string }) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, getProfileEntriesCountS, { throwError: true });

    const address = yield getService(COMMON_MODULE.profileHelpers).profileAddress(data);
    const count = yield getService(CORE_MODULE.CONTRACTS)
    .instance.Entries.getEntryCount(address);
    return { count: count.toString(10) };
  });

  const getProfileEntriesCount = { execute, name: 'getProfileEntriesCount' };
  const service = function () {
    return getProfileEntriesCount;
  };
  sp().service(ENTRY_MODULE.getProfileEntriesCount, service);
  return getProfileEntriesCount;
}
