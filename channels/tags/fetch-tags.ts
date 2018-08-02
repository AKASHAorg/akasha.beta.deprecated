import * as Promise from 'bluebird';
import { CORE_MODULE, TAGS_MODULE } from '@akashaproject/common/constants';

export const getTagsCreatedSchema = {
  id: '/getTagsCreated',
  type: 'object',
  properties: {
    fromBlock: { type: 'number' },
    toBlock: { type: 'number' },
  },
  required: ['fromBlock', 'toBlock'],
};

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* (data) {
    const v = new getService(CORE_MODULE.VALIDATOR_SCHEMA).Validator();
    v.validate(data, getTagsCreatedSchema, { throwError: true });

    const event = yield getService(CORE_MODULE.CONTRACTS)
    .instance.Tags.TagCreate(data);
    const collection = yield event.get();
    return { collection };
  });

  const fetchTags = { execute, name: 'getTagsCreated' };
  const service = function () {
    return fetchTags;
  };
  sp().service(TAGS_MODULE.fetchTags, service);

  return fetchTags;
}
