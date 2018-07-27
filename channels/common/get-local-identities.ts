import * as Promise from 'bluebird';
import { uniq } from 'ramda';
import { AUTH_MODULE, CORE_MODULE, PROFILE_MODULE } from './constants';

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* () {
    const web3Api = getService(CORE_MODULE.WEB3_API);
    const resolveEth = getService(PROFILE_MODULE.resolveEthAddress);
    const accounts = yield web3Api.instance.eth.getAccountsAsync();
    if (!accounts || !accounts.length) {
      return { collection: [] };
    }
    const profiles = uniq(accounts).map((address: string) => {
      return resolveEth.execute({ ethAddress: address });
    });
    const collection = yield Promise.all(profiles);
    return { collection: collection || [] };
  });

  const getLocalIdentities = { execute, name: 'getLocalIdentities' };
  const service = function () {
    return getLocalIdentities;
  };
  sp().service(AUTH_MODULE.getLocalIdentities, service);
  return getLocalIdentities;
}
