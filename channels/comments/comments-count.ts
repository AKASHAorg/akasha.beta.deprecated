import * as Promise from 'bluebird';
import { COMMENTS_MODULE, CORE_MODULE } from '@akashaproject/common/constants';

const commentsCountS = {
  id: '/commentsCount',
  type: 'array',
  items: {
    type: 'string',
  },
  uniqueItems: true,
  minItems: 1,
};

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* (data: string[]) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, commentsCountS, { throwError: true });
    const collection = [];
    const contracts = getService(CORE_MODULE.CONTRACTS);
    for (const entryId of data) {
      const count = yield contracts.instance.Comments.totalComments(entryId);
      collection.push({ count: count.toNumber(), entryId });
    }

    return { collection };
  });

  const commentsCount = { execute, name: 'commentsCount' };
  const service = function () {
    return commentsCount;
  };
  sp().service(COMMENTS_MODULE.commentsCount, service);
  return commentsCount;
}
