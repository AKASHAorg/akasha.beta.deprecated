import * as Promise from 'bluebird';
import { CORE_MODULE, REGISTRY_MODULE } from '@akashaproject/common/constants';

export const checkIdFormatSchema = {
  id: '/checkIdFormat',
  type: 'object',
  properties: {
    akashaId: { type: 'string', minLength: 2 },
  },
  required: ['akashaId'],
};

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* (data) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, checkIdFormatSchema, { throwError: true });

    const idValid = yield (getService(CORE_MODULE.CONTRACTS))
    .instance.ProfileRegistrar.check_format(data.akashaId);
    return { idValid, akashaId: data.akashaId };
  });

  const checkIdFormat = { execute, name: 'checkIdFormat' };
  const service = function () {
    return checkIdFormat;
  };
  sp().service(REGISTRY_MODULE.checkIdFormat, service);

  return checkIdFormat;
}
