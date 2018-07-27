import * as Promise from 'bluebird';
import { CORE_MODULE, TAGS_MODULE } from '@akashaproject/common/constants';

export const createSchema = {
  id: '/create',
  type: 'object',
  properties: {
    tagName: { type: 'string' },
    token: { type: 'string' },
  },
  required: ['tagName', 'token'],
};

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* (data, cb) {
    const v = new getService(CORE_MODULE.VALIDATOR_SCHEMA).Validator();
    v.validate(data, createSchema, { throwError: true });

    const txData = yield getService(CORE_MODULE.CONTRACTS)
      .instance.Tags.add.request(data.tagName);
    const transaction = yield getService(CORE_MODULE.CONTRACTS)
      .send(txData, data.token, cb);
    return { tx: transaction.tx, receipt: transaction.receipt, tagName: data.tagName };
  });
  const createTag = { execute, name: 'create', hasStream: true };
  const service = function () {
    return createTag;
  };
  sp().service(TAGS_MODULE.createTag, service);

  return createTag;
}
