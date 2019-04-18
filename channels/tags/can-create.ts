import * as Promise from 'bluebird';
import { CORE_MODULE, TAGS_MODULE } from '@akashaproject/common/constants';

export const canCreateSchema = {
  id: '/canCreate',
  type: 'object',
  properties: {
    ethAddress: { type: 'string', format: 'address' },
  },
  required: ['ethAddress'],
};
export default function init (sp, getService) {
  const execute = Promise.coroutine(function* (data) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, canCreateSchema, { throwError: true });

    const can = yield (getService(CORE_MODULE.CONTRACTS))
      .instance.Tags.canCreate(data.ethAddress);
    return { can };
  });

  const canCreate = { execute, name: 'canCreate' };
  const service = function () {
    return canCreate;
  };
  sp().service(TAGS_MODULE.canCreate, service);

  return canCreate;
}
