import * as Promise from 'bluebird';
import { COMMON_MODULE, CORE_MODULE, REGISTRY_MODULE } from '@akashaproject/common/constants';
import { unpad } from 'ethereumjs-util';
import { checkIdFormatSchema } from './check-id-format';

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* (data) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, checkIdFormatSchema, { throwError: true });

    let normalisedId;
    let exists;
    let idValid;
    const contracts = getService(CORE_MODULE.CONTRACTS);
    try {
      normalisedId = getService(COMMON_MODULE.profileHelpers)
      .normaliseId(data.akashaId);

      const idHash = yield contracts.instance.ProfileRegistrar.hash(normalisedId);
      exists = yield contracts.instance.ProfileResolver.addr(idHash);
      idValid = yield contracts.instance.ProfileRegistrar.check_format(normalisedId);
    } catch (err) {
      normalisedId = '';
      exists = '0x0';
      idValid = false;
    }

    return { idValid, normalisedId, exists: !!unpad(exists),  akashaId: data.akashaId };
  });

  const profileExists = { execute, name: 'profileExists' };
  const service = function () {
    return profileExists;
  };
  sp().service(REGISTRY_MODULE.profileExists, service);

  return profileExists;
}
