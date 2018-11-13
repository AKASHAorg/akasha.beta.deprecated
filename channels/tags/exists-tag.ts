import * as Promise from 'bluebird';
import { CORE_MODULE, TAGS_MODULE } from '@akashaproject/common/constants';

export const existsSchema = {
  id: '/existsSchema',
  type: 'object',
  properties: {
    tagName: { type: 'string' },
  },
  required: ['tagName'],
};

export default function init(sp, getService) {

  const execute = Promise.coroutine(function* (data) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, existsSchema, { throwError: true });

    const exists = yield (getService(CORE_MODULE.CONTRACTS))
    .instance.Tags.exists(data.tagName);
    return { exists, tagName: data.tagName };
  });

  const existsTag = { execute, name: 'exists' };
  const service = function () {
    return existsTag;
  };
  sp().service(TAGS_MODULE.existsTag, service);

  return existsTag;
}
