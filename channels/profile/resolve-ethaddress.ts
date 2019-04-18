import * as Promise from 'bluebird';
import { CORE_MODULE, PROFILE_MODULE } from '@akashaproject/common/constants';
import { unpad } from 'ethereumjs-util';

export const getByAddressSchema = {
  id: '/getByAddress',
  type: 'object',
  properties: {
    ethAddress: { type: 'string', format: 'address' },
  },
  required: ['ethAddress'],
};

export default function init (sp, getService) {

  const execute = Promise.coroutine(function* (data) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, getByAddressSchema, { throwError: true });
    const web3Api = getService(CORE_MODULE.WEB3_API);
    const contracts = getService(CORE_MODULE.CONTRACTS);
    let resolved;
    let profileHex = yield contracts.instance.ProfileResolver.reverse(data.ethAddress);
    if (!unpad(profileHex)) {
      profileHex = null;
    } else {
      resolved = yield contracts.instance.ProfileResolver.resolve(profileHex);
    }

    const akashaId = (profileHex) ? web3Api.instance.utils.toUtf8(resolved[0]) : '';
    return { akashaId, ethAddress: data.ethAddress, raw: profileHex };
  });

  const getByAddress = { execute, name: 'getByAddress' };
  const service = function () {
    return getByAddress;
  };
  sp().service(PROFILE_MODULE.getByAddress, service);
  return getByAddress;
}
