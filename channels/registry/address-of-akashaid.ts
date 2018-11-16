import * as Promise from 'bluebird';
import { CORE_MODULE, REGISTRY_MODULE } from '@akashaproject/common/constants';
import { unpad } from 'ethereumjs-util';
import { checkIdFormatSchema } from './check-id-format';

export const addressOfSchema = {
  id: '/addressOf',
  type: 'array',
  items: {
    $ref: '/checkIdFormat',
  },
  uniqueItems: true,
  minItems: 1,
};

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* (data) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.addSchema(checkIdFormatSchema, '/checkIdFormat');
    v.validate(data, addressOfSchema, { throwError: true });

    const batch = data.map(
      (profile) => {
        return (getService(CORE_MODULE.CONTRACTS)).instance
          .ProfileResolver.addr(profile.akashaId).then((address) => {
            return { address: unpad(address), akashaId: profile.akashaId };
          });
      },
    );
    const collection = yield Promise.all(batch);
    return { collection };
  });

  const addressOf = { execute, name: 'addressOf' };
  const service = function () {
    return addressOf;
  };
  sp().service(REGISTRY_MODULE.addressOf, service);

  return addressOf;
}
