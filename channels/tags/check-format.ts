import * as Promise from 'bluebird';
import { CORE_MODULE, TAGS_MODULE } from '@akashaproject/common/constants';

export const checkFormatSchema = {
  id: '/checkFormat',
  type: 'object',
  properties: {
    tagName: { type: 'string' },
  },
  required: ['tagName'],
};

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* (data) {
    const v = new getService(CORE_MODULE.VALIDATOR_SCHEMA).Validator();
    v.validate(data, checkFormatSchema, { throwError: true });

    const status = yield getService(CORE_MODULE.CONTRACTS)
    .instance.Tags.checkFormat(data.tagName);
    return { status, tagName: data.tagName };
  });

  const checkFormat = { execute, name: 'checkFormat' };
  const service = function () {
    return checkFormat;
  };
  sp().service(TAGS_MODULE.checkFormat, service);

  return checkFormat;
}
